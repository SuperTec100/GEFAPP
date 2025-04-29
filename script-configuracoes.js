
import { auth, db, doc, getDoc, setDoc } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const form = document.getElementById('configForm');
const localAtendimentoSelect = document.getElementById('localAtendimentoSelect');
const hospitaisSelect = document.getElementById('hospitaisSelect');
const unidadesSelect = document.getElementById('unidadesSelect');

let userId;

// Listas fixas
const locaisFixos = ['Hospital', 'Ambulatório', 'Clínica', 'Domiciliar'];
const hospitaisFixos = ['HGRS', 'HGE', 'HUPES'];
const unidadesFixas = ['UTI CIRÚRGICA', 'UTI CARDIOVASCULAR', 'UTI GERAL 1', 'UTI GERAL 2', 'UTI NEO', 'UTI PEDIÁTRICA'];

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
    let config = { locaisAtendimento: [], hospitais: [], unidades: [] };
    if (userSnap.exists()) config = userSnap.data().config || {};

    preencherSelect(localAtendimentoSelect, locaisFixos, config.locaisAtendimento || []);
    preencherSelect(hospitaisSelect, hospitaisFixos, config.hospitais || []);
    preencherSelect(unidadesSelect, unidadesFixas, config.unidades || []);
  }
});

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
