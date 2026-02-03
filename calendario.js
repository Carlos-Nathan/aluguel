// calendario.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

(async function () {

  /* ================= FIREBASE ================= */

  const firebaseConfig = {
    apiKey: "AIzaSyCQY-qMTeG6c93oBFNiBrf02AVB6UA8hR8",
    authDomain: "aluguel-chacara-saosebastiao.firebaseapp.com",
    projectId: "aluguel-chacara-saosebastiao",
    storageBucket: "aluguel-chacara-saosebastiao.firebasestorage.app",
    messagingSenderId: "444252026773",
    appId: "1:444252026773:web:5dca5d809baf0b0cc4a89c"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const reservasRef = collection(db, "diasReservados");

  /* ================= DATA ================= */

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const anoAtual = hoje.getFullYear();

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

  const params = new URLSearchParams(location.search);

  /* ================= CONTEXTO ================= */

  function detectarMes() {
    const mesURL = parseInt(params.get("mes"), 10);
    if (mesURL && mapaMeses[mesURL]) return mapaMeses[mesURL];

    const h1 = document.querySelector("h1");
    if (h1) {
      const texto = h1.textContent.trim().toLowerCase();
      for (const m in mapaMeses) {
        if (mapaMeses[m].nome === texto) return mapaMeses[m];
      }
    }
    return null;
  }

  const mesDetectado = detectarMes();
  const mesAtual = mesDetectado?.nome ?? null;
  const mesNumero = mesDetectado?.numero ?? null;

  /* ================= CALENDÁRIO ================= */

  function marcarDiasPassados() {
    if (mesNumero === null) return;

    document.querySelectorAll('a[href*="dia.html"]').forEach(a => {
      const dia = parseInt(new URL(a.href).searchParams.get("dia"), 10);
      if (isNaN(dia)) return;

      const data = new Date(anoAtual, mesNumero, dia);
      data.setHours(0, 0, 0, 0);

      if (data < hoje) {
        const td = a.closest("td");
        if (td) td.style.visibility = "hidden";
        a.removeAttribute("href");
      }
    });
  }

  function marcarDiasAlugados(diasReservados) {
    document.querySelectorAll('a[href*="dia.html"]').forEach(a => {
      const dia = parseInt(new URL(a.href).searchParams.get("dia"), 10);
      if (!diasReservados.includes(dia)) return;

      const td = a.closest("td");
      if (td) td.style.visibility = "hidden";
      a.removeAttribute("href");
    });
  }

  function iniciarCalendario() {
    if (!mesAtual) return;

    marcarDiasPassados();

    onSnapshot(reservasRef, snapshot => {
      const diasReservados = snapshot.docs
        .map(d => d.data())
        .filter(d => d.ano === anoAtual && d.mes === mesAtual)
        .map(d => d.dia);

      marcarDiasAlugados(diasReservados);
    });
  }

  /* ================= ALUGUEL ================= */

  function iniciarAluguel() {
    const botao = document.querySelector(".alugar");
    if (!botao) return;

    botao.addEventListener("click", async () => {
      if (!confirm("Confirmar aluguel deste dia?")) return;

      const dia = parseInt(params.get("dia"), 10);
      const mes = parseInt(params.get("mes"), 10);
      if (isNaN(dia) || !mapaMeses[mes]) {
        alert("Data inválida");
        return;
      }

      const mesNome = mapaMeses[mes].nome;

      const q = query(
        reservasRef,
        where("ano", "==", anoAtual),
        where("mes", "==", mesNome),
        where("dia", "==", dia)
      );

      const existe = await getDocs(q);
      if (!existe.empty) {
        alert("❌ Dia já reservado");
        return;
      }

      await addDoc(reservasRef, {
        ano: anoAtual,
        mes: mesNome,
        dia,
        criadoEm: new Date()
      });

      alert("✅ Dia reservado com sucesso!");
      history.back();
    });
  }

  /* ================= INIT ================= */

  iniciarCalendario();
  iniciarAluguel();

})();
