/* ======================================================
   CARRINHO (BulbeShop) — script.js (COMPLETO)
   - Mantém suas funcionalidades
   - Importa item da Home e persiste no localStorage
   - Sincroniza a barra inferior (resumoCarrinho)
   ====================================================== */

/* ==== BOTÃO VOLTAR ==== */
document.getElementById("botaoVoltar")?.addEventListener("click", () => history.back());

/* ==== SELECIONAR TUDO ==== */
const selecionarTudo = document.getElementById("selecionarTudo");
const selecoesIndividuais = Array.from(document.querySelectorAll(".selecao-individual"));
selecionarTudo?.addEventListener("change", () => {
  selecoesIndividuais.forEach((c) => (c.checked = selecionarTudo.checked));
});

/* ==== FORMATAÇÃO BR ==== */
const formatoBR = (n) => (Number(n) || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ==== ESTADO INICIAL DO CARRINHO (template do seu HTML) ==== */
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

/* ==== HELPERS DE STORAGE/PATH ==== */
function loadCart() {
  try { return JSON.parse(localStorage.getItem("bulbe:cart")) || []; } catch { return []; }
}
function saveCart(arr) {
  try { localStorage.setItem("bulbe:cart", JSON.stringify(arr)); } catch {}
}
function getLastId() {
  try { return localStorage.getItem("bulbe:lastAddedId") || ""; } catch { return ""; }
}
function setLastId(id) {
  try { localStorage.setItem("bulbe:lastAddedId", id || ""); } catch {}
}
function moedaBR(n) {
  return (Number(n) || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function resolverImgParaCarrinho(p) {
  if (!p) return "./assets/img/lamp.svg";
  if (p.startsWith("./img/")) return "../home/" + p.slice(2); // contexto /carrinhos/
  return p;
}

/* ==== CONTADORES DOS CARDS ==== */
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

      // sincroniza com localStorage se for a lâmpada (item principal mostrado)
      if (chave === "lampada") syncLampadaToStorageFromUI();

      atualizarResumo();
      syncBarraInferior(); // mantém a barra atualizada ao mudar quantidades
    });
  });
}

/* ==== TOTAL DO CARRINHO ==== */
function calcularTotal() {
  return produtos.lampada.preco * produtos.lampada.quantidade +
         produtos.parafusadeira.preco * produtos.parafusadeira.quantidade;
}

/* ==== ATUALIZA RESUMO (UNIFICADO) ==== */
function atualizarResumo() {
  // Lâmpada
  const qtdLamp = produtos.lampada.quantidade;
  const valorLamp = produtos.lampada.preco * qtdLamp;

  document.querySelectorAll("#quantidadeResumo, #quantidadeResumoLampada")
    .forEach((el) => (el.textContent = String(qtdLamp)));
  document.querySelectorAll("#precoResumo, #precoResumoLampada")
    .forEach((el) => (el.textContent = `R$${formatoBR(valorLamp)}`));

  // Parafusadeira
  const qtdParaf = produtos.parafusadeira.quantidade;
  const valorParaf = produtos.parafusadeira.preco * qtdParaf;

  document.querySelectorAll("#quantidadeResumoParafusadeira")
    .forEach((el) => (el.textContent = String(qtdParaf)));
  document.querySelectorAll("#precoResumoParafusadeira")
    .forEach((el) => (el.textContent = `R$${formatoBR(valorParaf)}`));

  // Total geral
  const total = calcularTotal();
  document.querySelectorAll("#totalResumo")
    .forEach((el) => (el.textContent = `R$${formatoBR(total)}`));
}

/* ==== CARROSSEL ==== */
const trilha = document.getElementById("trilhaCarrossel");
document.querySelector(".seta-carrossel.esquerda")?.addEventListener("click", () => {
  trilha?.scrollBy({ left: -trilha.clientWidth * 0.9, behavior: "smooth" });
});
document.querySelector(".seta-carrossel.direita")?.addEventListener("click", () => {
  trilha?.scrollBy({ left: +trilha.clientWidth * 0.9, behavior: "smooth" });
});

/* ==== BOTÃO CONTINUAR (fade e redireciona) ==== */
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

/* ==== LIMPAR CARRINHO (UI + localStorage) ==== */
document.getElementById("botaoLimpar")?.addEventListener("click", limparCarrinho);
function limparCarrinho() {
  produtos.lampada.quantidade = 1;
  produtos.parafusadeira.quantidade = 1;

  // zera visuais dos [data-quantidade] nos cards
  document.querySelectorAll('[data-produto="lampada"] [data-quantidade]').forEach((el) => (el.textContent = "1"));
  document.querySelectorAll('[data-produto="parafusadeira"] [data-quantidade]').forEach((el) => (el.textContent = "1"));

  document.querySelectorAll('[data-produto="lampada"] .texto-unidades').forEach((el) => (el.textContent = "(1 unidade)"));
  document.querySelectorAll('[data-produto="parafusadeira"] .texto-unidades').forEach((el) => (el.textContent = "(1 unidade)"));

  // limpa storage persistente
  try { localStorage.removeItem("bulbe:cart"); } catch {}
  try { localStorage.removeItem("bulbe:lastAddedId"); } catch {}

  atualizarResumo();
  syncBarraInferior(); // refletir limpeza na barra inferior
}

/* ======================================================
   IMPORTAR ITEM DA HOME + PERSISTÊNCIA + BARRA INFERIOR
   ====================================================== */

// Aplica o item salvo (localStorage/bulbe:cart) no card da LÂMPADA
function aplicarLampadaDoCarrinho() {
  const cart = loadCart();
  const lastId = getLastId();
  const item = (lastId && cart.find((it) => it.id === lastId)) || cart[0];
  if (!item) return false;

  const lamp = document.querySelector('article.cartao-produto[data-produto="lampada"]');
  if (!lamp) return false;

  const imgEl   = lamp.querySelector('.imagem-produto img, .img img, picture img, img');
  const titleEl = lamp.querySelector('.titulo-produto, .title, h3, h2');
  const priceEl = lamp.querySelector('.valor-produto, .price, [data-preco]');
  const qtdEl   = lamp.querySelector('[data-quantidade], .qtd, .quantidade');
  const unidadesEl = lamp.querySelector('.texto-unidades, .units, .info-qtd');

  if (imgEl)  { imgEl.src = resolverImgParaCarrinho(item.img); imgEl.alt = item.alt || item.title || 'Produto'; }
  if (titleEl){ titleEl.innerHTML = (item.title || 'Produto').replace(/\s{2,}/g, ' '); }
  if (priceEl){
    const unit = Number(item.price || 0);
    if (priceEl instanceof HTMLElement) priceEl.dataset.preco = String(unit.toFixed(2));
    priceEl.textContent = `R$${moedaBR(unit)}`;
  }
  const q = Number(item.qty || 1);
  if (qtdEl)  qtdEl.textContent = String(q);
  if (unidadesEl) unidadesEl.textContent = `(${q} unidade${q > 1 ? 's' : ''})`;

  // Estado interno do carrinho
  if (produtos.lampada) {
    produtos.lampada.titulo = item.title || produtos.lampada.titulo;
    produtos.lampada.preco  = Number(item.price || produtos.lampada.preco);
    produtos.lampada.quantidade = q;
  }

  setLastId(item.id || "");
  return true;
}

// Sincroniza storage a partir do que está no UI do card da lâmpada (quando +/−)
function syncLampadaToStorageFromUI() {
  const card = document.querySelector('article.cartao-produto[data-produto="lampada"]');
  if (!card) return;

  const title = (card.querySelector('.titulo-produto, .title, h3, h2')?.textContent || '').trim();
  const priceEl = card.querySelector('.valor-produto, .price, [data-preco]');
  const qtyEl = card.querySelector('[data-quantidade], .qtd, .quantidade');

  const unit = priceEl?.dataset?.preco
    ? Number(priceEl.dataset.preco)
    : Number((priceEl?.textContent || '0').replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.'));
  const qty = Math.max(1, parseInt(qtyEl?.textContent || '1', 10) || 1);

  const id = `${String(title).toLowerCase().replace(/\s+/g, ' ').slice(0, 200)}|${Number(unit || 0).toFixed(2)}`;

  const cart = loadCart();
  const ix = cart.findIndex((it) => it.id === id);

  const imgEl = card.querySelector('.imagem-produto img, .img img, picture img, img');
  const img = imgEl?.getAttribute('src') || '';
  const alt = imgEl?.getAttribute('alt') || title;

  if (ix >= 0) {
    cart[ix].qty = qty;
  } else {
    cart.push({ id, title, price: Number(unit || 0), img, alt, qty });
  }
  saveCart(cart);
  setLastId(id);
}

// Sincroniza a BARRA INFERIOR (resumoCarrinho) com o item atual da lâmpada
function syncBarraInferior() {
  const lampTitle = produtos.lampada?.titulo || "Produto";
  const lampQty   = Number(produtos.lampada?.quantidade || 1);
  const lampUnit  = Number(produtos.lampada?.preco || 0);
  const lampTotal = lampQty * lampUnit;

  // Título
  const tituloResumo = document.getElementById('tituloResumo');
  if (tituloResumo) tituloResumo.textContent = lampTitle;

  // Mini imagem do item-resumo (assumindo que o primeiro mini-card é o da lâmpada)
  const miniLampImg = document.querySelector('#resumoCarrinho .item-resumo img');
  if (miniLampImg) {
    // tenta pegar a mesma imagem do card da lâmpada
    const cardImg = document.querySelector('article.cartao-produto[data-produto="lampada"] .imagem-produto img, article.cartao-produto[data-produto="lampada"] .img img, article.cartao-produto[data-produto="lampada"] picture img');
    const src = cardImg?.getAttribute('src') || './assets/img/lamp.svg';
    miniLampImg.src = src;
    miniLampImg.alt = lampTitle;
  }

  // Quantidade e valores já são cobertos por atualizarResumo(), mas garantimos aqui também:
  const qtdResumo = document.getElementById('quantidadeResumo');
  const precoResumo = document.getElementById('precoResumo');
  const totalResumo = document.getElementById('totalResumo');

  if (qtdResumo)   qtdResumo.textContent   = String(lampQty);
  if (precoResumo) precoResumo.textContent = `R$${formatoBR(lampTotal)}`;

  // Total geral:
  const totalGeral = calcularTotal();
  if (totalResumo) totalResumo.textContent = `R$${formatoBR(totalGeral)}`;
}

// Importa item salvo da Home (bulbe:addToCart/bulbe:cart) e aplica na lâmpada
function importarDoLocalStorage() {
  // 1) Primeiro tenta o carrinho persistente
  const aplicado = aplicarLampadaDoCarrinho();

  // 2) Compat: também aceita o payload rápido (bulbe:addToCart) da navegação Home -> Carrinho
  const raw = localStorage.getItem("bulbe:addToCart");
  if (raw) {
    try {
      const incoming = JSON.parse(raw);
      localStorage.removeItem("bulbe:addToCart");
      if (incoming && incoming.title) {
        // injeta direto no DOM/estado:
        const lamp = document.querySelector('article.cartao-produto[data-produto="lampada"]');
        if (lamp) {
          const imgEl = lamp.querySelector(".imagem-produto img, .img img, picture img, img");
          const titleEl = lamp.querySelector(".titulo-produto, .title, h3, h2");
          const priceEl = lamp.querySelector(".valor-produto, .price, [data-preco]");
          const qtdEl = lamp.querySelector("[data-quantidade], .qtd, .quantidade");
          const unidadesEl = lamp.querySelector(".texto-unidades, .units, .info-qtd");

          if (imgEl)  { imgEl.src = resolverImgParaCarrinho(incoming.img); imgEl.alt = incoming.alt || incoming.title || 'Produto'; }
          if (titleEl){ titleEl.innerHTML = (incoming.title || 'Produto').replace(/\s{2,}/g, ' '); }
          if (priceEl){
            const unit = Number(incoming.price || 0);
            if (priceEl instanceof HTMLElement) priceEl.dataset.preco = String(unit.toFixed(2));
            priceEl.textContent = `R$${moedaBR(unit)}`;
          }
          if (qtdEl)  qtdEl.textContent = String(Number(incoming.qty || 1));
          if (unidadesEl) unidadesEl.textContent = `(${Number(incoming.qty || 1)} unidade${Number(incoming.qty || 1) > 1 ? 's' : ''})`;
        }

        // Atualiza estado e storage também
        produtos.lampada.titulo = incoming.title || produtos.lampada.titulo;
        produtos.lampada.preco  = Number(incoming.price || produtos.lampada.preco);
        produtos.lampada.quantidade = Number(incoming.qty || 1);

        // Merge no bulbe:cart para persistir
        const id = `${String(produtos.lampada.titulo).toLowerCase().replace(/\s+/g, ' ').slice(0,200)}|${Number(produtos.lampada.preco||0).toFixed(2)}`;
        const cart = loadCart();
        const ix = cart.findIndex((it) => it.id === id);
        const img = resolverImgParaCarrinho(incoming.img || "");
        const alt = incoming.alt || incoming.title || produtos.lampada.titulo;
        if (ix >= 0) {
          cart[ix].qty = Number(incoming.qty || 1);
        } else {
          cart.push({ id, title: produtos.lampada.titulo, price: produtos.lampada.preco, img, alt, qty: Number(incoming.qty || 1) });
        }
        saveCart(cart);
        setLastId(id);
      }
    } catch {}
  }

  // Resumo + barra inferior
  atualizarResumo();
  syncBarraInferior();
}

/* ==== INICIALIZAÇÃO ==== */
function init() {
  ativarContadores();
  atualizarResumo();
  importarDoLocalStorage(); // aplica item e atualiza barra
  atualizarResumo();
  syncBarraInferior();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}

// Reexecuta quando voltar via bfcache
window.addEventListener("pageshow", (ev) => {
  if (ev.persisted) init();
});
