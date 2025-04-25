import { getAuth, signOut, onAuthStateChanged, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { app, auth } from "./script.js";

// Configurar persistência como SESSION
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Persistência configurada no dashboard");
  })
  .catch((error) => {
    console.error("Erro ao configurar persistência:", error);
  });

// Verificar autenticação e monitorar atividade
let lastActivityTime = new Date().getTime();
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos

function updateActivity() {
  lastActivityTime = new Date().getTime();
}

['mousemove', 'keypress', 'click'].forEach(event => {
  document.addEventListener(event, updateActivity);
});

setInterval(() => {
  const currentTime = new Date().getTime();
  if (currentTime - lastActivityTime > SESSION_TIMEOUT) {
    signOut(auth).then(() => {
      window.location.href = "index.html";
    });
  }
}, 60000);

// Verificar autenticação
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    document.getElementById('userEmail').textContent = user.email;
    
    if (user.email === "admin@gef.com") {
      document.getElementById('adminLink').style.display = 'block';
    }
  }
});

// Menu do usuário
const userMenuToggle = document.getElementById('userMenuToggle');
const userMenu = document.getElementById('userMenu');

userMenuToggle.addEventListener('click', () => {
  const isVisible = userMenu.style.display === 'block';
  userMenu.style.display = isVisible ? 'none' : 'block';
  userMenuToggle.querySelector('i:last-child').style.transform = 
    isVisible ? 'rotate(0)' : 'rotate(180deg)';
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  signOut(auth).then(() => {
    sessionStorage.clear();
    window.location.href = "index.html";
  });
});

// Navegação do menu
document.querySelectorAll('.main-menu li').forEach(item => {
  item.addEventListener('click', function() {
    document.querySelector('.main-menu li.active').classList.remove('active');
    this.classList.add('active');
    loadSection(this.getAttribute('data-section'));
  });
});

// Função para carregar seções (modificada)
async function loadSection(section) {
  const dashboardContent = document.getElementById('dashboard-content');
  const gefIframe = document.getElementById('gef-iframe');
  
  dashboardContent.style.display = 'none';
  gefIframe.style.display = 'none';
  
  switch(section) {
    case 'dashboard':
      dashboardContent.style.display = 'block';
      break;
      
    case 'gerador-evolucao':
      try {
        console.log('Carregando GEF...');
        // Garante que o caminho seja absoluto
        gefIframe.src = window.location.pathname.includes('dashboard.html') 
          ? 'gef.html' 
          : window.location.pathname.replace('dashboard.html', '') + 'gef.html';
        gefIframe.style.display = 'block';
        
        gefIframe.onload = () => console.log('GEF carregado com sucesso');
        gefIframe.onerror = (e) => {
          console.error('Erro no iframe:', e);
          dashboardContent.innerHTML = `
            <div style="color: red; padding: 20px; text-align: center;">
              <h3>Erro ao carregar o Gerador de Evolução</h3>
              <p>${e.message}</p>
              <p>Verifique se o arquivo gef.html existe no diretório correto.</p>
            </div>
          `;
          dashboardContent.style.display = 'block';
        };
      } catch (error) {
        console.error('Erro:', error);
        dashboardContent.style.display = 'block';
      }
      break;
      
    default:
      dashboardContent.style.display = 'block';
      break;
  }
}

// Fechar menu ao clicar fora
document.addEventListener('click', (e) => {
  if (!userMenu.contains(e.target) && e.target !== userMenuToggle) {
    userMenu.style.display = 'none';
    userMenuToggle.querySelector('i:last-child').style.transform = 'rotate(0)';
  }
});

// Limpar sessão ao fechar
window.addEventListener('beforeunload', () => {
  sessionStorage.removeItem('users');
  sessionStorage.removeItem('loggedUser');
});
