import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      // Log in the user with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user details from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Check if occupation exists in the user data
        if (!userData.occupation) {
          alert("Occupation not found for this account. Please contact support.");
          return;
        }

        alert(`Welcome back, ${userData.username}!`);

        // Redirect based on occupation
        switch (userData.occupation) {
          case "waiter":
            window.location.href = "employee.html";
            break;
          case "chef":
            window.location.href = "chef.html";
            break;
          case "management":
            window.location.href = "inventory.html";
            break;
          default:
            alert("Unknown occupation. Please contact support.");
        }
      } else {
        alert("User data not found in Firestore. Please contact support.");
      }
    } catch (error) {
      // Handle login errors
      if (error.code === "auth/user-not-found") {
        alert("No user found with this email. Please sign up first.");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password. Please try again.");
      } else {
        alert("Error logging in: " + error.message);
      }
      console.error("Login error:", error);
    }
  });
});