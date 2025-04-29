import { auth, db } from "./firebase-config.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

let lastActivityTime = Date.now();
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos

function updateActivity() {
  lastActivityTime = Date.now();
}

['mousemove', 'keypress', 'click'].forEach(event => {
  document.addEventListener(event, updateActivity);
});

setInterval(() => {
  if (Date.now() - lastActivityTime > SESSION_TIMEOUT) {
    signOut(auth).then(() => {
      sessionStorage.clear();
      window.location.href = "index.html";
    });
  }
}, 5000);

// Verifica estado de autenticação
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  
  document.getElementById('userEmail').textContent = user.email;
  
  // Mostra link de admin se for o usuário admin
  if (user.email === "admin@gef.com") {
    document.getElementById('adminLink').style.display = 'block';
    document.getElementById('adminLink').addEventListener('click', () => {
      window.location.href = "admin.html";
    });
  }
});

// Menu do usuário
const userMenuToggle = document.getElementById('userMenuToggle');
const userMenu = document.getElementById('userMenu');

userMenuToggle.addEventListener('click', () => {
  userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  signOut(auth).then(() => {
    sessionStorage.clear();
    window.location.href = "index.html";
  });
});

document.getElementById('logoutBtnTop').addEventListener('click', () => {
  signOut(auth).then(() => {
    sessionStorage.clear();
    window.location.href = "index.html";
  });
});

// Navegação do menu principal
document.querySelectorAll('.main-menu li').forEach(item => {
  item.addEventListener('click', function() {
    document.querySelector('.main-menu li.active').classList.remove('active');
    this.classList.add('active');
    loadSection(this.dataset.section);
  });
});

// Carrega seções dinamicamente
async function loadSection(section) {
  const dashboardContent = document.getElementById('dashboard-content');
  const gefIframe = document.getElementById('gef-iframe');
  
  dashboardContent.style.display = 'none';
  gefIframe.style.display = 'none';

  try {
    console.log(`Carregando seção: ${section}`);
    
    switch(section) {
      case 'dashboard':
        dashboardContent.style.display = 'block';
        break;
        
      case 'gerador-evolucao':
        await loadGefIframe('gef.html');
        break;
        
      case 'configuracoes':
        await loadGefIframe('configuracoes.html');
        break;
        
      case 'gerador-relatorio':
        case 'prescricao-exercicio':
        dashboardContent.innerHTML = `
          <div style="padding:40px; text-align:center;">
            <h3>Funcionalidade em desenvolvimento</h3>
            <p>Esta seção estará disponível em breve</p>
          </div>
        `;
        dashboardContent.style.display = 'block';
        break;
        
      default:
        dashboardContent.style.display = 'block';
    }
  } catch (error) {
    console.error('Erro ao carregar seção:', error);
    dashboardContent.innerHTML = `
      <div style="color:red; padding:20px; text-align:center">
        <h3>Erro ao carregar conteúdo</h3>
        <p>${error.message}</p>
      </div>`;
    dashboardContent.style.display = 'block';
  }
}

// Carrega iframe com tratamento de erros
async function loadGefIframe(url) {
  const gefIframe = document.getElementById('gef-iframe');
  console.log('Tentando carregar:', url);
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) {
      throw new Error(`Arquivo ${url} não encontrado (${response.status})`);
    }
    
    gefIframe.src = url;
    gefIframe.style.display = 'block';
    
    gefIframe.onload = () => {
      console.log('Iframe carregado com sucesso');
      // Envia as configurações do usuário para o iframe
      sendUserConfigToIframe();
    };
    
    gefIframe.onerror = (e) => {
      console.error('Erro ao carregar iframe:', e);
      throw new Error(`Falha ao carregar ${url}`);
    };
  } catch (error) {
    throw error;
  }
}

// Envia as configurações do usuário para o iframe
async function sendUserConfigToIframe() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists() && userSnap.data().config) {
      const config = userSnap.data().config;
      const gefIframe = document.getElementById('gef-iframe');
      
      gefIframe.contentWindow.postMessage({
        type: 'USER_CONFIG',
        config: config
      }, '*');
    }
  } catch (error) {
    console.error("Erro ao obter configurações do usuário:", error);
  }
}

// Fecha menu ao clicar fora
document.addEventListener('click', (e) => {
  if (!userMenu.contains(e.target) && e.target !== userMenuToggle) {
    userMenu.style.display = 'none';
  }
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  loadSection('dashboard');
});

// Comunicação entre iframes/páginas
window.addEventListener('message', (event) => {
  if (event.data.type === 'NAVIGATE_TO') {
    const section = event.data.section;
    const menuItem = document.querySelector(`.main-menu li[data-section="${section}"]`);
    if (menuItem) {
      menuItem.click();
    }
  }
});
