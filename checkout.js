import { db } from './firebase-config.js';
import { collection, addDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const ordersCollection = collection(db, "orders");
const inventoryCollection = collection(db, "inventory");

async function handleCheckoutForm(event) {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const cart = JSON.parse(localStorage.getItem("cart"));

    if (!name || !email || !cart || Object.keys(cart).length === 0) {
        alert("Please fill out all fields and ensure your cart is not empty.");
        return;
    }

    try {
        const orderData = {
            customerName: name,
            email: email,
            cart: cart,
            timestamp: new Date(),
        };
        await addDoc(ordersCollection, orderData);

        // Update inventory
        for (const item of cart) {
            const inventoryRef = doc(db, "inventory", item.id);
            await updateDoc(inventoryRef, {
                quantity: item.quantity - cart[item.name].quantity,
            });
        }

        alert("Order placed successfully!");
        localStorage.removeItem("cart");
        window.location.href = "order.html";
    } catch (error) {
        console.error("Error placing order:", error);
        alert("Failed to place order. Please try again.");
    }
}