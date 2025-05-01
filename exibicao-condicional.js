// exibicao-condicional.js

export function mostrarOpcoesContencao() {
  const sim = document.querySelector('input[name="contencao"][value="Sim"]');
  const container = document.getElementById("opcoesContencao");
  container.style.display = sim?.checked ? "block" : "none";
}

export function mostrarEscalaEVA() {
  const sim = document.querySelector('input[name="avaliacaoDor"][value="Sim"]');
  const container = document.getElementById("escalaEVAContainer");
  container.style.display = sim?.checked ? "block" : "none";
}

export function mostrarOpcoesSedacao() {
  const valorSelecionado = document.querySelector('input[name="sedacao"]:checked')?.value;

  const containerSedacao = document.getElementById("opcoesSedacao");
  const glasgowContainer = document.getElementById("opcoesGlasgow");

  // Exibir container de sedação apenas se for "Sim"
  containerSedacao.style.display = (valorSelecionado === "Sim") ? "block" : "none";

  // Exibir escala de Glasgow se for "Não" ou "Narcose Anestésica"
  glasgowContainer.style.display = (valorSelecionado === "Não" || valorSelecionado === "Narcose Anestésica") ? "block" : "none";
}

export function mostrarDrogas() {
  const sim = document.querySelector('input[name="drogasVasoativas"][value="com uso de drogas vasoativas"]');
  const container = document.getElementById("opcoesDrogas");
  container.style.display = sim?.checked ? "block" : "none";
}

export function atualizarOpcoesRespiratorias() {
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

export function mostrarCamposHGA() {
  const sim = document.querySelector('input[name="hga"][value="Com HGA"]');
  const container = document.getElementById("camposHGA");
  container.style.display = sim?.checked ? "block" : "none";
}

export function aplicarLogicaCondicional() {
  mostrarOpcoesContencao();
  mostrarEscalaEVA();
  mostrarOpcoesSedacao();
  mostrarDrogas();
  atualizarOpcoesRespiratorias();
  mostrarCamposHGA();
}
