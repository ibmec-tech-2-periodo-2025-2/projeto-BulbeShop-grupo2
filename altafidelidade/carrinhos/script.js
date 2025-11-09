// === BOTÃO VOLTAR ===
document.getElementById("botaoVoltar")?.addEventListener("click", () => history.back());

// === SELECIONAR TUDO ===
const selecionarTudo = document.getElementById("selecionarTudo");
const selecoesIndividuais = Array.from(document.querySelectorAll(".selecao-individual"));
selecionarTudo?.addEventListener("change", () => {
  selecoesIndividuais.forEach((c) => (c.checked = selecionarTudo.checked));
});

// === FORMATAÇÃO BR ===
const formatoBR = (n) => (Number(n) || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// === ESTADO DO CARRINHO (inicial) ===
const produtos = {
  lampada: {
    titulo: "Lâmpada de LED E27 Bulbo 9W 803lm Luz Branca Bivolt Black + Decker",
    preco: 4.59,
    quantidade: 5,
  },
  parafusadeira: {
    titulo: "Parafusadeira Philco Force PPF120 3 em 1 1500RPM",
    preco: 199.9,
    quantidade: 1,
  },
};

// === CONTADORES DOS CARDS ===
function ativarContadores() {
  document.querySelectorAll(".contador").forEach((contador) => {
    const produtoPai = contador.closest(".cartao-produto");
    const chaveBase = produtoPai?.dataset.produto || null;

    contador.addEventListener("click", (evento) => {
      const botao = evento.target.closest(".botao-quantidade");
      if (!botao) return;

      const acao = botao.dataset.acao; // "aumentar" | "diminuir"
      const chave = contador.dataset.produto === "resumo" ? "lampada" : chaveBase;
      if (!chave || !produtos[chave]) return;

      const span = contador.querySelector("[data-quantidade]") || contador.querySelector(".quantidade-atual");
      let n = parseInt(span?.textContent || "1", 10) || 1;

      if (acao === "aumentar") n++;
      if (acao === "diminuir") n = Math.max(1, n - 1);

      span.textContent = String(n);
      produtos[chave].quantidade = n;

      // "(N unidades)" no card
      const textoUnidades = produtoPai?.querySelector(".texto-unidades");
      if (textoUnidades) {
        textoUnidades.textContent = `(${n} unidade${n > 1 ? "s" : ""})`;
      }

      atualizarResumo();
    });
  });
}

// === TOTAL DO CARRINHO ===
function calcularTotal() {
  return produtos.lampada.preco * produtos.lampada.quantidade +
         produtos.parafusadeira.preco * produtos.parafusadeira.quantidade;
}

// === ATUALIZA RESUMO (UNIFICADO – uma única definição) ===
function atualizarResumo() {
  // Lâmpada
  const qtdLamp = produtos.lampada.quantidade;
  const valorLamp = produtos.lampada.preco * qtdLamp;

  document.querySelectorAll("#quantidadeResumo, #quantidadeResumoLampada").forEach((el) => (el.textContent = String(qtdLamp)));
  document.querySelectorAll("#precoResumo, #precoResumoLampada").forEach((el) => (el.textContent = `R$${formatoBR(valorLamp)}`));

  // Parafusadeira
  const qtdParaf = produtos.parafusadeira.quantidade;
  const valorParaf = produtos.parafusadeira.preco * qtdParaf;

  document.querySelectorAll("#quantidadeResumoParafusadeira").forEach((el) => (el.textContent = String(qtdParaf)));
  document.querySelectorAll("#precoResumoParafusadeira").forEach((el) => (el.textContent = `R$${formatoBR(valorParaf)}`));

  // Total geral
  const total = calcularTotal();
  document.querySelectorAll("#totalResumo").forEach((el) => (el.textContent = `R$${formatoBR(total)}`));
}

// === CARROSSEL ===
const trilha = document.getElementById("trilhaCarrossel");
document.querySelector(".seta-carrossel.esquerda")?.addEventListener("click", () => {
  trilha?.scrollBy({ left: -trilha.clientWidth * 0.9, behavior: "smooth" });
});
document.querySelector(".seta-carrossel.direita")?.addEventListener("click", () => {
  trilha?.scrollBy({ left: +trilha.clientWidth * 0.9, behavior: "smooth" });
});

// === BOTÃO CONTINUAR (fade e redireciona) ===
document.addEventListener("DOMContentLoaded", function () {
  const botaoContinuar = document.getElementById("botaoContinuar");
  const resumoCarrinho = document.getElementById("resumoCarrinho");

  if (botaoContinuar && resumoCarrinho) {
    botaoContinuar.addEventListener("click", function () {
      resumoCarrinho.classList.add("fade-out");
      setTimeout(() => (window.location.href = "../pagamento1/pagamento.html"), 400);
    });
  }
});

// === LIMPAR CARRINHO (mantém mínimo 1 un por item para não quebrar UI) ===
document.getElementById("botaoLimpar")?.addEventListener("click", limparCarrinho);
function limparCarrinho() {
  produtos.lampada.quantidade = 1;
  produtos.parafusadeira.quantidade = 1;

  // zera visuais dos [data-quantidade] nos cards
  document.querySelectorAll('[data-produto="lampada"] [data-quantidade]').forEach((el) => (el.textContent = "1"));
  document.querySelectorAll('[data-produto="parafusadeira"] [data-quantidade]').forEach((el) => (el.textContent = "1"));

  document.querySelectorAll('[data-produto="lampada"] .texto-unidades').forEach((el) => (el.textContent = "(1 unidade)"));
  document.querySelectorAll('[data-produto="parafusadeira"] .texto-unidades').forEach((el) => (el.textContent = "(1 unidade)"));

  atualizarResumo();
}

// === BRIDGE: importar item salvo na Home e aplicar no cartão da LÂMPADA ===
(() => {
  const moedaBR = (n) => (Number(n) || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const resolverImgParaCarrinho = (p) => {
    if (!p) return "./assets/img/lamp.svg";
    if (p.startsWith("./img/")) return "../home/" + p.slice(2);
    return p;
  };

  function importarDoLocalStorage() {
    const raw = localStorage.getItem("bulbe:addToCart");
    if (!raw) return;

    let incoming = null;
    try { incoming = JSON.parse(raw); } catch {}
    localStorage.removeItem("bulbe:addToCart");
    if (!incoming || !incoming.title) return;

    const lamp = document.querySelector('article.cartao-produto[data-produto="lampada"]');
    if (!lamp) return;

    const imgEl = lamp.querySelector(".imagem-produto img");
    if (imgEl) {
      imgEl.src = resolverImgParaCarrinho(incoming.img);
      imgEl.alt = incoming.alt || incoming.title || "Produto";
    }

    const titleEl = lamp.querySelector(".titulo-produto");
    if (titleEl) titleEl.innerHTML = (incoming.title || "Produto").replace(/\s{2,}/g, " ");

    const priceEl = lamp.querySelector(".valor-produto");
    if (priceEl) {
      const pv = Number(incoming.price || 0);
      priceEl.dataset.preco = String(pv.toFixed(2));
      priceEl.textContent = `R$${moedaBR(pv)}`;
    }

    const qtdSpan = lamp.querySelector("[data-quantidade]");
    if (qtdSpan) qtdSpan.textContent = "1";
    const unidades = lamp.querySelector(".texto-unidades");
    if (unidades) unidades.textContent = "(1 unidade)";

    // estado
    if (produtos.lampada) {
      produtos.lampada.titulo = incoming.title || produtos.lampada.titulo;
      produtos.lampada.preco = Number(incoming.price || produtos.lampada.preco);
      produtos.lampada.quantidade = 1;
    }

    atualizarResumo();
  }

  function init() {
    ativarContadores();
    atualizarResumo();
    importarDoLocalStorage();
    atualizarResumo();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.addEventListener("pageshow", (ev) => {
    if (ev.persisted) init();
  });
})();
