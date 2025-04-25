// Importações corretas para Firebase v9 (modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Configuração do Firebase (mantenha a mesma)
const firebaseConfig = {
  apiKey: "AIzaSyC-VBHoQW0b5y0lmxRkIAj-ciAbuwF3YW8",
  authDomain: "gef-app1.firebaseapp.com",
  projectId: "gef-app1",
  storageBucket: "gef-app1.appspot.com",
  messagingSenderId: "625530882269",
  appId: "1:625530882269:web:c47d79aa16508cb855b334"
};

// Inicialização
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Verificação de estado de autenticação
onAuthStateChanged(auth, (user) => {
  if (user) {
    localStorage.setItem("loggedUser", user.email);
    window.location.href = "gef.html";
  }
});

// Funções de UI (mantenha as mesmas)
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
    .then(() => {
      // O redirecionamento será tratado pelo onAuthStateChanged
    })
    .catch((error) => {
      alert("Erro no login: " + error.message);
      console.error("Login error:", error);
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
      // Armazena informações adicionais no localStorage
      const users = JSON.parse(localStorage.getItem("users")) || {};
      users[email] = { nome: name, email, telefone: phone };
      localStorage.setItem("users", JSON.stringify(users));
      
      alert("Cadastro realizado com sucesso! Faça login para continuar.");
      mostrarLogin();
    })
    .catch((error) => {
      alert("Erro no cadastro: " + error.message);
      console.error("Registration error:", error);
    });
});
