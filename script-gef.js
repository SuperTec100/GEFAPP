
// Código omitido exceto pela função carregarPacientes

async function carregarPacientes() {
  listaPacientes.innerHTML = '';
  leitosContainer.style.display = 'none';

  const hospital = hospitalSelect.value;
  const unidade = unidadeSelect.value;

  const leitosRef = collection(db, "usuarios", auth.currentUser.uid, "hospitais", hospital, "unidades", unidade, "leitos");
  const leitosSnap = await getDocs(leitosRef);

  if (leitosSnap.empty) {
    listaPacientes.innerHTML = '<li style="color:#777">Nenhum paciente cadastrado.</li>';
  } else {
    leitosSnap.forEach(docSnap => {
      const leito = docSnap.id;
      const nome = docSnap.data().nome;

      const li = document.createElement('li');
      li.innerHTML = `
        <strong>Leito ${leito}</strong> - ${nome}
        <button class="botao-acao botao-excluir" onclick="excluirPaciente('${hospital}', '${unidade}', '${leito}')">🗑️ Excluir</button>
        <button class="botao-acao botao-evoluir" onclick="gerarEvolucao('${hospital}', '${unidade}', '${leito}', '${nome}')">📝 Evoluir</button>
        <button class="botao-acao botao-relatorio" onclick="gerarRelatorio('${hospital}', '${unidade}', '${leito}', '${nome}')">📄 Relatório</button>
        <button class="botao-acao botao-prescrever" onclick="prescreverExercicio('${hospital}', '${unidade}', '${leito}', '${nome}')">💊 Prescrever</button>
      `;
      listaPacientes.appendChild(li);
    });
  }

  leitosContainer.style.display = 'block';
}
