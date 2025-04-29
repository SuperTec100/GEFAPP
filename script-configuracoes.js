
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

let userId, config = {};

function criarCheckbox(nome, grupo, checked = false) {
  const label = document.createElement('label');
  label.className = 'checkbox-item';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.name = grupo;
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

function atualizarUnidades() {
  const hospitaisSelecionados = Array.from(document.querySelectorAll('input[name="hospital"]:checked')).map(cb => cb.value);
  unidadesContainer.innerHTML = '';

  hospitaisSelecionados.forEach(hospital => {
    const grupo = document.createElement('div');
    grupo.className = 'unidade-group';

    const titulo = document.createElement('h4');
    titulo.textContent = hospital;
    grupo.appendChild(titulo);

    (unidadesPorHospital[hospital] || []).forEach(unidade => {
      const selecionadas = config.unidades?.[hospital] || [];
      const cb = criarCheckbox(unidade, `unidade-${hospital}`, selecionadas.includes(unidade));
      grupo.appendChild(cb);
    });

    unidadesContainer.appendChild(grupo);
  });
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    userId = user.uid;
    const snap = await getDoc(doc(db, "users", userId));
    config = snap.exists() ? (snap.data().config || {}) : {};
    renderCheckboxes(locaisContainer, locaisFixos, config.locaisAtendimento || [], 'local');
    renderCheckboxes(hospitaisContainer, hospitaisFixos, config.hospitais || [], 'hospital');
    atualizarUnidades();
  }
});

hospitaisContainer.addEventListener('change', atualizarUnidades);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const locaisAtendimento = Array.from(document.querySelectorAll('input[name="local"]:checked')).map(i => i.value);
  const hospitais = Array.from(document.querySelectorAll('input[name="hospital"]:checked')).map(i => i.value);
  const unidades = {};

  hospitais.forEach(hospital => {
    const selecionadas = Array.from(document.querySelectorAll(`input[name="unidade-${hospital}"]:checked`)).map(i => i.value);
    if (selecionadas.length > 0) unidades[hospital] = selecionadas;
  });

  await setDoc(doc(db, "users", userId), { config: { locaisAtendimento, hospitais, unidades } }, { merge: true });
  alert("Configurações salvas com sucesso!");
});
