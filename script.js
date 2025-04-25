import { auth, db } from "https://gefapp.com.br/firebase-config.js";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { 
  doc, 
  setDoc 
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Verificar protocolo seguro
if (window.location.protocol !== 'https:' && !window.location.hostname.includes('localhost')) {
  window.location.href = 'https://' + window.location.hostname + window.location.pathname;
}

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

// Gerenciamento de autenticação
onAuthStateChanged(auth, (user) => {
  const currentPage = window.location.pathname.split('/').pop();
  
  if (user) {
    if (currentPage === 'index.html') {
      window.location.href = "https://gefapp.com.br/dashboard.html";
    }
  } else {
    if (currentPage !== 'index.html') {
      window.location.href = "https://gefapp.com.br/index.html";
    }
  }
});

// Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const button = e.target.querySelector("button");
  
  // Feedback visual
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
  button.disabled = true;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // Redirecionamento automático pelo onAuthStateChanged
  } catch (error) {
    button.innerHTML = 'Entrar';
    button.disabled = false;
    
    let errorMessage = "Erro no login: ";
    switch(error.code) {
      case 'auth/invalid-email':
        errorMessage = "Email inválido.";
        break;
      case 'auth/user-disabled':
        errorMessage = "Conta desativada.";
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMessage = "Email ou senha incorretos.";
        break;
      default:
        errorMessage = "Erro ao fazer login. Tente novamente.";
    }
    alert(errorMessage);
  }
});

// Cadastro
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("newEmail").value;
  const password = document.getElementById("newPassword").value;
  const name = document.getElementById("newName").value;
  const phone = document.getElementById("newPhone").value;
  const button = e.target.querySelector("button");
  
  // Feedback visual
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cadastrando...';
  button.disabled = true;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Salvar informações adicionais no Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      nome: name,
      email: email,
      telefone: phone,
      createdAt: new Date()
    });

    alert("Cadastro realizado com sucesso! Faça login.");
    mostrarLogin();
  } catch (error) {
    button.innerHTML = 'Cadastrar';
    button.disabled = false;
    
    let errorMessage = "Erro no cadastro: ";
    switch(error.code) {
      case 'auth/email-already-in-use':
        errorMessage = "Este email já está em uso.";
        break;
      case 'auth/invalid-email':
        errorMessage = "Email inválido.";
        break;
      case 'auth/weak-password':
        errorMessage = "Senha muito fraca (mínimo 6 caracteres).";
        break;
      default:
        errorMessage = "Erro ao cadastrar. Tente novamente.";
    }
    alert(errorMessage);
  }
});
