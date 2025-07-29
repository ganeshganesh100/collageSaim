
// Global variables
let cart = [];
let products = [];

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadProducts();
    loadCart();
    setupEventListeners();
    updateCartDisplay();
    updateUserDisplay();
    
    // Initialize auth tabs if on login page
    if (document.querySelector('.auth-section')) {
        initializeAuthTabs();
    }
}

function updateUserDisplay() {
    const currentUser = getCurrentUser();
    const userDisplayElement = document.getElementById('userDisplay');
    
    if (currentUser && userDisplayElement) {
        userDisplayElement.innerHTML = `
            <div class="user-info">
                <span>Welcome, ${currentUser.name}</span>
                <span class="user-id">ID: ${currentUser.userId}</span>
                <button onclick="logout()" class="logout-btn">Logout</button>
            </div>
        `;
    }
}

// Product data
function loadProducts() {
    products = [
        {
            id: 1,
            name: "Classic Burger",
            price: 450,
            originalPrice: 500,
            image: "/assets/burger.jpg",
            discount: 10
        },
        {
            id: 2,
            name: "Margherita Pizza",
            price: 850,
            originalPrice: 950,
            image: "/assets/pizza.jpg",
            discount: 10
        },
        {
            id: 3,
            name: "Grilled Chicken",
            price: 650,
            originalPrice: 750,
            image: "/assets/chicken.jpg",
            discount: 13
        },
        {
            id: 4,
            name: "Fresh Garden Salad",
            price: 320,
            originalPrice: 380,
            image: "/assets/salad.jpg",
            discount: 16
        },
        {
            id: 5,
            name: "Creamy Pasta",
            price: 550,
            originalPrice: 600,
            image: "/assets/pasta.jpg",
            discount: 8
        },
        {
            id: 6,
            name: "Club Sandwich",
            price: 380,
            originalPrice: 420,
            image: "/assets/sandwich.jpg",
            discount: 10
        },
        {
            id: 7,
            name: "Fried Rice",
            price: 420,
            originalPrice: 480,
            image: "/assets/fried_rice.jpg",
            discount: 12
        },
        {
            id: 8,
            name: "Vanilla Ice Cream",
            price: 180,
            originalPrice: 220,
            image: "/assets/ice_cream.jpg",
            discount: 18
        },
        {
            id: 9,
            name: "Fried Momo",
            price: 280,
            originalPrice: 320,
            image: "/assets/fried_momo.jpeg",
            discount: 12
        }
    ];
    
    displayProducts();
}

function displayProducts() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    
    productDiv.innerHTML = `
        ${product.discount ? `<div class="offer-badge">${product.discount}% OFF</div>` : ''}
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <h4>${product.name}</h4>
        <p>
            ${product.originalPrice ? `<span class="original-price">Nrs ${product.originalPrice}</span>` : ''}
            <span class="discounted-price">Nrs ${product.price}</span>
        </p>
        <button class="btn add-to-cart-btn" data-product-id="${product.id}">
            Add to Cart
        </button>
    `;
    
    return productDiv;
}

function setupEventListeners() {
    // Hamburger menu
    const hamburger = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('.main-nav');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }
    
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(e.target.getAttribute('data-product-id'));
            addToCart(productId);
        }
        
        // Remove from cart buttons
        if (e.target.classList.contains('remove-from-cart-btn')) {
            const productId = parseInt(e.target.getAttribute('data-product-id'));
            removeFromCart(productId);
        }
        
        // Quantity buttons
        if (e.target.classList.contains('quantity-btn')) {
            const productId = parseInt(e.target.getAttribute('data-product-id'));
            const action = e.target.getAttribute('data-action');
            updateQuantity(productId, action);
        }
    });
    
    // Cart actions
    const checkoutBtn = document.getElementById('checkoutBtn');
    const clearCartBtn = document.getElementById('clearCartBtn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
    
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    // Form submissions
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}

// Cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    showNotification('Item removed from cart');
}

function updateQuantity(productId, action) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    if (action === 'increase') {
        item.quantity += 1;
    } else if (action === 'decrease') {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
    }
    
    saveCart();
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const totalItems = document.getElementById('totalItems');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartDiscount = document.getElementById('cartDiscount');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<li style="text-align: center; padding: 2rem;">Your cart is empty</li>';
    } else {
        cart.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="item-info">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <span class="item-name">${item.name}</span>
                </div>
                <div class="item-actions">
                    <button class="quantity-btn" data-product-id="${item.id}" data-action="decrease">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="quantity-btn" data-product-id="${item.id}" data-action="increase">+</button>
                    <div class="item-price">
                        ${item.originalPrice ? `<span class="original-item-price">Nrs ${item.originalPrice * item.quantity}</span>` : ''}
                        <span class="discounted-item-price">Nrs ${item.price * item.quantity}</span>
                    </div>
                    <button class="remove-from-cart-btn" data-product-id="${item.id}">Remove</button>
                </div>
            `;
            cartItems.appendChild(li);
        });
    }
    
    // Update totals
    const totals = calculateTotals();
    
    if (totalItems) totalItems.textContent = totals.totalItems;
    if (cartSubtotal) cartSubtotal.textContent = totals.subtotal.toFixed(2);
    if (cartDiscount) cartDiscount.textContent = totals.discount.toFixed(2);
    if (cartTotal) cartTotal.textContent = totals.total.toFixed(2);
}

function calculateTotals() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.originalPrice || item.price) * item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = subtotal - total;
    
    return { totalItems, subtotal, total, discount };
}

function saveCart() {
    localStorage.setItem('foodyweb_cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('foodyweb_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartDisplay();
    showNotification('Cart cleared!');
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    const totals = calculateTotals();
    showNotification(`Order placed! Total: Nrs ${totals.total.toFixed(2)}`);
    clearCart();
}

// Admin functions
function showAllUsers() {
    const users = JSON.parse(localStorage.getItem('foodyweb_users') || '[]');
    const usersList = document.getElementById('usersList');
    
    if (!usersList) return;
    
    if (users.length === 0) {
        usersList.innerHTML = '<p>No users found.</p>';
        return;
    }
    
    let usersHTML = '<h4>Registered Users:</h4>';
    users.forEach(user => {
        usersHTML += `
            <div class="user-card">
                <strong>Name:</strong> ${user.name}<br>
                <strong>Email:</strong> ${user.email}<br>
                <strong>Phone:</strong> ${user.phone}<br>
                <strong>User ID:</strong> ${user.userId}<br>
                <strong>Registered:</strong> ${new Date(user.registeredAt).toLocaleString()}<br>
                <strong>Last Login:</strong> ${user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}<br>
                <button onclick="deleteUser('${user.email}')" class="delete-user-btn">Delete User</button>
                <hr>
            </div>
        `;
    });
    
    usersList.innerHTML = usersHTML;
}

function deleteUser(email) {
    if (confirm('Are you sure you want to delete this user?')) {
        let users = JSON.parse(localStorage.getItem('foodyweb_users') || '[]');
        users = users.filter(user => user.email !== email);
        localStorage.setItem('foodyweb_users', JSON.stringify(users));
        showNotification('User deleted successfully!');
        showAllUsers(); // Refresh the list
    }
}

function clearAllUsers() {
    if (confirm('Are you sure you want to delete ALL users? This action cannot be undone.')) {
        localStorage.removeItem('foodyweb_users');
        localStorage.removeItem('foodyweb_current_user');
        showNotification('All users cleared!');
        document.getElementById('usersList').innerHTML = '<p>No users found.</p>';
    }
}

// Notification system
function showNotification(message) {
    const notification = document.getElementById('cartNotification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Authentication tabs


function findUser(email) {
    const users = JSON.parse(localStorage.getItem('foodyweb_users') || '[]');
    return users.find(user => user.email === email);
}

function setCurrentUser(user) {
    localStorage.setItem('foodyweb_current_user', JSON.stringify(user));
}

function getCurrentUser() {
    const user = localStorage.getItem('foodyweb_current_user');
    return user ? JSON.parse(user) : null;
}

function logout() {
    localStorage.removeItem('foodyweb_current_user');
    showNotification('Logged out successfully!');
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1000);
}

// Form handlers
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    showNotification('Message sent successfully!');
    e.target.reset();
}




