import { app, auth } from './firebase-config.js';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
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
    
    if (userConfig.locaisAtendimento.length > 1) {
      const option = document.createElement('option');
      option.disabled = true;
      option.selected = true;
      option.textContent = 'Selecione uma opção';
      localAtendimento.appendChild(option);
    }
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
  hospitalContainer.style.display = 'none';
  unidadeContainer.style.display = 'none';
  leitosContainer.style.display = 'none';

  if (userConfig.hospitais && localAtendimento.value === 'Hospital') {
    
    if (userConfig.hospitais.length > 1) {
      const option = document.createElement('option');
      option.disabled = true;
      option.selected = true;
      option.textContent = 'Selecione um hospital';
      hospitalSelect.appendChild(option);
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
    hospitalContainer.style.display = 'block';
  }
}

function carregarUnidades() {
  unidadeSelect.innerHTML = '';
  listaPacientes.innerHTML = '';
  unidadeContainer.style.display = 'none';
  leitosContainer.style.display = 'none';

  const hospital = hospitalSelect.value;
  if (userConfig.unidades && userConfig.unidades[hospital]) {
    
    if (userConfig.unidades[hospital].length > 1) {
      const option = document.createElement('option');
      option.disabled = true;
      option.selected = true;
      option.textContent = 'Selecione uma unidade';
      unidadeSelect.appendChild(option);
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
    unidadeContainer.style.display = 'block';
  }
}

async function carregarPacientes() {
  listaPacientes.innerHTML = '';
  leitosContainer.style.display = 'block';

  const hospital = hospitalSelect.value || sessionStorage.getItem('evolucao.hospital');
const unidade = unidadeSelect.value || sessionStorage.getItem('evolucao.unidade');
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
    const li = document.createElement('li');
    li.className = 'paciente-item';
    li.innerHTML = `
      <div class="info-paciente"><strong>Leito ${docSnap.id}</strong>: ${nome}</div>
      <div class="actions">
        <button class="btn-evolucao" data-leito="${docSnap.id}">Gerar Evolução</button>
        <button class="btn-excluir" data-leito="${docSnap.id}"><i class="fas fa-trash"></i></button>
      </div>
    `;
    listaPacientes.appendChild(li);
  });
}

listaPacientes.addEventListener('click', async (e) => {
  const excluirBtn = e.target.closest('.btn-excluir');
  if (excluirBtn) {
    const leito = excluirBtn.dataset.leito;
    const hospital = hospitalSelect.value || sessionStorage.getItem('evolucao.hospital');
const unidade = unidadeSelect.value || sessionStorage.getItem('evolucao.unidade');
    if (confirm(`Deseja realmente remover o paciente do Leito ${leito}?`)) {
      await deleteDoc(doc(db, "hospitais", hospital, "unidades", unidade, "leitos", leito));
      excluirBtn.closest('li').remove();
    }
  }

  const evolucaoBtn = e.target.closest('.btn-evolucao');
  if (evolucaoBtn) {
    const leito = evolucaoBtn.dataset.leito;
    console.log("Iniciar geração de evolução para Leito:", leito);
    window.open('evolucao.html', '_blank');
  }
});

localAtendimento.addEventListener('change', carregarHospitais);
hospitalSelect.addEventListener('change', carregarUnidades);
unidadeSelect.addEventListener('change', carregarPacientes);

document.addEventListener("DOMContentLoaded", () => {
  const btnAdicionar = document.getElementById("btnAdicionarPaciente");
  const formCadastro = document.getElementById("cadastroPaciente");
  const btnCancelar = document.getElementById("btnCancelarCadastro");

  if (btnAdicionar && formCadastro) {
    btnAdicionar.addEventListener("click", () => {
      formCadastro.style.display = "block";
    });
  }

  if (btnCancelar && formCadastro) {
    btnCancelar.addEventListener("click", () => {
      formCadastro.style.display = "none";
    });
  }
});
