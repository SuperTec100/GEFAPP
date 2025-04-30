import { auth, db } from './firebase-config.js';
import {
  doc, getDoc, setDoc, deleteDoc
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

  const btnExcluir = document.getElementById("btnExcluirPaciente");
  if (btnExcluir) {
    btnExcluir.addEventListener("click", excluirPaciente);
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

async function excluirPaciente() {
  const hospital = sessionStorage.getItem("evolucao.hospital");
  const unidade = sessionStorage.getItem("evolucao.unidade");
  const leito = sessionStorage.getItem("evolucao.leito");

  if (!hospital || !unidade || !leito || !currentUser) {
    mostrarMensagem("Informações do paciente não disponíveis.", false);
    return;
  }

  if (!confirm(`Tem certeza que deseja excluir o paciente do leito ${leito}?`)) return;

  try {
    const docRef = doc(db, "users", currentUser.uid, "pacientes", `${hospital}_${unidade}_${leito}`);
    await deleteDoc(docRef);
    mostrarMensagem("Paciente excluído com sucesso!");
    window.location.href = "dashboard.html";
  } catch (e) {
    console.error("Erro ao excluir paciente:", e);
    mostrarMensagem("Erro ao excluir paciente.", false);
  }
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

  for (const key in data) {
    const value = data[key];

    if (document.getElementById(key)) {
      document.getElementById(key).value = value;
    }

    if (typeof value === "string") {
      const radio = document.querySelector(`input[name="${key}"][value="${value}"]`);
      if (radio) radio.checked = true;
    }

    if (Array.isArray(value)) {
      value.forEach(v => {
        const checkbox = document.querySelector(`input[name="${key}"][value="${v}"]`);
        if (checkbox) checkbox.checked = true;
      });
    }

    if (typeof value === "boolean") {
      const checkbox = document.querySelector(`input[name="${key}"]`);
      if (checkbox) checkbox.checked = value;
    }

    const select = document.querySelector(`select[name="${key}"]`);
    if (select) select.value = value;
  }
}

function coletarCampos() {
  return {
    glasgow: document.getElementById("glasgow")?.value || "",
    sedacao: document.querySelector('input[name="sedacao"]:checked')?.value || "",
    trabalhoRespiratorio: document.querySelector('input[name="trabalhoRespiratorio"]:checked')?.value || ""
  };
}

function pegarValor(id) {
  return document.getElementById(id)?.value || "";
}

function pegarRadio(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value || "";
}

function pegarCheckboxes(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(cb => cb.value);
}

function pegarCheckboxSimples(name) {
  const el = document.querySelector(`input[name="${name}"]`);
  return el ? el.checked : false;
}

function pegarSelect(name) {
  return document.querySelector(`select[name="${name}"]`)?.value || "";
}
