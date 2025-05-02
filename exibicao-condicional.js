
export function atualizarOpcoesRespiratorias() {
  const tipo = document.getElementById("sistemaRespiratorio")?.value;

  const viaAereaOptions = document.getElementById("viaAereaOptions");
  const opcoesRespiratorias = document.getElementById("opcoesRespiratorias");
  const ventilationParams = document.getElementById("ventilationParams");

  const opcoesEspontanea = `
    <div class="sub-section">
      <label>Via Aérea:</label>
      <div class="radio-group">
        <label><input name="viaAereaEsp" type="radio" value="Fisiológica"> Fisiológica</label>
        <label><input name="viaAereaEsp" type="radio" value="TQT"> TQT</label>
      </div>
    </div>`;

  const opcoesVNI = `
    <div class="sub-section">
      <label>Modos VNI:</label>
      <div class="radio-group">
        <label><input name="modoVNI" type="radio" value="BIPAP"> BIPAP</label>
        <label><input name="modoVNI" type="radio" value="CPAP"> CPAP</label>
      </div>
    </div>`;

  const opcoesVM = `
    <div class="sub-section">
      <label>Modos VM:</label>
      <div class="radio-group">
        <label><input name="modoVM" type="radio" value="VCV"> VCV</label>
        <label><input name="modoVM" type="radio" value="PCV"> PCV</label>
        <label><input name="modoVM" type="radio" value="PSV"> PSV</label>
        <label><input name="modoVM" type="radio" value="SIMV"> SIMV</label>
      </div>
    </div>`;

  viaAereaOptions.style.display = "none";
  opcoesRespiratorias.innerHTML = "";
  ventilationParams.style.display = "none";

  switch (tipo) {
    case "espontanea":
      opcoesRespiratorias.innerHTML = opcoesEspontanea;
      viaAereaOptions.style.display = "none";
      ventilationParams.style.display = "none";
      break;
    case "vni":
      opcoesRespiratorias.innerHTML = opcoesVNI;
      viaAereaOptions.style.display = "none";
      ventilationParams.style.display = "block";
      break;
    case "VM":
      opcoesRespiratorias.innerHTML = opcoesVM;
      viaAereaOptions.style.display = "block";
      ventilationParams.style.display = "block";
      break;
  }
}
