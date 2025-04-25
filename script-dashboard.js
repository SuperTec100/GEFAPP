import { auth } from "https://yourdomain.com/firebase-config.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Verificar protocolo seguro
if (window.location.protocol !== 'https:') {
  window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}

let lastActivityTime = Date.now();
const SESSION_TIMEOUT = 30 * 60 * 1000;

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
      window.location.href = "https://yourdomain.com/index.html";
    });
  }
}, 5000);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "https://yourdomain.com/index.html";
    return;
  }
  document.getElementById('userEmail').textContent = user.email;
  if (user.email === "admin@gef.com") {
    document.getElementById('adminLink').style.display = 'block';
  }
});

const userMenuToggle = document.getElementById('userMenuToggle');
const userMenu = document.getElementById('userMenu');

userMenuToggle.addEventListener('click', () => {
  userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  signOut(auth).then(() => {
    sessionStorage.clear();
    window.location.href = "https://yourdomain.com/index.html";
  });
});

document.querySelectorAll('.main-menu li').forEach(item => {
  item.addEventListener('click', function() {
    document.querySelector('.main-menu li.active').classList.remove('active');
    this.classList.add('active');
    loadSection(this.dataset.section);
  });
});

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
        console.log('Tentando carregar gef.html');
        const gefUrl = 'https://yourdomain.com/gef.html';
        
        const response = await fetch(gefUrl, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error(`Arquivo ${gefUrl} não encontrado (${response.status})`);
        }
        
        gefIframe.src = gefUrl;
        gefIframe.style.display = 'block';
        
        gefIframe.onload = () => {
          console.log('Iframe carregado com sucesso');
        };
        
        gefIframe.onerror = (e) => {
          console.error('Erro ao carregar iframe:', e);
          dashboardContent.innerHTML = `
            <div style="color:red; padding:20px; text-align:center">
              <h3>Erro ao carregar o Gerador de Evolução</h3>
              <p>O arquivo ${gefUrl} não pôde ser carregado.</p>
              <p>Status: ${e.message}</p>
            </div>`;
          dashboardContent.style.display = 'block';
        };
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

document.addEventListener('click', (e) => {
  if (!userMenu.contains(e.target) && e.target !== userMenuToggle) {
    userMenu.style.display = 'none';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  loadSection('dashboard');
});
