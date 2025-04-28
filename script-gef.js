
import { app, auth } from './firebase-config.js';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const db = getFirestore(app);
let userConfig = {};

const loading = document.getElementById('loading');
const gefContent = document.getElementById('gefContent');
const localAtendimento = document.getElementById('localAtendimento');
const hospitalContainer = document.getElementById('hospitalContainer');
const hospitalSelect = document.getElementById('hospital');
const unidadeContainer = document.getElementById('unidadeContainer');
const unidadeSelect = document.getElementById('unidade');
const leitosContainer = document.getElementById('leitosContainer');
const listaPacientes = document.getElementById('listaPacientes');

document.getElementById('backToDashboard').addEventListener('click', () => {
  window.parent.postMessage({ type: 'NAVIGATE_TO', section: 'dashboard' }, '*');
});

window.addEventListener('message', (event) => {
  if (event.data.type === 'USER_CONFIG') {
    userConfig = event.data.config;
    setupLocaisAtendimento();
  }
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists() && userSnap.data().config) {
      userConfig = userSnap.data().config;
      setupLocaisAtendimento();
    }
  }
});

function setupLocaisAtendimento() {
  localAtendimento.innerHTML = '';
  if (userConfig.locaisAtendimento) {
    userConfig.locaisAtendimento.forEach(local => {
      const option = document.createElement('option');
      option.value = local;
      option.textContent = local;
      localAtendimento.appendChild(option);
    });
    if (userConfig.locaisAtendimento.length === 1) {
      localAtendimento.value = userConfig.locaisAtendimento[0];
      carregarHospitais();
    }
  }
  loading.style.display = 'none';
  gefContent.style.display = 'block';
}

function carregarHospitais() {
  hospitalContainer.style.display = 'none';
  unidadeContainer.style.display = 'none';
  leitosContainer.style.display = 'none';
  if (localAtendimento.value === 'Hospital' && userConfig.hospitais) {
    hospitalSelect.innerHTML = '';
    userConfig.hospitais.forEach(hospital => {
      const option = document.createElement('option');
      option.value = hospital;
      option.textContent = hospital;
      hospitalSelect.appendChild(option);
    });
    if (userConfig.hospitais.length === 1) {
      hospitalSelect.value = userConfig.hospitais[0];
      carregarUnidades();
    }
    hospitalContainer.style.display = 'block';
  }
}

function carregarUnidades() {
  unidadeSelect.innerHTML = '';
  const hospital = hospitalSelect.value;
  if (userConfig.unidades && userConfig.unidades[hospital]) {
    userConfig.unidades[hospital].forEach(unidade => {
      const option = document.createElement('option');
      option.value = unidade;
      option.textContent = unidade;
      unidadeSelect.appendChild(option);
    });
    if (userConfig.unidades[hospital].length === 1) {
      unidadeSelect.value = userConfig.unidades[hospital][0];
      carregarPacientes();
    }
    unidadeContainer.style.display = 'block';
  }
}

async function carregarPacientes() {
  listaPacientes.innerHTML = '';
  leitosContainer.style.display = 'block';

  const hospital = hospitalSelect.value;
  const unidade = unidadeSelect.value;

  if (!hospital || !unidade) return;

  const leitosRef = collection(db, "hospitais", hospital, "unidades", unidade, "leitos");
  const leitosSnap = await getDocs(leitosRef);

  if (leitosSnap.empty) {
    listaPacientes.innerHTML = "<li>Nenhum paciente cadastrado</li>";
    return;
  }

  leitosSnap.forEach(docSnap => {
    const dados = docSnap.data();
    const nome = dados.nome || 'Sem nome';
    const iniciais = nome.split(' ').map(n => n[0]).join('').substring(0,3).toUpperCase();
    const li = document.createElement('li');
    li.className = 'paciente-item';
    li.innerHTML = `
      <div class="paciente-info-lista">
        <strong>Leito ${docSnap.id}</strong> - ${iniciais}
        <div class="paciente-actions">
          <button class="abrir" data-hospital="${hospital}" data-unidade="${unidade}" data-leito="${docSnap.id}">
            <i class="fas fa-file-alt"></i>
          </button>
          <button class="excluir" data-hospital="${hospital}" data-unidade="${unidade}" data-leito="${docSnap.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
    listaPacientes.appendChild(li);
  });

  // Eventos
  document.querySelectorAll('.abrir').forEach(btn => {
    btn.addEventListener('click', (e) => {
      window.open('evolucao.html', '_blank');
    });
  });

  document.querySelectorAll('.excluir').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const { hospital, unidade, leito } = e.target.closest('button').dataset;
      if (confirm(`Deseja excluir o paciente do Leito ${leito}?`)) {
        await deleteDoc(doc(db, "hospitais", hospital, "unidades", unidade, "leitos", leito));
        carregarPacientes();
      }
    });
  });
}

localAtendimento.addEventListener('change', carregarHospitais);
hospitalSelect.addEventListener('change', carregarUnidades);
unidadeSelect.addEventListener('change', carregarPacientes);
