
import { app } from "./firebase-config.js";
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { auth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const db = getFirestore(app);
const localSelect = document.getElementById('localAtendimento');
const hospitalSelect = document.getElementById('hospital');
const unidadeSelect = document.getElementById('unidade');
const listaPacientes = document.getElementById('listaPacientes');
const formEvolucaoContainer = document.getElementById('formEvolucao');
const evolucaoForm = document.getElementById('evolucaoForm');
const loadingScreen = document.getElementById('loadingScreen');
const mainContainer = document.querySelector('.container');

let pacienteSelecionado = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().config) {
        await carregarConfiguracoes(userDoc.data().config);
      } else {
        throw new Error("Configuração não encontrada. Configure seu perfil primeiro.");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      loadingScreen.style.display = "none";
      mainContainer.style.display = "block";
    }
  }
});

async function carregarConfiguracoes(config) {
  if (config.locaisAtendimento?.length) {
    localSelect.innerHTML = `<option selected>${config.locaisAtendimento[0]}</option>`;
  }
  if (config.hospitais?.length) {
    hospitalSelect.innerHTML = `<option selected>${config.hospitais[0]}</option>`;
  }
  if (config.unidades && config.hospitais[0]) {
    const unidades = config.unidades[config.hospitais[0]];
    unidadeSelect.innerHTML = unidades.map(u => `<option>${u}</option>`).join('');
    unidadeSelect.value = unidades[0];
    await carregarPacientes(hospitalSelect.value, unidadeSelect.value);
  }
}

async function carregarPacientes(hospital, unidade) {
  listaPacientes.innerHTML = "";
  const leitosRef = collection(db, "hospitais", hospital, "unidades", unidade, "leitos");
  const leitosSnap = await getDocs(leitosRef);

  if (leitosSnap.empty) {
    listaPacientes.innerHTML = "<p>Nenhum paciente encontrado nesta unidade.</p>";
    return;
  }

  leitosSnap.forEach((docSnap) => {
    const dados = docSnap.data();
    const div = document.createElement("div");
    div.className = "accordion";
    div.innerHTML = `<strong>Leito ${docSnap.id}</strong> - ${dados.nome || "Sem Nome"}`;
    div.onclick = () => selecionarPaciente(hospital, unidade, docSnap.id, dados);
    listaPacientes.appendChild(div);
  });
}

function selecionarPaciente(hospital, unidade, leito, dadosPaciente) {
  pacienteSelecionado = { hospital, unidade, leito };
  formEvolucaoContainer.classList.remove("hidden");

  if (dadosPaciente.evolucao) {
    Object.keys(dadosPaciente.evolucao).forEach(key => {
      const field = document.getElementById(key);
      if (field) field.value = dadosPaciente.evolucao[key];
    });
  }
}

evolucaoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!pacienteSelecionado) return alert("Selecione um paciente.");

  const evolucao = {};
  evolucaoForm.querySelectorAll("input, textarea").forEach(input => {
    evolucao[input.id] = input.value;
  });

  const docRef = doc(db, "hospitais", pacienteSelecionado.hospital, "unidades", pacienteSelecionado.unidade, "leitos", pacienteSelecionado.leito);
  await updateDoc(docRef, { evolucao });

  alert("Evolução salva com sucesso!");
});
