function updateCart() {
    const list = document.getElementById("cartItems");
    const totalBox = document.getElementById("cartTotal");

    if (!list) return;

    list.innerHTML = cart.length
        ? cart.map(item => `
            <li>
                ${item.name} × ${item.quantity}
                <button class="remove-from-cart-btn"
                        data-id="${item.id}">
                    Remove
                </button>
            </li>
        `).join("")
        : "<li>Cart is empty</li>";

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    if (totalBox) {
        totalBox.textContent = `Total: Nrs ${total}`;
    }
}
