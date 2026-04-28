import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const ordersCollection = collection(db, "orders");

// Function to handle form submission
async function handleCheckoutForm(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const cart = JSON.parse(localStorage.getItem("cart"));

    if (!name || !email || !cart || Object.keys(cart).length === 0) {
        alert("Please fill out all fields and ensure your cart is not empty.");
        return;
    }

    // Calculate total amount
    let totalAmount = 0;
    Object.values(cart).forEach((item) => {
        totalAmount += item.price * item.quantity;
    });

    try {
        // Save the order to Firestore
        const orderData = {
            customerName: name,
            email: email,
            cart: cart,
            totalAmount: totalAmount,
            timestamp: serverTimestamp() // Add the current timestamp
        };

        await addDoc(ordersCollection, orderData);

        console.log("Order saved:", orderData); // Debugging log
        alert("Order placed successfully!");
        localStorage.removeItem("cart");
        window.location.href = "order.html";
    } catch (error) {
        console.error("Error placing order:", error);
        alert("Failed to place order. Please try again.");
    }
}

document.querySelector(".checkout-form").addEventListener("submit", handleCheckoutForm);