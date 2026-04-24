import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const occupation = document.getElementById("occupation").value;

    // Validate occupation selection
    if (occupation === "none") {
      alert("Please select an occupation.");
      return;
    }

    try {
      // Create the user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user info to Firestore, including occupation
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        occupation: occupation, // Add occupation here
        createdAt: serverTimestamp()
      });

      alert("User signed up successfully!");

      // Redirect based on occupation
      if (occupation === "waiter") {
        window.location.href = "employee.html";
      } else if (occupation === "chef") {
        window.location.href = "chef.html";
      } else if (occupation === "management") {
        window.location.href = "management.html";
      }
    } catch (error) {
      alert("Error signing up: " + error.message);
      console.error("Signup error:", error);
    }
  });
});