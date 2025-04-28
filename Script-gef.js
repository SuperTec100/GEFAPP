
import { app } from "./firebase-config.js";
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const db = getFirestore(app);

window.carregarHospitais = function () {
  const local = document.getElementById("localAtendimento").value;
  document.getElementById("hospitalContainer").style.display = local === "Hospital" ? "block" : "none";
  document.getElementById("unidadeContainer").style.display = "none";
  document.getElementById("leitosContainer").style.display = "none";
};

window.carregarUnidades = function () {
  document.getElementById("unidadeContainer").style.display = "block";
  const unidade = document.getElementById("unidade");
  unidade.innerHTML = `
    <option value="" disabled selected>Selecione</option>
    <option value="UTI GERAL 1">UTI GERAL 1</option>
    <option value="UTI GERAL 2">UTI GERAL 2</option>
    <option value="Enfermaria">Enfermaria</option>
  `;
  document.getElementById("leitosContainer").style.display = "none";
};

window.carregarLeitos = async function () {
  const hospital = document.getElementById("hospital").value;
  const unidade = document.getElementById("unidade").value;
  const lista = document.getElementById("listaPacientes");
  lista.innerHTML = "";
  document.getElementById("leitosContainer").style.display = "block";

  try {
    const leitosRef = collection(db, "hospitais", hospital, "unidades", unidade, "leitos");
    const leitosSnap = await getDocs(leitosRef);

    if (leitosSnap.empty) {
      lista.innerHTML = "<li>Nenhum paciente cadastrado nesta unidade</li>";
      return;
    }

    leitosSnap.forEach((docSnap) => {
      const dados = docSnap.data();
      const li = document.createElement("li");
      li.innerHTML = `
        <span><strong>Leito ${docSnap.id}</strong>: ${dados.nome || 'Sem nome'}</span>
        <div>
          <button class="selecionar" onclick="carregarEvolucao('${hospital}', '${unidade}', '${docSnap.id}')"><i class="fas fa-edit"></i> Editar</button>
          <button class="excluir" onclick="removerPaciente('${hospital}', '${unidade}', '${docSnap.id}')"><i class="fas fa-trash"></i> Excluir</button>
        </div>
      `;
      lista.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao carregar leitos:", error);
    lista.innerHTML = "<li>Erro ao carregar pacientes</li>";
  }
};

window.mostrarCadastroPaciente = function () {
  document.getElementById("cadastroPaciente").style.display = "block";
};

window.cadastrarPaciente = async function () {
  const hospital = document.getElementById("hospital").value;
  const unidade = document.getElementById("unidade").value;
  const leito = document.getElementById("leitoPaciente").value;
  const nome = document.getElementById("nomePaciente").value;

  if (!leito || !nome) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    const docRef = doc(db, "hospitais", hospital, "unidades", unidade, "leitos", leito);
    await setDoc(docRef, { nome, evolucao: {} });
    alert("Paciente cadastrado.");
    document.getElementById("cadastroPaciente").style.display = "none";
    carregarLeitos();
  } catch (error) {
    console.error("Erro ao cadastrar paciente:", error);
    alert("Erro ao cadastrar paciente.");
  }
};

window.removerPaciente = async function (hospital, unidade, leito) {
  if (!confirm("Deseja remover este paciente?")) return;
  try {
    const docRef = doc(db, "hospitais", hospital, "unidades", unidade, "leitos", leito);
    await deleteDoc(docRef);
    carregarLeitos();
  } catch (error) {
    console.error("Erro ao remover paciente:", error);
    alert("Erro ao remover paciente.");
  }
};

window.carregarEvolucao = async function (hospital, unidade, leito) {
  const form = document.getElementById("formEvolucao");
  if (!form) return;

  try {
    const docRef = doc(db, "hospitais", hospital, "unidades", unidade, "leitos", leito);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const dados = snap.data();
      sessionStorage.setItem("pacienteSelecionado", JSON.stringify({ hospital, unidade, leito }));
      if (dados.evolucao && typeof dados.evolucao === 'object') {
        for (const [id, value] of Object.entries(dados.evolucao)) {
          const input = document.getElementById(id);
          if (input) input.value = value;
        }
      }
      form.style.display = 'block';
    } else {
      alert("Paciente não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao carregar evolução:", error);
    alert("Erro ao carregar evolução.");
  }
};

document.getElementById("formEvolucao")?.addEventListener("submit", async function (e) {
  e.preventDefault();
  const dados = JSON.parse(sessionStorage.getItem("pacienteSelecionado"));

  if (!dados) {
    alert("Selecione um paciente antes de salvar.");
    return;
  }

  const campos = this.querySelectorAll("input, textarea, select");
  const evolucao = {};
  campos.forEach(el => {
    if (el.id) evolucao[el.id] = el.value;
  });

  try {
    const docRef = doc(db, "hospitais", dados.hospital, "unidades", dados.unidade, "leitos", dados.leito);
    await updateDoc(docRef, { evolucao });
    alert("Evolução salva com sucesso.");
  } catch (error) {
    console.error("Erro ao salvar evolução:", error);
    alert("Erro ao salvar evolução.");
  }
});
