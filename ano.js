document.addEventListener('DOMContentLoaded', () => {
  const ano = new Date().getFullYear();
  const anoEl = document.getElementById("ano");
  if (anoEl) {
    anoEl.textContent = ano;
  }
});
var pegaano = document.querySelector("#ano")
var data = new Date()
var ano = data.getFullYear()
pegaano.innerHTML = ano