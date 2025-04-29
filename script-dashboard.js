
import { app, auth } from './firebase-config.js';
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const userEmailSpan = document.getElementById('userEmail');
const userMenu = document.getElementById('userMenu');
const userMenuToggle = document.getElementById('userMenuToggle');
const adminLink = document.getElementById('adminLink');
const logoutBtnTop = document.getElementById('logoutBtnTop');
const logoutBtn = document.getElementById('logoutBtn');

const gefIframe = document.getElementById('gef-iframe');
const dashboardContent = document.getElementById('dashboard-content');

// MENU LATERAL - clique
document.querySelectorAll('.main-menu li').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.main-menu li').forEach(li => li.classList.remove('active'));
    item.classList.add('active');
    carregarSecao(item.dataset.section);
  });
});

// BOTÕES DE AÇÃO RÁPIDA
document.querySelectorAll('.quick-action-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const section = btn.dataset.section;
    carregarSecao(section);
  });
});

function carregarSecao(section) {
  console.log('Carregando seção:', section);
  if (section === 'dashboard') {
    gefIframe.style.display = 'none';
    dashboardContent.style.display = 'block';
  } else {
    dashboardContent.style.display = 'none';
    gefIframe.style.display = 'block';
    let src = '';
    if (section === 'gerador-evolucao') src = 'gef.html';
    else if (section === 'configuracoes') src = 'configuracoes.html';
    else if (section === 'gerador-relatorio') src = 'relatorio.html';
    else if (section === 'prescricao-exercicio') src = 'prescricao.html';
    gefIframe.src = src;
  }
}

// MENU SUPERIOR
userMenuToggle.addEventListener('click', () => {
  userMenu.classList.toggle('show');
});

logoutBtn.addEventListener('click', () => {
  sair();
});

logoutBtnTop.addEventListener('click', () => {
  sair();
});

function sair() {
  const auth = getAuth();
  signOut(auth).then(() => {
    console.log('Usuário deslogado');
    window.location.href = 'index.html';
  }).catch(error => {
    console.error('Erro ao deslogar:', error);
  });
}

// RECEBER CONFIGURAÇÕES USUÁRIO
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      userEmailSpan.textContent = user.email;
      if (userSnap.data().isAdmin) {
        adminLink.style.display = 'block';
        adminLink.addEventListener('click', () => {
          window.location.href = 'admin.html';
        });
      }
      const iframe = document.getElementById('gef-iframe');
      iframe.addEventListener('load', () => {
        iframe.contentWindow.postMessage({ type: 'USER_CONFIG', config: userSnap.data().config }, '*');
      });
    }
  } else {
    window.location.href = 'index.html';
  }
});
