import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { auth } from "./script.js";

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
      window.location.href = "index.html";
    });
  }
}, 5000);

onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "index.html";
  document.getElementById('userEmail').textContent = user.email;
  if (user.email === "admin@gef.com") document.getElementById('adminLink').style.display = 'block';
});

const userMenuToggle = document.getElementById('userMenuToggle');
const userMenu = document.getElementById('userMenu');

userMenuToggle.addEventListener('click', () => {
  userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  signOut(auth).then(() => {
    sessionStorage.clear();
    window.location.href = "index.html";
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
    switch(section) {
      case 'dashboard':
        dashboardContent.style.display = 'block';
        break;
        
      case 'gerador-evolucao':
        gefIframe.src = `${window.location.origin}/gef.html`;
        gefIframe.style.display = 'block';
        break;
        
      default:
        dashboardContent.style.display = 'block';
    }
  } catch (error) {
    console.error(error);
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
