// script-gef.js import { app } from "./firebase-config.js"; import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const db = getFirestore(app);

window.carregarHospitais = function () { const local = document.getElementById("localAtendimento").value; document.getElementById("hospitalContainer").style.display = local === "Hospital" ? "block" : "none"; document.getElementById("unidadeContainer").style.display = "none"; document.getElementById("leitosContainer").style.display = "none"; };

window.carregarUnidades = function () { document.getElementById("unidadeContainer").style.display = "block"; const unidade = document.getElementById("unidade"); unidade.innerHTML = <option value="" disabled selected>Selecione</option> <option value="UTI Geral 1">UTI Geral 1</option> <option value="UTI Geral 2">UTI Geral 2</option> <option value="UTI Cardiológica">UTI Cardiológica</option>; document.getElementById("leitosContainer").style.display = "none"; };

window.carregarLeitos = async function () { const hospital = document.getElementById("hospital").value; const unidade = document.getElementById("unidade").value; const lista = document.getElementById("listaLeitos"); lista.innerHTML = ""; document.getElementById("leitosContainer").style.display = "block";

const leitosRef = collection(db, "hospitais", hospital, "unidades", unidade, "leitos"); const leitosSnap = await getDocs(leitosRef);

leitosSnap.forEach((docSnap) => { const dados = docSnap.data(); const li = document.createElement("li"); li.innerHTML = <strong>${docSnap.id}</strong>: ${dados.nome} <button onclick=\"carregarEvolucao('${hospital}', '${unidade}', '${docSnap.id}')\">Selecionar</button> <button onclick=\"removerPaciente('${hospital}', '${unidade}', '${docSnap.id}')\">Excluir</button>; lista.appendChild(li); }); };

window.mostrarCadastroPaciente = function () { document.getElementById("cadastroPaciente").style.display = "block"; };

window.cadastrarPaciente = async function () { const hospital = document.getElementById("hospital").value; const unidade = document.getElementById("unidade").value; const leito = document.getElementById("leitoPaciente").value; const nome = document.getElementById("nomePaciente").value;

if (!leito || !nome) { alert("Preencha todos os campos."); return; }

const docRef = doc(db, "hospitais", hospital, "unidades", unidade, "leitos", leito); await setDoc(docRef, { nome, evolucao: {} });

alert("Paciente cadastrado."); document.getElementById("cadastroPaciente").style.display = "none"; carregarLeitos(); };

window.removerPaciente = async function (hospital, unidade, leito) { const confirmacao = confirm("Deseja remover este paciente?"); if (!confirmacao) return; const docRef = doc(db, "hospitais", hospital, "unidades", unidade, "leitos", leito); await deleteDoc(docRef); carregarLeitos(); };

window.carregarEvolucao = async function (hospital, unidade, leito) { const docRef = doc(db, "hospitais", hospital, "unidades", unidade, "leitos", leito); const snap = await getDoc(docRef);

if (snap.exists()) { const dados = snap.data(); sessionStorage.setItem("pacienteSelecionado", JSON.stringify({ hospital, unidade, leito })); if (dados.evolucao && typeof dados.evolucao === 'object') { for (const [id, value] of Object.entries(dados.evolucao)) { const input = document.getElementById(id); if (input) input.value = value; } } } else { alert("Paciente não encontrado."); } };

const form = document.getElementById("formEvolucao"); if (form) { form.addEventListener("submit", async function (e) { e.preventDefault(); const dados = JSON.parse(sessionStorage.getItem("pacienteSelecionado"));

if (!dados) {
  alert("Selecione um paciente antes de salvar a evolução.");
  return;
}

const campos = form.querySelectorAll("input, textarea, select");
const evolucao = {};
campos.forEach(el => {
  if (el.id) evolucao[el.id] = el.value;
});

const docRef = doc(db, "hospitais", dados.hospital, "unidades", dados.unidade, "leitos", dados.leito);
await updateDoc(docRef, { evolucao });
alert("Evolução salva com sucesso.");

}); }

