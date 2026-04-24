import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const employeeName = document.getElementById("employeeName");
const employeePosition = document.getElementById("employeePosition");
const clockInBtn = document.getElementById("clockInBtn");
const clockOutBtn = document.getElementById("clockOutBtn");
const employeeStatus = document.getElementById("employeeStatus");

// Clock In Functionality
clockInBtn.addEventListener("click", async () => {
  const name = employeeName.value.trim();
  const position = employeePosition.value;

  if (!name || !position) {
    employeeStatus.textContent = "Enter your name and choose a position.";
    return;
  }

  try {
    // Add clock-in data to Firestore
    await addDoc(collection(db, "employeeHours"), {
      name: name,
      position: position,
      clockIn: serverTimestamp(),
      clockOut: null,
      totalHours: null,
      status: "Clocked In"
    });

    employeeStatus.textContent = `${name} clocked in as ${position}.`;
    employeeName.value = "";
    employeePosition.value = "";
  } catch (error) {
    employeeStatus.textContent = "Clock in failed. Check Firebase.";
    console.error("Error during clock in:", error);
  }
});

// Clock Out Functionality
clockOutBtn.addEventListener("click", async () => {
  const name = employeeName.value.trim();

  if (!name) {
    employeeStatus.textContent = "Enter your name to clock out.";
    return;
  }

  try {
    const q = query(
      collection(db, "employeeHours"),
      where("name", "==", name),
      where("clockOut", "==", null),
      orderBy("clockIn", "desc"),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      employeeStatus.textContent = "No active clock in found.";
      return;
    }

    const record = snapshot.docs[0];
    const data = record.data();

    const clockInTime = data.clockIn.toDate();
    const clockOutTime = new Date();

    const totalHours = (
      (clockOutTime.getTime() - clockInTime.getTime()) /
      1000 /
      60 /
      60
    ).toFixed(2);

    await updateDoc(doc(db, "employeeHours", record.id), {
      clockOut: Timestamp.fromDate(clockOutTime),
      totalHours: Number(totalHours),
      status: "Clocked Out"
    });

    employeeStatus.textContent = `${name} clocked out. Total hours: ${totalHours}`;
    employeeName.value = "";
  } catch (error) {
    employeeStatus.textContent = "Clock out failed. Check Firebase index.";
    console.error("Error during clock out:", error);
  }
});