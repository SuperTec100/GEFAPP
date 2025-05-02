// exibicao-condicional.js

export function mostrarOpcoesContencao() { const sim = document.querySelector('input[name="contencao"][value="Sim"]'); const container = document.getElementById("opcoesContencao"); container.style.display = sim?.checked ? "block" : "none"; }

export function mostrarEscalaEVA() { const sim = document.querySelector('input[name="avaliacaoDor"][value="Sim"]'); const container = document.getElementById("escalaEVAContainer"); container.style.display = sim?.checked ? "block" : "none"; }

export function mostrarOpcoesSedacao() { const sim = document.querySelector('input[name="sedacao"][value="Sim"]'); const container = document.getElementById("opcoesSedacao"); container.style.display = sim?.checked ? "block" : "none"; }

export function mostrarDrogas() { const sim = document.querySelector('input[name="drogasVasoativas"][value="com uso de drogas vasoativas"]'); const container = document.getElementById("opcoesDrogas"); container.style.display = sim?.checked ? "block" : "none"; }

export function atualizarOpcoesRespiratorias() { const tipo = document.getElementById("sistemaRespiratorio")?.value; const viaAerea = document.getElementById("viaAereaOptions"); const params = document.getElementById("ventilationParams"); const modoVMContainer = document.getElementById("modoVMContainer");

if (!tipo || !viaAerea || !params) return;

// Oculta tudo inicialmente viaAerea.style.display = "none"; params.style.display = "none"; modoVMContainer.style.display = "none"; esconderTodosModos();

if (tipo === "VM") { viaAerea.style.display = "block"; params.style.display = "block"; modoVMContainer.style.display = "block"; } else if (tipo === "vni") { params.style.display = "block"; document.getElementById("PSVParams").style.display = "block"; } }

export function exibirParametrosModoVM() { esconderTodosModos(); const modo = document.getElementById("modoVM")?.value; if (!modo) return; const id = ${modo}Params; const el = document.getElementById(id); if (el) el.style.display = "block"; }

function esconderTodosModos() { ["VCVParams", "PCVParams", "PSVParams", "SIMVParams"].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; }); }

export function mostrarCamposHGA() { const sim = document.querySelector('input[name="hga"][value="Com HGA"]'); const container = document.getElementById("camposHGA"); container.style.display = sim?.checked ? "block" : "none"; }

export function aplicarLogicaCondicional() { mostrarOpcoesContencao(); mostrarEscalaEVA(); mostrarOpcoesSedacao(); mostrarDrogas(); atualizarOpcoesRespiratorias(); mostrarCamposHGA(); }

export function mostrarCuffOptions() { const via = document.querySelector('input[name="viaAerea"]:checked'); const cuff = document.getElementById("cuffOptions"); if (via?.value === "TOT") { cuff.style.display = "block"; document.getElementById("opcoesTQT").style.display = "none"; } else if (via?.value === "TQT") { document.getElementById("opcoesTQT").style.display = "block"; cuff.style.display = "block"; } else { cuff.style.display = "none"; document.getElementById("opcoesTQT").style.display = "none"; } }

export function mostrarOpcoesTQT() { document.getElementById("opcoesTQT").style.display = "block"; document.getElementById("cuffOptions").style.display = "block"; }

export function mostrarPressaoCuff() { document.getElementById("pressaoCuff").style.display = "block"; }

export function esconderPressaoCuff() { document.getElementById("pressaoCuff").style.display = "none"; }

export function mostrarMecanicaPulmonar() { document.getElementById("detalhesMecanicaPulmonar").style.display = "block"; }

export function esconderMecanicaPulmonar() { document.getElementById("detalhesMecanicaPulmonar").style.display = "none"; }

