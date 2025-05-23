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
  const sim = document.querySelector('input[name="sedacao"][value="Sim"]');
  const container = document.getElementById("opcoesSedacao");
  container.style.display = sim?.checked ? "block" : "none";
}

export function mostrarDrogas() {
  const sim = document.querySelector('input[name="drogasVasoativas"][value="com uso de drogas vasoativas"]');
  const container = document.getElementById("opcoesDrogas");
  container.style.display = sim?.checked ? "block" : "none";
}

export function atualizarOpcoesRespiratorias() {
  const tipo = document.getElementById("sistemaRespiratorio")?.value;
  const viaAerea = document.getElementById("viaAereaOptions");
  const opcoesTQT = document.getElementById("opcoesTQT");
  const cuffOptions = document.getElementById("cuffOptions");
  const pressaoCuff = document.getElementById("pressaoCuff");
  const rimaLabial = document.getElementById("rimaLabial");
  const numeroTubo = document.getElementById("numeroTubo");
  const params = document.getElementById("ventilationParams");
  const fluxo = document.getElementById("fluxoContainer");

  if (!tipo) return;

  // Resetar todos
  if (viaAerea) viaAerea.style.display = "none";
  if (opcoesTQT) opcoesTQT.style.display = "none";
  if (cuffOptions) cuffOptions.style.display = "none";
  if (pressaoCuff) pressaoCuff.style.display = "none";
  if (params) params.style.display = "none";
  if (fluxo) fluxo.style.display = "none";

  // Aplicar lógica
  if (tipo === "espontanea") {
    if (viaAerea) viaAerea.style.display = "block"; // Fisiológica/TQT
    if (fluxo) fluxo.style.display = "block"; // CNAF
  } else if (tipo === "vni") {
    if (params) params.style.display = "block"; // Parâmetros ventilatórios
  } else if (tipo === "VM") {
    if (viaAerea) viaAerea.style.display = "block"; // TOT/TQT
    if (params) params.style.display = "block"; // Modos e parâmetros
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
