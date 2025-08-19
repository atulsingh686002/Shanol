// Global cart array
let cart = [];

// Product Data (for slider)


// Load Products in Slider (from products.js)
function loadProductSlider() {
  const slider = document.getElementById("product-slider");
  slider.innerHTML = "";

  // 👉 Sirf un products ko select karo jinka isNewArrival = true
  const newArrivals = products.filter(p => p.isNewArrival);

  newArrivals.forEach(product => {
    slider.innerHTML += `
      <div class="swiper-slide">
        <div class="product-card bg-white rounded-xl p-4 shadow-md">
          <img src="${product.images[0]}" alt="${product.title}" class="w-full h-48 object-cover rounded-lg mb-3">
          <h3 class="text-lg font-semibold text-gray-800">${product.title}</h3>
          <p class="text-indigo-600 font-bold text-sm">₹${product.price}</p>
          <div class="flex gap-2 mt-3">
            <button onclick="addToCart(${product.id})"
              class="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
              Add to Cart
            </button>
            <button onclick="viewProduct(${product.id})"
              class="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition">
              View
            </button>
          </div>
        </div>
      </div>
    `;
  });

  // Init Swiper
  new Swiper(".myProductSlider", {
    loop: true,
    autoplay: { delay: 3000, disableOnInteraction: false },
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: { el: ".swiper-pagination", clickable: true },
    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
    breakpoints: { 640: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }
  });
}


// Add to Cart Function
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = cart.find(p => p.id === id);
    if (!exists) {
      cart.push({ ...product, quantity: 1 });
    } else {
      exists.quantity += 1;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(product.title + " added to cart!");
  } else {
    alert("Product not found!");
  }
}



document.addEventListener("DOMContentLoaded", loadProductSlider);


// Normalize Helper
const normalizeProduct = (p) => ({
  id: p.id,
  title: p.title || p.name || "Untitled",
  price: Number(p.price) || 0,
  images: (p.images && p.images.length ? p.images : [p.image || ""]),
  sku: p.sku || p.SKU || ("SKU-" + p.id)
});

// Normalized arrays
const SLIDER = (typeof sliderProducts !== "undefined" ? sliderProducts : []).map(normalizeProduct);
const CATALOG = (typeof products !== "undefined" ? products : []).map(normalizeProduct);

// Final product source (sab yahan se chalega)
const ALL_PRODUCTS = [...SLIDER, ...CATALOG];
