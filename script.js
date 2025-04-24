import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

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

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user.email === "admin@gef.com") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "gef.html";
      }
    } catch (error) {
      alert("Erro ao fazer login: " + error.message);
    }
  };
}

const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById("newEmail").value;
    const password = document.getElementById("newPassword").value;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Cadastro realizado com sucesso! Faça login para continuar.");
      location.reload();
    } catch (error) {
      alert("Erro ao cadastrar: " + error.message);
    }
  };
}

export function logoutUser() {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  }).catch((error) => {
    alert("Erro ao sair: " + error.message);
  });
}

onAuthStateChanged(auth, (user) => {
  const isAdminPage = window.location.pathname.includes("admin.html");
  if (!user) {
    if (window.location.pathname !== "/index.html") {
      window.location.href = "index.html";
    }
  } else if (isAdminPage && user.email !== "admin@gef.com") {
    alert("Acesso restrito ao administrador.");
    window.location.href = "index.html";
  }
});
