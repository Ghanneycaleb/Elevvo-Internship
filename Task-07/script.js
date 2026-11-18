const API_BASE_URL = 'https://api.openweathermap.org';
const DEFAULT_CITY = 'Accra';
const citySearchForm = document.querySelector('#citySearchForm');
const citySearchInput = document.querySelector('#citySearch');
const searchButton = document.querySelector('#searchButton');
const searchMessage = document.querySelector('#searchMessage');
const locationButton = document.querySelector('#locationButton');
const cityList = document.querySelector('#cityList');
const placeCount = document.querySelector('#placeCount');
const placesEmpty = document.querySelector('#placesEmpty');
const weatherContent = document.querySelector('#weatherContent');
const todayLabel = document.querySelector('#todayLabel');
const themeToggle = document.querySelector('#themeToggle');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

const THEME_STORAGE_KEY = 'weather-atlas-theme';

const state = {
  cities: [],
  selectedCityId: null,
  nextId: 1,
  isSearching: false,
  isUsingLocation: false,
  initialLoading: false,
  initialError: '',
};

const API_ERROR_MESSAGES = {
  401: 'The OpenWeatherMap API key is invalid or not active. Check config.js and try again.',
  404: 'We could not find that city. Check the spelling and try another name.',
  429: 'Weather requests are temporarily limited. Please wait a moment and try again.',
};

function getInitialTheme() {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
  } catch (error) {
    console.warn('Could not read the saved theme preference.', error);
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function setTheme(theme, shouldSave = false) {
  const isDark = theme === 'dark';
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute('aria-pressed', String(isDark));
  const nextTheme = isDark ? 'light' : 'dark';
  const label = `Switch to ${nextTheme} mode`;
  themeToggle.setAttribute('aria-label', label);
  themeToggle.title = label;
  themeColorMeta.content = isDark ? '#151c1e' : '#f7f8f6';

  if (shouldSave) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Could not save the theme preference.', error);
    }
  }
}

function hasApiKey() {
  const key = window.WEATHER_CONFIG?.apiKey?.trim();
  return Boolean(key && key !== 'YOUR_OPENWEATHERMAP_API_KEY');
}

function getApiKey() {
  if (!hasApiKey()) {
    throw new Error(
      'Add your OpenWeatherMap API key to config.js, then reload the page.',
    );
  }
  return window.WEATHER_CONFIG.apiKey.trim();
}

function setTodayLabel() {
  todayLabel.textContent = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());
}

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function createIconImage(iconCode, description, className) {
  const image = document.createElement('img');
  image.src = `https://openweathermap.org/img/wn/${encodeURIComponent(iconCode)}@2x.png`;
  image.alt = description ? `Weather icon: ${description}` : '';
  image.className = className;
  image.loading = 'lazy';
  image.addEventListener(
    'error',
    () => {
      image.hidden = true;
    },
    { once: true },
  );
  return image;
}

function formatTemperature(value) {
  return `${Math.round(value)}°`;
}

function getCurrentDescription(weatherData) {
  return weatherData.weather?.[0]?.description || 'Conditions unavailable';
}

function getCurrentIcon(weatherData) {
  return weatherData.weather?.[0]?.icon || '01d';
}

function getCountryName(countryCode) {
  if (!countryCode) return '';
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(countryCode) || countryCode;
  } catch {
    return countryCode;
  }
}

async function fetchJson(url) {
  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error('Could not connect to the weather service. Check your connection and try again.');
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(API_ERROR_MESSAGES[401]);
    }

    let apiMessage = '';
    try {
      const errorBody = await response.json();
      apiMessage = errorBody.message || '';
    } catch {
      apiMessage = '';
    }

    throw new Error(
      API_ERROR_MESSAGES[response.status] ||
        apiMessage ||
        `Weather service request failed (${response.status}). Please try again.`,
    );
  }

  try {
    return await response.json();
  } catch {
    throw new Error('The weather service returned an unreadable response. Please try again.');
  }
}

async function geocodeCity(cityName) {
  const key = getApiKey();
  const parameters = new URLSearchParams({
    q: cityName,
    limit: '1',
    appid: key,
  });
  const results = await fetchJson(
    `${API_BASE_URL}/geo/1.0/direct?${parameters.toString()}`,
  );

  if (!Array.isArray(results) || results.length === 0) {
    throw new Error(API_ERROR_MESSAGES[404]);
  }

  const [place] = results;
  return {
    name: place.name,
    country: place.country || '',
    state: place.state || '',
    lat: place.lat,
    lon: place.lon,
  };
}

async function fetchCurrentWeather({ lat, lon }) {
  const parameters = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    appid: getApiKey(),
    units: 'metric',
  });
  return fetchJson(
    `${API_BASE_URL}/data/2.5/weather?${parameters.toString()}`,
  );
}

async function fetchForecast({ lat, lon }) {
  const parameters = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    appid: getApiKey(),
    units: 'metric',
  });
  return fetchJson(
    `${API_BASE_URL}/data/2.5/forecast?${parameters.toString()}`,
  );
}

function getLocalDateKey(timestamp, timezoneOffset) {
  // Shift to the city's local time, then use UTC getters to avoid the browser's timezone.
  const localTime = new Date((timestamp + timezoneOffset) * 1000);
  const year = localTime.getUTCFullYear();
  const month = String(localTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(localTime.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatLocalForecastDate(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function buildDailyForecast(forecastData) {
  const timezoneOffset = Number(forecastData.city?.timezone) || 0;
  const todayKey = getLocalDateKey(Date.now() / 1000, timezoneOffset);
  const days = new Map();

  for (const entry of forecastData.list || []) {
    if (!Number.isFinite(entry.dt) || !Number.isFinite(entry.main?.temp)) {
      continue;
    }

    const dateKey = getLocalDateKey(entry.dt, timezoneOffset);
    if (dateKey <= todayKey) continue;

    const existing = days.get(dateKey);
    const high = Number.isFinite(entry.main.temp_max)
      ? entry.main.temp_max
      : entry.main.temp;
    const low = Number.isFinite(entry.main.temp_min)
      ? entry.main.temp_min
      : entry.main.temp;
    const weather = entry.weather?.[0];

    if (existing) {
      existing.high = Math.max(existing.high, high);
      existing.low = Math.min(existing.low, low);
      existing.conditions.push(weather);
    } else {
      days.set(dateKey, {
        dateKey,
        high,
        low,
        conditions: [weather],
      });
    }
  }

  return [...days.values()]
    .sort((first, second) => first.dateKey.localeCompare(second.dateKey))
    .slice(0, 3)
    .map((day) => {
      const representativeCondition =
        day.conditions.find((condition) => condition?.icon?.endsWith('d')) ||
        day.conditions.find(Boolean);
      return {
        ...day,
        description: representativeCondition?.description || 'Forecast unavailable',
        icon: representativeCondition?.icon || '01d',
      };
    });
}

function getDuplicateCity(lat, lon) {
  return state.cities.find(
    (city) =>
      Math.abs(city.lat - lat) < 0.01 && Math.abs(city.lon - lon) < 0.01,
  );
}

function addCity(weatherData, location, forecastResult, forecastError = '') {
  const city = {
    id: state.nextId++,
    name: weatherData.name || location.name || 'Unknown place',
    country: getCountryName(weatherData.sys?.country || location.country),
    state: location.state || '',
    lat: weatherData.coord?.lat ?? location.lat,
    lon: weatherData.coord?.lon ?? location.lon,
    current: weatherData,
    forecast: forecastResult ? buildDailyForecast(forecastResult) : [],
    forecastError,
  };

  state.cities.push(city);
  state.selectedCityId = city.id;
  renderCities();
  renderWeather();
}

async function loadCity(location) {
  const duplicate = getDuplicateCity(location.lat, location.lon);
  if (duplicate) {
    state.selectedCityId = duplicate.id;
    renderCities();
    renderWeather();
    return;
  }

  const [currentResult, forecastResult] = await Promise.allSettled([
    fetchCurrentWeather(location),
    fetchForecast(location),
  ]);

  if (currentResult.status === 'rejected') {
    throw currentResult.reason;
  }

  const resolvedCurrent = currentResult.value;
  const existingCity = getDuplicateCity(
    resolvedCurrent.coord?.lat ?? location.lat,
    resolvedCurrent.coord?.lon ?? location.lon,
  );
  if (existingCity) {
    state.selectedCityId = existingCity.id;
    renderCities();
    renderWeather();
    return;
  }

  const forecastData =
    forecastResult.status === 'fulfilled' ? forecastResult.value : null;
  const forecastError =
    forecastResult.status === 'rejected'
      ? `Current conditions loaded, but the forecast could not be retrieved. ${forecastResult.reason.message}`
      : '';
  addCity(resolvedCurrent, location, forecastData, forecastError);
}

function setSearchStatus(message, isError = false) {
  searchMessage.textContent = message;
  searchMessage.classList.toggle('is-error', isError);
}

function setSearchLoading(isLoading) {
  state.isSearching = isLoading;
  searchButton.disabled = isLoading;
  citySearchInput.disabled = isLoading;
  searchButton.setAttribute('aria-label', isLoading ? 'Searching for city' : 'Add city');
  searchButton.setAttribute('aria-busy', String(isLoading));
}

async function handleCitySearch(event) {
  event.preventDefault();
  const cityName = citySearchInput.value.trim();
  if (!cityName || state.isSearching) return;

  setSearchLoading(true);
  setSearchStatus(`Looking up ${cityName}…`);
  state.initialError = '';

  try {
    const location = await geocodeCity(cityName);
    const duplicate = getDuplicateCity(location.lat, location.lon);
    if (duplicate) {
      state.selectedCityId = duplicate.id;
      renderCities();
      renderWeather();
      setSearchStatus(`${duplicate.name} is already in your places.`);
      citySearchInput.value = '';
      return;
    }

    setSearchStatus(`Fetching weather for ${location.name}…`);
    await loadCity(location);
    citySearchInput.value = '';
    setSearchStatus(`${location.name} added to your places.`);
  } catch (error) {
    setSearchStatus(error.message, true);
  } finally {
    setSearchLoading(false);
  }
}

function getGeolocationError(error) {
  switch (error.code) {
    case 1:
      return 'Location permission was denied. You can still search for a city by name.';
    case 2:
      return 'Your location is unavailable right now. Try searching for a city instead.';
    case 3:
      return 'The location request timed out. Please try again or search for a city.';
    default:
      return 'We could not get your location. You can search for a city instead.';
  }
}

function requestCurrentLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000,
    });
  });
}

async function handleUseLocation() {
  if (state.isUsingLocation) return;

  if (!navigator.geolocation) {
    setSearchStatus(
      'Location is not supported by this browser. You can search for a city instead.',
      true,
    );
    return;
  }

  state.isUsingLocation = true;
  locationButton.disabled = true;
  locationButton.setAttribute('aria-busy', 'true');
  const label = locationButton.querySelector('span');
  label.textContent = 'Finding you…';
  setSearchStatus('Requesting your location…');

  try {
    const position = await requestCurrentLocation();
    const location = {
      name: 'Your location',
      country: '',
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };
    await loadCity(location);
    const selectedCity = state.cities.find(
      (city) => city.id === state.selectedCityId,
    );
    setSearchStatus(
      selectedCity?.name
        ? `Showing local weather for ${selectedCity.name}.`
        : 'Your local weather is ready.',
    );
  } catch (error) {
    setSearchStatus(
      error.code !== undefined
        ? getGeolocationError(error)
        : error.message,
      true,
    );
  } finally {
    state.isUsingLocation = false;
    locationButton.disabled = false;
    locationButton.removeAttribute('aria-busy');
    label.textContent = 'Use my location';
  }
}

function renderCities() {
  cityList.replaceChildren();
  placeCount.textContent = String(state.cities.length);
  placesEmpty.hidden = state.cities.length > 0;

  for (const city of state.cities) {
    const button = createElement(
      'button',
      `city-card${city.id === state.selectedCityId ? ' is-selected' : ''}`,
    );
    button.type = 'button';
    button.setAttribute('aria-pressed', String(city.id === state.selectedCityId));
    button.setAttribute(
      'aria-label',
      `${city.name}, ${city.country || 'local weather'}, ${Math.round(city.current.main.temp)} degrees Celsius`,
    );

    const copy = createElement('span', 'city-card__copy');
    copy.append(
      createElement(
        'span',
        'city-card__name',
        `${city.name}${city.country ? `, ${city.country}` : ''}`,
      ),
      createElement('span', 'city-card__condition', getCurrentDescription(city.current)),
    );

    const weather = createElement('span', 'city-card__weather');
    weather.append(
      createIconImage(getCurrentIcon(city.current), getCurrentDescription(city.current), ''),
      createElement('span', 'city-card__temp', formatTemperature(city.current.main.temp)),
    );
    button.append(copy, weather);
    button.addEventListener('click', () => {
      state.selectedCityId = city.id;
      setSearchStatus('');
      renderCities();
      renderWeather();
    });
    cityList.append(button);
  }
}

function renderWelcomeState() {
  const container = createElement('div', 'welcome-state');
  const icon = createElement('div', 'welcome-state__icon');
  const sun = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  sun.setAttribute('viewBox', '0 0 48 48');
  sun.setAttribute('fill', 'none');
  sun.setAttribute('aria-hidden', 'true');
  const sunCore = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  sunCore.setAttribute('cx', '24');
  sunCore.setAttribute('cy', '24');
  sunCore.setAttribute('r', '9');
  sunCore.setAttribute('fill', 'currentColor');
  const sunRays = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  sunRays.setAttribute(
    'd',
    'M24 3v7m0 28v7M3 24h7m28 0h7M9.15 9.15l5 5m19.7 19.7 5 5m0-29.7-5 5m-19.7 19.7-5 5',
  );
  sunRays.setAttribute('stroke', 'currentColor');
  sunRays.setAttribute('stroke-linecap', 'round');
  sunRays.setAttribute('stroke-width', '3');
  sun.append(sunCore, sunRays);
  icon.append(sun);
  container.append(
    icon,
    createElement('h2', '', 'A forecast for every favorite place.'),
    createElement(
      'p',
      '',
      'Search for a city or use your location to see current conditions and the next three forecast days.',
    ),
  );

  if (!hasApiKey()) {
    const setup = createElement(
      'p',
      'setup-note',
      'Before getting started, add your OpenWeatherMap API key to config.js. Reload this page after saving the file.',
    );
    container.append(setup);
  }
  return container;
}

function renderLoadingState(message) {
  const container = createElement('div', 'loading-state');
  const spinner = createElement('span', 'loading-spinner');
  spinner.setAttribute('aria-hidden', 'true');
  container.append(spinner, createElement('p', '', message));
  return container;
}

function renderErrorState(message) {
  const container = createElement('div', 'error-state');
  const icon = createElement('span', 'error-state__icon', '!');
  icon.setAttribute('aria-hidden', 'true');
  container.append(
    icon,
    createElement('h2', '', 'Weather could not be loaded'),
    createElement('p', '', message),
  );
  return container;
}

function renderMetric(label, value, iconPath) {
  const card = createElement('div', 'metric-card');
  const heading = createElement('span', 'metric-card__label');
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('fill', 'none');
  icon.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', iconPath);
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('stroke-width', '1.7');
  icon.append(path);
  heading.append(icon, document.createTextNode(label));
  card.append(heading, createElement('p', 'metric-card__value', value));
  return card;
}

function renderForecast(days) {
  const list = createElement('div', 'forecast-list');
  const weekdayFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    timeZone: 'UTC',
  });
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });

  for (const day of days) {
    const date = formatLocalForecastDate(day.dateKey);
    const card = createElement('article', 'forecast-card');
    card.append(
      createElement('p', 'forecast-card__day', weekdayFormatter.format(date)),
      createElement('p', 'forecast-card__date', dateFormatter.format(date)),
      createIconImage(day.icon, day.description, ''),
      createElement('span', 'forecast-card__description', day.description),
    );
    const range = createElement('div', 'forecast-card__range');
    range.append(
      createElement('span', '', formatTemperature(day.high)),
      createElement('span', '', formatTemperature(day.low)),
    );
    card.append(range);
    list.append(card);
  }
  return list;
}

function renderSelectedCity(city) {
  const current = city.current;
  const overview = createElement('div', 'weather-overview');
  const location = createElement('div', 'weather-location');
  const locationTitle = createElement('h2', '', city.name);
  locationTitle.id = 'selectedCityName';
  location.append(
    createElement('p', 'eyebrow', city.state ? `${city.state} · CURRENT WEATHER` : 'CURRENT WEATHER'),
    locationTitle,
    createElement(
      'span',
      'weather-location__country',
      city.country ? `Country · ${city.country}` : 'Your local conditions',
    ),
  );

  const currentWeather = createElement('div', 'weather-current');
  currentWeather.append(
    createIconImage(getCurrentIcon(current), getCurrentDescription(current), ''),
  );
  const temperature = createElement('span', 'weather-current__temp');
  temperature.append(
    document.createTextNode(formatTemperature(current.main.temp).replace('°', '')),
    createElement('span', 'weather-current__unit', '°C'),
  );
  currentWeather.append(temperature);
  overview.append(location, currentWeather);

  const description = createElement('p', 'weather-condition', getCurrentDescription(current));
  const metrics = createElement('div', 'weather-metrics');
  metrics.append(
    renderMetric(
      'Feels like',
      `${formatTemperature(current.main.feels_like)}C`,
      'M12 3v10.2a4 4 0 1 0 4 4V3a2 2 0 0 0-4 0Z',
    ),
    renderMetric(
      'Humidity',
      `${current.main.humidity}%`,
      'M12 3.5S5.5 11 5.5 15.5a6.5 6.5 0 0 0 13 0C18.5 11 12 3.5 12 3.5Z',
    ),
    renderMetric(
      'Wind speed',
      `${Number(current.wind?.speed || 0).toFixed(1)} m/s`,
      'M3 8h12a2 2 0 1 0-2-2M3 12h16a2 2 0 1 1-2 2M3 16h8a2 2 0 1 1-2 2',
    ),
  );

  const forecastSection = createElement('section', 'forecast-section');
  forecastSection.setAttribute('aria-labelledby', 'forecastTitle');
  const forecastHeading = createElement('div', 'forecast-heading');
  const heading = createElement('h3', '', 'The next three days');
  heading.id = 'forecastTitle';
  forecastHeading.append(
    heading,
    createElement('span', '', 'Daily highs & lows · local time'),
  );
  forecastSection.append(forecastHeading);

  if (city.forecastError) {
    forecastSection.append(createElement('p', 'forecast-message', city.forecastError));
  } else if (city.forecast.length === 0) {
    forecastSection.append(
      createElement(
        'p',
        'forecast-message',
        'No daily forecast entries are available yet. Try again later for an updated forecast.',
      ),
    );
  } else {
    forecastSection.append(renderForecast(city.forecast));
  }

  weatherContent.replaceChildren(overview, description, metrics, forecastSection);
}

function renderWeather() {
  if (state.initialLoading) {
    weatherContent.replaceChildren(renderLoadingState(`Loading weather for ${DEFAULT_CITY}…`));
    return;
  }

  const selectedCity = state.cities.find(
    (city) => city.id === state.selectedCityId,
  );
  if (selectedCity) {
    renderSelectedCity(selectedCity);
  } else if (state.initialError) {
    weatherContent.replaceChildren(renderErrorState(state.initialError));
  } else {
    weatherContent.replaceChildren(renderWelcomeState());
  }
}

async function loadInitialCity() {
  if (!hasApiKey()) {
    renderWeather();
    return;
  }

  state.initialLoading = true;
  renderWeather();
  try {
    const location = await geocodeCity(DEFAULT_CITY);
    await loadCity(location);
  } catch (error) {
    state.initialError = error.message;
  } finally {
    state.initialLoading = false;
    renderWeather();
  }
}

citySearchForm.addEventListener('submit', handleCitySearch);
locationButton.addEventListener('click', handleUseLocation);
themeToggle.addEventListener('click', () => {
  const nextTheme =
    document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme, true);
});
setTheme(getInitialTheme());
setTodayLabel();
renderCities();
loadInitialCity();
