const params = new URLSearchParams(location.search);

const dia = params.get("dia");
const mes = params.get("mes");

if (!dia || !mes) {
  alert("Data inválida");
}

const hoje = new Date();
const ano = hoje.getFullYear();

document.getElementById("data").textContent =
  `${String(dia).padStart(2,"0")}/${String(mes).padStart(2,"0")}`;

document.getElementById("ano").textContent = ano;
