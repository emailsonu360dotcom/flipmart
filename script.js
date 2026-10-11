"use strict";

// Flipkart: Phase 15 — frequently bought together bundle suggestions.
// This is a frontend demonstration, not a production store.

const products = [
  { id: 1, name: "Smartphone 128GB", category: "Mobiles", price: 14999, oldPrice: 18999, rating: 4.5, badge: "BESTSELLER", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80" },
  { id: 2, name: "Wireless Headphones", category: "Electronics", price: 1999, oldPrice: 3499, rating: 4.4, badge: "POPULAR", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80" },
  { id: 3, name: "Classic Wrist Watch", category: "Fashion", price: 1299, oldPrice: 2499, rating: 4.2, badge: "GREAT DEAL", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80" },
  { id: 4, name: "Running Sneakers", category: "Fashion", price: 1799, oldPrice: 2999, rating: 4.3, badge: "TRENDING", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80" },
  { id: 5, name: "Everyday Cotton T-Shirt", category: "Fashion", price: 499, oldPrice: 799, rating: 4.1, badge: "VALUE BUY", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80" },
  { id: 6, name: "Modern Accent Chair", category: "Home", price: 5499, oldPrice: 7999, rating: 4.6, badge: "TOP RATED", image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=500&q=80" },
  { id: 7, name: "Inspirational Book", category: "Books", price: 299, oldPrice: 499, rating: 4.7, badge: "READER PICK", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80" },
  { id: 8, name: "Digital Smart Watch", category: "Electronics", price: 2299, oldPrice: 3999, rating: 4.3, badge: "HOT DEAL", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=500&q=80" },
  { id: 9, name: "Portable Laptop", category: "Electronics", price: 42999, oldPrice: 49999, rating: 4.4, badge: "DEAL OF DAY", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80" },
  { id: 10, name: "Everyday Backpack", category: "Fashion", price: 899, oldPrice: 1499, rating: 4.2, badge: "VALUE BUY", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80" },
  { id: 11, name: "Table Lamp", category: "Home", price: 799, oldPrice: 1199, rating: 4.1, badge: "GREAT DEAL", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=80" },
  { id: 12, name: "Electric Coffee Maker", category: "Appliances", price: 2499, oldPrice: 3299, rating: 4.5, badge: "POPULAR", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&q=80" }
];

const $ = (selector) => document.querySelector(selector);

// Phase 12: persistent appearance preference (light/dark theme).
const THEME_STORAGE_KEY = "campuskart-theme";
function applyTheme(theme, notify = false) {
  const dark = theme === "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  const button = document.querySelector("#themeToggle");
  if (button) {
    button.setAttribute("aria-pressed", String(dark));
    button.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    button.title = dark ? "Switch to light mode" : "Switch to dark mode";
    button.innerHTML = dark ? "☀️ <span>Light mode</span>" : "🌙 <span>Dark mode</span>";
  }
  if (notify) showToast(`${dark ? "Dark" : "Light"} mode enabled`);
}


function loadSaved(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn("Could not read saved data:", error);
    return fallback;
  }
}

function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Could not save data:", error);
  }
}

let cart = loadSaved("campuskart-cart", []);
let savedForLater = loadSaved("campuskart-saved-for-later", []).filter((item) => item && products.some((product) => product.id === item.id) && Number.isInteger(item.quantity) && item.quantity > 0);
let wishlist = loadSaved("campuskart-wishlist", []);
let activeCategory = "All";
let searchTerm = "";
let sortMode = "featured";
let selectedRating = 0;
let selectedBrands = [];
let maxPrice = 50000;
let showWishlistOnly = false;
let toastTimer = null;
let recentlyViewed = loadSaved("campuskart-recently-viewed", []);
let customerReviews = loadSaved("campuskart-reviews", []);
let productQuestions = loadSaved("campuskart-questions", []);
let recentSearches = loadSaved("campuskart-search-history", []).filter((term) => typeof term === "string").slice(0, 6);
let priceAlerts = loadSaved("campuskart-price-alerts", []).filter((alert) => alert && products.some((product) => product.id === alert.productId) && Number.isFinite(Number(alert.targetPrice)) && Number(alert.targetPrice) > 0);

const brandById = {1:"Nova",2:"SoundBeat",3:"TimeCraft",4:"StreetStep",5:"CampusBasics",6:"HomeNest",7:"ReadWell",8:"PulsePro",9:"StudyTech",10:"CarryCo",11:"HomeNest",12:"BrewMate"};
products.forEach((product, index) => {
  product.brand = brandById[product.id] || "Flipkart";
  product.reviews = [842,1280,390,564,710,305,2100,970,125,756,390,480][index] || 120;
  product.description = `A popular ${product.category.toLowerCase()} pick selected for everyday campus life. This sample product listing includes a clear price, customer rating and useful product details for the Flipkart demo.`;
  product.features = ["Everyday practical design", "Student-friendly sample price", "Illustrative product listing"];
});

const formatPrice = (amount) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
}).format(amount);

function getDiscount(product) {
  return Math.round((1 - product.price / product.oldPrice) * 100);
}

function renderProducts() {
  let visibleProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const searchableText = `${product.name} ${product.category} ${product.brand}`.toLowerCase();
    const matchesPrice = product.price <= maxPrice;
    const matchesRating = product.rating >= selectedRating;
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesWishlist = !showWishlistOnly || wishlist.includes(product.id);
    return matchesCategory && searchableText.includes(searchTerm.toLowerCase()) && matchesPrice && matchesRating && matchesBrand && matchesWishlist;
  });

  if (sortMode === "price-low") visibleProducts.sort((a, b) => a.price - b.price);
  else if (sortMode === "price-high") visibleProducts.sort((a, b) => b.price - a.price);
  else if (sortMode === "rating") visibleProducts.sort((a, b) => b.rating - a.rating);
  else if (sortMode === "discount") visibleProducts.sort((a, b) => getDiscount(b) - getDiscount(a));

  $("#sectionTitle").textContent = activeCategory === "All"
    ? (searchTerm ? "Search results" : "Best deals for you")
    : `${activeCategory} deals`;

  $("#resultInfo").textContent = `${visibleProducts.length} of ${products.length} products shown${showWishlistOnly ? " · Wishlist only" : ""}`;
  const wishlistButton = $("#wishlistViewBtn");
  if (wishlistButton) {
    wishlistButton.textContent = showWishlistOnly ? "♥ Viewing wishlist" : `♡ View wishlist (${wishlist.length})`;
    wishlistButton.setAttribute("aria-pressed", String(showWishlistOnly));
    wishlistButton.classList.toggle("active", showWishlistOnly);
  }
  renderActiveFilters();
  $("#emptyState").hidden = visibleProducts.length !== 0;
  $("#productGrid").hidden = visibleProducts.length === 0;

  $("#productGrid").innerHTML = visibleProducts.map((product) => {
    const wished = wishlist.includes(product.id);
    return `
      <article class="product-card" data-product-card="${product.id}">
        <div class="product-image-wrap" data-detail="${product.id}" role="button" tabindex="0" aria-label="View ${product.name}">
          <span class="product-badge">${product.badge}</span>
          <button class="wish-btn ${wished ? "wished" : ""}"
            data-action="wishlist" data-id="${product.id}"
            aria-label="${wished ? "Remove from" : "Add to"} wishlist"
            aria-pressed="${wished}">${wished ? "♥" : "♡"}</button>
          <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/500x400/f2f5fa/51617a?text=Flipkart+Product'">
        </div>
        <div class="product-info">
          <small class="product-brand-label">${product.brand}</small>
          <h3 class="product-name" data-detail="${product.id}">${product.name}</h3>
          <span class="rating">★ ${product.rating} / 5 <small>(${product.reviews.toLocaleString("en-IN")})</small></span>
          <div class="price-line">
            <span class="price">${formatPrice(product.price)}</span>
            <span class="old-price">${formatPrice(product.oldPrice)}</span>
            <span class="discount">${getDiscount(product)}% off</span>
          </div>
          <div class="phase3-product-actions"><button class="details-btn" data-detail="${product.id}" type="button">View details</button><button class="add-btn" data-action="add" data-id="${product.id}" type="button">＋ Add to Cart</button></div>
        </div>
      </article>`;
  }).join("");
}

function renderCarousel() {
  const track = $("#carouselTrack");
  if (!track) return;

  track.innerHTML = products.slice(0, 8).map((product) => `
    <article class="carousel-product">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <h3 title="${product.name}">${product.name}</h3>
      <p class="carousel-price">${formatPrice(product.price)}</p>
      <button type="button" data-carousel-add="${product.id}">Add to Cart</button>
    </article>`).join("");
}

function renderRecentlyViewed() {
  const section = $("#recentlyViewedSection");
  const track = $("#recentlyViewedTrack");
  if (!section || !track) return;
  const recentProducts = recentlyViewed
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);
  section.hidden = recentProducts.length === 0;
  track.innerHTML = recentProducts.map((product) => `
    <article class="recent-card">
      <button class="recent-product-open" type="button" data-recent-detail="${product.id}" aria-label="View ${product.name}">
        <img src="${product.image}" alt="" loading="lazy">
        <span><b>${product.name}</b><small>${formatPrice(product.price)}</small></span>
      </button>
      <button class="recent-add" type="button" data-recent-add="${product.id}">＋ Add</button>
    </article>`).join("");
}

function saveCart() {
  saveData("campuskart-cart", cart);
}

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function addToCart(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  if (!demoProfile) {   // adding to cart needs a login (see Phase 37)
    showToast('Please login to add items to your cart');
    promptLogin('Login to add items to your cart', () => addToCart(id));
    return;
  }

  const existing = cart.find((item) => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({ id, quantity: 1 });

  saveCart();
  renderCart();
  showToast(`${product.name} added to your cart`);
  openCart();
}

function changeQuantity(id, amount) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;

  item.quantity += amount;
  if (item.quantity <= 0) cart = cart.filter((entry) => entry.id !== id);

  saveCart();
  renderCart();
  showToast(item.quantity > 0 ? "Cart quantity updated" : "Item removed from cart");
}

function removeFromCart(id) {
  const removed = cart.find((item) => item.id === id);
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  renderCart();
  if (removed) showToast("Item removed from cart");
}

function toggleWishlist(id) {
  if (wishlist.includes(id)) wishlist = wishlist.filter((item) => item !== id);
  else wishlist.push(id);

  saveData("campuskart-wishlist", wishlist);
  renderProducts();
  const product = products.find((item) => item.id === id);
  showToast(wishlist.includes(id) ? `${product ? product.name : "Product"} added to wishlist` : "Removed from wishlist");
}

function saveForLater(id) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;
  const saved = savedForLater.find((entry) => entry.id === id);
  if (saved) saved.quantity += item.quantity;
  else savedForLater.push({ id: item.id, quantity: item.quantity });
  cart = cart.filter((entry) => entry.id !== id);
  saveCart();
  saveData("campuskart-saved-for-later", savedForLater);
  renderCart();
  showToast("Item saved for later");
}

function moveSavedToCart(id) {
  const saved = savedForLater.find((entry) => entry.id === id);
  if (!saved) return;
  const existing = cart.find((entry) => entry.id === id);
  if (existing) existing.quantity += saved.quantity;
  else cart.push({ id, quantity: saved.quantity });
  savedForLater = savedForLater.filter((entry) => entry.id !== id);
  saveCart();
  saveData("campuskart-saved-for-later", savedForLater);
  renderCart();
  showToast("Item moved back to your cart");
}

function removeSavedItem(id) {
  savedForLater = savedForLater.filter((entry) => entry.id !== id);
  saveData("campuskart-saved-for-later", savedForLater);
  renderCart();
  showToast("Saved item removed");
}

function renderCart() {
  cart = cart.filter((item) => products.some((product) => product.id === item.id && Number.isInteger(item.quantity) && item.quantity > 0));
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  $("#cartCount").textContent = count;
  const delivery = subtotal === 0 || subtotal >= 999 ? 0 : 49;
  const mrpTotal = cart.reduce((sum, item) => { const product = products.find((p) => p.id === item.id); return sum + (product ? product.oldPrice * item.quantity : 0); }, 0);
  $("#subtotal").textContent = formatPrice(subtotal);
  $("#total").textContent = formatPrice(subtotal + delivery);
  $("#savingsTotal").textContent = formatPrice(mrpTotal - subtotal);
  const deliveryLabel = document.querySelector("#cartSummary .free");
  if (deliveryLabel) { deliveryLabel.textContent = delivery === 0 ? "FREE" : formatPrice(delivery); deliveryLabel.classList.toggle("free", delivery === 0); }

  const cartMarkup = cart.length ? cart.map((item) => {
    const product = products.find((p) => p.id === item.id);
    return `
      <div class="cart-item">
        <img src="${product.image}" alt="${product.name}">
        <div>
          <h3>${product.name}</h3>
          <div class="cart-item-price">${formatPrice(product.price)}</div>
          <div class="quantity-control">
            <button type="button" data-action="decrease" data-id="${item.id}" aria-label="Decrease quantity">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-action="increase" data-id="${item.id}" aria-label="Increase quantity">＋</button>
          </div>
          <button class="save-later-btn" type="button" data-action="save-later" data-id="${item.id}">♡ Save for later</button>
        </div>
        <button class="remove-btn" type="button" data-action="remove" data-id="${item.id}">Remove</button>
      </div>`;
  }).join("") : `<div class="cart-empty"><span>🛍️</span><h3>Your cart is empty</h3><p>Add some products to get started.</p></div>`;

  const savedMarkup = savedForLater.length ? `<section class="saved-later-section" aria-labelledby="savedLaterTitle"><div class="saved-later-heading"><h3 id="savedLaterTitle">Saved for later</h3><span>${savedForLater.length} item${savedForLater.length === 1 ? "" : "s"}</span></div>${savedForLater.map((item) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) return "";
    return `<article class="saved-later-item"><img src="${product.image}" alt="${product.name}"><div class="saved-later-copy"><b>${product.name}</b><span>${formatPrice(product.price)} · Qty ${item.quantity}</span><div class="saved-later-actions"><button type="button" data-action="move-to-cart" data-id="${item.id}">Move to cart</button><button type="button" data-action="remove-saved" data-id="${item.id}" aria-label="Remove ${product.name} from saved items">Remove</button></div></div></article>`;
  }).join("")}</section>` : "";
  $("#cartItems").innerHTML = cartMarkup + savedMarkup;

  $("#cartSummary").hidden = cart.length === 0;
  saveCart();
}

function openCart() {
  if (!demoProfile) { showCartGate(); return; }   // cart needs a login (see Phase 37)
  $("#overlay").hidden = false;
  $("#cartPanel").classList.add("open");
  $("#cartPanel").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $("#closeCartBtn").focus();
}

function closeCart() {
  $("#cartPanel").classList.remove("open");
  $("#cartPanel").setAttribute("aria-hidden", "true");
  $("#overlay").hidden = true;
  document.body.style.overflow = "";
  $("#cartBtn").focus();
}

function setCategory(category) {
  activeCategory = category;
  document.querySelectorAll(".category").forEach((button) => {
    const active = button.dataset.category === category;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  renderProducts();
}

function resetProducts() {
  activeCategory = "All";
  searchTerm = "";
  sortMode = "featured";
  selectedRating = 0;
  selectedBrands = [];
  maxPrice = 50000;
  showWishlistOnly = false;
  $("#priceRange").value = "50000";
  $("#maxPriceLabel").textContent = formatPrice(50000);
  document.querySelectorAll('input[name="ratingFilter"]').forEach((input) => input.checked = input.value === "0");
  $("#searchInput").value = "";
  $("#sortSelect").value = "featured";
  renderBrandFilters();
  setCategory("All");
}

function renderBrandFilters() {
  const brands = [...new Set(products.map((product) => product.brand))].sort();
  $("#brandFilters").innerHTML = brands.map((brand) => `<label class="brand-filter"><input type="checkbox" value="${brand}" ${selectedBrands.includes(brand) ? "checked" : ""}> ${brand}</label>`).join("");
}
function renderActiveFilters() {
  const chips = [];
  if (activeCategory !== "All") chips.push([`Category: ${activeCategory}`, "category"]);
  if (searchTerm) chips.push([`Search: ${searchTerm}`, "search"]);
  if (maxPrice < 50000) chips.push([`Up to ${formatPrice(maxPrice)}`, "price"]);
  if (selectedRating > 0) chips.push([`${selectedRating}★ and above`, "rating"]);
  selectedBrands.forEach((brand) => chips.push([brand, `brand:${brand}`]));
  $("#activeFilters").innerHTML = chips.map(([label, key]) => `<span class="active-filter-chip">${label}<button type="button" data-remove-filter="${key}" aria-label="Remove ${label}">×</button></span>`).join("");
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[character]));
}

function renderReviewSection(product) {
  const samples = [
    { id: `sample-${product.id}-1`, productId: product.id, name: "Aarav S.", rating: 5, text: "Good value for the price. Product details were clear and the demo shopping flow was easy to use.", date: "Sample review", helpful: 3, sample: true },
    { id: `sample-${product.id}-2`, productId: product.id, name: "Meera K.", rating: 4, text: "Looks useful for everyday needs. This review is sample content for the Flipkart project.", date: "Sample review", helpful: 1, sample: true }
  ];
  const ownReviews = customerReviews.filter((review) => review.productId === product.id);
  const allReviews = [...ownReviews.slice().reverse(), ...samples];
  const average = ownReviews.length ? (ownReviews.reduce((sum, review) => sum + review.rating, 0) / ownReviews.length).toFixed(1) : null;
  return `<section class="detail-reviews" aria-labelledby="customerReviewsTitle">
    <div class="review-heading"><div><h3 id="customerReviewsTitle">Customer reviews</h3><p>${ownReviews.length} demo review${ownReviews.length === 1 ? "" : "s"} submitted by visitors${average ? ` · Visitor average ${average}/5` : ""}</p></div>
    <label class="review-sort-label" for="reviewSort">Sort by<select id="reviewSort"><option value="newest">Newest</option><option value="helpful">Most helpful</option><option value="highest">Highest rating</option></select></label></div>
    <form id="reviewForm" class="review-form" data-review-product="${product.id}">
      <h4>Write a review</h4><p class="review-form-note">Share your opinion for this college demo. Reviews are stored only in this browser.</p>
      <label for="reviewName">Your name</label><input id="reviewName" name="reviewName" maxlength="50" required placeholder="Enter your name">
      <label for="reviewRating">Your rating</label><select id="reviewRating" name="reviewRating" required><option value="">Choose a rating</option><option value="5">★★★★★ — Excellent</option><option value="4">★★★★☆ — Good</option><option value="3">★★★☆☆ — Average</option><option value="2">★★☆☆☆ — Poor</option><option value="1">★☆☆☆☆ — Very poor</option></select>
      <label for="reviewText">Your review</label><textarea id="reviewText" name="reviewText" rows="3" minlength="8" maxlength="600" required placeholder="What did you think about this product?"></textarea>
      <button type="submit" class="primary-btn">Submit review</button><p id="reviewMessage" class="review-message" role="status" aria-live="polite"></p>
    </form>
    <div id="reviewList" class="review-list">${allReviews.map((review) => `<article class="review-item" data-review-item="${escapeHTML(review.id)}" data-rating="${review.rating}" data-helpful="${review.helpful}" data-date="${escapeHTML(review.date)}"><div class="review-item-top"><b>${escapeHTML(review.name)}</b><span class="rating" aria-label="${review.rating} out of 5 stars">${"★".repeat(review.rating)}${"☆".repeat(5-review.rating)}</span></div><small class="review-date">${escapeHTML(review.date)}${review.sample ? " · sample" : ""}</small><p>${escapeHTML(review.text)}</p><button type="button" class="helpful-btn" data-helpful-review="${escapeHTML(review.id)}" ${review.sample ? "disabled title='Sample review votes are fixed'" : ""}>👍 Helpful (${review.helpful})</button></article>`).join("")}</div>
    <p class="demo-note">Sample ratings and reviews are illustrative, not verified customer feedback. Visitor-submitted reviews are saved locally in this browser only.</p>
  </section>`;
}

function sortVisibleReviews(mode) {
  const list = $("#reviewList");
  if (!list) return;
  const items = [...list.querySelectorAll(".review-item")];
  items.sort((a, b) => {
    if (mode === "helpful") return Number(b.dataset.helpful) - Number(a.dataset.helpful);
    if (mode === "highest") return Number(b.dataset.rating) - Number(a.dataset.rating);
    return items.indexOf(a) - items.indexOf(b);
  });
  items.forEach((item) => list.appendChild(item));
}

function renderQuestionSection(product) {
  const questions = productQuestions.filter((item) => item.productId === product.id).slice().reverse();
  const sampleFAQs = [
    { question: "Is this listing part of a real store?", answer: "No. Flipkart is a college project demonstration. Product details, prices and checkout are illustrative." },
    { question: "How can I check delivery availability?", answer: "Use the 6-digit PIN code checker above for a sample delivery estimate. It does not contact a courier." }
  ];
  return `<section class="product-qa" aria-labelledby="productQuestionsTitle">
    <div class="qa-heading"><div><h3 id="productQuestionsTitle">Questions &amp; Answers</h3><p>Ask something about this product or browse the demo FAQs.</p></div><span class="qa-count">${questions.length} question${questions.length === 1 ? "" : "s"}</span></div>
    <div class="qa-faq-list">${sampleFAQs.map((item) => `<details class="qa-faq"><summary>${item.question}</summary><p>${item.answer}</p></details>`).join("")}</div>
    <form id="questionForm" class="question-form" data-question-product="${product.id}">
      <h4>Ask a question</h4><p class="review-form-note">Questions are saved only in this browser for the college demo.</p>
      <label for="questionName">Your name</label><input id="questionName" name="questionName" maxlength="50" required placeholder="Enter your name">
      <label for="questionText">Your question</label><textarea id="questionText" name="questionText" rows="3" minlength="8" maxlength="400" required placeholder="What would you like to know about this product?"></textarea>
      <button type="submit" class="primary-btn">Submit question</button><p id="questionMessage" class="review-message" role="status" aria-live="polite"></p>
    </form>
    <div class="qa-list">${questions.length ? questions.map((item) => `<article class="qa-item"><div class="qa-question-label">Q</div><div class="qa-item-content"><b>${escapeHTML(item.question)}</b><small>Asked by ${escapeHTML(item.name)} · ${escapeHTML(item.date)}</small><p class="qa-answer ${item.answer ? "" : "qa-pending"}">${item.answer ? escapeHTML(item.answer) : "No answer yet — this demo stores questions locally and has no seller support connection."}</p><button type="button" class="helpful-btn" data-helpful-question="${escapeHTML(item.id)}">👍 Helpful (${Number(item.helpful) || 0})</button></div></article>`).join("") : `<p class="qa-empty">No visitor questions yet. Be the first to ask!</p>`}</div>
    <p class="demo-note">Questions and helpful votes are stored in this browser only. No seller or support team receives them.</p>
  </section>`;
}

function renderPriceAlerts() {
  const count = priceAlerts.length;
  const countEl = $("#priceAlertCount");
  if (countEl) countEl.textContent = String(count);
  const list = $("#priceAlertsList");
  if (!list) return;
  if (!count) {
    list.innerHTML = '<div class="price-alerts-empty"><span>🔔</span><h3>No price alerts yet</h3><p>Open a product, set your target price, and save an alert.</p></div>';
    return;
  }
  list.innerHTML = priceAlerts.map((alert) => {
    const product = products.find((item) => item.id === alert.productId);
    if (!product) return '';
    return `<article class="price-alert-card"><img src="${product.image}" alt="${product.name}"><div class="price-alert-card-copy"><b>${product.name}</b><span>Current demo price: ${formatPrice(product.price)}</span><span>Target price: <strong>${formatPrice(Number(alert.targetPrice))}</strong></span><small class="price-alert-status ${alert.triggered ? 'triggered' : ''}">${alert.triggered ? 'Demo alert triggered' : 'Waiting for target price'}</small><div class="price-alert-card-actions"><button type="button" data-edit-price-alert="${product.id}">Edit target</button><button type="button" data-demo-price-drop="${product.id}">Simulate price drop</button><button type="button" data-remove-price-alert="${product.id}">Remove</button></div></div></article>`;
  }).join('');
}

function savePriceAlert(productId, targetPrice) {
  const product = products.find((item) => item.id === productId);
  if (!product || !Number.isFinite(targetPrice) || targetPrice <= 0) return;
  const existing = priceAlerts.find((alert) => alert.productId === productId);
  if (existing) { existing.targetPrice = targetPrice; existing.triggered = false; }
  else priceAlerts.push({ productId, targetPrice, triggered: false, createdAt: new Date().toISOString() });
  saveData('campuskart-price-alerts', priceAlerts);
  renderPriceAlerts();
  showToast(`Price alert saved for ${product.name}`);
}

// Phase 15: simple, curated complementary-product bundles for the demo store.
const bundleRecommendations = {
  1: [2, 10], 2: [1, 8], 3: [5, 10], 4: [5, 10], 5: [3, 10], 6: [11, 7],
  7: [10, 11], 8: [2, 10], 9: [2, 10], 10: [7, 5], 11: [7, 6], 12: [7, 11]
};

function renderBundleSection(product) {
  const related = (bundleRecommendations[product.id] || [])
    .map((id) => products.find((item) => item.id === id))
    .filter(Boolean)
    .slice(0, 2);
  const items = [product, ...related];
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return `<section class="bundle-section" aria-labelledby="bundleTitle">
    <div class="bundle-heading"><div><p class="section-kicker">MAKE IT A SET</p><h3 id="bundleTitle">Frequently bought together</h3></div><span class="bundle-count">${items.length} items</span></div>
    <div class="bundle-items">${items.map((item, index) => `<label class="bundle-item"><input type="checkbox" data-bundle-product="${item.id}" checked><img src="${item.image}" alt=""><span class="bundle-item-copy"><b>${item.name}</b><small>${formatPrice(item.price)}</small>${index === 0 ? '<em>This product</em>' : ''}</span></label>`).join('<span class="bundle-plus" aria-hidden="true">+</span>')}</div>
    <div class="bundle-footer"><div><small>Selected items total</small><strong id="bundleTotal">${formatPrice(total)}</strong><span class="bundle-demo-note">Demo bundle · no extra discount applied</span></div><button type="button" class="add-btn" data-add-bundle="${product.id}">Add selected to cart</button></div>
  </section>`;
}

function updateBundleTotal() {
  const totalElement = document.querySelector('#bundleTotal');
  if (!totalElement) return;
  const selectedIds = [...document.querySelectorAll('[data-bundle-product]:checked')].map((input) => Number(input.dataset.bundleProduct));
  const total = selectedIds.reduce((sum, id) => sum + (products.find((product) => product.id === id)?.price || 0), 0);
  totalElement.textContent = formatPrice(total);
}

function addBundleToCart(mainProductId) {
  if (!demoProfile) { promptLogin('Login to add items to your cart', () => addBundleToCart(mainProductId)); return; }
  const selectedIds = [...document.querySelectorAll('[data-bundle-product]:checked')]
    .map((input) => Number(input.dataset.bundleProduct))
    .filter((id, index, array) => products.some((product) => product.id === id) && array.indexOf(id) === index);
  if (!selectedIds.length) {
    showToast('Select at least one product to add');
    return;
  }
  selectedIds.forEach((id) => {
    const existing = cart.find((item) => item.id === id);
    if (existing) existing.quantity += 1;
    else cart.push({ id, quantity: 1 });
  });
  saveCart();
  renderCart();
  $('#productDialog').close();
  showToast(`${selectedIds.length} selected item${selectedIds.length === 1 ? '' : 's'} added to cart`);
  openCart();
}

function openProductDetails(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  recentlyViewed = [id, ...recentlyViewed.filter((item) => item !== id)].slice(0, 5);
  saveData("campuskart-recently-viewed", recentlyViewed);
  renderRecentlyViewed();
  const gallery = [product.image,
    `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80`,
    `https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=500&q=80`];
  const specifications = [
    ["Category", product.category], ["Brand", product.brand], ["Customer rating", `${product.rating} / 5`],
    ["Reviews", product.reviews.toLocaleString("en-IN")], ["Availability", "In stock (demo)"]
  ];
  $("#productDetail").innerHTML = `<button type="button" class="icon-btn dialog-close" id="closeProductBtn" aria-label="Close product details">✕</button>
    <div class="detail-gallery"><div class="detail-image-wrap"><img id="detailMainImage" src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='https://placehold.co/500x400/f2f5fa/51617a?text=Flipkart+Product'"></div>
    <div class="detail-thumbnails" aria-label="Product image options">${gallery.map((image,index)=>`<button type="button" class="detail-thumb ${index===0?'active':''}" data-gallery-image="${image}" aria-label="Show product image ${index+1}"><img src="${image}" alt=""></button>`).join("")}</div></div>
    <div class="detail-copy"><p class="section-kicker">${product.category} · ${product.brand}</p><h2>${product.name}</h2><span class="rating">★ ${product.rating} / 5 · ${product.reviews.toLocaleString("en-IN")} reviews</span>
    <div class="detail-price">${formatPrice(product.price)} <span class="old-price">${formatPrice(product.oldPrice)}</span> <span class="discount">${getDiscount(product)}% off</span></div>
    <p>${product.description}</p><div class="detail-delivery"><b>🚚 Delivery check</b><div class="pin-entry"><input id="deliveryPin" inputmode="numeric" maxlength="6" pattern="[0-9]{6}" placeholder="Enter 6-digit PIN code" aria-label="Delivery PIN code"><button type="button" class="secondary-btn" id="checkPinBtn">Check</button></div><p id="pinMessage" role="status">Enter a PIN code to see a sample delivery estimate.</p></div>
    <h3>Product highlights</h3>${product.features.map((feature) => `<div class="detail-feature">✓ &nbsp;${feature}</div>`).join("")}
    ${renderBundleSection(product)}
    <section class="price-alert-form" aria-labelledby="priceAlertFormTitle"><div><h3 id="priceAlertFormTitle">🔔 Price alert</h3><p>Choose a target price and keep an eye on this item.</p></div><form id="priceAlertForm" data-alert-product="${product.id}"><label for="targetPriceInput">Notify me when the price reaches (₹)</label><div class="price-alert-entry"><input id="targetPriceInput" name="targetPrice" type="number" min="1" max="9999999" step="1" required value="${Math.max(1, Math.floor(product.price * 0.9))}"><button class="secondary-btn" type="submit">Save alert</button></div><small>Demo only: no live price monitoring or messages are sent.</small></form></section>
    <div class="detail-action-row"><button type="button" class="details-btn" data-detail-wishlist="${product.id}">${wishlist.includes(product.id) ? "♥ Wishlisted" : "♡ Wishlist"}</button><button type="button" class="add-btn" data-detail-add="${product.id}">＋ Add to Cart</button></div>
    <section class="detail-specs"><h3>Specifications</h3><dl>${specifications.map(([key,value])=>`<div><dt>${key}</dt><dd>${value}</dd></div>`).join("")}</dl></section>
    ${renderQuestionSection(product)}
    ${renderReviewSection(product)}</div>`;
  $("#productDialog").showModal();
}

$("#productGrid").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (button) {
    const id = Number(button.dataset.id);
    if (!Number.isInteger(id)) return;
    if (button.dataset.action === "add") addToCart(id);
    if (button.dataset.action === "wishlist") toggleWishlist(id);
    return;
  }
  const detail = event.target.closest("[data-detail]");
  if (detail) openProductDetails(Number(detail.dataset.detail));
});

$("#recentlyViewedTrack").addEventListener("click", (event) => {
  const detail = event.target.closest("[data-recent-detail]");
  const add = event.target.closest("[data-recent-add]");
  if (detail) openProductDetails(Number(detail.dataset.recentDetail));
  if (add) addToCart(Number(add.dataset.recentAdd));
});

$("#productGrid").addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-detail][role='button']")) {
    event.preventDefault();
    openProductDetails(Number(event.target.dataset.detail));
  }
});

$("#cartItems").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const id = Number(button.dataset.id);
  if (!Number.isInteger(id)) return;

  if (button.dataset.action === "increase") changeQuantity(id, 1);
  if (button.dataset.action === "decrease") changeQuantity(id, -1);
  if (button.dataset.action === "remove") removeFromCart(id);
  if (button.dataset.action === "save-later") saveForLater(id);
  if (button.dataset.action === "move-to-cart") moveSavedToCart(id);
  if (button.dataset.action === "remove-saved") removeSavedItem(id);
});

$("#categories").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-category]");
  if (button) setCategory(button.dataset.category);
});

document.querySelectorAll(".quick-category").forEach((button) => {
  button.addEventListener("click", () => {
    searchTerm = "";
    $("#searchInput").value = "";
    setCategory(button.dataset.category);
    $("#productsSection").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

function renderSearchSuggestions() {
  const panel = $("#searchSuggestions");
  const query = $("#searchInput").value.trim().toLowerCase();
  if (!panel) return;
  const matchingProducts = query
    ? products.filter((product) => `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query)).slice(0, 5)
    : [];
  const matchingHistory = recentSearches.filter((term) => !query || term.toLowerCase().includes(query)).slice(0, 5);
  const showHistory = !query && matchingHistory.length > 0;
  const rows = matchingProducts.map((product) => `<button type="button" class="search-suggestion" data-search-choice="${escapeHTML(product.name)}"><span aria-hidden="true">🔎</span><span><b>${escapeHTML(product.name)}</b><small>${escapeHTML(product.category)} · ${formatPrice(product.price)}</small></span><span class="suggestion-arrow">↗</span></button>`).join("");
  const historyRows = matchingHistory.map((term) => `<button type="button" class="search-suggestion history-suggestion" data-search-choice="${escapeHTML(term)}"><span aria-hidden="true">◷</span><span><b>${escapeHTML(term)}</b><small>Recent search</small></span><span class="suggestion-arrow">↗</span></button>`).join("");
  if (!rows && !historyRows) {
    panel.innerHTML = query ? `<p class="search-suggestions-empty">No product suggestions found. Press Search to search all listings.</p>` : `<p class="search-suggestions-empty">Start typing to find products.</p>`;
  } else {
    panel.innerHTML = `${showHistory ? `<div class="search-suggestions-heading"><b>Recent searches</b><button type="button" data-clear-search-history>Clear</button></div>${historyRows}` : ""}${rows ? `<div class="search-suggestions-heading"><b>${query ? "Product suggestions" : "Popular products"}</b></div>${rows}` : ""}${query && historyRows ? `<div class="search-suggestions-heading"><b>Recent searches</b></div>${historyRows}` : ""}`;
  }
  panel.hidden = false;
}

function rememberSearch(term) {
  const cleanTerm = term.trim();
  if (!cleanTerm) return;
  recentSearches = [cleanTerm, ...recentSearches.filter((item) => item.toLowerCase() !== cleanTerm.toLowerCase())].slice(0, 6);
  saveData("campuskart-search-history", recentSearches);
}

function runSearch() {
  searchTerm = $("#searchInput").value.trim();
  if (searchTerm) rememberSearch(searchTerm);
  renderProducts();
  renderSearchSuggestions();
  if (searchTerm) $("#searchSuggestions").hidden = true;
}

$("#searchBtn").addEventListener("click", runSearch);
$("#searchInput").addEventListener("input", () => {
  searchTerm = $("#searchInput").value.trim();
  renderProducts();
  renderSearchSuggestions();
});
$("#searchInput").addEventListener("focus", renderSearchSuggestions);
$("#searchInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") { event.preventDefault(); runSearch(); }
  if (event.key === "Escape") $("#searchSuggestions").hidden = true;
});
$("#searchSuggestions").addEventListener("click", (event) => {
  const clearButton = event.target.closest("[data-clear-search-history]");
  if (clearButton) {
    recentSearches = [];
    saveData("campuskart-search-history", recentSearches);
    renderSearchSuggestions();
    showToast("Recent searches cleared");
    return;
  }
  const choice = event.target.closest("[data-search-choice]");
  if (!choice) return;
  $("#searchInput").value = choice.dataset.searchChoice;
  searchTerm = choice.dataset.searchChoice;
  rememberSearch(searchTerm);
  renderProducts();
  $("#searchSuggestions").hidden = true;
  $("#productsSection").scrollIntoView({ behavior: "smooth", block: "start" });
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".search-box")) $("#searchSuggestions").hidden = true;
});

$("#sortSelect").addEventListener("change", (event) => {
  sortMode = event.target.value;
  renderProducts();
});

$("#resetBtn").addEventListener("click", resetProducts);
$("#wishlistViewBtn").addEventListener("click", () => {
  showWishlistOnly = !showWishlistOnly;
  renderProducts();
  $("#productsSection").scrollIntoView({ behavior: "smooth", block: "start" });
});
$("#backToTopBtn").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
window.addEventListener("scroll", () => {
  $("#backToTopBtn").classList.toggle("visible", window.scrollY > 500);
}, { passive: true });
$("#shopNowBtn").addEventListener("click", () => $("#productsSection").scrollIntoView({ behavior: "smooth" }));
$("#bottomShopBtn").addEventListener("click", () => $("#productsSection").scrollIntoView({ behavior: "smooth" }));

$("#carouselPrev").addEventListener("click", () => {
  $("#carouselTrack").scrollBy({ left: -$("#carouselTrack").clientWidth * 0.8, behavior: "smooth" });
});
$("#carouselNext").addEventListener("click", () => {
  $("#carouselTrack").scrollBy({ left: $("#carouselTrack").clientWidth * 0.8, behavior: "smooth" });
});
$("#carouselTrack").addEventListener("click", (event) => {
  const button = event.target.closest("[data-carousel-add]");
  if (button) addToCart(Number(button.dataset.carouselAdd));
});

$("#cartBtn").addEventListener("click", openCart);
$("#closeCartBtn").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && $("#cartPanel").classList.contains("open")) closeCart();
});

let demoProfile = loadSaved("campuskart-profile", null);
let orderHistory = loadSaved("campuskart-orders", []);
let appliedCoupon = null;
let latestOrderId = null;

const couponRules = {
  UPI50:     {value:50, minimum:499, method:"upi",        label:"₹50 off on UPI payments"},
  CARD60:    {value:60, minimum:599, method:"card",       label:"₹60 off on Credit / Debit / ATM card payments"},
  NETBANK70: {value:70, minimum:699, method:"netbanking", label:"₹70 off on Net Banking payments"},
  SAVE30:    {value:30, minimum:299, method:null,         label:"₹30 off on any payment method"},
  FLAT25:    {value:25, minimum:199, method:null,         label:"Flat ₹25 off on any payment method"}
};
const paymentLabels = {upi:"UPI", card:"Credit / Debit / ATM Card", emi:"EMI", cod:"Cash on Delivery", netbanking:"Net Banking", gift:"Flipkart Gift Card"};
const COD_FEE = 29;
let paymentMethod = "upi";
function paymentFee() { return paymentMethod === "cod" ? COD_FEE : 0; }

function cartSubtotal() {
  return cart.reduce((sum,item)=> { const product=products.find(p=>p.id===item.id); return sum+(product?product.price*item.quantity:0); },0);
}
function cartDelivery(subtotal) { return subtotal === 0 || subtotal >= 999 ? 0 : 49; }
function couponDiscount(subtotal) {
  if (!appliedCoupon) return 0;
  const rule = couponRules[appliedCoupon];
  if (!rule || subtotal < rule.minimum || (rule.method && rule.method !== paymentMethod)) return 0;
  return Math.min(rule.value, subtotal);
}
function checkoutTotalAmount() {
  const subtotal=cartSubtotal();
  return Math.max(0,subtotal+cartDelivery(subtotal)+paymentFee()-couponDiscount(subtotal));
}
function setCouponMessage(text, type) { $("#couponMessage").textContent=text; $("#couponMessage").className="coupon-message"+(type?" "+type:""); }
function renderCheckoutTotals() {
  const subtotal=cartSubtotal(), delivery=cartDelivery(subtotal), discount=couponDiscount(subtotal), fee=paymentFee(), total=checkoutTotalAmount();
  const count=cart.reduce((n,item)=>n+item.quantity,0);
  const line=(l,v,cls="")=>`<div class="pay-line ${cls}"><span>${l}</span><b>${v}</b></div>`;
  // delivery step summary
  $("#checkoutTotal").innerHTML = line("Items subtotal",formatPrice(subtotal))+line("Delivery",delivery?formatPrice(delivery):"FREE")+line("Total (before payment fees &amp; offers)",formatPrice(subtotal+delivery),"grand");
  // payment page summary
  $("#paymentSummary").innerHTML =
    line(`Price (${count} item${count===1?"":"s"})`,formatPrice(subtotal))+
    line("Delivery Charges",delivery?formatPrice(delivery):"FREE",delivery?"":"green")+
    (fee?`<div class="pay-group">Fees</div>`+line("Cash on Delivery Fee",formatPrice(fee)):"")+
    (discount?`<div class="pay-group">Discounts</div>`+line(`Coupon (${appliedCoupon})`,"− "+formatPrice(discount),"green"):"")+
    `<div class="pay-divider"></div>`+line("Total Amount",formatPrice(total),"grand");
  document.querySelectorAll(".pay-amount").forEach(el=>el.textContent=formatPrice(total));
  renderEmiPlans(total);
  renderCouponList(subtotal);
  if (typeof upiOnTotalsChanged === "function") upiOnTotalsChanged(total);
}
function renderCouponList(subtotal) {
  $("#couponList").innerHTML = Object.entries(couponRules).map(([code,rule])=>{
    const methodOk=!rule.method||rule.method===paymentMethod, minOk=subtotal>=rule.minimum, on=appliedCoupon===code;
    const note = on ? "Applied ✓" : !minOk ? `Min. order ${formatPrice(rule.minimum)}` : !methodOk ? `Select ${paymentLabels[rule.method]} to use` : "Tap to apply";
    return `<button type="button" class="coupon-chip${on?" applied":""}${(!methodOk||!minOk)&&!on?" dim":""}" data-coupon="${code}"><b>${code}</b><span>${rule.label}</span><small>${note}</small></button>`;
  }).join("");
}
function applyCoupon(codeArg) {
  const code=(typeof codeArg==="string"?codeArg:$("#couponInput").value).trim().toUpperCase();
  const rule=couponRules[code];
  const subtotal=cartSubtotal();
  if (!code) { appliedCoupon=null; setCouponMessage("Enter a coupon code first.","error"); renderCheckoutTotals(); return; }
  if (!rule) { appliedCoupon=null; setCouponMessage("That code isn't recognised. Try UPI50, CARD60, NETBANK70, SAVE30 or FLAT25.","error"); renderCheckoutTotals(); return; }
  if (subtotal < rule.minimum) { appliedCoupon=null; setCouponMessage(`${code} requires an items subtotal of ${formatPrice(rule.minimum)}.`,"error"); renderCheckoutTotals(); return; }
  if (rule.method && rule.method !== paymentMethod) { appliedCoupon=null; setCouponMessage(`${code} is valid only when paying with ${paymentLabels[rule.method]}. Select that option to use it.`,"error"); renderCheckoutTotals(); return; }
  appliedCoupon=code;
  $("#couponInput").value=code;
  renderCheckoutTotals();
  setCouponMessage(`${code} applied — ${rule.label}. You save ${formatPrice(couponDiscount(subtotal))}.`,"success");
}

/* ---------- Payment page ---------- */
function renderEmiPlans(total) {
  const selected=document.querySelector('input[name="emiPlan"]:checked')?.value||"6";
  const plans=[3,6,9,12];
  $("#emiPlans").innerHTML=plans.map(m=>{
    const monthly=Math.ceil((total+total*0.14*m/12)/m);
    return `<label class="emi-plan"><input type="radio" name="emiPlan" value="${m}"${String(m)===selected?" checked":""}><span><b>${formatPrice(monthly)}/mo</b> × ${m} months</span></label>`;
  }).join("");
}
function selectPaymentMethod(method) {
  paymentMethod=method;
  document.querySelectorAll(".pay-method").forEach(b=>b.classList.toggle("active",b.dataset.method===method));
  document.querySelectorAll(".pay-panel").forEach(p=>p.hidden=p.dataset.panel!==method);
  document.querySelectorAll(".pay-error").forEach(e=>e.textContent="");
  if (method==="upi") { if ($("#paymentDialog").open) setUpiView(defaultUpiView()); } else stopQrTimer();
  if (appliedCoupon) {
    const rule=couponRules[appliedCoupon];
    if (rule.method && rule.method!==method) { const old=appliedCoupon; appliedCoupon=null; $("#couponInput").value=""; renderCheckoutTotals(); setCouponMessage(`${old} removed — it is valid only on ${paymentLabels[rule.method]}.`,"error"); return; }
  }
  renderCheckoutTotals();
}
function openPaymentPage() {
  appliedCoupon=null; $("#couponInput").value=""; setCouponMessage("");
  pendingOrderRef = "CK" + Date.now().toString().slice(-8);
  selectPaymentMethod("upi");
  $("#paymentDialog").showModal();
  setUpiView(defaultUpiView());
}
function validatePayment(method, form) {
  const v=id=>form.querySelector(id).value.trim();
  if (method==="upi") { if (!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(v("#upiId"))) return "Enter a valid UPI ID, e.g. name@upi."; }
  if (method==="card") {
    if (v("#cardNumber").replace(/\s/g,"").length!==16) return "Enter a valid 16-digit card number.";
    const m=v("#cardExpiry").match(/^(\d{2})\/(\d{2})$/); if (!m||Number(m[1])<1||Number(m[1])>12) return "Enter expiry as MM/YY.";
    if (!/^\d{3}$/.test(v("#cardCvv"))) return "Enter the 3-digit CVV.";
    if (v("#cardName").length<2) return "Enter the name on the card.";
  }
  if (method==="emi") { if (!v("#emiBank")) return "Please select your bank."; }
  if (method==="netbanking") { if (!form.querySelector('input[name="bank"]:checked') && !v("#bankOther")) return "Please choose a bank."; }
  if (method==="gift") {
    if (!/^\d{16}$/.test(v("#giftNumber"))) return "Enter the 16-digit gift card number.";
    if (!/^\d{6}$/.test(v("#giftPin"))) return "Enter the 6-digit PIN.";
  }
  return "";
}
function paymentDetail(method, form) {
  if (method==="upi") return "UPI ("+form.querySelector("#upiId").value.trim()+")";
  if (method==="card") return "Credit / Debit / ATM Card (•••• "+form.querySelector("#cardNumber").value.replace(/\s/g,"").slice(-4)+")";
  if (method==="emi") return `EMI (${form.querySelector("#emiBank").value}, ${form.querySelector('input[name="emiPlan"]:checked').value} months)`;
  if (method==="netbanking") return "Net Banking ("+(form.querySelector('input[name="bank"]:checked')?.value||form.querySelector("#bankOther").value)+")";
  return paymentLabels[method];
}


/* ---------- UPI: QR code (desktop) and app redirection (mobile / tablet) ---------- */
let pendingOrderRef = null;
const QR_SECONDS = 300;          // payment session shown to the customer: 5 minutes
const QR_REFRESH_SECONDS = 30;   // background: the QR pattern is silently regenerated every 30 seconds
const UPI_IS_TOUCH = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const UPI_IS_ANDROID = /Android/i.test(navigator.userAgent);
const upiApps = {
  gpay:    { label:"Google Pay", pkg:"com.google.android.apps.nbu.paisa.user", ios:"gpay://upi/pay?" },
  phonepe: { label:"PhonePe",    pkg:"com.phonepe.app",                         ios:"phonepe://pay?" },
  paytm:   { label:"Paytm",      pkg:"net.one97.paytm",                         ios:"paytmmp://pay?" },
  bhim:    { label:"BHIM",       pkg:"in.org.npci.upiapp",                      ios:"upi://pay?" },
  supermoney:{ label:"super.money", pkg:"money.super.payments",                  ios:"upi://pay?" },
  other:   { label:"UPI app",    pkg:null,                                      ios:"upi://pay?" }
};
let upiView = "qr", qrTimerId = null, qrLeft = 0, qrAmount = -1, upiChosenApp = "";
const upiConfig = () => window.UPI_CONFIG || { vpa:"yourname@upi", name:"Flipkart Demo Store" };
const defaultUpiView = () => UPI_IS_TOUCH ? "apps" : "qr";

function upiQuery(amount) {
  // Payee (pa), name, amount and note stay the same. Only the transaction reference (tr) is new
  // each time, which is what makes the QR pattern change on every refresh.
  const c = upiConfig(), ref = pendingOrderRef || "CKDEMO";
  const tr = ref + Date.now().toString(36).toUpperCase();
  return `pa=${c.vpa}&pn=${encodeURIComponent(c.name)}&tr=${tr}&tn=${encodeURIComponent("Order "+ref)}&am=${Number(amount).toFixed(2)}&cu=INR`;
}
function qrSvg(text) {
  const qr = FKQR.create(text, "M"), n = qr.getModuleCount(), pad = 2;
  let d = "";
  for (let r=0; r<n; r++) for (let c=0; c<n; c++) if (qr.isDark(r,c)) d += `M${c+pad} ${r+pad}h1v1h-1z`;
  const size = n + pad*2;
  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" role="img"><rect width="${size}" height="${size}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
}
let qrRevealed = false, qrExpired = false;
function stopQrTimer() { clearInterval(qrTimerId); qrTimerId = null; }
function paintQrTimer() {
  const m = Math.floor(qrLeft/60), s = qrLeft%60;
  $("#qrTimer").textContent = String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
  $("#qrBarFill").style.width = (qrLeft/QR_SECONDS*100)+"%";
}
function syncQrUi() {
  $("#upiQr").classList.toggle("masked", !qrRevealed);
  $("#upiQr").classList.toggle("expired", qrRevealed && qrExpired);
  $("#showQrBtn").hidden = qrRevealed;
  $("#qrTimerBlock").hidden = !qrRevealed || qrExpired;
  $("#qrRenewBtn").hidden = !(qrRevealed && qrExpired);
  $("#qrPaidBtn").hidden = !qrRevealed || qrExpired;
}
// newSession=true starts a fresh 5-minute payment countdown; false only redraws the QR (silent refresh / amount change).
function renderQr(newSession) {
  const amount = checkoutTotalAmount();
  qrAmount = amount;
  $("#upiQr").innerHTML = qrSvg("upi://pay?" + upiQuery(amount));
  $("#upiQr").classList.remove("refreshed"); void $("#upiQr").offsetWidth; $("#upiQr").classList.add("refreshed");
  if (newSession && qrRevealed) {
    stopQrTimer(); qrExpired = false; qrLeft = QR_SECONDS; paintQrTimer();
    qrTimerId = setInterval(()=>{
      qrLeft--; paintQrTimer();
      if (qrLeft <= 0) { stopQrTimer(); qrExpired = true; syncQrUi(); return; }
      if ((QR_SECONDS - qrLeft) % QR_REFRESH_SECONDS === 0) renderQr(false);   // background refresh, not shown to the user
    },1000);
  }
  syncQrUi();
}
function setUpiView(view) {
  if (view === "default") view = defaultUpiView();
  upiView = view;
  [["qr","upiQrView"],["apps","upiAppsView"],["wait","upiWaitView"],["id","upiIdView"]].forEach(([k,id])=>{ $("#"+id).hidden = k!==view; });
  const placeholder = upiConfig().vpa === "yourname@upi";
  $("#upiConfigNote").hidden = $("#upiConfigNote2").hidden = !placeholder;
  stopQrTimer();
  if (view === "qr" && paymentMethod === "upi") { qrRevealed = false; qrExpired = false; renderQr(false); } // QR stays hidden until "Show QR code" is clicked
}
function upiOnTotalsChanged(total) {
  if (paymentMethod === "upi" && upiView === "qr" && $("#paymentDialog").open && total !== qrAmount) renderQr(false);
}
function openUpiApp(key) {
  const app = upiApps[key], q = upiQuery(checkoutTotalAmount());
  upiChosenApp = app.label;
  const url = UPI_IS_ANDROID
    ? (app.pkg ? `intent://pay?${q}#Intent;scheme=upi;package=${app.pkg};end` : `upi://pay?${q}`)
    : app.ios + q;
  setUpiView("wait");
  window.location.href = url;
}
function confirmUpiPaid(btn, detail) {
  const original = btn.textContent;
  btn.disabled = true; btn.textContent = "Verifying payment…";
  setTimeout(()=>{ btn.disabled = false; btn.textContent = original; finalizeOrder(detail); }, 1500);
}
document.querySelectorAll("[data-upi-app]").forEach(b=>b.addEventListener("click",()=>openUpiApp(b.dataset.upiApp)));
document.querySelectorAll("[data-upi-view]").forEach(b=>b.addEventListener("click",()=>setUpiView(b.dataset.upiView)));
$("#qrRenewBtn").addEventListener("click",()=>renderQr(true));
$("#showQrBtn").addEventListener("click",()=>{ qrRevealed = true; renderQr(true); $("#qrPaidBtn").focus({preventScroll:true}); });
$("#qrPaidBtn").addEventListener("click",e=>confirmUpiPaid(e.currentTarget,"UPI (QR code)"));
$("#waitPaidBtn").addEventListener("click",e=>confirmUpiPaid(e.currentTarget,"UPI ("+(upiChosenApp||"app")+")"));
$("#paymentDialog").addEventListener("close",stopQrTimer);

document.querySelectorAll(".pay-method").forEach(btn=>btn.addEventListener("click",()=>selectPaymentMethod(btn.dataset.method)));
$("#payBackBtn").addEventListener("click",()=>{ $("#paymentDialog").close(); renderCheckoutTotals(); $("#checkoutDialog").showModal(); });
$("#couponList").addEventListener("click",event=>{const chip=event.target.closest("[data-coupon]"); if(chip) applyCoupon(chip.dataset.coupon);});
$("#cardNumber").addEventListener("input",e=>{e.target.value=e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();});
$("#cardExpiry").addEventListener("input",e=>{let d=e.target.value.replace(/\D/g,"").slice(0,4); e.target.value=d.length>2?d.slice(0,2)+"/"+d.slice(2):d;});
["#cardCvv","#giftNumber","#giftPin"].forEach(s=>$(s).addEventListener("input",e=>{e.target.value=e.target.value.replace(/\D/g,"");}));
document.querySelectorAll('input[name="bank"]').forEach(r=>r.addEventListener("change",()=>{$("#bankOther").value="";}));
$("#bankOther").addEventListener("change",()=>{document.querySelectorAll('input[name="bank"]').forEach(r=>r.checked=false);});
document.querySelectorAll(".pay-form").forEach(form=>form.addEventListener("submit",event=>{
  event.preventDefault();
  const method=form.dataset.method, err=form.querySelector(".pay-error"), btn=form.querySelector(".pay-btn");
  const msg=validatePayment(method,form);
  if (msg) { err.textContent=msg; return; }
  err.textContent="";
  const detail=paymentDetail(method,form);
  const original=btn.innerHTML; btn.disabled=true; btn.textContent="Processing…";
  setTimeout(()=>{ btn.disabled=false; btn.innerHTML=original; finalizeOrder(detail); form.reset(); },900);
}));

const trackingSteps = [
  { label:"Order confirmed", description:"Your order has been received by Flipkart.", icon:"✓" },
  { label:"Packed", description:"Your items have been packed for dispatch.", icon:"▣" },
  { label:"Shipped", description:"Your parcel is on its way (simulated).", icon:"➜" },
  { label:"Out for delivery", description:"Your parcel is on the final delivery route (simulated).", icon:"⌂" },
  { label:"Delivered", description:"The demo delivery is marked complete.", icon:"✓" }
];
let trackingOrderId = null;
function openOrderTracking(orderId) {
  const order = orderHistory.find(item => item.id === orderId);
  if (!order) { showToast("Order not found"); return; }
  trackingOrderId = orderId;
  order.statusStep = Math.max(0, Math.min(Number(order.statusStep) || 0, trackingSteps.length - 1));
  const step = order.statusStep;
  $("#trackingSubtitle").textContent = `Order ${order.id} · Placed ${order.date}`;
  $("#trackingSummary").innerHTML = `<div><span>Order total</span><b>${formatPrice(order.total)}</b></div><div><span>Items</span><b>${order.items.reduce((n,item)=>n+item.quantity,0)}</b></div><div><span>Current status</span><b>${trackingSteps[step].label}</b></div>`;
  $("#trackingTimeline").innerHTML = trackingSteps.map((item,index)=>`<li class="tracking-step ${index < step ? "completed" : ""} ${index === step ? "current" : ""}"><span class="tracking-step-icon">${index < step ? "✓" : item.icon}</span><div><b>${item.label}</b><p>${item.description}</p></div>${index === step ? `<span class="tracking-current-label">CURRENT</span>` : ""}</li>`).join("");
  $("#advanceTrackingBtn").disabled = step >= trackingSteps.length - 1;
  $("#advanceTrackingBtn").textContent = step >= trackingSteps.length - 1 ? "Delivery complete" : "Simulate next update";
  saveData("campuskart-orders",orderHistory);
  $("#trackingDialog").showModal();
}
function advanceOrderTracking() {
  const order = orderHistory.find(item => item.id === trackingOrderId);
  if (!order || (Number(order.statusStep)||0) >= trackingSteps.length - 1) return;
  order.statusStep = (Number(order.statusStep)||0) + 1;
  saveData("campuskart-orders",orderHistory);
  openOrderTracking(trackingOrderId);
  renderAccount();
  showToast(`Demo status updated: ${trackingSteps[order.statusStep].label}`);
}

function renderAccount() {
  if (demoProfile) {
    $("#accountName").value=demoProfile.name || "";
    $("#accountEmail").value=demoProfile.email || "";
    $("#loginLabel").textContent=(demoProfile.name||"").split(" ")[0]||"Account";
  } else {
    $("#accountName").value=""; $("#accountEmail").value=""; $("#loginLabel").textContent="Login";
  }
  $("#orderCountLabel").textContent=`${orderHistory.length} order${orderHistory.length===1?"":"s"}`;
  document.documentElement.dataset.auth = demoProfile ? "in" : "out";
  if (typeof updateLoginMenu === "function") updateLoginMenu();
  $("#accountOrdersList").innerHTML=orderHistory.length ? orderHistory.slice().reverse().map(order=>`<article class="account-order-card"><div><b>${order.id}</b><small>${order.date}</small></div><strong>${formatPrice(order.total)}</strong><span class="order-status">${trackingSteps[Math.min(Number(order.statusStep)||0,trackingSteps.length-1)].label}</span><button type="button" class="track-order-btn" data-track-order="${order.id}">Track order →</button><details><summary>View items</summary><ul>${order.items.map(item=>`<li>${item.name} × ${item.quantity}</li>`).join("")}</ul></details></article>`).join("") : `<div class="account-empty"><span>📦</span><b>No orders yet</b><p>Your demo orders will appear here after checkout.</p></div>`;
}
function openAccount() {
  renderAccount();
  $("#accountDialog").showModal();
}

// Login button opens the account dropdown: see "Phase 35" block at the end of this file.
$("#accountBtn").addEventListener("click", () => { if (demoProfile) openAccount(); else { $("#loginDialog").showModal(); focusLoginField(); } });
$("#closeLoginBtn").addEventListener("click", () => $("#loginDialog").close());
// ---- Login: phone (default) or email, then 6-digit OTP verification ----
const login = { mode:"phone", step:1, otp:"", timer:null, seconds:0 };
const otpInputs = () => [...document.querySelectorAll("#otpBoxes input")];
const loginValue = () => login.mode==="phone" ? $("#demoPhone").value.trim() : $("#demoEmail").value.trim().toLowerCase();
const loginValueValid = () => login.mode==="phone" ? /^[6-9]\d{9}$/.test(loginValue()) : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(loginValue());
function focusLoginField() { setTimeout(()=>{ (login.step===1 ? (login.mode==="phone"?$("#demoPhone"):$("#demoEmail")) : otpInputs()[0]).focus(); },30); }
function updateLoginButton() {
  const ok = login.step===1 ? loginValueValid() : otpInputs().every(i=>i.value);
  $("#loginSubmitBtn").disabled=!ok;
}
function setLoginMode(mode) {
  login.mode=mode;
  $("#phoneField").hidden = mode!=="phone"; $("#emailField").hidden = mode!=="email";
  $("#loginSub").textContent = mode==="phone" ? "Enter your phone number to continue" : "Enter your email address to continue";
  $("#loginModeBtn").textContent = mode==="phone" ? "Use Email-ID" : "Use Phone Number";
  $("#loginError").textContent=""; updateLoginButton(); focusLoginField();
}
function showLoginStep(step) {
  login.step=step;
  $("#loginStep1").hidden = step!==1; $("#loginStep2").hidden = step!==2;
  $("#loginSubmitBtn").textContent = step===1 ? "Continue" : "Verify";
  $("#loginError").textContent=""; $("#otpError").textContent="";
  updateLoginButton(); focusLoginField();
}
function startOtpTimer() {
  clearInterval(login.timer); login.seconds=30;
  $("#otpResendBtn").hidden=true; $("#otpTimer").hidden=false;
  const paint=()=>{ $("#otpTimer").textContent="00:"+String(login.seconds).padStart(2,"0"); };
  paint();
  login.timer=setInterval(()=>{
    login.seconds--; paint();
    if (login.seconds<=0) { clearInterval(login.timer); $("#otpTimer").hidden=true; $("#otpResendBtn").hidden=false; }
  },1000);
}
function sendOtp() {
  login.otp=String(Math.floor(100000+Math.random()*900000));
  $("#demoOtp").textContent=login.otp;
  otpInputs().forEach(i=>i.value="");
  $("#otpTarget").textContent = login.mode==="phone" ? "+91-"+loginValue() : loginValue();
  startOtpTimer();
}
function resetLogin() {
  clearInterval(login.timer); login.otp="";
  $("#demoPhone").value=""; $("#demoEmail").value=""; otpInputs().forEach(i=>i.value="");
  login.mode="phone"; $("#phoneField").hidden=false; $("#emailField").hidden=true;
  $("#loginSub").textContent="Enter your phone number to continue"; $("#loginModeBtn").textContent="Use Email-ID";
  showLoginStep(1);
}
function completeLogin(profile) {
  demoProfile=profile; saveData("campuskart-profile",demoProfile);
  const next=pendingAfterLogin, gateWasOpen=!$("#cartGate").hidden; pendingAfterLogin=null;
  $("#loginDialog").close(); renderAccount(); showToast("Logged in successfully (demo)");
  if (next) next(); else if (gateWasOpen) { hideCartGate(); openCart(); } else openAccount();
}
$("#loginModeBtn").addEventListener("click",()=>setLoginMode(login.mode==="phone"?"email":"phone"));
$("#demoPhone").addEventListener("input",e=>{e.target.value=e.target.value.replace(/\D/g,"").slice(0,10); $("#loginError").textContent=""; updateLoginButton();});
$("#demoEmail").addEventListener("input",()=>{$("#loginError").textContent=""; updateLoginButton();});
$("#otpEditBtn").addEventListener("click",()=>{clearInterval(login.timer); showLoginStep(1);});
$("#otpResendBtn").addEventListener("click",()=>{sendOtp(); $("#otpError").textContent=""; updateLoginButton(); otpInputs()[0].focus(); showToast("A new OTP has been sent (demo)");});
otpInputs().forEach((box,idx,all)=>{
  box.addEventListener("input",()=>{
    box.value=box.value.replace(/\D/g,"").slice(0,1);
    if (box.value && all[idx+1]) all[idx+1].focus();
    $("#otpError").textContent=""; updateLoginButton();
  });
  box.addEventListener("keydown",e=>{
    if (e.key==="Backspace" && !box.value && all[idx-1]) { all[idx-1].value=""; all[idx-1].focus(); updateLoginButton(); }
    if (e.key==="ArrowLeft" && all[idx-1]) all[idx-1].focus();
    if (e.key==="ArrowRight" && all[idx+1]) all[idx+1].focus();
  });
  box.addEventListener("paste",e=>{
    const digits=(e.clipboardData.getData("text")||"").replace(/\D/g,"").slice(0,6);
    if (!digits) return; e.preventDefault();
    all.forEach((b,i)=>b.value=digits[i]||""); all[Math.min(digits.length,5)].focus(); updateLoginButton();
  });
});
$("#closeLoginBtn").addEventListener("click", () => $("#loginDialog").close());
$("#loginDialog").addEventListener("close", resetLogin);
$("#loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  if (login.step===1) {
    if (!loginValueValid()) { $("#loginError").textContent = login.mode==="phone" ? "Please enter a valid 10-digit mobile number." : "Please enter a valid email address."; return; }
    sendOtp(); showLoginStep(2); return;
  }
  const entered=otpInputs().map(i=>i.value).join("");
  if (entered!==login.otp) { $("#otpError").textContent="Incorrect OTP. Please try again."; otpInputs().forEach(i=>i.value=""); otpInputs()[0].focus(); updateLoginButton(); return; }
  const value=loginValue();
  completeLogin(login.mode==="email"
    ? {name:value.split("@")[0].replace(/[._-]+/g," ").replace(/\b\w/g,c=>c.toUpperCase()), email:value, phone:(demoProfile&&demoProfile.phone)||""}
    : {name:(demoProfile&&demoProfile.name)||"", email:(demoProfile&&demoProfile.email)||"", phone:value});
});
$("#closeAccountBtn").addEventListener("click", () => $("#accountDialog").close());
$("#accountForm").addEventListener("submit", event=>{
  event.preventDefault();
  demoProfile={...demoProfile,name:$("#accountName").value.trim(),email:$("#accountEmail").value.trim().toLowerCase()};
  saveData("campuskart-profile",demoProfile); renderAccount(); showToast("Profile saved in this browser");
});
$("#logoutBtn").addEventListener("click",()=>{
  demoProfile=null; saveData("campuskart-profile",null); $("#accountDialog").close(); renderAccount(); showToast("Signed out of demo account");
});

$("#checkoutBtn").addEventListener("click", () => {
  if (!demoProfile) { closeCart(); showCartGate(); return; }   // checkout needs a login
  if (!cart.length) return;
  closeCart(); appliedCoupon=null; paymentMethod="upi";
  if (demoProfile) { $("#customerName").value=demoProfile.name||""; $("#customerEmail").value=demoProfile.email||""; }
  renderCheckoutTotals(); $("#checkoutDialog").showModal();
});
$("#applyCouponBtn").addEventListener("click",()=>applyCoupon());
$("#couponInput").addEventListener("keydown",event=>{if(event.key==="Enter"){event.preventDefault();applyCoupon();}});
$("#closeCheckoutBtn").addEventListener("click", () => $("#checkoutDialog").close());
// Step 1: delivery details -> payment page
$("#checkoutForm").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!$("#checkoutForm").reportValidity() || !cart.length) return;
  $("#checkoutDialog").close(); openPaymentPage();
});
// Step 2: payment page -> place order
function finalizeOrder(paymentText) {
  if (!cart.length) return;
  const orderNumber = pendingOrderRef || ("CK" + Date.now().toString().slice(-8)); pendingOrderRef = null;
  const customerName = $("#customerName").value.trim();
  const customerEmail = $("#customerEmail").value.trim().toLowerCase();
  const total = checkoutTotalAmount();
  const subtotal = cartSubtotal();
  const discount = couponDiscount(subtotal);
  const order = {
    id:orderNumber, date:new Date().toLocaleString("en-IN"), statusStep:0, name:customerName, email:customerEmail,
    address:$("#customerAddress").value.trim(), payment:paymentText,
    subtotal, delivery:cartDelivery(subtotal), fee:paymentFee(), coupon:appliedCoupon, discount, total,
    items:cart.map(item=>{const product=products.find(p=>p.id===item.id);return {id:item.id,name:product.name,price:product.price,quantity:item.quantity,image:product.image};})
  };
  orderHistory.push(order); saveData("campuskart-orders",orderHistory);
  demoProfile={...demoProfile,name:customerName,email:customerEmail}; saveData("campuskart-profile",demoProfile);
  latestOrderId=orderNumber;
  $("#confirmationGreeting").textContent=`Thanks, ${customerName}. Your order has been recorded in this browser.`;
  $("#confirmationOrderDetails").innerHTML=`<div><span>Order number</span><b>${order.id}</b></div><div><span>Order date</span><b>${order.date}</b></div><div><span>Items</span><b>${order.items.reduce((n,item)=>n+item.quantity,0)}</b></div><div><span>Payment method</span><b>${paymentText}</b></div><div><span>Coupon savings</span><b>${formatPrice(discount)}</b></div><div class="confirmation-total"><span>Demo total</span><b>${formatPrice(total)}</b></div>`;
  $("#paymentDialog").close(); $("#orderConfirmationDialog").showModal();
  cart=[]; saveCart(); renderCart(); $("#checkoutForm").reset(); appliedCoupon=null; paymentMethod="upi"; renderAccount();
}
$("#closeConfirmationBtn").addEventListener("click",()=>$("#orderConfirmationDialog").close());
$("#continueShoppingBtn").addEventListener("click",()=>{$("#orderConfirmationDialog").close(); window.scrollTo({top:0,behavior:"smooth"});});
$("#viewOrdersBtn").addEventListener("click",()=>{$("#orderConfirmationDialog").close();openAccount();});

$("#accountOrdersList").addEventListener("click", event => {
  const button = event.target.closest("[data-track-order]");
  if (button) openOrderTracking(button.dataset.trackOrder);
});
$("#closeTrackingBtn").addEventListener("click", () => $("#trackingDialog").close());
$("#closeTrackingDoneBtn").addEventListener("click", () => $("#trackingDialog").close());
$("#advanceTrackingBtn").addEventListener("click", advanceOrderTracking);
$("#trackLatestOrderBtn").addEventListener("click", () => {
  if (latestOrderId) { $("#orderConfirmationDialog").close(); openOrderTracking(latestOrderId); }
});
$("#trackingDialog").addEventListener("click", event => { if (event.target === $("#trackingDialog")) $("#trackingDialog").close(); });

$("#productDetail").addEventListener("click", (event) => {
  const thumb=event.target.closest("[data-gallery-image]");
  if(thumb){ $("#detailMainImage").src=thumb.dataset.galleryImage; $("#productDetail").querySelectorAll(".detail-thumb").forEach(btn=>btn.classList.toggle("active",btn===thumb)); return; }
  if(event.target.closest("#checkPinBtn")){
    const pin=$("#deliveryPin").value.trim(); const message=$("#pinMessage");
    if(!/^\d{6}$/.test(pin)){message.textContent="Please enter a valid 6-digit PIN code.";message.className="error";}
    else {message.textContent=`Delivery estimate for ${pin}: 3–6 business days (sample estimate).`;message.className="success";}
    return;
  }
  const bundleButton = event.target.closest("[data-add-bundle]");
  if (bundleButton) { addBundleToCart(Number(bundleButton.dataset.addBundle)); return; }
  const questionHelpful = event.target.closest("[data-helpful-question]");
  if (questionHelpful) {
    const question = productQuestions.find((item) => item.id === questionHelpful.dataset.helpfulQuestion);
    if (!question) return;
    question.helpful = (Number(question.helpful) || 0) + 1;
    saveData("campuskart-questions", productQuestions);
    const productId = Number($("#questionForm")?.dataset.questionProduct);
    openProductDetails(productId);
    showToast("Thanks for helping other shoppers!");
    return;
  }
  const helpfulButton = event.target.closest("[data-helpful-review]");
  if (helpfulButton) {
    const review = customerReviews.find((item) => item.id === helpfulButton.dataset.helpfulReview);
    if (!review) return;
    review.helpful = (Number(review.helpful) || 0) + 1;
    saveData("campuskart-reviews", customerReviews);
    const productId = Number($("#reviewForm")?.dataset.reviewProduct);
    openProductDetails(productId);
    showToast("Thanks for your feedback!");
    return;
  }
  if (event.target.closest("#closeProductBtn")) { $("#productDialog").close(); return; }
  const add = event.target.closest("[data-detail-add]");
  if (add) { const id = Number(add.dataset.detailAdd); $("#productDialog").close(); addToCart(id); return; }
  const wish = event.target.closest("[data-detail-wishlist]");
  if (wish) { const id = Number(wish.dataset.detailWishlist); toggleWishlist(id); openProductDetails(id); }
});
$("#productDetail").addEventListener("change", (event) => {
  if (event.target.matches("[data-bundle-product]")) updateBundleTotal();
});

$("#productDetail").addEventListener("submit", (event) => {
  const alertForm = event.target.closest("#priceAlertForm");
  if (alertForm) {
    event.preventDefault();
    if (!alertForm.reportValidity()) return;
    const productId = Number(alertForm.dataset.alertProduct);
    const targetPrice = Number($("#targetPriceInput").value);
    if (!products.some((product) => product.id === productId) || !Number.isFinite(targetPrice) || targetPrice <= 0) return;
    savePriceAlert(productId, targetPrice);
    return;
  }
  const questionForm = event.target.closest("#questionForm");
  if (questionForm) {
    event.preventDefault();
    if (!questionForm.reportValidity()) return;
    const productId = Number(questionForm.dataset.questionProduct);
    const name = $("#questionName").value.trim();
    const question = $("#questionText").value.trim();
    if (!products.some((product) => product.id === productId) || !name || question.length < 8) return;
    productQuestions.push({ id: `question-${Date.now()}-${Math.random().toString(36).slice(2,7)}`, productId, name, question, answer: "", date: new Date().toLocaleDateString("en-IN"), helpful: 0 });
    saveData("campuskart-questions", productQuestions);
    openProductDetails(productId);
    showToast("Your question was saved in this browser");
    return;
  }
  const form = event.target.closest("#reviewForm");
  if (!form) return;
  event.preventDefault();
  if (!form.reportValidity()) return;
  const productId = Number(form.dataset.reviewProduct);
  const name = $("#reviewName").value.trim();
  const rating = Number($("#reviewRating").value);
  const text = $("#reviewText").value.trim();
  if (!products.some((product) => product.id === productId) || !name || ![1,2,3,4,5].includes(rating) || text.length < 8) return;
  customerReviews.push({ id: `review-${Date.now()}-${Math.random().toString(36).slice(2,7)}`, productId, name, rating, text, date: new Date().toLocaleDateString("en-IN"), helpful: 0, sample: false });
  saveData("campuskart-reviews", customerReviews);
  openProductDetails(productId);
  showToast("Your review was saved in this browser");
});

$("#productDetail").addEventListener("change", (event) => {
  if (event.target.matches("#reviewSort")) sortVisibleReviews(event.target.value);
});

$("#productDialog").addEventListener("click", (event) => { if (event.target === $("#productDialog")) $("#productDialog").close(); });

$("#priceRange").addEventListener("input", (event) => {
  maxPrice = Number(event.target.value);
  $("#maxPriceLabel").textContent = formatPrice(maxPrice);
});
$("#applyFiltersBtn").addEventListener("click", () => { renderProducts(); $("#productsSection").scrollIntoView({behavior:"smooth",block:"start"}); });
$("#clearFiltersBtn").addEventListener("click", resetProducts);
$("#brandFilters").addEventListener("change", (event) => {
  if (!event.target.matches('input[type="checkbox"]')) return;
  selectedBrands = [...$("#brandFilters").querySelectorAll('input[type="checkbox"]:checked')].map((input) => input.value);
  renderProducts();
});
document.querySelectorAll('input[name="ratingFilter"]').forEach((input) => input.addEventListener("change", () => { selectedRating = Number(input.value); renderProducts(); }));
$("#activeFilters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-filter]"); if (!button) return;
  const key = button.dataset.removeFilter;
  if (key === "category") setCategory("All");
  else if (key === "search") { searchTerm = ""; $("#searchInput").value = ""; }
  else if (key === "price") { maxPrice = 50000; $("#priceRange").value = "50000"; $("#maxPriceLabel").textContent = formatPrice(50000); }
  else if (key === "rating") { selectedRating = 0; document.querySelector('input[name="ratingFilter"][value="0"]').checked = true; }
  else if (key.startsWith("brand:")) { selectedBrands = selectedBrands.filter((brand) => brand !== key.slice(6)); renderBrandFilters(); }
  renderProducts();
});

let savedTheme = "light";
try { savedTheme = localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light"; } catch (error) { /* Theme still works for this page view. */ }
applyTheme(savedTheme);
$("#themeToggle").addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem(THEME_STORAGE_KEY, nextTheme); } catch (error) { /* Theme still works for this page view. */ }
  applyTheme(nextTheme, true);
});

$("#priceAlertsBtn").addEventListener("click", () => { renderPriceAlerts(); $("#priceAlertsDialog").showModal(); });
$("#closePriceAlertsBtn").addEventListener("click", () => $("#priceAlertsDialog").close());
$("#priceAlertsDialog").addEventListener("click", (event) => { if (event.target === $("#priceAlertsDialog")) $("#priceAlertsDialog").close(); });
$("#priceAlertsList").addEventListener("click", (event) => {
  const edit = event.target.closest("[data-edit-price-alert]");
  const simulate = event.target.closest("[data-demo-price-drop]");
  const remove = event.target.closest("[data-remove-price-alert]");
  const productId = Number((edit || simulate || remove)?.dataset.editPriceAlert || (edit || simulate || remove)?.dataset.demoPriceDrop || (edit || simulate || remove)?.dataset.removePriceAlert);
  if (!Number.isInteger(productId)) return;
  if (edit) {
    $("#priceAlertsDialog").close();
    openProductDetails(productId);
    showToast("Update the target price in the product details");
    return;
  }
  if (simulate) {
    const alert = priceAlerts.find((item) => item.productId === productId);
    if (!alert) return;
    alert.triggered = true;
    saveData("campuskart-price-alerts", priceAlerts);
    renderPriceAlerts();
    showToast("Demo alert triggered — no live price was checked");
    return;
  }
  if (remove) {
    priceAlerts = priceAlerts.filter((item) => item.productId !== productId);
    saveData("campuskart-price-alerts", priceAlerts);
    renderPriceAlerts();
    showToast("Price alert removed");
  }
});

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
$("#maxPriceLabel").textContent = formatPrice(maxPrice);
renderBrandFilters();
renderProducts();
renderCarousel();
renderRecentlyViewed();
renderCart();
renderPriceAlerts();

// Phase 26 header menu interactions
const moreMenuButton = document.querySelector("#moreMenuBtn");
const moreDropdownMenu = document.querySelector("#moreDropdown");
if (moreMenuButton && moreDropdownMenu) {
  moreMenuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = moreDropdownMenu.hidden;
    moreDropdownMenu.hidden = !willOpen;
    moreMenuButton.setAttribute("aria-expanded", String(willOpen));
  });
  moreDropdownMenu.addEventListener("click", (event) => event.stopPropagation());
  document.addEventListener("click", () => {
    moreDropdownMenu.hidden = true;
    moreMenuButton.setAttribute("aria-expanded", "false");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      moreDropdownMenu.hidden = true;
      moreMenuButton.setAttribute("aria-expanded", "false");
    }
  });
}
// Delivery location: see "Phase 34" block at the end of this file.


// Phase 32: multi-card moving banner carousel (8 replaceable image slots; 3-second rotation).
(() => {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;
  const banners = Array.from({ length: 8 }, (_, i) => `banners/banner-${i + 1}.jpg`);
  const dots = [...slider.querySelectorAll('.hero-dot')];
  const oldContent = slider.querySelector('.hero-content');
  const oldArt = slider.querySelector('.hero-art');
  if (oldContent) oldContent.style.display = 'none';
  if (oldArt) oldArt.style.display = 'none';
  slider.classList.add('multi-banner-slider');
  const track = document.createElement('div');
  track.className = 'multi-banner-track';
  track.setAttribute('aria-label', 'Shopping promotions');
  // Add a few clones at the end for a smooth wrap-around loop.
  [...banners, ...banners.slice(0, 3)].forEach((src, i) => {
    const card = document.createElement('div');
    card.className = 'multi-banner-card';
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Shopping promotion ${((i % banners.length) + 1)}`;
    img.loading = i < 3 ? 'eager' : 'lazy';
    img.onerror = () => {
      img.onerror = null;
      img.remove();
      card.classList.add('banner-placeholder');
      card.innerHTML = `<div class="placeholder-copy"><span>THE BIG SALE</span><strong>Big deals.<br>Happy shopping.</strong><small>Place your banner image at ${src}</small></div>`;
    };
    card.appendChild(img);
    track.appendChild(card);
  });
  slider.insertBefore(track, slider.querySelector('.hero-arrow'));
  let current = 0;
  let timer = null;
  const gap = () => parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 24;
  const step = () => {
    const card = track.querySelector('.multi-banner-card');
    return card ? card.getBoundingClientRect().width + gap() : 0;
  };
  const update = (animate = true) => {
    track.style.transition = animate ? 'transform 650ms cubic-bezier(.22,.7,.25,1)' : 'none';
    track.style.transform = `translateX(${-current * step()}px)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      dot.setAttribute('aria-pressed', String(i === current));
    });
    slider.setAttribute('aria-label', `Featured shopping banners, banner ${current + 1} of ${banners.length}`);
  };
  const go = (index) => {
    current = (index + banners.length) % banners.length;
    update(true);
  };
  const startAuto = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => {
      current += 1;
      update(true);
      if (current === banners.length) {
        window.setTimeout(() => { current = 0; update(false); }, 680);
      }
    }, 3000);
  };
  document.getElementById('heroPrev')?.addEventListener('click', () => { go(current - 1); startAuto(); });
  document.getElementById('heroNext')?.addEventListener('click', () => { go(current + 1); startAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { go(i); startAuto(); }));
  slider.addEventListener('mouseenter', () => window.clearInterval(timer));
  slider.addEventListener('mouseleave', startAuto);
  slider.addEventListener('focusin', () => window.clearInterval(timer));
  slider.addEventListener('focusout', (event) => { if (!slider.contains(event.relatedTarget)) startAuto(); });
  document.addEventListener('visibilitychange', () => document.hidden ? window.clearInterval(timer) : startAuto());
  window.addEventListener('resize', () => update(false));
  update(false);
  startAuto();
})();


// Phase 33: interactive deal rails below the static banner.
// Each card is one image from /deals/ (photo + price bar + name are already inside the image).
// If an image is missing, an emoji fallback card with the text below is shown instead.
(() => {
  const mount = document.getElementById('dealRails');
  if (!mount) return;
  // [emoji fallback, name, price, fallback tile colour]
  const rails = [
    { id: 'tech', title: 'Top deals on tech', items: [
      ['📱', 'Galaxy S25', 'From ₹54,299*', '#f8d3df'], ['🔊', 'boAt PartyPal 500', 'Just ₹11,499*', '#bff0e0'],
      ['💻', 'Acer Core 7', 'Just ₹57,490*', '#d9e6ff'], ['📱', 'Google Pixel 10a', 'From 42,999*', '#c9d2ff'],
      ['🏷️', 'Top deals !', 'From ₹399', '#f3e3d3'], ['🪒', 'Deal on trimmers', 'From ₹449', '#e8e3dc'],
      ['💧', 'Water purifiers', 'From ₹3,999', '#f3dfd0'], ['🖱️', 'Ant Esports', 'From ₹199', '#c8ecff']] },
    { id: 'best', title: 'Bestsellers of the sale', items: [
      ['💧', 'Water purifiers', 'From ₹6,299', '#e5dcd6'], ['🎮', 'HP Victus Gaming', 'Starts ₹78,490*', '#d8d0f5'],
      ['🍳', 'Kitchen deals !', 'From ₹399', '#e9e4de'], ['🧳', 'Safari, Aristocrat', 'Min. 85% Off', '#ffd9c2'],
      ['🧴', 'Moisturizer', 'Min. 50% Off', '#fbe1d6'], ['⌚', 'realme Watch 5', 'From ₹3,299*', '#ffe3c7'],
      ['🥤', 'Mixer grinders', 'From ₹999', '#e9e1d6'], ['🍳', 'Cookware range', 'Up to 70% Off', '#e4e4e4'] ] }
  ];
  const exts = ['webp', 'png', 'jpg'];   // tried in this order for each card image
  rails.forEach((rail) => {
    const sec = document.createElement('section');
    sec.className = 'deal-rail';
    sec.setAttribute('aria-label', rail.title);
    const h = document.createElement('h2');
    h.className = 'deal-rail-title';
    h.textContent = rail.title;
    const track = document.createElement('div');
    track.className = 'deal-rail-track';
    rail.items.forEach(([emoji, name, price, bg], i) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'deal-card';
      card.setAttribute('aria-label', `${name}, ${price}`);
      // Emoji fallback (replaced by the photo card as soon as an image loads).
      const art = document.createElement('span');
      art.className = 'deal-card-img';
      art.style.background = `linear-gradient(160deg, ${bg}, #ffffff)`;
      art.textContent = emoji;
      const p = document.createElement('span'); p.className = 'deal-card-price'; p.textContent = price;
      const n = document.createElement('span'); n.className = 'deal-card-name'; n.textContent = name;
      card.append(art, p, n);
      let tryIndex = 0;
      const img = new Image();
      img.alt = name;
      img.className = 'deal-card-photo';
      img.onload = () => { card.classList.add('has-photo'); card.replaceChildren(img); };
      img.onerror = () => { tryIndex += 1; if (tryIndex < exts.length) img.src = `deals/${rail.id}-${i + 1}.${exts[tryIndex]}`; };
      img.src = `deals/${rail.id}-${i + 1}.${exts[0]}`;
      card.addEventListener('click', () => {
        document.getElementById('productsSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (typeof showToast === 'function') showToast(`Showing deals: ${name}`);
      });
      track.appendChild(card);
    });
    const prev = document.createElement('button');
    prev.type = 'button'; prev.className = 'deal-arrow deal-prev'; prev.setAttribute('aria-label', `Scroll ${rail.title} left`); prev.textContent = '‹';
    const next = document.createElement('button');
    next.type = 'button'; next.className = 'deal-arrow deal-next'; next.setAttribute('aria-label', `Scroll ${rail.title} right`); next.textContent = '›';
    const amount = () => Math.max(track.clientWidth * 0.8, 200);
    prev.addEventListener('click', () => track.scrollBy({ left: -amount() }));
    next.addEventListener('click', () => track.scrollBy({ left: amount() }));
    const sync = () => {
      prev.hidden = track.scrollLeft <= 16;
      next.hidden = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    };
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sec.append(h, track, prev, next);
    mount.appendChild(sec);
    sync();
  });
})();


// Phase 34: live delivery-location lookup (India Post PIN code API).
(() => {
  const btn = document.getElementById('deliveryLocationBtn');
  const pop = document.getElementById('locPopover');
  if (!btn || !pop) return;
  const input = document.getElementById('locPin');
  const checkBtn = document.getElementById('locCheck');
  const closeBtn = document.getElementById('locClose');
  const msg = document.getElementById('locMsg');
  const list = document.getElementById('locResults');
  const label = btn.querySelector('b');
  const linkText = btn.querySelector('.set-location-text');
  const API = 'https://api.postalpincode.in/pincode/';
  const STORE = 'flipkartDemoDeliveryLocation';

  // Tiny offline sample so the demo still works without internet or if the API is down.
  const SAMPLE = {
    '110001': ['New Delhi', 'Delhi', ['Connaught Place', 'Baroda House', 'Parliament Street']],
    '400001': ['Mumbai', 'Maharashtra', ['Mumbai G.P.O.', 'Fort', 'Horniman Circle']],
    '560001': ['Bengaluru', 'Karnataka', ['Bangalore G.P.O.', 'Vidhana Soudha', 'Cubbon Park']],
    '600001': ['Chennai', 'Tamil Nadu', ['Parrys', 'Chennai G.P.O.', 'George Town']],
    '700001': ['Kolkata', 'West Bengal', ['Kolkata G.P.O.', 'Dalhousie Square', 'Lal Bazar']]
  };

  const setMsg = (text, type = '') => { msg.textContent = text; msg.className = 'loc-msg ' + type; };

  const saved = () => { try { return JSON.parse(localStorage.getItem(STORE)); } catch { return null; } };
  const applyHeader = (loc) => {
    if (loc) {
      label.textContent = `Deliver to ${loc.district} - ${loc.pin}`;
      linkText.textContent = 'Change';
    } else {
      label.textContent = 'Location not set';
      linkText.textContent = 'Select delivery location';
    }
  };

  const place = () => {
    const r = btn.getBoundingClientRect();
    if (window.innerWidth <= 600) {
      pop.style.left = '12px'; pop.style.right = '12px'; pop.style.width = 'auto';
    } else {
      pop.style.width = '';
      pop.style.left = 'auto';
      pop.style.right = Math.max(12, window.innerWidth - r.right) + 'px';
    }
    pop.style.top = (r.bottom + 10) + 'px';
  };
  const open = () => {
    pop.hidden = false; place();
    btn.setAttribute('aria-expanded', 'true');
    const cur = saved();
    if (cur && !input.value) input.value = cur.pin;
    input.focus();
  };
  const close = () => { pop.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.setAttribute('aria-haspopup', 'dialog');
  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', (e) => { e.stopPropagation(); pop.hidden ? open() : close(); });
  closeBtn.addEventListener('click', () => { close(); btn.focus(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !pop.hidden) { close(); btn.focus(); } });
  document.addEventListener('click', (e) => { if (!pop.hidden && !pop.contains(e.target) && !btn.contains(e.target)) close(); });
  window.addEventListener('resize', () => { if (!pop.hidden) place(); });

  const chooseOffice = (office, pin) => {
    const loc = { pin, district: office.district, state: office.state, office: office.name };
    try { localStorage.setItem(STORE, JSON.stringify(loc)); } catch { /* storage may be blocked */ }
    applyHeader(loc);
    setMsg(`Delivering to ${office.name}, ${office.district}, ${office.state} – ${pin}`, 'ok');
    if (typeof showToast === 'function') showToast(`Delivery location set to ${office.district} - ${pin}`);
    window.setTimeout(close, 700);
  };

  const render = (offices, pin) => {
    list.replaceChildren();
    offices.forEach((o) => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'loc-office';
      const name = document.createElement('strong'); name.textContent = o.name;
      const meta = document.createElement('span'); meta.textContent = `${o.branch} · ${o.district}, ${o.state}`;
      const badge = document.createElement('em');
      const delivers = /^delivery$/i.test(o.delivery);
      badge.textContent = delivers ? 'Delivery' : 'Non-delivery';
      badge.className = delivers ? 'yes' : 'no';
      b.append(name, badge, meta);
      b.addEventListener('click', () => chooseOffice(o, pin));
      li.appendChild(b); list.appendChild(li);
    });
  };

  const fromApi = (data) => {
    const first = Array.isArray(data) ? data[0] : null;
    if (!first || first.Status !== 'Success' || !Array.isArray(first.PostOffice) || !first.PostOffice.length) return [];
    return first.PostOffice.map((p) => ({
      name: p.Name, branch: p.BranchType || 'Post Office', delivery: p.DeliveryStatus || '',
      district: p.District, state: p.State
    }));
  };
  const fromSample = (pin) => {
    const s = SAMPLE[pin];
    return s ? s[2].map((n) => ({ name: n, branch: 'Sub Post Office', delivery: 'Delivery', district: s[0], state: s[1] })) : [];
  };

  let busy = false;
  const lookup = async () => {
    if (busy) return;
    const pin = input.value.trim();
    list.replaceChildren();
    if (!/^[1-9]\d{5}$/.test(pin)) { setMsg('Please enter a valid 6-digit Indian PIN code.', 'error'); input.focus(); return; }
    busy = true; checkBtn.disabled = true; setMsg('Checking PIN code…');
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), 8000);
    try {
      const res = await fetch(API + pin, { signal: ctrl.signal });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const offices = fromApi(await res.json());
      if (!offices.length) { setMsg(`No post offices found for PIN code ${pin}. Please check and try again.`, 'error'); return; }
      setMsg(`${offices.length} post office${offices.length === 1 ? '' : 's'} found for ${pin}. Choose one:`, 'ok');
      render(offices, pin);
    } catch (err) {
      const offline = fromSample(pin);
      if (offline.length) {
        setMsg('Live service unavailable — showing saved sample data. Choose one:', 'warn');
        render(offline, pin);
      } else {
        setMsg('Could not reach the PIN code service. Check your internet connection and try again.', 'error');
      }
    } finally {
      window.clearTimeout(timer); busy = false; checkBtn.disabled = false;
    }
  };
  checkBtn.addEventListener('click', lookup);
  input.addEventListener('input', () => { input.value = input.value.replace(/\D/g, '').slice(0, 6); });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); lookup(); } });

  applyHeader(saved());
})();


// Phase 35: Login dropdown menu (Sign Up / profile / orders / wishlist / help links).
function updateLoginMenu() {
  const greeting = document.getElementById('lmGreeting');
  const link = document.getElementById('lmSignUp');
  if (!greeting || !link) return;
  if (demoProfile) {
    greeting.textContent = `Hi, ${(demoProfile.name || 'there').split(' ')[0]}`;
    link.textContent = 'Logout'; link.dataset.action = 'logout';
  } else {
    greeting.textContent = 'New customer?';
    link.textContent = 'Sign Up'; link.dataset.action = 'signup';
  }
}
(() => {
  const btn = document.getElementById('loginBtn');
  const menu = document.getElementById('loginMenu');
  if (!btn || !menu) return;
  const wrap = btn.closest('.login-wrap');
  const items = () => [...menu.querySelectorAll('button')];
  const demo = (name) => showToast(`${name} is a demo feature in this project.`);
  const openLogin = () => { $('#loginDialog').showModal(); focusLoginField(); };
  const go = (url) => window.open(url, '_blank', 'noopener,noreferrer');

  const open = () => {
    const more = document.getElementById('moreDropdown');           // keep only one header menu open
    if (more) { more.hidden = true; document.getElementById('moreMenuBtn')?.setAttribute('aria-expanded', 'false'); }
    updateLoginMenu();
    menu.hidden = false; btn.setAttribute('aria-expanded', 'true');
    menu.classList.remove('align-left'); menu.style.left = ''; menu.style.right = '';   // flip to left-aligned if it would run off-screen
    if (menu.getBoundingClientRect().left < 8) menu.classList.add('align-left');
    const r = menu.getBoundingClientRect();
    if (r.right > window.innerWidth - 8) { menu.style.left = (menu.offsetLeft - (r.right - (window.innerWidth - 8))) + 'px'; menu.style.right = 'auto'; }
  };
  const close = (returnFocus = false) => {
    if (menu.hidden) return;
    menu.hidden = true; btn.setAttribute('aria-expanded', 'false');
    if (returnFocus) btn.focus();
  };
  btn.addEventListener('click', () => (menu.hidden ? open() : close()));
  document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) close(); });
  document.getElementById('moreMenuBtn')?.addEventListener('click', () => close());
  document.addEventListener('keydown', (e) => {
    if (menu.hidden) return;
    if (e.key === 'Escape') { close(true); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const list = items(); const i = list.indexOf(document.activeElement);
      const next = e.key === 'ArrowDown' ? (i + 1) % list.length : (i <= 0 ? list.length - 1 : i - 1);
      list[next].focus();
    }
  });

  const actions = {
    signup: openLogin,
    logout: () => {
      demoProfile = null; saveData('campuskart-profile', null); renderAccount(); showToast('Signed out of the demo account');
    },
    profile: () => (demoProfile ? openAccount() : openLogin()),
    plus: () => demo('Flipkart Plus Zone'),
    orders: () => openAccount(),
    wishlist: () => {
      if (!showWishlistOnly) $('#wishlistViewBtn')?.click();
      document.getElementById('productsSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    seller: () => go('https://seller.flipkart.com/'),
    rewards: () => demo('Rewards'),
    gift: () => go('https://www.flipkart.com/'),
    notify: () => $('#priceAlertsBtn')?.click(),
    care: () => go('https://www.flipkart.com/helpcentre'),
    advertise: () => go('https://www.flipkart.com/advertise'),
    app: () => demo('Download App')
  };
  menu.addEventListener('click', (e) => {
    const target = e.target.closest('button[data-action]');
    if (!target) return;
    close();
    actions[target.dataset.action]?.();
  });
  if (typeof renderAccount === 'function') renderAccount();   // restore name on the button after a page reload
  updateLoginMenu();
})();


// Phase 36: extra options in the "More" dropdown.
(() => {
  const btn = document.getElementById('moreMenuBtn');
  const dd = document.getElementById('moreDropdown');
  if (!btn || !dd) return;
  const go = (url) => window.open(url, '_blank', 'noopener,noreferrer');
  const actions = {
    seller: () => go('https://seller.flipkart.com/'),
    notify: () => document.getElementById('priceAlertsBtn')?.click(),   // opens your existing Price Alerts window
    care: () => go('https://www.flipkart.com/helpcentre'),
    advertise: () => go('https://www.flipkart.com/advertise')
  };
  dd.addEventListener('click', (e) => {
    const item = e.target.closest('button');
    if (!item || item.id === 'themeToggle') return;          // dark-mode toggle keeps the menu open
    dd.hidden = true; btn.setAttribute('aria-expanded', 'false');
    actions[item.dataset.more]?.();
  });
  btn.addEventListener('click', () => {                       // flip to left-aligned if it would run off-screen
    dd.classList.remove('align-left'); dd.style.left = ''; dd.style.right = '';
    if (dd.hidden) return;
    if (dd.getBoundingClientRect().left < 8) dd.classList.add('align-left');
    const r = dd.getBoundingClientRect();                      // keep an 8px margin from the right edge too
    if (r.right > window.innerWidth - 8) { dd.style.left = (dd.offsetLeft - (r.right - (window.innerWidth - 8))) + 'px'; dd.style.right = 'auto'; }
  });
})();


// Phase 37: the cart needs a login. Logged-out users get a full "Missing Cart items?" page.
let pendingAfterLogin = null;          // what to do right after a successful login (e.g. add the product)
let titleBeforeCartGate = document.title;

function promptLogin(message, next) {
  pendingAfterLogin = next || null;
  const dialog = document.getElementById('loginDialog');
  dialog.querySelector('#loginTitle').textContent = message || 'Login';
  dialog.showModal();
  focusLoginField();
}
function showCartGate() {
  const gate = document.getElementById('cartGate');
  document.querySelectorAll('dialog[open]').forEach((d) => d.close());
  if (gate.hidden) titleBeforeCartGate = document.title;
  document.querySelector('.store-main').hidden = true;
  document.getElementById('categories').hidden = true;
  gate.hidden = false;
  document.title = 'Shopping Cart | Flipkart';
  if (location.hash !== '#cart') location.hash = 'cart';      // lets the browser Back button return to shopping
  window.scrollTo({ top: 0 });
  document.getElementById('cartGateLogin').focus({ preventScroll: true });
}
function hideCartGate() {
  const gate = document.getElementById('cartGate');
  if (gate.hidden) return;
  gate.hidden = true;
  document.querySelector('.store-main').hidden = false;
  document.getElementById('categories').hidden = false;
  document.title = titleBeforeCartGate;
  if (location.hash === '#cart') location.hash = '';
  window.scrollTo({ top: 0 });
}
(() => {
  const gate = document.getElementById('cartGate');
  if (!gate) return;
  document.getElementById('cartGateLogin').addEventListener('click', () =>
    promptLogin('Login to view your cart', () => { hideCartGate(); openCart(); }));
  document.getElementById('cartGateContinue').addEventListener('click', hideCartGate);
  document.getElementById('loginDialog').addEventListener('close', () => {
    document.querySelector('#loginTitle').textContent = 'Login';
    pendingAfterLogin = null;
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !gate.hidden && !document.querySelector('dialog[open]')) hideCartGate();
  });
  document.getElementById('searchInput')?.addEventListener('input', () => hideCartGate());   // searching leaves the cart page
  window.addEventListener('hashchange', () => {                                              // Back / Forward buttons
    if (location.hash === '#cart') { if (gate.hidden) openCart(); }
    else hideCartGate();
  });
  if (location.hash === '#cart') openCart();
})();
