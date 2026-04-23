document.addEventListener("DOMContentLoaded", () => {
    const cart = {};
    const buttons = document.querySelectorAll(".add-btn");
    const checkoutBtn = document.getElementById("checkout-btn");

    // Render the cart
    function renderCart() {
        const cartItems = document.getElementById("cart-items");
        const cartCount = document.getElementById("cart-count");
        const cartSubtotal = document.getElementById("cart-subtotal");
        const cartTax = document.getElementById("cart-tax");
        const cartTotal = document.getElementById("cart-total");

        cartItems.innerHTML = "";
        let itemCount = 0;
        let subtotal = 0;

        Object.values(cart).forEach((item) => {
            const itemTotal = item.price * item.quantity;
            itemCount += item.quantity;
            subtotal += itemTotal;

            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <p>${item.name} x ${item.quantity} - $${itemTotal.toFixed(2)}</p>
            `;
            cartItems.appendChild(cartItem);
        });

        if (itemCount === 0) {
            cartItems.innerHTML = "<p class='empty-cart'>Your cart is empty.</p>";
            checkoutBtn.disabled = true;
        } else {
            checkoutBtn.disabled = false;
        }

        const tax = subtotal * 0.07; // 7% NJ tax
        const total = subtotal + tax;

        cartCount.textContent = itemCount;
        cartSubtotal.textContent = subtotal.toFixed(2);
        cartTax.textContent = tax.toFixed(2);
        cartTotal.textContent = total.toFixed(2);

        // Save cart to localStorage
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Add items to the cart
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const card = button.closest(".menu-card");
            if (!card) return;
            const name = card.dataset.name;
            const price = Number(card.dataset.price);
            if (!name || isNaN(price)) return;

            if (!cart[name]) {
                cart[name] = { name, price, quantity: 1 };
            } else {
                cart[name].quantity += 1;
            }

            renderCart();
        });
    });

    // Checkout button click: only navigate when cart has items
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", (e) => {
            const hasItems = Object.keys(cart).length > 0;
            if (!hasItems) {
                e.preventDefault();
                return;
            }
            // Save cart to localStorage before navigating
            localStorage.setItem("cart", JSON.stringify(cart));
            window.location.href = "checkout.html";
        });
    }

    renderCart();
});