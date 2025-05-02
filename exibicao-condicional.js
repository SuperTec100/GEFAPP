// exibicao-condicional.js

function mostrarOpcoesContencao() {
  const sim = document.querySelector('input[name="contencao"][value="Sim"]');
  const container = document.getElementById("opcoesContencao");
  container.style.display = sim?.checked ? "block" : "none";
}

function mostrarEscalaEVA() {
  const sim = document.querySelector('input[name="avaliacaoDor"][value="Sim"]');
  const container = document.getElementById("escalaEVAContainer");
  container.style.display = sim?.checked ? "block" : "none";
}

function mostrarOpcoesSedacao() {
  const sim = document.querySelector('input[name="sedacao"][value="Sim"]');
  const container = document.getElementById("opcoesSedacao");
  container.style.display = sim?.checked ? "block" : "none";
}

function mostrarDrogas() {
  const sim = document.querySelector('input[name="drogasVasoativas"][value="com uso de drogas vasoativas"]');
  const container = document.getElementById("opcoesDrogas");
  container.style.display = sim?.checked ? "block" : "none";
}

function atualizarOpcoesRespiratorias() {
  const tipo = document.getElementById("sistemaRespiratorio")?.value;
  const viaAerea = document.getElementById("viaAereaOptions");
  const params = document.getElementById("ventilationParams");

  if (!tipo || !viaAerea || !params) return;

  if (tipo === "VM") {
    viaAerea.style.display = "block";
    params.style.display = "block";
  } else if (tipo === "vni") {
    viaAerea.style.display = "none";
    params.style.display = "block";
  } else {
    viaAerea.style.display = "none";
    params.style.display = "none";
  }
}

function mostrarCamposHGA() {
  const sim = document.querySelector('input[name="hga"][value="Com HGA"]');
  const container = document.getElementById("camposHGA");
  container.style.display = sim?.checked ? "block" : "none";
}

function aplicarLogicaCondicional() {
  mostrarOpcoesContencao();
  mostrarEscalaEVA();
  mostrarOpcoesSedacao();
  mostrarDrogas();
  atualizarOpcoesRespiratorias();
  mostrarCamposHGA();
}

function mostrarCuffOptions() {
  const via = document.querySelector('input[name="viaAerea"]:checked');
  const cuff = document.getElementById("cuffOptions");
  if (via?.value === "TOT") {
    cuff.style.display = "block";
    document.getElementById("opcoesTQT").style.display = "none";
  } else if (via?.value === "TQT") {
    document.getElementById("opcoesTQT").style.display = "block";
    cuff.style.display = "block";
  } else {
    cuff.style.display = "none";
    document.getElementById("opcoesTQT").style.display = "none";
  }
}

function mostrarOpcoesTQT() {
  document.getElementById("opcoesTQT").style.display = "block";
  document.getElementById("cuffOptions").style.display = "block";
}

function mostrarPressaoCuff() {
  document.getElementById("pressaoCuff").style.display = "block";
}

function esconderPressaoCuff() {
  document.getElementById("pressaoCuff").style.display = "none";
}

function mostrarMecanicaPulmonar() {
  document.getElementById("detalhesMecanicaPulmonar").style.display = "block";
}

function esconderMecanicaPulmonar() {
  document.getElementById("detalhesMecanicaPulmonar").style.display = "none";
}