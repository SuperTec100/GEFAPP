// script-evolucao.js
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { app } from './firebase-config.js';

const auth = getAuth(app);
const db = getFirestore(app);

// Coleta todos os dados do formulário
function coletarDadosFormulario() {
  const dados = {};
  const elementos = document.querySelectorAll("input, select, textarea");

  elementos.forEach(el => {
    if (!el.id && !el.name) return;

    const key = el.id || el.name;

    if (el.type === "radio") {
      if (el.checked) dados[key] = el.value;
    } else if (el.type === "checkbox") {
      if (!dados[key]) dados[key] = [];
      if (el.checked) dados[key].push(el.value);
    } else if (el.type === "range") {
      dados[key] = el.value;
    } else {
      dados[key] = el.value;
    }
  });

  return dados;
}

// Preenche o formulário com os dados carregados
function preencherFormulario(dados) {
  const elementos = document.querySelectorAll("input, select, textarea");

  elementos.forEach(el => {
    const key = el.id || el.name;
    if (!(key in dados)) return;

    if (el.type === "radio" || el.type === "checkbox") {
      if (Array.isArray(dados[key])) {
        el.checked = dados[key].includes(el.value);
      } else {
        el.checked = dados[key] === el.value;
      }
    } else if (el.type === "range") {
      el.value = dados[key];
      const display = document.getElementById(el.id + "Value");
      if (display) display.textContent = dados[key];
    } else {
      el.value = dados[key];
    }
  });
}

// Salva os dados no Firestore
async function salvarEvolucao() {
  const uid = auth.currentUser?.uid;
  if (!uid) return alert("Usuário não autenticado.");

  const hospital = sessionStorage.getItem("evolucao.hospital");
  const unidade = sessionStorage.getItem("evolucao.unidade");
  const leito = sessionStorage.getItem("evolucao.leito");
  const data = document.getElementById("dataEvolucao")?.value;

  if (!hospital || !unidade || !leito || !data) {
    alert("Hospital, unidade, leito ou data da evolução estão ausentes.");
    return;
  }

  const dados = coletarDadosFormulario();
  const ref = doc(db, "usuarios", uid, "hospitais", hospital, "unidades", unidade, "leitos", leito, "evolucoes", data);

  try {
    await setDoc(ref, dados, { merge: true });
    alert("Evolução salva com sucesso.");
  } catch (err) {
    console.error("Erro ao salvar evolução:", err);
    alert("Erro ao salvar evolução.");
  }
}

// Carrega os dados salvos, se existirem
async function carregarEvolucao() {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const hospital = sessionStorage.getItem("evolucao.hospital");
  const unidade = sessionStorage.getItem("evolucao.unidade");
  const leito = sessionStorage.getItem("evolucao.leito");
  const data = document.getElementById("dataEvolucao")?.value;

  if (!hospital || !unidade || !leito || !data) return;

  const ref = doc(db, "usuarios", uid, "hospitais", hospital, "unidades", unidade, "leitos", leito, "evolucoes", data);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    preencherFormulario(snap.data());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const hospital = sessionStorage.getItem("evolucao.hospital");
  const unidade = sessionStorage.getItem("evolucao.unidade");
  const leito = sessionStorage.getItem("evolucao.leito");

  if (hospital && unidade && leito) {
    document.getElementById("hospital").textContent = hospital;
    document.getElementById("unidade").textContent = unidade;
    document.getElementById("leito").textContent = leito;
  }

  onAuthStateChanged(auth, async user => {
    if (user) {
      const inputData = document.getElementById("dataEvolucao");
      if (inputData) {
        inputData.addEventListener("change", carregarEvolucao);
        if (inputData.value) await carregarEvolucao();
      }
    }
  });

  const btn = document.getElementById("btnSalvarEvolucao");
  if (btn) {
    btn.addEventListener("click", salvarEvolucao);
  }
});
