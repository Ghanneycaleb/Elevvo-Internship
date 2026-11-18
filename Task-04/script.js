// Sample journal content stays in JavaScript and is rendered into the HTML.
const posts = [
  {
    id: 1,
    title: "A Gentler Way to Organize Your Digital Life",
    description: "A few thoughtful habits can turn a crowded screen into a calmer place to think and make.",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Laptop and notebook arranged on a bright wooden desk",
    date: "2026-09-18",
    category: "Tech"
  },
  {
    id: 2,
    title: "What I Learned from a Week Offline",
    description: "Stepping away from the feed made room for longer thoughts, unhurried walks, and better sleep.",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Quiet mountain valley beneath a wide open sky",
    date: "2026-08-29",
    category: "Travel"
  },
  {
    id: 3,
    title: "The Sunday Tomato Toast I Make All Summer",
    description: "Ripe tomatoes, crisp sourdough, and a little patience make a simple lunch feel like a ritual.",
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Fresh seasonal vegetables arranged for a simple meal",
    date: "2026-08-12",
    category: "Food"
  },
  {
    id: 4,
    title: "A Beginner's Guide to Making the Most of Maps",
    description: "Small features in your favorite map app can help you plan a trip without overplanning it.",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Person using a laptop to plan and research",
    date: "2026-07-26",
    category: "Tech"
  },
  {
    id: 5,
    title: "The Long Way Around the Coast",
    description: "On the best kind of road trip, the detours become the story you remember most.",
    imageUrl: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Winding road passing through a green coastal landscape",
    date: "2026-07-09",
    category: "Travel"
  },
  {
    id: 6,
    title: "A Pantry Pasta for the End of the Week",
    description: "This flexible, garlicky supper is proof that a good meal doesn't need a complicated shopping list.",
    imageUrl: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Bowl of pasta with herbs and fresh ingredients",
    date: "2026-06-21",
    category: "Food"
  },
  {
    id: 7,
    title: "Why I Still Keep a Small Notebook",
    description: "Handwriting a thought gives it somewhere to land before the next notification arrives.",
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Open notebook and pen ready for writing",
    date: "2026-06-04",
    category: "Tech"
  },
  {
    id: 8,
    title: "Finding the Quiet Corners of Kyoto",
    description: "A morning start and an unplanned turn down a side street changed the pace of the whole trip.",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Traditional wooden street in Kyoto with a pagoda in the distance",
    date: "2026-05-17",
    category: "Travel"
  },
  {
    id: 9,
    title: "The Small Joy of Baking Bread at Home",
    description: "A simple loaf asks for very little beyond time, warm water, and the pleasure of getting your hands messy.",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Freshly baked crusty bread cooling on a wooden counter",
    date: "2026-04-30",
    category: "Food"
  }
];

// Shared state tracks the active filter and the current results page.
const postsPerPage = 3;
let selectedCategory = "All";
let currentPage = 1;

// Cache the HTML elements that the page updates or listens to.
const postsGrid = document.querySelector("#posts-grid");
const searchInput = document.querySelector("#post-search");
const resultsCount = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");
const pagination = document.querySelector("#pagination");
const pageNumbers = document.querySelector("#page-numbers");
const previousButton = document.querySelector("#previous-page");
const nextButton = document.querySelector("#next-page");
const categoryButtons = document.querySelectorAll(".category-button");

// Return posts matching both the selected category and the title query.
function getFilteredPosts() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  return posts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });
}

// Calculate the number of pages needed for the filtered result list.
function getTotalPages(filteredPosts) {
  return Math.ceil(filteredPosts.length / postsPerPage);
}

// Select the three-post slice for the current page.
function getPostsForCurrentPage(filteredPosts) {
  const startIndex = (currentPage - 1) * postsPerPage;
  return filteredPosts.slice(startIndex, startIndex + postsPerPage);
}

// Build one story card using DOM methods and the post's data.
function createPostCard(post) {
  const article = document.createElement("article");
  article.className = "post-card";

  const imageFrame = document.createElement("div");
  imageFrame.className = "post-image";

  const image = document.createElement("img");
  image.src = post.imageUrl;
  image.alt = post.imageAlt;
  image.loading = "lazy";
  image.addEventListener("error", () => {
    image.hidden = true;
    fallback.hidden = false;
  }, { once: true });

  const fallback = document.createElement("span");
  fallback.className = "image-fallback";
  fallback.textContent = "Image unavailable";
  fallback.hidden = true;
  imageFrame.append(image, fallback);

  const meta = document.createElement("div");
  meta.className = "post-meta";

  const category = document.createElement("span");
  category.className = "post-category";
  category.textContent = post.category;

  const divider = document.createElement("span");
  divider.className = "meta-divider";
  divider.setAttribute("aria-hidden", "true");

  const date = document.createElement("time");
  date.dateTime = post.date;
  date.textContent = new Date(`${post.date}T12:00:00`).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  meta.append(category, divider, date);

  const title = document.createElement("h2");
  title.className = "post-title";
  title.textContent = post.title;

  const description = document.createElement("p");
  description.className = "post-description";
  description.textContent = post.description;

  article.append(imageFrame, meta, title, description);
  return article;
}

// Replace the current cards with the posts for the active page.
function renderPosts(visiblePosts) {
  postsGrid.replaceChildren(...visiblePosts.map(createPostCard));
}

// Rebuild the numbered page buttons and mark the active page for assistive technology.
function renderPageNumbers(totalPages) {
  pageNumbers.replaceChildren();

  for (let page = 1; page <= totalPages; page += 1) {
    const button = document.createElement("button");
    button.className = "page-button";
    button.type = "button";
    button.textContent = String(page);
    button.setAttribute("aria-label", `Go to page ${page}`);

    if (page === currentPage) {
      button.setAttribute("aria-current", "page");
    }

    button.addEventListener("click", () => {
      currentPage = page;
      updatePage();
    });
    pageNumbers.append(button);
  }
}

// Keep the cards, result count, empty state, and pagination in sync.
function updatePage() {
  const filteredPosts = getFilteredPosts();
  const totalPages = getTotalPages(filteredPosts);

  // Keep the current page valid if the result set shrinks after filtering.
  currentPage = Math.min(currentPage, Math.max(totalPages, 1));
  const visiblePosts = getPostsForCurrentPage(filteredPosts);

  renderPosts(visiblePosts);
  resultsCount.textContent = `${filteredPosts.length} ${filteredPosts.length === 1 ? "story" : "stories"} found`;
  emptyState.hidden = filteredPosts.length > 0;
  pagination.hidden = totalPages <= 1;

  if (totalPages > 1) {
    renderPageNumbers(totalPages);
    previousButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
  } else {
    pageNumbers.replaceChildren();
  }
}

// Category selection changes both the visual active state and filtered results.
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;
    currentPage = 1;

    categoryButtons.forEach((categoryButton) => {
      const isSelected = categoryButton === button;
      categoryButton.classList.toggle("is-active", isSelected);
      categoryButton.setAttribute("aria-pressed", String(isSelected));
    });

    updatePage();
  });
});

// Search updates results as the visitor types and always starts at page one.
searchInput.addEventListener("input", () => {
  currentPage = 1;
  updatePage();
});

// Previous and Next handlers guard against navigating outside the page range.
previousButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage -= 1;
    updatePage();
  }
});

nextButton.addEventListener("click", () => {
  const totalPages = getTotalPages(getFilteredPosts());
  if (currentPage < totalPages) {
    currentPage += 1;
    updatePage();
  }
});

// Render the initial set of stories when the script loads.
updatePage();
