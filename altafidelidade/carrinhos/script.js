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

/* ==== [ADDON PERSISTÊNCIA] CARRINHO -> carrega/sincroniza com localStorage ==== */
(() => {
  function loadCart() {
    try { return JSON.parse(localStorage.getItem('bulbe:cart')) || []; } catch { return []; }
  }
  function saveCart(arr) {
    try { localStorage.setItem('bulbe:cart', JSON.stringify(arr)); } catch {}
  }
  function getLastId() {
    try { return localStorage.getItem('bulbe:lastAddedId') || ''; } catch { return ''; }
  }
  function setLastId(id) {
    try { localStorage.setItem('bulbe:lastAddedId', id || ''); } catch {}
  }

  function moedaBR(n) {
    return (Number(n) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function resolverImgParaCarrinho(p) {
    if (!p) return './assets/img/lamp.svg';
    if (p.startsWith('./img/')) return '../home/' + p.slice(2);
    return p;
  }

  // Aplica um item salvo no cartão da lâmpada (mantendo layout/JS)
  function aplicarLampadaDoCarrinho() {
    const cart = loadCart();
    if (!cart.length) return false;

    // Preferir o último adicionado, senão o primeiro
    const lastId = getLastId();
    const item = cart.find(it => it.id === lastId) || cart[0];

    const lamp = document.querySelector('article.cartao-produto[data-produto="lampada"]');
    if (!lamp || !item) return false;

    const imgEl   = lamp.querySelector('.imagem-produto img, .img img, picture img, img');
    const titleEl = lamp.querySelector('.titulo-produto, .title, h3, h2');
    const priceEl = lamp.querySelector('.valor-produto, .price, [data-preco]');
    const qtdEl   = lamp.querySelector('[data-quantidade], .qtd, .quantidade');
    const unidadesEl = lamp.querySelector('.texto-unidades, .units, .info-qtd');

    if (imgEl)  { imgEl.src = resolverImgParaCarrinho(item.img); imgEl.alt = item.alt || item.title || 'Produto'; }
    if (titleEl){ titleEl.innerHTML = (item.title || 'Produto').replace(/\s{2,}/g, ' '); }
    if (priceEl){
      if (priceEl instanceof HTMLElement) priceEl.dataset.preco = String(Number(item.price || 0).toFixed(2));
      priceEl.textContent = moedaBR(item.price || 0);
    }
    if (qtdEl)  qtdEl.textContent = String(item.qty || 1);
    if (unidadesEl) unidadesEl.textContent = `(${item.qty || 1} unidade${(item.qty||1) > 1 ? 's' : ''})`;

    // Atualiza seu estado existente
    if (typeof window.produtos === 'object' && window.produtos.lampada) {
      window.produtos.lampada.titulo = item.title || window.produtos.lampada.titulo;
      window.produtos.lampada.preco  = Number(item.price || window.produtos.lampada.preco);
      window.produtos.lampada.quantidade = Number(item.qty || 1);
    }

    // Recalcula com suas funções
    if (typeof window.atualizarResumo === 'function') { try { window.atualizarResumo(); } catch {} }
    if (typeof window.atualizarQuantidadesNaTela === 'function') { try { window.atualizarQuantidadesNaTela(); } catch {} }

    // Guarda o ID aplicado
    setLastId(item.id || '');
    return true;
  }

  // Mantém o localStorage sincronizado quando o usuário muda a quantidade no carrinho
  function sincronizarQtdLampadaNoStorage() {
    document.addEventListener('click', (ev) => {
      const btn = ev.target.closest('.botao-quantidade');
      if (!btn) return;

      const card = btn.closest('article.cartao-produto[data-produto="lampada"]');
      if (!card) return; // só cuidamos da lâmpada (seu template-alvo)

      // Lê o estado atual da UI
      const qtdEl = card.querySelector('[data-quantidade], .qtd, .quantidade');
      const title = (card.querySelector('.titulo-produto, .title, h3, h2')?.textContent || '').trim();
      const priceEl = card.querySelector('.valor-produto, .price, [data-preco]');
      const price = priceEl?.dataset?.preco ? Number(priceEl.dataset.preco) : Number((priceEl?.textContent || '0').replace(/[^\d,.-]/g, '').replace(/\./g,'').replace(',', '.'));
      const qty = Math.max(1, parseInt(qtdEl?.textContent || '1', 10) || 1);

      // Reconstrói o id
      const id = `${String(title).toLowerCase().replace(/\s+/g,' ').slice(0,200)}|${Number(price||0).toFixed(2)}`;

      const cart = loadCart();
      const ix = cart.findIndex(it => it.id === id);

      if (ix >= 0) {
        cart[ix].qty = qty;
      } else {
        // Se não achar (ex.: veio direto sem Home), cria uma entrada mínima
        const img = card.querySelector('.imagem-produto img, .img img, picture img, img')?.getAttribute('src') || '';
        const alt = card.querySelector('.imagem-produto img, .img img, picture img, img')?.getAttribute('alt') || title;
        cart.push({ id, title, price: Number(price||0), img, alt, qty });
      }
      saveCart(cart);
      setLastId(id);
    });
  }

  // Limpar carrinho -> também limpa o localStorage
  function integrarLimparCarrinho() {
    const btn = document.getElementById('botaoLimpar');
    if (!btn) return;
    btn.addEventListener('click', () => {
      try { localStorage.removeItem('bulbe:cart'); } catch {}
      try { localStorage.removeItem('bulbe:lastAddedId'); } catch {}
    });
  }

  // Inicialização
  function initPersistencia() {
    aplicarLampadaDoCarrinho();     // carrega do storage para a lâmpada
    sincronizarQtdLampadaNoStorage(); // mantém storage alinhado a cada +/−
    integrarLimparCarrinho();       // limpa storage quando o usuário limpar
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPersistencia, { once: true });
  } else {
    initPersistencia();
  }
})();
