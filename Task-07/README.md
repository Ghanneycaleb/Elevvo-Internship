# Weather Sight

**Elevvo Internship · Task 07 · Level 3**

A responsive weather dashboard built with HTML, CSS, and vanilla JavaScript. It fetches weather from OpenWeatherMap and has no framework, backend, or package dependencies.

## Features

- Search for a city using OpenWeatherMap Geocoding.
- View current conditions and a three-day forecast grouped by the city's local date.
- Add and select multiple locations, with duplicate-location prevention.
- Request local weather through the browser's Geolocation API.
- Switch between light and dark themes; the preference is saved in this browser.
- Show useful loading, API, network, invalid-search, and location-permission messages.

## Configure the API key

1. Create an API key through [OpenWeatherMap](https://openweathermap.org/api).
2. In this folder, copy `config.example.js` to `config.js` if `config.js` does not already exist. In PowerShell:

   ```powershell
   Copy-Item config.example.js config.js
   ```

3. Edit your local `config.js` and replace the example placeholder with your API key.
4. Reload the app.

`config.js` is excluded by `.gitignore`; do not commit or publish it. A key used in a browser is still visible to visitors, even when its file is ignored by Git. Restrict the key and use a secure backend to make API requests in production. Never paste a real key into source code, screenshots, issue reports, or public repositories.

## Run locally

Use VS Code Live Server, or run this command from the Task-07 folder:

```powershell
py -m http.server 8000
```

Then open `http://localhost:8000`. Use localhost or HTTPS for browser geolocation; opening the page directly as a `file://` URL can prevent browser APIs from working.

## Project files

- `index.html` — dashboard structure and accessible controls.
- `style.css` — responsive styling and light/dark themes.
- `script.js` — API requests, forecast processing, and interface behavior.
- `config.example.js` — safe placeholder to copy when creating a local API config.
- `config.js` — local API configuration; ignored by Git.

## Check JavaScript syntax

With Node.js installed, run from this folder:

```powershell
node --check script.js
```

The app's live weather requests require your own valid, active API key and network access. Without a configured key, it displays setup instructions instead of weather data.
