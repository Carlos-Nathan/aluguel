// Começo do código JS
document.addEventListener('DOMContentLoaded', () => {

  const hoje = new Date();
  hoje.setHours(0,0,0,0);
  const anoAtual = hoje.getFullYear();

  // -----------------------------
  // Storage por ano
  // -----------------------------
  let storage = JSON.parse(localStorage.getItem('diasAlugados'));
  if (!storage || storage.ano !== anoAtual) {
    storage = { ano: anoAtual, dados: {} };
    localStorage.setItem('diasAlugados', JSON.stringify(storage));
  }

  // -----------------------------
  // Mapa de meses
  // -----------------------------
  const mapaMeses = {
    1: { nome: "janeiro", numero: 0 },
    2: { nome: "fevereiro", numero: 1 },
    3: { nome: "março", numero: 2 },
    4: { nome: "abril", numero: 3 },
    5: { nome: "maio", numero: 4 },
    6: { nome: "junho", numero: 5 },
    7: { nome: "julho", numero: 6 },
    8: { nome: "agosto", numero: 7 },
    9: { nome: "setembro", numero: 8 },
    10:{ nome: "outubro", numero: 9 },
    11:{ nome: "novembro", numero: 10 },
    12:{ nome: "dezembro", numero: 11 }
  };

  // -----------------------------
  // DESCOBRE O MÊS ATUAL
  // -----------------------------
  let mesNumero = null;
  let mesAtual = null;

  // 👉 prioridade: URL (?mes=)
  const paramsPagina = new URLSearchParams(location.search);
  const mesURL = parseInt(paramsPagina.get("mes"), 10);

  if (mesURL && mapaMeses[mesURL]) {
    mesNumero = mapaMeses[mesURL].numero;
    mesAtual = mapaMeses[mesURL].nome;
    localStorage.setItem("mesAtual", mesAtual);
  }

  // 👉 fallback: h1 (página do calendário)
  if (!mesAtual) {
    const h1 = document.querySelector("h1");
    if (h1) {
      const texto = h1.textContent.trim().toLowerCase();
      for (const m in mapaMeses) {
        if (mapaMeses[m].nome === texto) {
          mesNumero = mapaMeses[m].numero;
          mesAtual = mapaMeses[m].nome;
          localStorage.setItem("mesAtual", mesAtual);
          break;
        }
      }
    }
  }

  if (!mesAtual || mesNumero === null) return;

  // -----------------------------
  // PÁGINA DO CALENDÁRIO
  // -----------------------------
  const diasAlugados = (storage.dados[mesAtual] || []).map(Number);

  document.querySelectorAll('a[href*="dia.html"]').forEach(a => {

    const url = new URL(a.href);
    const dia = parseInt(url.searchParams.get("dia"), 10);
    if (isNaN(dia)) return;

    const dataTd = new Date(anoAtual, mesNumero, dia);
    dataTd.setHours(0,0,0,0);

    if (dataTd < hoje || diasAlugados.includes(dia)) {
      const td = a.closest("td");
      if (td) td.style.visibility = "hidden";
      a.style.visibility = "hidden";
    }
  });

  // -----------------------------
  // PÁGINA DO DIA (botão alugar)
  // -----------------------------
  const botao = document.querySelector(".alugar");
  if (botao) {
    botao.addEventListener("click", () => {

      if (!confirm("Você falou com responsável e vai alugar este dia?")) return;

      const params = new URLSearchParams(location.search);
      const dia = parseInt(params.get("dia"), 10);
      const mes = parseInt(params.get("mes"), 10);

      if (isNaN(dia) || isNaN(mes) || !mapaMeses[mes]) return;

      const mesNome = mapaMeses[mes].nome;

      if (!storage.dados[mesNome]) storage.dados[mesNome] = [];
      if (!storage.dados[mesNome].includes(dia)) {
        storage.dados[mesNome].push(dia);
      }

      localStorage.setItem("diasAlugados", JSON.stringify(storage));
      history.back();
    });
  }

});
