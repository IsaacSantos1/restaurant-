import { db } from "./firebase-config.js";
import { collection, query, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const totalProfitElement = document.getElementById("totalProfit");
const purchaseHistoryElement = document.getElementById("purchaseHistory");

// Reference to the Firestore collection
const ordersCollection = collection(db, "orders");

// Function to calculate and display total profit
function calculateTotalProfit(orders) {
    let totalProfit = 0;

    orders.forEach((order) => {
        if (order.totalAmount) {
            totalProfit += order.totalAmount; // Ensure totalAmount is being summed
        }
    });

    totalProfitElement.textContent = `$${totalProfit.toFixed(2)}`;
}

// Function to display purchase history
function displayPurchaseHistory(orders) {
    purchaseHistoryElement.innerHTML = "";

    if (orders.length === 0) {
        purchaseHistoryElement.innerHTML = `<tr><td colspan="4">No purchases yet.</td></tr>`;
        return;
    }

    orders.forEach((order) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customerName || "Unknown"}</td>
            <td>$${order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}</td>
            <td>${order.timestamp ? new Date(order.timestamp.toDate()).toLocaleString() : "N/A"}</td>
        `;
        purchaseHistoryElement.appendChild(row);
    });
}

// Real-time listener for Firestore orders
const q = query(ordersCollection);
onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    }));

    console.log("Orders fetched:", orders); // Debugging log
    calculateTotalProfit(orders);
    displayPurchaseHistory(orders);
});