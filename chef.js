import { db } from './firebase-config.js';
import { collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const ordersCollection = collection(db, "orders");

async function fetchOrders() {
    const ordersContainer = document.querySelector('.orders-container');
    ordersContainer.innerHTML = '';

    const snapshot = await getDocs(ordersCollection);
    snapshot.forEach((doc) => {
        const order = doc.data();
        const orderId = doc.id;

        const orderElement = document.createElement("div");
        orderElement.classList.add("order-card");
        orderElement.innerHTML = `
            <h2>Order ID: ${orderId}</h2>
            <p>Name: ${order.customerName}</p>
            <p>Email: ${order.email}</p>
            <button class="complete-order-btn" data-id="${orderId}">Mark as Completed</button>
        `;

        ordersContainer.appendChild(orderElement);
    });

    attachCompleteOrderEvents();
}

function attachCompleteOrderEvents() {
    const completeOrderButtons = document.querySelectorAll(".complete-order-btn");
    completeOrderButtons.forEach((button) => {
        button.addEventListener("click", async (e) => {
            const orderId = e.target.dataset.id;
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, { status: "Completed" });
            fetchOrders();
        });
    });
}

fetchOrders();