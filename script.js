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

// Verifique o estado de autenticação ao carregar a página
auth.onAuthStateChanged(user => {
  if (user) {
    // Usuário logado - redireciona para gef.html
    window.location.href = "gef.html";
  }
});

// Login
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Salva informações do usuário no localStorage
      localStorage.setItem("loggedUser", userCredential.user.email);
      
      // Redireciona para a página principal
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

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Salva informações adicionais do usuário
      const user = userCredential.user;
      
      // Aqui você pode salvar informações adicionais no banco de dados se necessário
      const users = JSON.parse(localStorage.getItem("users")) || {};
      users[user.email] = {
        nome: name,
        email: user.email,
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
