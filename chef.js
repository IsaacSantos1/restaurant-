import { db } from './firebase-config.js';
import { collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
        querySnapshot.forEach((docSnapshot) => {
            const order = docSnapshot.data();
            const orderId = docSnapshot.id;
            const orderElement = document.createElement('div');
            orderElement.classList.add('order-card');

            // Handle missing or invalid cart data
            const cartItems = order.cart && typeof order.cart === 'object' ? Object.values(order.cart) : [];

            // Display order details
            orderElement.innerHTML = `
                <h2>Order ID: ${orderId}</h2>
                <p><strong>Name:</strong> ${order.name}</p>
                <p><strong>Email:</strong> ${order.email}</p>
                <p><strong>Phone:</strong> ${order.phone}</p>
                <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.state}, ${order.zip}</p>
                <p><strong>Order Time:</strong> ${new Date(order.timestamp.toDate()).toLocaleString()}</p>
                <h3>Items:</h3>
                <ul>
                    ${cartItems.length > 0
                        ? cartItems.map(item => `
                            <li>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>
                        `).join('')
                        : '<li>No items in the cart.</li>'
                    }
                </ul>
                <button class="complete-order-btn" data-id="${orderId}">Complete Order</button>
                <hr>
            `;

            ordersContainer.appendChild(orderElement);
        });

        // Add event listeners to "Complete Order" buttons
        const completeOrderButtons = document.querySelectorAll('.complete-order-btn');
        completeOrderButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const orderId = e.target.dataset.id;
                await completeOrder(orderId);
                e.target.closest('.order-card').remove(); // Remove the order from the DOM
            });
        });
    } catch (error) {
        console.error("Error fetching orders: ", error);
        ordersContainer.innerHTML = '<p>Error loading orders. Please try again later.</p>';
    }
}

// Function to mark an order as complete and remove it from Firestore
async function completeOrder(orderId) {
    try {
        await deleteDoc(doc(db, "orders", orderId));
        console.log(`Order ${orderId} marked as complete and removed.`);
    } catch (error) {
        console.error(`Error completing order ${orderId}:`, error);
        alert("Failed to complete the order. Please try again.");
    }
}

// Fetch orders on page load
fetchOrders();