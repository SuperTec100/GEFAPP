// exibicao-respiratoria.js

export function atualizarExibicaoRespiratoria() {
  const tipoVentilacao = document.getElementById("sistemaRespiratorio")?.value;
  
  // Resetar todas as seções
  document.getElementById("secaoEspontanea").style.display = "none";
  document.getElementById("secaoVNI").style.display = "none";
  document.getElementById("secaoVM").style.display = "none";
  document.getElementById("fluxoContainer").style.display = "none";
  document.getElementById("fio2CNAFContainer").style.display = "none";
  document.getElementById("roxContainer").style.display = "none";
  document.getElementById("viaAereaOptions").style.display = "none";
  document.getElementById("opcoesTQT").style.display = "none";
  document.getElementById("cuffOptions").style.display = "none";
  document.getElementById("pressaoCuff").style.display = "none";
  document.getElementById("ventilationParams").style.display = "none";

  // Exibir seção conforme seleção
  if (tipoVentilacao === "espontanea") {
    exibirVentilacaoEspontanea();
  } else if (tipoVentilacao === "vni") {
    exibirVNI();
  } else if (tipoVentilacao === "VM") {
    exibirVM();
  }
}

function exibirVentilacaoEspontanea() {
  const secao = document.getElementById("secaoEspontanea");
  secao.style.display = "block";
  
  // Via Aérea
  const viaAereaDiv = document.getElementById("viaAereaOptions");
  viaAereaDiv.style.display = "block";
  viaAereaDiv.innerHTML = `
    <label>Via Aérea:</label>
    <div class="radio-group">
      <label><input type="radio" name="tipoEspontanea" value="Fisiológica" checked> Fisiológica</label>
      <label><input type="radio" name="tipoEspontanea" value="TQT"> TQT (Traqueostomia)</label>
    </div>
  `;
  
  // Suporte de Oxigênio
  const suporteOxigenioDiv = document.createElement("div");
  suporteOxigenioDiv.className = "sub-section";
  suporteOxigenioDiv.innerHTML = `
    <label>Suporte de Oxigênio:</label>
    <div class="radio-group">
      <label><input type="radio" name="opcaoEspontanea" value="Ar Ambiente" checked 
             onclick="esconderCamposCNAF()"> Ar Ambiente</label>
      <label><input type="radio" name="opcaoEspontanea" value="Cateter" 
             onclick="mostrarFluxo(); esconderCamposCNAF()"> Cateter</label>
      <label><input type="radio" name="opcaoEspontanea" value="Máscara" 
             onclick="mostrarFluxo(); esconderCamposCNAF()"> Máscara</label>
      <label><input type="radio" name="opcaoEspontanea" value="CNAF" 
             onclick="mostrarCamposCNAF()"> CNAF</label>
    </div>
  `;
  secao.appendChild(suporteOxigenioDiv);
}

function exibirVNI() {
  const secao = document.getElementById("secaoVNI");
  secao.style.display = "block";
  
  secao.innerHTML = `
    <div class="sub-section">
      <label>Modo:</label>
      <div class="radio-group">
        <label><input type="radio" name="modoVNI" value="CPAP" checked> CPAP</label>
        <label><input type="radio" name="modoVNI" value="BIPAP"> BIPAP</label>
      </div>
    </div>
    
    <div class="sub-section">
      <label>Tipo de Equipamento:</label>
      <div class="radio-group">
        <label><input type="radio" name="tipoMaquinaVNI" value="CPAP de Parede" checked> CPAP de Parede</label>
        <label><input type="radio" name="tipoMaquinaVNI" value="Ventilador Mecânico"> Ventilador Mecânico</label>
      </div>
    </div>
    
    <div class="vital-signs-container">
      <div class="vital-sign">
        <label>IPAP (cmH2O):</label>
        <input type="number" id="ipap" min="0" step="0.1" oninput="calcularHACOR()">
      </div>
      <div class="vital-sign">
        <label>EPAP (cmH2O):</label>
        <input type="number" id="epap" min="0" step="0.1" oninput="calcularHACOR()">
      </div>
      <div class="vital-sign">
        <label>FiO2 (%):</label>
        <input type="number" id="fio2VNI" min="21" max="100" oninput="calcularHACOR()">
      </div>
    </div>
    
    <div id="hacorContainer" class="sub-section">
      <h4>Índice HACOR</h4>
      <p>Pontuação: <span id="hacorScore">-</span> (<span id="hacorInterpretation">-</span>)</p>
    </div>
  `;
}

function exibirVM() {
  const secao = document.getElementById("secaoVM");
  secao.style.display = "block";
  
  // Via Aérea
  const viaAereaDiv = document.getElementById("viaAereaOptions");
  viaAereaDiv.style.display = "block";
  viaAereaDiv.innerHTML = `
    <label>Via Aérea:</label>
    <div class="radio-group">
      <label><input type="radio" name="viaAerea" value="TOT" checked 
             onclick="mostrarCuffOptions()"> TOT (Tubo Orotraqueal)</label>
      <label><input type="radio" name="viaAerea" value="TQT" 
             onclick="mostrarOpcoesTQT()"> TQT (Traqueostomia)</label>
    </div>
  `;
  
  // Modos Ventilatórios
  secao.innerHTML = `
    <div class="sub-section">
      <label>Modo Ventilatório:</label>
      <div class="radio-group">
        <label><input type="radio" name="modoVM" value="VCV" checked 
               onclick="mostrarParametrosVentilacao('VCV')"> VCV</label>
        <label><input type="radio" name="modoVM" value="PCV" 
               onclick="mostrarParametrosVentilacao('PCV')"> PCV</label>
        <label><input type="radio" name="modoVM" value="PSV" 
               onclick="mostrarParametrosVentilacao('PSV')"> PSV</label>
        <label><input type="radio" name="modoVM" value="SIMV" 
               onclick="mostrarParametrosVentilacao('SIMV')"> SIMV</label>
      </div>
    </div>
    
    <div id="ventilationParams" class="sub-section">
      <!-- Parâmetros serão preenchidos dinamicamente -->
    </div>
  `;
  
  // Inicializa com VCV
  mostrarParametrosVentilacao('VCV');
}

// Funções auxiliares para mostrar/ocultar elementos
export function mostrarCamposCNAF() {
  document.getElementById("fluxoContainer").style.display = "block";
  document.getElementById("fio2CNAFContainer").style.display = "block";
  document.getElementById("roxContainer").style.display = "block";
  calcularROX();
}

export function esconderCamposCNAF() {
  document.getElementById("fluxoContainer").style.display = "none";
  document.getElementById("fio2CNAFContainer").style.display = "none";
  document.getElementById("roxContainer").style.display = "none";
}

export function mostrarFluxo() {
  document.getElementById("fluxoContainer").style.display = "block";
  document.getElementById("fio2CNAFContainer").style.display = "none";
  document.getElementById("roxContainer").style.display = "none";
}

export function mostrarOpcoesTQT() {
  document.getElementById("opcoesTQT").style.display = "block";
  document.getElementById("cuffOptions").style.display = "none";
  
  document.getElementById("opcoesTQT").innerHTML = `
    <label>Tipo de Cânula:</label>
    <div class="radio-group">
      <label><input type="radio" name="tipoTQT" value="Plástica" checked> Plástica</label>
      <label><input type="radio" name="tipoTQT" value="Blue Line"> Blue Line</label>
      <label><input type="radio" name="tipoTQT" value="Metálica"> Metálica</label>
    </div>
  `;
}

export function mostrarCuffOptions() {
  document.getElementById("opcoesTQT").style.display = "none";
  document.getElementById("cuffOptions").style.display = "block";
  
  document.getElementById("cuffOptions").innerHTML = `
    <label>Cuff:</label>
    <div class="radio-group">
      <label><input type="radio" name="cuff" value="Insuflado" checked 
             onclick="mostrarPressaoCuff()"> Insuflado</label>
      <label><input type="radio" name="cuff" value="Desinsuflado" 
             onclick="esconderPressaoCuff()"> Desinsuflado</label>
    </div>
  `;
}

export function mostrarPressaoCuff() {
  const div = document.getElementById("pressaoCuff");
  div.style.display = "block";
  div.innerHTML = `
    <div class="vital-sign">
      <label>P.Cuff (cmH2O):</label>
      <input type="number" id="pcuff" min="0" step="0.1">
    </div>
    <div class="vital-sign">
      <label>Rima Labial (cm):</label>
      <input type="number" id="rimaLabial" min="0" step="0.1">
    </div>
    <div class="vital-sign">
      <label>Número do Tubo:</label>
      <input type="number" id="numeroTubo" min="0" step="0.5">
    </div>
  `;
}

export function esconderPressaoCuff() {
  document.getElementById("pressaoCuff").style.display = "none";
}

export function mostrarParametrosVentilacao(modo) {
  const div = document.getElementById("ventilationParams");
  div.style.display = "block";
  
  switch(modo) {
    case 'VCV':
      div.innerHTML = `
        <div class="vital-signs-container">
          <div class="vital-sign">
            <label>VC (ml):</label>
            <input type="number" id="vc" min="0">
          </div>
          <div class="vital-sign">
            <label>PEEP (cmH2O):</label>
            <input type="number" id="peep" min="0" step="0.1">
          </div>
          <div class="vital-sign">
            <label>FiO2 (%):</label>
            <input type="number" id="fio2" min="21" max="100">
          </div>
          <div class="vital-sign">
            <label>FR (ipm):</label>
            <input type="number" id="frVent" min="0">
          </div>
        </div>
      `;
      break;
      
    case 'PCV':
      div.innerHTML = `
        <div class="vital-signs-container">
          <div class="vital-sign">
            <label>Pinsp (cmH2O):</label>
            <input type="number" id="pinsp" min="0" step="0.1">
          </div>
          <div class="vital-sign">
            <label>PEEP (cmH2O):</label>
            <input type="number" id="peepPcv" min="0" step="0.1">
          </div>
          <div class="vital-sign">
            <label>FiO2 (%):</label>
            <input type="number" id="fio2Pcv" min="21" max="100">
          </div>
          <div class="vital-sign">
            <label>FR (ipm):</label>
            <input type="number" id="frPcv" min="0">
          </div>
        </div>
      `;
      break;
      
    case 'PSV':
      div.innerHTML = `
        <div class="vital-signs-container">
          <div class="vital-sign">
            <label>Psup (cmH2O):</label>
            <input type="number" id="psup" min="0" step="0.1">
          </div>
          <div class="vital-sign">
            <label>PEEP (cmH2O):</label>
            <input type="number" id="peepPsv" min="0" step="0.1">
          </div>
          <div class="vital-sign">
            <label>FiO2 (%):</label>
            <input type="number" id="fio2Psv" min="21" max="100">
          </div>
        </div>
      `;
      break;
      
    case 'SIMV':
      div.innerHTML = `
        <div class="vital-signs-container">
          <div class="vital-sign">
            <label>VC (ml):</label>
            <input type="number" id="vcSimv" min="0">
          </div>
          <div class="vital-sign">
            <label>FR (ipm):</label>
            <input type="number" id="frSimv" min="0">
          </div>
          <div class="vital-sign">
            <label>PEEP (cmH2O):</label>
            <input type="number" id="peepSimv" min="0" step="0.1">
          </div>
          <div class="vital-sign">
            <label>FiO2 (%):</label>
            <input type="number" id="fio2Simv" min="21" max="100">
          </div>
        </div>
      `;
      break;
  }
}

// Adicione estas funções ao objeto window para que possam ser chamadas do HTML
window.mostrarCamposCNAF = mostrarCamposCNAF;
window.esconderCamposCNAF = esconderCamposCNAF;
window.mostrarFluxo = mostrarFluxo;
window.mostrarOpcoesTQT = mostrarOpcoesTQT;
window.mostrarCuffOptions = mostrarCuffOptions;
window.mostrarPressaoCuff = mostrarPressaoCuff;
window.esconderPressaoCuff = esconderPressaoCuff;
window.mostrarParametrosVentilacao = mostrarParametrosVentilacao;
window.atualizarExibicaoRespiratoria = atualizarExibicaoRespiratoria;
