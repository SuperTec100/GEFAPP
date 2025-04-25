import { getAuth, signOut, onAuthStateChanged, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { app } from "./script.js";

const auth = getAuth(app);

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

// Atualizar atividade do usuário
function updateActivity() {
  lastActivityTime = new Date().getTime();
}

document.addEventListener('mousemove', updateActivity);
document.addEventListener('keypress', updateActivity);
document.addEventListener('click', updateActivity);

// Verificar inatividade periodicamente
setInterval(() => {
  const currentTime = new Date().getTime();
  if (currentTime - lastActivityTime > SESSION_TIMEOUT) {
    signOut(auth).then(() => {
      window.location.href = "index.html";
    });
  }
}, 60000); // Verificar a cada minuto

// Verificar autenticação ao carregar
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
    sessionStorage.clear();
    window.location.href = "index.html";
  });
});

// Navegação do menu
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
        // Carrega o conteúdo do partial-gef.html via fetch
        const response = await fetch('partial-gef.html');
        if (!response.ok) throw new Error('Arquivo não encontrado');
        const html = await response.text();
        gefContent.innerHTML = html;
        gefContent.style.display = 'block';
        
        // Rola a página para o topo do GEF
        gefContent.scrollIntoView({ behavior: 'smooth' });
        
        // Se houver scripts específicos do GEF, podemos carregá-los aqui
        if (typeof initGEF === 'function') {
          initGEF();
        }
      } catch (error) {
        console.error('Erro ao carregar o GEF:', error);
        gefContent.innerHTML = `
          <div style="color: red; padding: 20px; text-align: center;">
            <h3>Erro ao carregar o Gerador de Evolução</h3>
            <p>${error.message}</p>
            <p>Verifique se o arquivo partial-gef.html existe no diretório correto.</p>
          </div>
        `;
        gefContent.style.display = 'block';
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

// Limpar sessão ao fechar a página
window.addEventListener('beforeunload', () => {
  sessionStorage.removeItem('users');
  sessionStorage.removeItem('loggedUser');
});
