import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC-VBHoQW0b5y0lmxRkIAj-ciAbuwF3YW8",
  authDomain: "gef-app1.firebaseapp.com",
  projectId: "gef-app1",
  storageBucket: "gef-app1.appspot.com",
  messagingSenderId: "625530882269",
  appId: "1:625530882269:web:c47d79aa16508cb855b334"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configurar persistência como SESSION
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Persistência de autenticação configurada como sessão");
  })
  .catch((error) => {
    console.error("Erro ao configurar persistência:", error);
  });

// Exportações necessárias
export { app, auth }

// Verificação de estado de autenticação
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Não armazenar em localStorage para sessão temporária
    sessionStorage.setItem("loggedUser", user.email);
    window.location.href = "dashboard.html";
  }
});

// Funções de UI
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
      // Armazena informações adicionais no sessionStorage
      const users = JSON.parse(sessionStorage.getItem("users")) || {};
      users[email] = { nome: name, email, telefone: phone };
      sessionStorage.setItem("users", JSON.stringify(users));
      
      alert("Cadastro realizado com sucesso! Faça login para continuar.");
      mostrarLogin();
    })
    .catch((error) => {
      alert("Erro no cadastro: " + error.message);
      console.error("Registration error:", error);
    });
});
