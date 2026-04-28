import { db } from "./firebase-config.js";
import { collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const employeeHoursList = document.getElementById("employeeHoursList");

const q = query(
    collection(db, "employeeHours"),
    orderBy("clockIn", "desc")
);

onSnapshot(q, (snapshot) => {
    employeeHoursList.innerHTML = "";

    snapshot.forEach((doc) => {
        const data = doc.data();
        const totalHours = data.totalHours ? `${data.totalHours} hours` : "In progress";
        const clockedInStatus = data.clockOut ? "Clocked Out" : "Clocked In";

        const employeeItem = document.createElement("div");
        employeeItem.innerHTML = `
            <p>Name: ${data.name}</p>
            <p>Position: ${data.position}</p>
            <p>Total Hours: ${totalHours}</p>
            <p>Status: ${clockedInStatus}</p>
        `;
        employeeHoursList.appendChild(employeeItem);
    });
});