import { db } from "./firebase-config.js";
import { collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const inventoryCollection = collection(db, "inventory");
const availableItemsEl = document.getElementById("available-items");

async function fetchInventory() {
    const snapshot = await getDocs(inventoryCollection);
    availableItemsEl.innerHTML = "";

    snapshot.forEach((doc) => {
        const data = doc.data();
        const itemId = doc.id;

        const itemCard = document.createElement("div");
        itemCard.classList.add("item-card");
        itemCard.innerHTML = `
            <h3>${data.name}</h3>
            <p>Quantity: ${data.quantity}</p>
            <button class="delete-btn" data-id="${itemId}">Delete</button>
        `;

        availableItemsEl.appendChild(itemCard);
    });

    attachDeleteEvents();
}

function attachDeleteEvents() {
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", async (e) => {
            const itemId = e.target.dataset.id;
            await deleteDoc(doc(db, "inventory", itemId));
            fetchInventory();
        });
    });
}

fetchInventory();