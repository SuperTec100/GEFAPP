
import { auth, db, doc, getDoc, setDoc } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const locaisFixos = ['Hospital', 'Ambulatório', 'Clínica', 'Domiciliar'];
const hospitaisFixos = ['HGRS', 'HGE', 'HUPES'];
const unidadesPorHospital = {
  HGRS: ['UTI CIRÚRGICA', 'UTI CARDIOVASCULAR', 'UTI GERAL 1', 'UTI GERAL 2', 'UTI NEO', 'UTI PEDIÁTRICA'],
  HGE: ['EMERGÊNCIA', 'UTI ADULTO'],
  HUPES: ['CLÍNICA MÉDICA', 'CLÍNICA CIRÚRGICA']
};

const locaisContainer = document.getElementById('locaisCheckboxes');
const hospitaisContainer = document.getElementById('hospitaisCheckboxes');
const unidadesContainer = document.getElementById('unidadesCheckboxes');
const form = document.getElementById('configForm');

let userId;

function criarCheckbox(nome, idBase, checked = false) {
  const label = document.createElement('label');
  label.className = 'checkbox-item';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.name = idBase;
  checkbox.value = nome;
  if (checked) checkbox.checked = true;
  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(' ' + nome));
  return label;
}

function renderCheckboxes(container, lista, selecionados, name) {
  container.innerHTML = '';
  lista.forEach(item => {
    const cb = criarCheckbox(item, name, selecionados.includes(item));
    container.appendChild(cb);
  });
}

function renderUnidadesCheckboxes(config) {
  unidadesContainer.innerHTML = '';
  Object.entries(unidadesPorHospital).forEach(([hospital, unidades]) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'unidade-group';
    const title = document.createElement('h4');
    title.textContent = hospital;
    wrapper.appendChild(title);

    unidades.forEach(unidade => {
      const selecionados = config.unidades?.[hospital] || [];
      const cb = criarCheckbox(unidade, `unidade-${hospital}`, selecionados.includes(unidade));
      wrapper.appendChild(cb);
    });

    unidadesContainer.appendChild(wrapper);
  });
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    userId = user.uid;
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    const config = snap.exists() ? (snap.data().config || {}) : {};
    renderCheckboxes(locaisContainer, locaisFixos, config.locaisAtendimento || [], 'local');
    renderCheckboxes(hospitaisContainer, hospitaisFixos, config.hospitais || [], 'hospital');
    renderUnidadesCheckboxes(config);
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const locaisAtendimento = Array.from(document.querySelectorAll('input[name="local"]:checked')).map(i => i.value);
  const hospitais = Array.from(document.querySelectorAll('input[name="hospital"]:checked')).map(i => i.value);
  const unidades = {};

  hospitais.forEach(hospital => {
    const selecionadas = Array.from(document.querySelectorAll(`input[name="unidade-${hospital}"]:checked`)).map(i => i.value);
    if (selecionadas.length > 0) unidades[hospital] = selecionadas;
  });

  await setDoc(doc(db, "users", userId), {
    config: { locaisAtendimento, hospitais, unidades }
  }, { merge: true });

  alert("Configurações salvas com sucesso!");
});
