// Import Firebase configuration
import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Reference to the Firestore collection
const ordersCollection = collection(db, "orders");

// Function to fetch and display orders
async function fetchOrders() {
    const ordersContainer = document.querySelector('.orders-container');
    ordersContainer.innerHTML = ''; // Clear previous content

    try {
        // Fetch orders from Firestore
        const querySnapshot = await getDocs(ordersCollection);

        if (querySnapshot.empty) {
            ordersContainer.innerHTML = '<p>No orders available.</p>';
            return;
        }

        // Loop through each order and display it
        querySnapshot.forEach((doc) => {
            const order = doc.data();
            const orderElement = document.createElement('div');
            orderElement.classList.add('order-card');

            orderElement.innerHTML = `
                <h2>Order ID: ${doc.id}</h2>
                <p><strong>Name:</strong> ${order.name}</p>
                <p><strong>Email:</strong> ${order.email}</p>
                <p><strong>Phone:</strong> ${order.phone}</p>
                <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.state}, ${order.zip}</p>
                <p><strong>Order Time:</strong> ${new Date(order.timestamp.toDate()).toLocaleString()}</p>
            `;

            ordersContainer.appendChild(orderElement);
        });
    } catch (error) {
        console.error("Error fetching orders: ", error);
        ordersContainer.innerHTML = '<p>Error loading orders. Please try again later.</p>';
    }
}

// Fetch orders on page load
fetchOrders();