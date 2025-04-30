if (typeof onAuthStateChanged === "undefined") {
  import('https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js').then(({ onAuthStateChanged }) => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        alert("Você precisa estar logado.");
        window.location.href = "index.html";
        return;
      }
      console.log("✅ Usuário autenticado:", user.uid);
      document.addEventListener("DOMContentLoaded", () => {
        carregarPacientes();
      });
    });
  });
} else {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      alert("Você precisa estar logado.");
      window.location.href = "index.html";
      return;
    }
    console.log("✅ Usuário autenticado:", user.uid);
    document.addEventListener("DOMContentLoaded", () => {
      carregarPacientes();
    });
  });
}

import { auth, db, doc, getDocs, setDoc, deleteDoc, collection } from './firebase-config.js';

const hospitalSelect = document.getElementById('hospital');
const unidadeSelect = document.getElementById('unidade');
const leitosContainer = document.getElementById('leitosContainer');
const listaPacientes = document.getElementById('listaPacientes');

// Salvar paciente
document.addEventListener('DOMContentLoaded', () => {
  const btnSalvar = document.getElementById('btnSalvarPaciente');
  if (btnSalvar) {
    btnSalvar.addEventListener('click', async () => {
      const leito = document.getElementById('leitoPaciente').value.trim();
      const nome = document.getElementById('nomePaciente').value.trim();
      const hospital = hospitalSelect.value;
      const unidade = unidadeSelect.value;

      if (!leito || !nome || !hospital || !unidade) {
        alert("Preencha todos os campos obrigatórios.");
        return;
      }

      try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");

        const pacienteRef = doc(db, "users", user.uid, "pacientes", `${hospital}_${unidade}_${leito}`);
        await setDoc(pacienteRef, {
          nome,
          leito,
          hospital,
          unidade,
          criadoEm: new Date().toISOString()
        });

        alert("Paciente salvo com sucesso!");
        document.getElementById('cadastroPaciente').style.display = 'none';
        document.getElementById('leitoPaciente').value = '';
        document.getElementById('nomePaciente').value = '';
        carregarPacientes();
      } catch (error) {
        console.error("Erro ao salvar paciente:", error);
        alert("Erro ao salvar paciente. Veja o console.");
      }
    });
  }
});

// Carregar pacientes
async function carregarPacientes() {
  listaPacientes.innerHTML = '';
  leitosContainer.style.display = 'block';

  const hospital = hospitalSelect.value;
  const unidade = unidadeSelect.value;
  const user = auth.currentUser;
  if (!hospital || !unidade || !user) return;

  const pacientesRef = collection(db, "users", user.uid, "pacientes");
  const pacientesSnap = await getDocs(pacientesRef);

  const pacientesFiltrados = pacientesSnap.docs.filter(doc => {
    const data = doc.data();
    return data.hospital === hospital && data.unidade === unidade;
  });

  if (pacientesFiltrados.length === 0) {
    listaPacientes.innerHTML = "<li>Nenhum paciente cadastrado</li>";
    return;
  }

  pacientesFiltrados.forEach(docSnap => {
    const dados = docSnap.data();
    const nome = dados.nome || 'Sem nome';
    const leito = dados.leito || 'Sem leito';
    const li = document.createElement('li');
    li.className = 'paciente-item';
    li.innerHTML = \`
      <div class="info-paciente"><strong>Leito \${leito}</strong>: \${nome}</div>
      <div class="actions">
        <button class="btn-evolucao" data-leito="\${leito}">Gerar Evolução</button>
        <button class="btn-excluir" data-id="\${docSnap.id}"><i class="fas fa-trash"></i></button>
      </div>
    \`;
    listaPacientes.appendChild(li);
  });
}

// Excluir paciente
listaPacientes.addEventListener('click', async (e) => {
  const excluirBtn = e.target.closest('.btn-excluir');
  if (excluirBtn) {
    const pacienteId = excluirBtn.dataset.id;
    const user = auth.currentUser;
    if (!user || !pacienteId) return;
    if (confirm("Deseja realmente remover este paciente?")) {
      await deleteDoc(doc(db, "users", user.uid, "pacientes", pacienteId));
      excluirBtn.closest('li').remove();
    }
  }

  const evolucaoBtn = e.target.closest('.btn-evolucao');
  if (evolucaoBtn) {
    const leito = evolucaoBtn.dataset.leito;
    const hospital = hospitalSelect.value;
    const unidade = unidadeSelect.value;
    sessionStorage.setItem('evolucao.leito', leito);
    sessionStorage.setItem('evolucao.hospital', hospital);
    sessionStorage.setItem('evolucao.unidade', unidade);
    document.getElementById('gefContent').style.display = 'none';
    window.location.href = 'evolucao.html';
  }
});