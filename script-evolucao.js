// script-evolucao.js
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore, doc, setDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { app } from './firebase-config.js';

const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("btnSalvarEvolucao").addEventListener("click", async () => {
  const uid = auth.currentUser?.uid;
  if (!uid) return alert("Usuário não autenticado.");

  const hospital = sessionStorage.getItem("evolucao.hospital");
  const unidade = sessionStorage.getItem("evolucao.unidade");
  const leito = sessionStorage.getItem("evolucao.leito");
  const data = document.getElementById("dataEvolucao").value;

  if (!hospital || !unidade || !leito || !data) {
    alert("Informações do paciente ou data estão incompletas.");
    return;
  }

  const docRef = doc(db, "usuarios", uid, "hospitais", hospital, "unidades", unidade, "leitos", leito, "evolucoes", data);

  const dados = {
    tipo: document.getElementById("tipoDocumento")?.value || "",
    uti: document.getElementById("uti")?.value || "",
    turno: document.getElementById("turno")?.value || "",
    sexo: document.querySelector('input[name="sexo"]:checked')?.value || "",
    hda: document.getElementById("hdaTexto")?.value || "",
    posicaoLeito: document.getElementById("posicaoLeito")?.value || "",
    contencao: document.querySelector('input[name="contencao"]:checked')?.value || "",
    membrosContidos: {
      MMSS: document.querySelector('input[name="MMSS"]:checked')?.value || "",
      MMII: document.querySelector('input[name="MMII"]:checked')?.value || ""
    },
    avaliacaoDor: document.querySelector('input[name="avaliacaoDor"]:checked')?.value || "",
    eva: document.getElementById("evaValue")?.textContent || "",
    textoEvolucao: document.getElementById("textoEvolucao")?.value || "",
    // Adicione aqui todos os outros campos conforme necessidade...
  };

  try {
    await setDoc(docRef, dados, { merge: true });
    alert("Evolução salva com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar:", error);
    alert("Erro ao salvar evolução.");
  }
});
