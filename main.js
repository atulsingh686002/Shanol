// ===== Products & Cart =====
const productList = document.getElementById("product-list");
const cartDiv = document.getElementById("cart");
const cartCount = document.getElementById("cart-count");

// ===== Render Products (Grid + Hover 2nd image) =====
function renderProducts(products, containerId = "product-list") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = products.map(p => `
    <div class="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden relative group" data-aos="fade-up">
      <div class="relative w-full h-48 overflow-hidden">
        <!-- First Image -->
        <img src="${p.images && p.images[0] ? p.images[0] : 'https://via.placeholder.com/300'}" 
             alt="${p.title}" 
             class="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0">

        <!-- Second Image -->
        <img src="${p.images && p.images[1] ? p.images[1] : (p.images && p.images[0] ? p.images[0] : 'https://via.placeholder.com/300')}" 
             alt="${p.title}" 
             class="w-full h-full object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
      </div>

      <div class="p-4">
        <h3 class="font-semibold text-gray-800">${p.title}</h3>
        <p class="text-green-600 font-bold mt-1">₹${p.price}</p>
      <div class="mt-3 flex gap-2 relative z-10">
  <a href="product.html?id=${p.id}" 
     class="flex-1 border rounded py-1 text-center text-sm font-medium hover:bg-gray-100 cursor-pointer">View</a>
  <button onclick="addToCart(${p.id})" 
     class="flex-1 bg-indigo-600 text-white rounded py-1 text-sm font-medium hover:bg-indigo-700 cursor-pointer">Add</button>
</div>

      </div>
    </div>
  `).join('');
}

// ===== Render New Arrivals (Slider + Hover 2nd image) =====
function renderNewArrivals(products) {
  const container = document.getElementById("product-slider");
  if (!container) return;

  container.innerHTML = products.map(p => `
    <div class="swiper-slide !w-60">   <!-- 👈 fixed width card -->
      <div class="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden relative group">
        <div class="relative w-full h-40 overflow-hidden">
          <!-- First Image -->
          <img src="${p.images && p.images[0] ? p.images[0] : 'https://via.placeholder.com/300'}" 
               alt="${p.title}" 
               class="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0">

          <!-- Second Image -->
          <img src="${p.images && p.images[1] ? p.images[1] : (p.images && p.images[0] ? p.images[0] : 'https://via.placeholder.com/300')}" 
               alt="${p.title}" 
               class="w-full h-full object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        </div>

        <div class="p-3">
          <h3 class="font-semibold text-gray-800 text-sm">${p.title}</h3>
          <p class="text-green-600 font-bold mt-1 text-sm">₹${p.price}</p>
         <div class="mt-2 flex gap-2 relative z-10">
  <a href="product.html?id=${p.id}" 
     class="flex-1 border rounded py-1 text-center text-xs font-medium hover:bg-gray-100 cursor-pointer">View</a>
  <button onclick="addToCart(${p.id})" 
     class="flex-1 bg-indigo-600 text-white rounded py-1 text-xs font-medium hover:bg-indigo-700 cursor-pointer">Add</button>
</div>
        </div>
      </div>
    </div>
  `).join('');
}


// ===== Cart Functions =====
function addToCart(id){
  const allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];
  const product = allProducts.find(p => String(p.id) === String(id));

  if(!product){
      console.error("Product not found:", id);
      showToast("Product not found");
      return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const exists = cart.find(p => String(p.id) === String(id));

  if(!exists){
      cart.push({
          id: product.id,
          title: product.title,
          price: Number(product.price) || 0,
          images: product.images && product.images.length ? product.images : [""],
          quantity: 1,
          sku: product.sku || product.SKU || ("SKU-"+product.id) 
      });
  } else {
      exists.quantity += 1;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
  showToast(`${product.title} added to cart!`);
}

function updateCartCount(){
  const cart = JSON.parse(localStorage.getItem("cart"))||[];
  const count = cart.reduce((sum,i)=>sum+i.quantity,0);
  if(cartCount) cartCount.textContent = count;

  // mobile cart count
  const cartCountMobile = document.getElementById("cart-count-mobile");
  if(cartCountMobile) cartCountMobile.textContent = count;
}

function renderCart(){
  if(!cartDiv) return;
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if(cart.length === 0){
      cartDiv.innerHTML = `
          <h2 class="text-2xl font-bold mb-4">Your Cart</h2>
          <p>Cart is empty.</p>
      `;
      return;
  }

  let total = 0;
  let html = `
      <h2 class="text-2xl font-bold mb-4">Your Cart</h2>
      <ul>
  `;
  
  cart.forEach(item=>{
      const price = Number(item.price) || 0;
      const subTotal = price * item.quantity;
      total += subTotal;

      html += `
      <li class="mb-2 border-b py-2 flex justify-between items-center">
          <div class="flex items-center gap-4">
              <img src="${(item.images && item.images[0]) ? item.images[0] : 'https://via.placeholder.com/60'}" 
                   class="w-16 h-16 object-cover rounded" alt="${item.title}">
              <div>
                  <p class="font-semibold">${item.title || "No Title"}</p>
                  <p class="text-sm text-gray-500">SKU: ${item.sku || "N/A"}</p>
                  <p>₹${price} × ${item.quantity} = <b>₹${subTotal}</b></p>
              </div>
          </div>
          <div class="flex gap-2">
              <button onclick="decreaseQty(${item.id})" class="bg-yellow-500 text-white px-2 rounded">-</button>
              <button onclick="increaseQty(${item.id})" class="bg-green-500 text-white px-2 rounded">+</button>
              <button onclick="removeFromCart(${item.id})" class="bg-red-500 text-white px-2 rounded">Remove</button>
          </div>
      </li>
      `;
  });

  html += `
      </ul>
      <div class="mt-4 flex justify-between items-center bg-gray-100 p-3 rounded">
          <h3 class="text-xl font-bold">Total: ₹${total}</h3>
          <button onclick="checkout()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">Checkout</button>
      </div>
  `;
  
  cartDiv.innerHTML = html;
}

function removeFromCart(id){
  let cart = JSON.parse(localStorage.getItem("cart"))||[];
  cart = cart.filter(item=>item.id!==id);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// ===== View Product =====
function viewProduct(id){
  const allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];
  let product = allProducts.find(p => String(p.id) === String(id));

  if (!product && typeof products !== "undefined") {
      product = products.find(p => String(p.id) === String(id));
  }

  if (product) {
      localStorage.setItem("selectedProduct", JSON.stringify(product));
      window.location.href = "product.html?id=" + id;
  } else {
      console.error("Product not found for id:", id);
  }
}

// ===== Toast =====
function showToast(msg){
  const t = document.createElement("div");
  t.textContent = msg;
  t.className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50";
  document.body.appendChild(t);
  setTimeout(()=> t.remove(),2000);
}

// ===== Search =====
const searchInput = document.getElementById("search");
if(searchInput){
  searchInput.addEventListener("input", e=>{
      const q = e.target.value.toLowerCase();
      renderProducts(products.filter(p=>p.title.toLowerCase().includes(q)));
  });
}

// ===== Store All Products =====
if(typeof products !== "undefined"){
  localStorage.setItem('allProducts', JSON.stringify(products));
}

// ===== Initial Render =====
if(typeof products !== "undefined"){
  renderProducts(products);         // grid
  renderNewArrivals(products.slice(0,6)); // new arrivals slider
}
updateCartCount();
renderCart();

// ===== Quantity Controls =====
function increaseQty(id){
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find(p => p.id === id);
  if(item) item.quantity += 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function decreaseQty(id){
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find(p => p.id === id);
  if(item){
      if(item.quantity > 1){
          item.quantity -= 1;
      } else {
          cart = cart.filter(p => p.id !== id);
      }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// ===== Buy Now =====
function checkout(){
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if(cart.length === 0){
      alert("Your cart is empty!");
      return;
  }
  window.location.href = "checkout.html";
}
