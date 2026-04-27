import { db } from "./firebase-config.js";
import { collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const employeeHoursList = document.getElementById("employeeHoursList");

const q = query(
    collection(db, "employeeHours"),
    orderBy("clockIn", "desc")
);

onSnapshot(q, (snapshot) => {
    employeeHoursList.innerHTML = "";

    if (snapshot.empty) {
        employeeHoursList.innerHTML = `<p class="empty-message">No employee hours yet.</p>`;
        return;
    }

    snapshot.forEach((doc) => {
        const data = doc.data();

        const clockIn = data.clockIn ? data.clockIn.toDate().toLocaleString() : "Loading...";
        const clockOut = data.clockOut ? data.clockOut.toDate().toLocaleString() : "Still clocked in";
        const totalHours = data.totalHours ? `${data.totalHours} hours` : "In progress";
        const earnings = data.earnings ? `$${data.earnings}` : "In progress";

        const employeeItem = document.createElement("div");
        employeeItem.classList.add("employee-hour-item");

        employeeItem.innerHTML = `
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Position:</strong> ${data.position}</p>
            <p><strong>Clock In:</strong> ${clockIn}</p>
            <p><strong>Clock Out:</strong> ${clockOut}</p>
            <p><strong>Total Hours:</strong> ${totalHours}</p>
            <p><strong>Earnings:</strong> ${earnings}</p>
        `;

        employeeHoursList.appendChild(employeeItem);
    });
});