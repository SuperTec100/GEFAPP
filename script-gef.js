
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
  loading.style.display = 'none';
  gefContent.style.display = 'block';
  if (userConfig.locaisAtendimento.length === 1) {
    localAtendimento.value = userConfig.locaisAtendimento[0];
    carregarHospitais();
  }
}

function carregarHospitais() {
  hospitalSelect.innerHTML = '';
  unidadeSelect.innerHTML = '';
  listaPacientes.innerHTML = '';
  hospitalContainer.style.display = 'none';
  unidadeContainer.style.display = 'none';
  leitosContainer.style.display = 'none';

  if (userConfig.hospitais && localAtendimento.value === 'Hospital') {
    hospitalContainer.style.display = 'block';
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

    const storedHospital = sessionStorage.getItem('evolucao.hospital');
    if (storedHospital && userConfig.hospitais.includes(storedHospital)) {
      hospitalSelect.value = storedHospital;
      carregarUnidades();
    } else if (userConfig.hospitais.length === 1) {
      hospitalSelect.value = userConfig.hospitais[0];
      carregarUnidades();
    }
  }
}

function carregarUnidades() {
  unidadeSelect.innerHTML = '';
  listaPacientes.innerHTML = '';
  unidadeContainer.style.display = 'none';
  leitosContainer.style.display = 'none';

  const hospital = hospitalSelect.value;
  if (userConfig.unidades && userConfig.unidades[hospital]) {
    unidadeContainer.style.display = 'block';
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

    const storedUnidade = sessionStorage.getItem('evolucao.unidade');
    if (storedUnidade && userConfig.unidades[hospital].includes(storedUnidade)) {
      unidadeSelect.value = storedUnidade;
      carregarPacientes();
    } else if (userConfig.unidades[hospital].length === 1) {
      unidadeSelect.value = userConfig.unidades[hospital][0];
      carregarPacientes();
    }
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

localAtendimento.addEventListener('change', carregarHospitais);
hospitalSelect.addEventListener('change', carregarUnidades);
unidadeSelect.addEventListener('change', carregarPacientes);

document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("btnAdicionarPaciente");
  const form = document.getElementById("cadastroPaciente");
  if (btn && form) {
    btn.addEventListener("click", () => {
      form.style.display = "block";
    });
  }

  const listaPacientes = document.getElementById("listaPacientes");
  listaPacientes.addEventListener("click", (e) => {
    const evolucaoBtn = e.target.closest(".btn-evolucao");
    if (evolucaoBtn) {
      const leito = evolucaoBtn.dataset.leito;
      const hospital = document.getElementById("hospital").value;
      const unidade = document.getElementById("unidade").value;
      sessionStorage.setItem("evolucao.leito", leito);
      sessionStorage.setItem("evolucao.hospital", hospital);
      sessionStorage.setItem("evolucao.unidade", unidade);

      const gefContent = document.getElementById("gefContent");
      const iframe = document.getElementById("evolucaoIframe");
      if (gefContent && iframe) {
        gefContent.style.display = "none";
        iframe.src = "evolucao.html";
        iframe.style.display = "block";
      }
    }
  });
});
