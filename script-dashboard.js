import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { app } from "./script.js";

const auth = getAuth(app);

// Verificar autenticação e carregar dados do usuário
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    document.getElementById('userEmail').textContent = user.email;
    
    // Mostrar link para admin se for o usuário admin
    if (user.email === "admin@gef.com") {
      document.getElementById('adminLink').style.display = 'block';
      document.getElementById('adminLink').addEventListener('click', () => {
        window.location.href = "admin.html";
      });
    }
  }
});

// Menu do usuário
const userMenuToggle = document.getElementById('userMenuToggle');
const userMenu = document.getElementById('userMenu');

userMenuToggle.addEventListener('click', () => {
  userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
  userMenuToggle.querySelector('i:last-child').style.transform = 
    userMenu.style.display === 'block' ? 'rotate(180deg)' : 'rotate(0)';
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});

// Navegação do menu
document.querySelectorAll('.main-menu li').forEach(item => {
  item.addEventListener('click', function() {
    document.querySelector('.main-menu li.active').classList.remove('active');
    this.classList.add('active');
    
    const section = this.getAttribute('data-section');
    
    if (section === 'gerador-evolucao') {
      window.location.href = "gef.html";
    } else {
      // Aqui você pode adicionar redirecionamentos para outras páginas quando criá-las
      alert(`Funcionalidade ${section} será implementada em breve!`);
    }
  });
});

// Fechar menu ao clicar fora
document.addEventListener('click', (e) => {
  if (!userMenu.contains(e.target) && e.target !== userMenuToggle) {
    userMenu.style.display = 'none';
    userMenuToggle.querySelector('i:last-child').style.transform = 'rotate(0)';
  }
});