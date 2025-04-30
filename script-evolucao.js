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
  return {
    tipoDocumento: document.getElementById("tipoDocumento")?.value || "",
    uti: document.getElementById("uti")?.value || "",
    dataEvolucao: document.getElementById("dataEvolucao")?.value || "",
    turno: document.getElementById("turno")?.value || "",
    sexo: document.querySelector('input[name="sexo"]:checked')?.value || "",
    fc: document.getElementById("fc")?.value || "",
    fr: document.getElementById("fr")?.value || "",
    spo2: document.getElementById("spo2")?.value || "",
    pa: document.getElementById("pa")?.value || "",
    temp: document.getElementById("temp")?.value || "",
    estadoComportamental: Array.from(document.querySelectorAll('input[name="estadoComportamental"]:checked')).map(cb => cb.value),
    glasgow: document.getElementById("glasgow")?.value || "",
    sedacao: document.querySelector('input[name="sedacao"]:checked')?.value || "",
    trabalhoRespiratorio: document.querySelector('input[name="trabalhoRespiratorio"]:checked')?.value || ""
  };
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

  document.getElementById("tipoDocumento").value = data.tipoDocumento || "";
  document.getElementById("uti").value = data.uti || "";
  document.getElementById("dataEvolucao").value = data.dataEvolucao || "";
  document.getElementById("turno").value = data.turno || "";
  if (data.sexo) {
    document.querySelector(`input[name="sexo"][value="${data.sexo}"]`)?.checked = true;
  }
  document.getElementById("fc").value = data.fc || "";
  document.getElementById("fr").value = data.fr || "";
  document.getElementById("spo2").value = data.spo2 || "";
  document.getElementById("pa").value = data.pa || "";
  document.getElementById("temp").value = data.temp || "";
  document.getElementById("glasgow").value = data.glasgow || "";

  if (data.estadoComportamental) {
    data.estadoComportamental.forEach(estado => {
      document.querySelector(`input[name="estadoComportamental"][value="${estado}"]`)?.checked = true;
    });
  }

  if (data.sedacao) {
    document.querySelector(`input[name="sedacao"][value="${data.sedacao}"]`)?.checked = true;
  }

  if (data.trabalhoRespiratorio) {
    document.querySelector(`input[name="trabalhoRespiratorio"][value="${data.trabalhoRespiratorio}"]`)?.checked = true;
  }
}