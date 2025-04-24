// Substitua pelos dados do seu Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("Login bem-sucedido!");
      // Redirecione ou mostre o sistema
    })
    .catch((error) => {
      alert("Erro no login: " + error.message);
    });
});

document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("newEmail").value;
  const password = document.getElementById("newPassword").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("Usuário cadastrado com sucesso!");
      document.getElementById("registerForm").reset();
      mostrarLogin();
    })
    .catch((error) => {
      alert("Erro no cadastro: " + error.message);
    });
});
