// Importações corretas para Firebase v9 (compat mode)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth-compat.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC-VBHoQW0b5y0lmxRkIAj-ciAbuwF3YW8",
  authDomain: "gef-app1.firebaseapp.com",
  projectId: "gef-app1",
  storageBucket: "gef-app1.appspot.com",
  messagingSenderId: "625530882269",
  appId: "1:625530882269:web:c47d79aa16508cb855b334"
};

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Verificação de estado de autenticação
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "gef.html";
  }
});

// Funções de UI (precisa ser acessível globalmente)
window.mostrarCadastro = function() {
  document.getElementById("loginForm").style.display = "none";
  document.querySelector("div[style*='text-align:center']").style.display = "none";
  document.getElementById("cadastroSection").classList.remove("hidden");
};

window.mostrarLogin = function() {
  document.getElementById("loginForm").style.display = "block";
  document.querySelector("div[style*='text-align:center']").style.display = "block";
  document.getElementById("cadastroSection").classList.add("hidden");
  document.getElementById("registerForm").reset();
};

// Login
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      localStorage.setItem("loggedUser", userCredential.user.email);
      window.location.href = "gef.html";
    })
    .catch((error) => {
      alert("Erro no login: " + error.message);
    });
});

// Cadastro
document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("newEmail").value;
  const password = document.getElementById("newPassword").value;
  const name = document.getElementById("newName").value;
  const phone = document.getElementById("newPhone").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const users = JSON.parse(localStorage.getItem("users")) || {};
      users[userCredential.user.email] = {
        nome: name,
        email: userCredential.user.email,
        telefone: phone
      };
      localStorage.setItem("users", JSON.stringify(users));
      
      alert("Usuário cadastrado com sucesso!");
      document.getElementById("registerForm").reset();
      mostrarLogin();
    })
    .catch((error) => {
      alert("Erro no cadastro: " + error.message);
    });
});
