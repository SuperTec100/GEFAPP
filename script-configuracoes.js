
import { auth, db, doc, getDoc, setDoc } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const form = document.getElementById('configForm');
const localAtendimentoSelect = document.getElementById('localAtendimentoSelect');
const hospitaisSelect = document.getElementById('hospitaisSelect');
const unidadesTextarea = document.getElementById('unidadesTextarea');

let userId;

function preencherSelect(selectElement, valores) {
  selectElement.innerHTML = '';
  valores.forEach(valor => {
    const option = document.createElement('option');
    option.value = valor;
    option.textContent = valor;
    option.selected = true;
    selectElement.appendChild(option);
  });
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    userId = user.uid;
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const config = userSnap.data().config || {};

      if (Array.isArray(config.locaisAtendimento)) {
        preencherSelect(localAtendimentoSelect, config.locaisAtendimento);
        document.getElementById('panel-hospitais').classList.remove('hidden');
      }

      if (Array.isArray(config.hospitais)) {
        preencherSelect(hospitaisSelect, config.hospitais);
        document.getElementById('panel-unidades').classList.remove('hidden');
      }

      if (config.unidades) {
        let unidadesTexto = '';
        for (const [hospital, unidades] of Object.entries(config.unidades)) {
          unidadesTexto += `${hospital}: ${unidades.join(';')}` + '\n';
        }
        unidadesTextarea.value = unidadesTexto.trim();
      }
    }
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const locaisAtendimento = Array.from(localAtendimentoSelect.selectedOptions).map(opt => opt.value);
  const hospitais = Array.from(hospitaisSelect.selectedOptions).map(opt => opt.value);
  const unidadesTexto = unidadesTextarea.value.trim().split('\n');

  const unidades = {};
  unidadesTexto.forEach(linha => {
    const [hospital, unidadesStr] = linha.split(':');
    if (hospital && unidadesStr) {
      unidades[hospital.trim()] = unidadesStr.split(';').map(u => u.trim()).filter(Boolean);
    }
  });

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
