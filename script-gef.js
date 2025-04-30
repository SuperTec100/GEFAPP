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
const btnAdicionarPaciente = document.getElementById('btnAdicionarPaciente');
const btnSalvar = document.getElementById('btnSalvarPaciente');
const btnCancelar = document.getElementById('btnCancelarCadastro');

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

function carregarPacientes() {
  listaPacientes.innerHTML = '';
  leitosContainer.style.display = 'block';

  const hospital = hospitalSelect.value;
  const unidade = unidadeSelect.value;

  const leitos = JSON.parse(localStorage.getItem(`leitos_${hospital}_${unidade}`)) || [];

  leitos.forEach(paciente => {
    const li = document.createElement('li');
    li.textContent = `Leito ${paciente.leito} - ${paciente.nome}`;
    li.classList.add('paciente-item');
    li.addEventListener('click', () => {
      sessionStorage.setItem("evolucao.hospital", hospital);
      sessionStorage.setItem("evolucao.unidade", unidade);
      sessionStorage.setItem("evolucao.leito", paciente.leito);
      window.location.href = "evolucao.html";
    });
    listaPacientes.appendChild(li);
  });
}


btnAdicionarPaciente.addEventListener('click', () => {
  cadastroPaciente.style.display = 'block';
});

btnCancelar.addEventListener('click', () => {
  cadastroPaciente.style.display = 'none';
});

btnSalvar.addEventListener('click', async () => {
  const leito = document.getElementById('leitoPaciente').value.trim();
  const nome = document.getElementById('nomePaciente').value.trim();
  const hospital = hospitalSelect.value;
  const unidade = unidadeSelect.value;

  if (!hospital || !unidade || !leito || !nome) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  const leitoRef = doc(db, "usuarios", auth.currentUser.uid, "hospitais", hospital, "unidades", unidade, "leitos", leito);
  await setDoc(leitoRef, { nome });
  cadastroPaciente.style.display = 'none';
  carregarPacientes();
});

window.excluirPaciente = async (hospital, unidade, leito) => {
  if (!confirm(`Tem certeza que deseja excluir o paciente do Leito ${leito}?`)) return;
  const ref = doc(db, "usuarios", auth.currentUser.uid, "hospitais", hospital, "unidades", unidade, "leitos", leito);
  await deleteDoc(ref);
  carregarPacientes();
};

window.gerarEvolucao = (hospital, unidade, leito, nome) => {
  sessionStorage.setItem('evolucao.hospital', hospital);
  sessionStorage.setItem('evolucao.unidade', unidade);
  sessionStorage.setItem('evolucao.leito', leito);
  sessionStorage.setItem('evolucao.nome', nome);
  window.location.href = 'evolucao.html';
};

localAtendimento.addEventListener('change', carregarHospitais);
hospitalSelect.addEventListener('change', carregarUnidades);
unidadeSelect.addEventListener('change', carregarPacientes);

window.prescrever = (hospital, unidade, leito) => {
  alert(`Prescrição (em desenvolvimento) - Leito ${leito}`);
};

window.abrirRelatorio = (hospital, unidade, leito) => {
  alert(`Relatório (em desenvolvimento) - Leito ${leito}`);
};
