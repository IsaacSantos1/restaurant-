import { db } from "./firebase-config.js";

import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

    const clockIn = data.clockIn
      ? data.clockIn.toDate().toLocaleString()
      : "Loading...";

    const clockOut = data.clockOut
      ? data.clockOut.toDate().toLocaleString()
      : "Still clocked in";

    const totalHours =
      data.totalHours !== null && data.totalHours !== undefined
        ? `${data.totalHours} hours`
        : "In progress";

    const employeeItem = document.createElement("div");
    employeeItem.classList.add("employee-hour-item");

    employeeItem.innerHTML = `
      <p><span>Name:</span> ${data.name}</p>
      <p><span>Position:</span> ${data.position}</p>
      <p><span>Clock In:</span> ${clockIn}</p>
      <p><span>Clock Out:</span> ${clockOut}</p>
      <p><span>Total Hours:</span> ${totalHours}</p>
      <p><span>Status:</span> ${data.status}</p>
    `;

    employeeHoursList.appendChild(employeeItem);
  });
});

