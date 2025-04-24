// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-VBHoQW0b5y0lmxRkIAj-ciAbuwF3YW8",
  authDomain: "gef-app1.firebaseapp.com",
  projectId: "gef-app1",
  storageBucket: "gef-app1.firebasestorage.app",
  messagingSenderId: "625530882269",
  appId: "1:625530882269:web:c47d79aa16508cb855b334"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const users = JSON.parse(localStorage.getItem("users")) || {
  "admin": {
    password: "admin123",
    nome: "Administrador",
    email: "admin@gef.com",
    telefone: "(00) 00000-0000"
  }
};

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

// Login
document.getElementById("loginForm").onsubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    const user = auth.currentUser;
    // Você pode verificar se é admin por email
    if (user.email === "admin@gef.com") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "gef.html";
    }
  } catch (error) {
    alert("Erro ao fazer login: " + error.message);
  }
};

// Cadastro
document.getElementById("registerForm").onsubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById("newEmail").value;
  const password = document.getElementById("newPassword").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Cadastro realizado com sucesso!");
    location.reload();
  } catch (error) {
    alert("Erro ao cadastrar: " + error.message);
  }
};
