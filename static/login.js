// Handles admin login/logout and UI switching using Firebase v10+ modular Auth API
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDQJs0p85rVHMOW3tX-WjOgV_13b5FBfJ8",
  authDomain: "qrsave-4398b.firebaseapp.com",
  projectId: "qrsave-4398b",
  storageBucket: "qrsave-4398b.firebasestorage.app",
  messagingSenderId: "1002851839065",
  appId: "1:1002851839065:web:e83b16b26ba4a41a7f9548",
};

const app = initializeApp(firebaseConfig);

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const logoutBtn = document.getElementById("logout-btn");
  const mainUI = document.getElementById("main-ui");
  const auth = getAuth(app);

  onAuthStateChanged(auth, function (user) {
    if (user) {
      loginForm.style.display = "none";
      logoutBtn.style.display = "block";
      mainUI.style.display = "block";
    } else {
      loginForm.style.display = "flex";
      logoutBtn.style.display = "none";
      mainUI.style.display = "none";
    }
  });

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    signInWithEmailAndPassword(auth, email, password).catch(function (error) {
      alert("Login failed: " + error.message);
    });
  });

  logoutBtn.addEventListener("click", function () {
    signOut(auth);
  });
});
