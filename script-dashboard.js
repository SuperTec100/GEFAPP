[file name]: script-dashboard.js
[file content begin]
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
    }
  }
});

// Menu do usuário (mantido igual)
const userMenuToggle = document.getElementById('userMenuToggle');
const userMenu = document.getElementById('userMenu');

userMenuToggle.addEventListener('click', () => {
  userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
  userMenuToggle.querySelector('i:last-child').style.transform = 
    userMenu.style.display === 'block' ? 'rotate(180deg)' : 'rotate(0)';
});

// Logout (mantido igual)
document.getElementById('logoutBtn').addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});

// Navegação do menu - Modificada para carregar conteúdo dinâmico
document.querySelectorAll('.main-menu li').forEach(item => {
  item.addEventListener('click', function() {
    document.querySelector('.main-menu li.active').classList.remove('active');
    this.classList.add('active');
    
    const section = this.getAttribute('data-section');
    loadSection(section);
  });
});

// Função para carregar seções dinamicamente
async function loadSection(section) {
  const contentContainer = document.getElementById('content-container');
  const dashboardContent = document.getElementById('dashboard-content');
  const gefContent = document.getElementById('gef-content');
  
  // Esconder todos os conteúdos primeiro
  dashboardContent.style.display = 'none';
  gefContent.style.display = 'none';
  
  switch(section) {
    case 'dashboard':
      dashboardContent.style.display = 'block';
      break;
      
    case 'gerador-evolucao':
      try {
        // Carrega o conteúdo do GEF.html via fetch
        const response = await fetch('gef.html');
        const html = await response.text();
        gefContent.innerHTML = html;
        gefContent.style.display = 'block';
        
        // Se houver scripts específicos do GEF, podemos carregá-los aqui
        if (typeof initGEF === 'function') {
          initGEF();
        }
      } catch (error) {
        console.error('Erro ao carregar o GEF:', error);
        gefContent.innerHTML = '<p>Erro ao carregar o Gerador de Evolução</p>';
        gefContent.style.display = 'block';
      }
      break;
      
    default:
      dashboardContent.style.display = 'block';
      break;
  }
}

// Fechar menu ao clicar fora (mantido igual)
document.addEventListener('click', (e) => {
  if (!userMenu.contains(e.target) && e.target !== userMenuToggle) {
    userMenu.style.display = 'none';
    userMenuToggle.querySelector('i:last-child').style.transform = 'rotate(0)';
  }
});
[file content end]
