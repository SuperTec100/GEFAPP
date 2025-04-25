import { auth, db } from "https://gefapp.com.br/firebase-config.js";
import { 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { 
  doc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Verificação de protocolo seguro
if (window.location.protocol !== 'https:' && !window.location.hostname.includes('localhost')) {
  window.location.href = 'https://' + window.location.hostname + window.location.pathname;
}

// Gerenciamento de sessão
let lastActivityTime = Date.now();
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos

function updateActivity() {
  lastActivityTime = Date.now();
}

['mousemove', 'keypress', 'click', 'scroll'].forEach(event => {
  document.addEventListener(event, updateActivity);
});

setInterval(() => {
  if (Date.now() - lastActivityTime > SESSION_TIMEOUT) {
    signOut(auth).then(() => {
      window.location.href = "https://gefapp.com.br/index.html";
    });
  }
}, 5000);

// Gerenciamento de autenticação
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "https://gefapp.com.br/index.html";
    return;
  }

  // Carregar informações do usuário
  document.getElementById('userEmail').textContent = user.email;
  
  if (user.email === "admin@gef.com") {
    document.getElementById('adminLink').style.display = 'block';
    document.getElementById('adminLink').addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = "https://gefapp.com.br/admin.html";
    });
  }

  // Carregar dados adicionais do Firestore
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      document.getElementById('userName').textContent = userData.nome || user.email;
    }
  } catch (error) {
    console.error("Erro ao carregar dados do usuário:", error);
  }
});

// Menu do usuário
const userMenuToggle = document.getElementById('userMenuToggle');
const userMenu = document.getElementById('userMenu');

userMenuToggle.addEventListener('click', () => {
  userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = "https://gefapp.com.br/index.html";
  });
});

// Navegação
document.querySelectorAll('.main-menu li').forEach(item => {
  item.addEventListener('click', function() {
    document.querySelector('.main-menu li.active').classList.remove('active');
    this.classList.add('active');
    loadSection(this.dataset.section);
  });
});

// Carregar seções
async function loadSection(section) {
  const dashboardContent = document.getElementById('dashboard-content');
  const gefIframe = document.getElementById('gef-iframe');
  const loadingIndicator = document.getElementById('loading-indicator');
  
  dashboardContent.style.display = 'none';
  gefIframe.style.display = 'none';
  loadingIndicator.style.display = 'none';

  try {
    switch(section) {
      case 'dashboard':
        dashboardContent.style.display = 'block';
        break;
        
      case 'gerador-evolucao':
        loadingIndicator.style.display = 'block';
        const gefUrl = 'https://gefapp.com.br/gef.html';
        
        // Verificar se o arquivo existe
        const response = await fetch(gefUrl, { method: 'HEAD' });
        if (!response.ok) throw new Error(`Arquivo não encontrado (${response.status})`);
        
        gefIframe.src = gefUrl;
        gefIframe.onload = () => {
          loadingIndicator.style.display = 'none';
          gefIframe.style.display = 'block';
        };
        
        gefIframe.onerror = () => {
          loadingIndicator.style.display = 'none';
          showError("Erro ao carregar o Gerador de Evolução");
        };
        break;
        
      default:
        dashboardContent.style.display = 'block';
    }
  } catch (error) {
    loadingIndicator.style.display = 'none';
    showError(error.message);
  }
}

function showError(message) {
  const dashboardContent = document.getElementById('dashboard-content');
  dashboardContent.innerHTML = `
    <div class="error-message">
      <h3>Erro ao carregar conteúdo</h3>
      <p>${message}</p>
    </div>`;
  dashboardContent.style.display = 'block';
}

// Fechar menu ao clicar fora
document.addEventListener('click', (e) => {
  if (!userMenu.contains(e.target) && e.target !== userMenuToggle) {
    userMenu.style.display = 'none';
  }
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Adicionar indicador de carregamento dinamicamente
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading-indicator';
  loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
  loadingDiv.style.display = 'none';
  document.getElementById('content-container').appendChild(loadingDiv);
  
  loadSection('dashboard');
});
