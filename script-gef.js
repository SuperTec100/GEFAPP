
document.addEventListener("DOMContentLoaded", () => {
  const btnAdicionar = document.getElementById("btnAdicionarPaciente");
  const formCadastro = document.getElementById("cadastroPaciente");
  const btnCancelar = document.getElementById("btnCancelarCadastro");

  if (btnAdicionar && formCadastro) {
    btnAdicionar.addEventListener("click", () => {
      formCadastro.style.display = "block";
    });
  }

  if (btnCancelar && formCadastro) {
    btnCancelar.addEventListener("click", () => {
      formCadastro.style.display = "none";
    });
  }
});
