
import { auth, db, doc, getDoc, setDoc } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const form = document.getElementById('configForm');
const localAtendimentoSelect = document.getElementById('localAtendimentoSelect');
const hospitaisSelect = document.getElementById('hospitaisSelect');
const unidadesSelect = document.getElementById('unidadesSelect');

let userId;

const locaisFixos = ['Hospital', 'Ambulatório', 'Clínica', 'Domiciliar'];
const hospitaisFixos = ['HGRS', 'HGE', 'HUPES'];
const unidadesPorHospital = {
  HGRS: ['UTI CIRÚRGICA', 'UTI CARDIOVASCULAR', 'UTI GERAL 1', 'UTI GERAL 2', 'UTI NEO', 'UTI PEDIÁTRICA'],
  HGE: ['EMERGÊNCIA', 'UTI ADULTO'],
  HUPES: ['CLÍNICA MÉDICA', 'CLÍNICA CIRÚRGICA']
};

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

function atualizarUnidadesSelecionadas() {
  const hospitaisSelecionados = Array.from(hospitaisSelect.selectedOptions).map(opt => opt.value);
  const unidadesDisponiveis = new Set();

  hospitaisSelecionados.forEach(hospital => {
    (unidadesPorHospital[hospital] || []).forEach(unidade => unidadesDisponiveis.add(unidade));
  });

  preencherSelect(unidadesSelect, Array.from(unidadesDisponiveis));
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    userId = user.uid;
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    let config = { locaisAtendimento: [], hospitais: [], unidades: [] };
    if (userSnap.exists()) config = userSnap.data().config || {};

    preencherSelect(localAtendimentoSelect, locaisFixos, config.locaisAtendimento || []);
    preencherSelect(hospitaisSelect, hospitaisFixos, config.hospitais || []);
    atualizarUnidadesSelecionadas();
    // re-seleciona unidades
    const options = unidadesSelect.options;
    for (let i = 0; i < options.length; i++) {
      if ((config.unidades || []).includes(options[i].value)) {
        options[i].selected = true;
      }
    }
  }
});

hospitaisSelect.addEventListener('change', atualizarUnidadesSelecionadas);

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const locaisAtendimento = Array.from(localAtendimentoSelect.selectedOptions).map(opt => opt.value);
  const hospitais = Array.from(hospitaisSelect.selectedOptions).map(opt => opt.value);
  const unidades = Array.from(unidadesSelect.selectedOptions).map(opt => opt.value);

  const userRef = doc(db, "users", userId);
  await setDoc(userRef, {
    config: {
      locaisAtendimento,
      hospitais,
      unidades
    }
  }, { merge: true });

  alert("Configurações salvas com sucesso!");
});
