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

// Firebase SDK (não use "import" se estiver direto no HTML)
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SUA_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// LOGIN
document.getElementById("loginForm").onsubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Verifica se é admin por email
    if (user.email === "admin@gef.com") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "gef.html";
    }
  } catch (error) {
    alert("Erro ao fazer login: " + error.message);
  }
};

// CADASTRO
document.getElementById("registerForm").onsubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById("newEmail").value;
  const password = document.getElementById("newPassword").value;

  try {
    await auth.createUserWithEmailAndPassword(email, password);
    alert("Cadastro realizado com sucesso! Faça login para continuar.");
    location.reload();
  } catch (error) {
    alert("Erro ao cadastrar: " + error.message);
  }
};

// LOGOUT opcional (em páginas protegidas, botão sair)
function logout() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}
