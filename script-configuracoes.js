
import { auth, db, doc, getDoc, setDoc } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const form = document.getElementById('configForm');
const localAtendimentoSelect = document.getElementById('localAtendimentoSelect');
const hospitaisSelect = document.getElementById('hospitaisSelect');
const unidadesContainer = document.getElementById('unidadesContainer');

const locaisFixos = ['Hospital', 'Ambulatório', 'Clínica', 'Domiciliar'];
const hospitaisFixos = ['HGRS', 'HGE', 'HUPES'];
const unidadesPorHospital = {
  HGRS: ['UTI CIRÚRGICA', 'UTI CARDIOVASCULAR', 'UTI GERAL 1', 'UTI GERAL 2', 'UTI NEO', 'UTI PEDIÁTRICA'],
  HGE: ['EMERGÊNCIA', 'UTI ADULTO'],
  HUPES: ['CLÍNICA MÉDICA', 'CLÍNICA CIRÚRGICA']
};

let userId;

function criarSelectUnidades(hospital, selecionadas = []) {
  const div = document.createElement('div');
  const label = document.createElement('label');
  label.textContent = hospital;
  const select = document.createElement('select');
  select.multiple = true;
  select.dataset.hospital = hospital;

  (unidadesPorHospital[hospital] || []).forEach(unidade => {
    const option = document.createElement('option');
    option.value = unidade;
    option.textContent = unidade;
    if (selecionadas.includes(unidade)) option.selected = true;
    select.appendChild(option);
  });

  div.appendChild(label);
  div.appendChild(select);
  unidadesContainer.appendChild(div);
}

function preencherSelect(selectElement, valores, selecionados = []) {
  selectElement.innerHTML = '';
  valores.forEach(valor => {
    const option = document.createElement('option');
    option.value = valor;
    option.textContent = valor;
    if (selecionados.includes(valor)) option.selected = true;
    selectElement.appendChild(option);
  });
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    userId = user.uid;
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const config = userSnap.exists() ? (userSnap.data().config || {}) : {};

    preencherSelect(localAtendimentoSelect, locaisFixos, config.locaisAtendimento || []);
    preencherSelect(hospitaisSelect, hospitaisFixos, config.hospitais || []);

    unidadesContainer.innerHTML = '';
    hospitaisFixos.forEach(hospital => {
      const unidadesSelecionadas = config.unidades?.[hospital] || [];
      criarSelectUnidades(hospital, unidadesSelecionadas);
    });
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const locaisAtendimento = Array.from(localAtendimentoSelect.selectedOptions).map(opt => opt.value);
  const hospitais = Array.from(hospitaisSelect.selectedOptions).map(opt => opt.value);

  const selects = unidadesContainer.querySelectorAll('select');
  const unidades = {};
  selects.forEach(select => {
    const hospital = select.dataset.hospital;
    const selecionadas = Array.from(select.selectedOptions).map(opt => opt.value);
    if (selecionadas.length > 0) unidades[hospital] = selecionadas;
  });

  const userRef = doc(db, "users", userId);
  await setDoc(userRef, { config: { locaisAtendimento, hospitais, unidades } }, { merge: true });

  alert("Configurações salvas com sucesso!");
});
