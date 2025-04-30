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

const btnSalvar = document.getElementById("btnSalvarEvolucao");

btnSalvar?.addEventListener("click", async () => {
  const hospital = sessionStorage.getItem("evolucao.hospital");
  const unidade = sessionStorage.getItem("evolucao.unidade");
  const leito = sessionStorage.getItem("evolucao.leito");

  if (!hospital || !unidade || !leito) {
    alert("Hospital, unidade ou leito não selecionados.");
    return;
  }

  const docRef = doc(db, "users", currentUser.uid, "pacientes", `${hospital}_${unidade}_${leito}`);

  const dados = coletarCampos();

  try {
    await setDoc(docRef, {
      hospital, unidade, leito,
      ...dados
    });

    alert("Evolução salva com sucesso!");
  } catch (e) {
    console.error("Erro ao salvar:", e);
    alert("Erro ao salvar evolução.");
  }
});

function coletarCampos() {
  return {
    tipoDocumento: document.getElementById("tipoDocumento").value,
    uti: document.getElementById("uti").value,
    dataEvolucao: document.getElementById("dataEvolucao").value,
    turno: document.getElementById("turno").value,
    sexo: document.querySelector('input[name="sexo"]:checked')?.value,
    fc: document.getElementById("fc").value,
    fr: document.getElementById("fr").value,
    spo2: document.getElementById("spo2").value,
    pa: document.getElementById("pa").value,
    temp: document.getElementById("temp").value,
    estadoComportamental: Array.from(document.querySelectorAll('input[name="estadoComportamental"]:checked')).map(cb => cb.value),
    glasgow: document.getElementById("glasgow").value,
    sedacao: document.querySelector('input[name="sedacao"]:checked')?.value,
    trabalhoRespiratorio: document.querySelector('input[name="trabalhoRespiratorio"]:checked')?.value
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