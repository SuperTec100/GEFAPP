
import { app, auth } from './firebase-config.js';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const db = getFirestore(app);
let userConfig = {};

const loading = document.getElementById('loading');
const gefContent = document.getElementById('gefContent');
const localAtendimento = document.getElementById('localAtendimento');
const hospitalSelect = document.getElementById('hospital');
const unidadeSelect = document.getElementById('unidade');
const listaPacientes = document.getElementById('listaPacientes');
const cadastroPaciente = document.getElementById('cadastroPaciente');

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
  if (userConfig && userConfig.locaisAtendimento) {
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
  hospitalSelect.innerHTML = '';
  unidadeSelect.innerHTML = '';
  listaPacientes.innerHTML = '';

  if (localAtendimento.value === 'Hospital' && userConfig.hospitais) {
    if (userConfig.hospitais.length > 1) {
      const emptyOption = document.createElement('option');
      emptyOption.value = '';
      emptyOption.textContent = 'Selecione o hospital';
      hospitalSelect.appendChild(emptyOption);
    }
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
  }
}

function carregarUnidades() {
  unidadeSelect.innerHTML = '';
  listaPacientes.innerHTML = '';

  const hospital = hospitalSelect.value;
  if (userConfig.unidades && userConfig.unidades[hospital]) {
    if (userConfig.unidades[hospital].length > 1) {
      const emptyOption = document.createElement('option');
      emptyOption.value = '';
      emptyOption.textContent = 'Selecione a unidade';
      unidadeSelect.appendChild(emptyOption);
    }
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
  }
}

async function carregarPacientes() {
  listaPacientes.innerHTML = '';

  const hospital = hospitalSelect.value;
  const unidade = unidadeSelect.value;
  if (!hospital || !unidade) return;

  const leitosRef = collection(db, "hospitais", hospital, "unidades", unidade, "leitos");
  const leitosSnap = await getDocs(leitosRef);

  const pacientes = [];
  leitosSnap.forEach(docSnap => {
    pacientes.push({ id: docSnap.id, ...docSnap.data() });
  });

  pacientes.sort((a, b) => parseInt(a.id) - parseInt(b.id));

  pacientes.forEach(dados => {
    const nome = dados.nome || 'Sem nome';
    const li = document.createElement('li');
    li.className = 'paciente-item';
    li.innerHTML = `
      <div class="info-paciente"><strong>Leito ${dados.id}</strong>: ${nome}</div>
      <div class="actions">
        <button class="btn-evolucao" data-leito="${dados.id}">Gerar Evolução</button>
        <button class="btn-excluir" data-leito="${dados.id}"><i class="fas fa-trash"></i></button>
      </div>
    `;
    listaPacientes.appendChild(li);
  });
}

listaPacientes.addEventListener('click', async (e) => {
  const excluirBtn = e.target.closest('.btn-excluir');
  if (excluirBtn) {
    const leito = excluirBtn.dataset.leito;
    const hospital = hospitalSelect.value;
    const unidade = unidadeSelect.value;
    if (confirm(`Deseja realmente remover o paciente do Leito ${leito}?`)) {
      await deleteDoc(doc(db, "hospitais", hospital, "unidades", unidade, "leitos", leito));
      excluirBtn.closest('li').remove();
    }
  }

  const evolucaoBtn = e.target.closest('.btn-evolucao');
  if (evolucaoBtn) {
    const leito = evolucaoBtn.dataset.leito;
    window.open('evolucao.html', '_blank');
  }
});

localAtendimento.addEventListener('change', carregarHospitais);
hospitalSelect.addEventListener('change', carregarUnidades);
unidadeSelect.addEventListener('change', carregarPacientes);
