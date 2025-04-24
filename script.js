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
