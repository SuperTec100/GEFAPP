import { auth } from "./firebase-config.js";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  const currentPage = window.location.pathname.split('/').pop();
  
  if (user) {
    sessionStorage.setItem("loggedUser", user.email);
    
    if (currentPage !== 'dashboard.html') {
      window.location.href = "dashboard.html";
    }
  } else {
    sessionStorage.removeItem("loggedUser");
    
    if (currentPage !== 'index.html') {
      window.location.href = "index.html";
    }
  }
});

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

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .catch((error) => alert("Erro no login: " + error.message));
});

document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("newEmail").value;
  const password = document.getElementById("newPassword").value;
  const name = document.getElementById("newName").value;
  const phone = document.getElementById("newPhone").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      const users = JSON.parse(sessionStorage.getItem("users")) || {};
      users[email] = { nome: name, email, telefone: phone };
      sessionStorage.setItem("users", JSON.stringify(users));
      alert("Cadastro realizado! Faça login.");
      mostrarLogin();
    })
    .catch((error) => alert("Erro no cadastro: " + error.message));
});

import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

window.mostrarRecuperacaoSenha = function () {
  document.getElementById("loginForm").style.display = "none";
  document.querySelector("div[style*='text-align:center']").style.display = "none";
  document.getElementById("cadastroSection").classList.add("hidden");
  document.getElementById("recuperacaoSenhaSection").classList.remove("hidden");
};

document.getElementById("recuperarSenhaForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("resetEmail").value;

  sendPasswordResetEmail(auth, email)
    .then(() => alert("Email de recuperação enviado! Verifique sua caixa de entrada."))
    .catch((error) => alert("Erro ao enviar email: " + error.message));
});
