import { auth, db } from './firebase-config.js';
import {
  doc, getDoc, setDoc
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

let currentUser;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Usuário não autenticado.");
    window.location.href = "index.html";
    return;
  }

  currentUser = user;
  await carregarDadosSalvos();
});

document.addEventListener("DOMContentLoaded", () => {
  const btnSalvar = document.getElementById("btnSalvarEvolucao");
  if (btnSalvar) {
    btnSalvar.addEventListener("click", salvarEvolucao);
  }

  const msg = document.createElement("div");
  msg.id = "mensagemStatus";
  msg.style.position = "fixed";
  msg.style.bottom = "20px";
  msg.style.right = "20px";
  msg.style.padding = "10px 15px";
  msg.style.borderRadius = "6px";
  msg.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
  msg.style.display = "none";
  msg.style.zIndex = "9999";
  document.body.appendChild(msg);
});

function mostrarMensagem(texto, sucesso = true) {
  const msg = document.getElementById("mensagemStatus");
  msg.textContent = texto;
  msg.style.backgroundColor = sucesso ? "#2ecc71" : "#e74c3c";
  msg.style.color = "#fff";
  msg.style.display = "block";
  setTimeout(() => {
    msg.style.display = "none";
  }, 3000);
}

async function salvarEvolucao() {
  const hospital = sessionStorage.getItem("evolucao.hospital");
  const unidade = sessionStorage.getItem("evolucao.unidade");
  const leito = sessionStorage.getItem("evolucao.leito");

  if (!hospital || !unidade || !leito) {
    mostrarMensagem("Hospital, unidade ou leito não selecionados!", false);
    return;
  }

  const docRef = doc(db, "users", currentUser.uid, "pacientes", `${hospital}_${unidade}_${leito}`);
  const dados = coletarCampos();

  try {
    await setDoc(docRef, {
      hospital, unidade, leito,
      ...dados
    });

    mostrarMensagem("Evolução salva com sucesso!");
  } catch (e) {
    console.error("Erro ao salvar:", e);
    mostrarMensagem("Erro ao salvar evolução!", false);
  }
}

function coletarCampos() {
  const data = {};

  // Inputs tipo texto, número, select e range com ID
  document.querySelectorAll("input[id], select[id], textarea[id]").forEach(el => {
    if (el.type === "checkbox" || el.type === "radio") return;
    data[el.id] = el.value || "";
  });

  // Radio buttons (por name)
  document.querySelectorAll("input[type='radio']").forEach(radio => {
    if (radio.checked) data[radio.name] = radio.value;
  });

  // Checkbox com name[] agrupado
  const checkboxesAgrupados = {};
  document.querySelectorAll("input[type='checkbox']").forEach(cb => {
    if (cb.name) {
      if (!checkboxesAgrupados[cb.name]) checkboxesAgrupados[cb.name] = [];
      if (cb.checked) checkboxesAgrupados[cb.name].push(cb.value);
    }
  });

  Object.assign(data, checkboxesAgrupados);

  // Campos ADM e Amputações com select
  document.querySelectorAll("select[name]").forEach(sel => {
    data[sel.name] = sel.value;
  });

  return data;
}

async function carregarDadosSalvos() {
  const hospital = sessionStorage.getItem("evolucao.hospital");
  const unidade = sessionStorage.getItem("evolucao.unidade");
  const leito = sessionStorage.getItem("evolucao.leito");

  if (!hospital || !unidade || !leito) return;

  const docRef = doc(db, "users", currentUser.uid, "pacientes", `${hospital}_${unidade}_${leito}`);
  const snap = await getDoc(docRef);

  if (!snap.exists()) return;

  const data = snap.data();

  // Inputs, textareas e selects por ID
  Object.keys(data).forEach(key => {
    const el = document.getElementById(key);
    if (el) {
      if (el.type === "range" || el.type === "number" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.type === "text") {
        el.value = data[key];
        if (el.id === "eva" && document.getElementById("evaValue")) {
          document.getElementById("evaValue").textContent = el.value;
        }
      }
    }
  });

  // Radios
  Object.keys(data).forEach(name => {
    const val = data[name];
    const radio = document.querySelector(`input[type="radio"][name="${name}"][value="${val}"]`);
    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(new Event("click"));
    }
  });

  // Checkboxes múltiplos
  Object.keys(data).forEach(name => {
    if (Array.isArray(data[name])) {
      data[name].forEach(val => {
        const checkbox = document.querySelector(`input[type="checkbox"][name="${name}"][value="${val}"]`);
        if (checkbox) checkbox.checked = true;
      });
    }
  });

  // Selects com name
  document.querySelectorAll("select[name]").forEach(sel => {
    const val = data[sel.name];
    if (val) sel.value = val;
  });
}
