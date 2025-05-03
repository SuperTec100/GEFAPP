
export function atualizarExibicaoRespiratoria() {
  const tipo = document.getElementById("sistemaRespiratorio").value;

  // Seções principais
  const espontanea = document.getElementById("secaoEspontanea");
  const vni = document.getElementById("secaoVNI");
  const vm = document.getElementById("secaoVM");

  // Subdivisões
  const fluxo = document.getElementById("fluxoContainer");
  const fio2 = document.getElementById("fio2CNAFContainer");
  const rox = document.getElementById("roxContainer");
  const viaAerea = document.getElementById("viaAereaOptions");
  const tqt = document.getElementById("opcoesTQT");
  const cuff = document.getElementById("cuffOptions");
  const pressao = document.getElementById("pressaoCuff");
  const parametros = document.getElementById("ventilationParams");

  // Oculta todos
  [espontanea, vni, vm, fluxo, fio2, rox, viaAerea, tqt, cuff, pressao, parametros]
    .forEach(el => el && (el.style.display = "none"));

  if (tipo === "espontanea") {
    espontanea.style.display = "block";
    viaAerea.style.display = "block";
    document.getElementById("suporteOxigenioContainer")?.addEventListener("change", e => {
      const val = e.target.value;
      if (val === "cnaf") {
        fluxo.style.display = "block";
        fio2.style.display = "block";
        rox.style.display = "block";
      } else {
        fluxo.style.display = "none";
        fio2.style.display = "none";
        rox.style.display = "none";
      }
    });
  } else if (tipo === "vni") {
    vni.style.display = "block";
  } else if (tipo === "vm") {
    vm.style.display = "block";
    viaAerea.style.display = "block";
    document.querySelectorAll("input[name='viaAereaVM']").forEach(r => {
      r.addEventListener("change", () => {
        const selected = document.querySelector("input[name='viaAereaVM']:checked")?.value;
        if (selected === "tqt") {
          tqt.style.display = "block";
          cuff.style.display = "block";
        } else {
          tqt.style.display = "none";
          cuff.style.display = "none";
          pressao.style.display = "none";
        }
      });
    });
    document.getElementById("cuff")?.addEventListener("change", e => {
      pressao.style.display = e.target.value === "insuflado" ? "block" : "none";
    });
    document.getElementById("modoVM")?.addEventListener("change", e => {
      parametros.style.display = "block";
    });
  }
}

window.addEventListener("DOMContentLoaded", atualizarExibicaoRespiratoria);
