// Import Firebase configuration
import { db } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Reference to the Firestore collection
const ordersCollection = collection(db, "orders");

// Function to handle form submission
async function handleCheckoutForm(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zip').value;
    const cardName = document.getElementById('card-name').value;
    const cardNumber = document.getElementById('card-number').value;
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;

    // Validate form data (basic validation)
    if (!name || !email || !phone || !address || !city || !state || !zip || !cardName || !cardNumber || !expiry || !cvv) {
        alert("Please fill out all fields.");
        return;
    }

    try {
        // Save the data to Firestore
        const docRef = await addDoc(ordersCollection, {
            name,
            email,
            phone,
            address,
            city,
            state,
            zip,
            cardName,
            cardNumber,
            expiry,
            cvv,
            timestamp: new Date() // Add a timestamp
        });

        // Success message
        alert("Order placed successfully! Your order ID is: " + docRef.id);

        // Reset the form
        document.querySelector('.checkout-form').reset();
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("There was an error placing your order. Please try again.");
    }
}

// Attach the event listener to the form
document.querySelector('.checkout-form').addEventListener('submit', handleCheckoutForm);