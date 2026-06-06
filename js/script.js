// ===== Global Data =====
let cart = [];
let products = [];

// ===== App Start =====
document.addEventListener("DOMContentLoaded", init);

function init() {
    loadProducts();
    loadCart();
    setupEvents();
    updateCart();
    showUser();
}

// ===== User =====
const getCurrentUser = () =>
    JSON.parse(localStorage.getItem("foodyweb_current_user"));

function showUser() {
    const user = getCurrentUser();
    const display = document.getElementById("userDisplay");

    if (!user || !display) return;

    display.innerHTML = `
        <div class="user-info">
            <span>Welcome, ${user.name}</span>
            <button onclick="logout()">Logout</button>
        </div>`;
}

function logout() {
    localStorage.removeItem("foodyweb_current_user");
    notify("Logged out!");
    setTimeout(() => location.href = "../index.html", 1000);
}

// ===== Products =====
function loadProducts() {
    products = [
        { id: 1, name: "Classic Burger", price: 450, image: "/assets/burger.jpg" },
        { id: 2, name: "Pizza", price: 850, image: "/assets/pizza.jpg" },
        { id: 3, name: "Chicken", price: 650, image: "/assets/chicken.jpg" }
    ];

    displayProducts();
}

function displayProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    grid.innerHTML = products.map(product => `
        <div class="product">
            <img src="${product.image}" alt="${product.name}">
            <h4>${product.name}</h4>
            <p>Nrs ${product.price}</p>
            <button class="add-to-cart-btn" data-id="${product.id}">
                Add to Cart
            </button>
        </div>
    `).join("");
}

// ===== Events =====
function setupEvents() {
    document.addEventListener("click", e => {

        // Add item
        if (e.target.matches(".add-to-cart-btn"))
            addToCart(+e.target.dataset.id);

        // Remove item
        if (e.target.matches(".remove-from-cart-btn"))
            removeFromCart(+e.target.dataset.id);
    });
}

// ===== Cart =====
function addToCart(id) {
    const product = products.find(p => p.id === id);

    const item = cart.find(i => i.id === id);

    item ? item.quantity++ :
        cart.push({ ...product, quantity: 1 });

    saveCart();
    updateCart();
    notify(`${product.name} added`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCart();
}

function updateCart() {
    const list = document.getElementById("cartItems");
    if (!list) return;

    list.innerHTML = cart.length
        ? cart.map(item => `
            <li>
                ${item.name} × ${item.quantity}
                <button class="remove-from-cart-btn" data-id="${item.id}">
                    Remove
                </button>
            </li>
        `).join("")
        : "<li>Cart is empty</li>";
}

function saveCart() {
    localStorage.setItem("foodyweb_cart", JSON.stringify(cart));
}

function loadCart() {
    cart = JSON.parse(localStorage.getItem("foodyweb_cart")) || [];
}

// ===== Notification =====
function notify(msg) {
    const box = document.getElementById("cartNotification");
    if (!box) return;

    box.textContent = msg;
    box.classList.add("show");

    setTimeout(() => box.classList.remove("show"), 3000);
}
