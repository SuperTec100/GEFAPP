// script-evolucao.js
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { app } from "./firebase-config.js";
import { aplicarLogicaCondicional } from "./exibicao-condicional.js";

const auth = getAuth(app);
const db = getFirestore(app);

function coletarDadosFormulario() {
  const dados = {};
  document.querySelectorAll("input, select, textarea").forEach(el => {
    if (!el.id && !el.name) return;
    const key = el.id || el.name;
    if (el.type === "radio") {
      if (el.checked) dados[key] = el.value;
    } else if (el.type === "checkbox") {
      if (!dados[key]) dados[key] = [];
      if (el.checked) dados[key].push(el.value);
    } else {
      dados[key] = el.value;
    }
  });
  return dados;
}

function preencherFormulario(dados) {
  document.querySelectorAll("input, select, textarea").forEach(el => {
    const key = el.id || el.name;
    if (!(key in dados)) return;
    if (el.type === "radio" || el.type === "checkbox") {
      el.checked = Array.isArray(dados[key])
        ? dados[key].includes(el.value)
        : dados[key] === el.value;
    } else {
      el.value = dados[key];
      if (el.type === "range") {
        const display = document.getElementById(el.id + "Value");
        if (display) display.textContent = dados[key];
      }
    }
  });
  aplicarLogicaCondicional();
}

async function salvarEvolucao() {
  const uid = auth.currentUser?.uid;
  if (!uid) return alert("Usuário não autenticado.");

  const hospital = sessionStorage.getItem("evolucao.hospital");
  const unidade = sessionStorage.getItem("evolucao.unidade");
  const leito = sessionStorage.getItem("evolucao.leito");
  const raw = document.getElementById("dataEvolucao")?.value;
  if (!hospital || !unidade || !leito || !raw) {
    alert("Hospital, unidade, leito ou data da evolução estão ausentes.");
    return;
  }

  // Converter DD/MM/AAAA → YYYY-MM-DD para usar como ID
  const [dia, mes, ano] = raw.split("/");
  const dataId = `${ano}-${mes}-${dia}`;

  const dados = coletarDadosFormulario();
  const ref = doc(
    db,
    "usuarios", uid,
    "hospitais", hospital,
    "unidades", unidade,
    "leitos", leito,
    "evolucoes", dataId
  );

  try {
    await setDoc(ref, dados, { merge: true });
    alert("Evolução salva com sucesso.");
  } catch (err) {
    console.error("Erro ao salvar evolução:", err);
    alert("Erro ao salvar evolução.");
  }
}

async function carregarEvolucao() {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const hospital = sessionStorage.getItem("evolucao.hospital");
  const unidade = sessionStorage.getItem("evolucao.unidade");
  const leito = sessionStorage.getItem("evolucao.leito");
  const raw = document.getElementById("dataEvolucao")?.value;
  if (!hospital || !unidade || !leito || !raw) return;

  const [dia, mes, ano] = raw.split("/");
  const dataId = `${ano}-${mes}-${dia}`;

  const ref = doc(
    db,
    "usuarios", uid,
    "hospitais", hospital,
    "unidades", unidade,
    "leitos", leito,
    "evolucoes", dataId
  );
  const snap = await getDoc(ref);
  if (snap.exists()) preencherFormulario(snap.data());
}

document.addEventListener("DOMContentLoaded", () => {
  // Preenche cabeçalhos de hospital/unidade/leito
  const hosp = sessionStorage.getItem("evolucao.hospital");
  const uni  = sessionStorage.getItem("evolucao.unidade");
  const lei  = sessionStorage.getItem("evolucao.leito");
  if (hosp && uni && lei) {
    document.getElementById("hospital").textContent = hosp;
    document.getElementById("unidade").textContent = uni;
    document.getElementById("leito").textContent   = lei;
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
  if (btn) btn.addEventListener("click", salvarEvolucao);
});
