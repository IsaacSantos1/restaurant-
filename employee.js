import { collection, addDoc, query, where, orderBy, limit, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { db } from "./firebase-config.js";

const employeeName = document.getElementById("employeeName");
const employeePosition = document.getElementById("employeePosition");
const clockInBtn = document.getElementById("clockInBtn");
const clockOutBtn = document.getElementById("clockOutBtn");
const employeeStatus = document.getElementById("employeeStatus");
const reminder = document.getElementById("reminder");

// Clock In Functionality
clockInBtn.addEventListener("click", async () => {
    const name = employeeName.value.trim();
    const position = employeePosition.value;

    if (!name || !position) {
        employeeStatus.textContent = "Please enter your name and position.";
        return;
    }

    try {
        await addDoc(collection(db, "employeeHours"), {
            name,
            position,
            clockIn: new Date(),
            clockOut: null,
            status: "Clocked In",
        });
        employeeStatus.textContent = `${name} clocked in as ${position}.`;
        reminder.style.display = "block";
    } catch (error) {
        console.error("Error during clock in:", error);
        employeeStatus.textContent = "Clock in failed. Check Firebase.";
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
        const recordRef = doc(db, "employeeHours", record.id);

        const clockInTime = record.data().clockIn.toDate();
        const clockOutTime = new Date();
        const totalHours = ((clockOutTime - clockInTime) / (1000 * 60 * 60)).toFixed(2);
        const earnings = (totalHours * 15).toFixed(2);

        await updateDoc(recordRef, {
            clockOut: clockOutTime,
            totalHours,
            earnings,
            status: "Clocked Out",
        });

        employeeStatus.textContent = `${name} successfully clocked out.`;
        reminder.style.display = "none";
        employeeName.value = "";
    } catch (error) {
        employeeStatus.textContent = "Clock out failed. Check Firebase.";
        console.error("Error during clock out:", error);
    }
});