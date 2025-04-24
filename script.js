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

document.getElementById("loginForm").onsubmit = (e) => {
  e.preventDefault();
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (users[user] && users[user].password === pass) {
    localStorage.setItem("loggedUser", user);
    window.location.href = user === "admin" ? "admin.html" : "gef.html";
  } else {
    alert("Usuário ou senha inválidos.");
  }
};

document.getElementById("registerForm").onsubmit = (e) => {
  e.preventDefault();
  const name = document.getElementById("newName").value;
  const email = document.getElementById("newEmail").value;
  const phone = document.getElementById("newPhone").value;
  const user = document.getElementById("newUsername").value;
  const pass = document.getElementById("newPassword").value;

  if (users[user]) {
    alert("Usuário já existe.");
  } else {
    users[user] = {
      password: pass,
      nome: name,
      email: email,
      telefone: phone
    };
    localStorage.setItem("users", JSON.stringify(users));
    alert("Cadastro realizado com sucesso! Faça login para continuar.");
    location.reload(); // Volta para tela de login
  }
};
