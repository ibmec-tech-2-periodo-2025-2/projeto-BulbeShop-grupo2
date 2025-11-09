/* ======================================================
   CARRINHO (BulbeShop) — script.js
   Atualizações:
   - Carrinho VAZIO por padrão (se não houver bulbe:cart e nem bulbe:addToCart)
   - Botão “Selecionar/Selecionado” com TOGGLE (texto, ARIA e estilo)
   - Mantém: voltar, carrossel, +/−, remover ao ir a 0, selecionar tudo,
             limpar carrinho, persistência (bulbe:cart/lastAddedId),
             compatibilidade com bulbe:addToCart, resumo apenas dos selecionados
   - Sem criar/editar HTML/CSS externos: todo o CSS extra é injetado por JS
   ====================================================== */

/* ==== BOTÃO VOLTAR ==== */
document.getElementById("botaoVoltar")?.addEventListener("click", () => history.back());

/* ==== FORMATADORES ==== */
const formatoBR = (n) => (Number(n) || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const moedaBR   = (n) => `R$${formatoBR(n)}`;

/* ==== ESTADO (rótulos básicos; quantidades serão ajustadas por inicialização) ==== */
const produtos = {
  lampada:       { titulo: "Lâmpada de LED E27 Bulbo 9W 803lm Luz Branca Bivolt Black + Decker", preco: 4.59,  quantidade: 5 },
  parafusadeira: { titulo: "Parafusadeira Philco Force PPF120 3 em 1 1500RPM",                    preco: 199.9, quantidade: 1 },
};

/* ==== SELEÇÃO (entram no RESUMO) ==== */
const selecionados = { lampada: false, parafusadeira: false };

/* ==== PERSISTÊNCIA ==== */
function loadCart() { try { return JSON.parse(localStorage.getItem("bulbe:cart")) || []; } catch { return []; } }
function saveCart(arr) { try { localStorage.setItem("bulbe:cart", JSON.stringify(arr)); } catch {} }
function getLastId() { try { return localStorage.getItem("bulbe:lastAddedId") || ""; } catch { return ""; } }
function setLastId(id) { try { localStorage.setItem("bulbe:lastAddedId", id || ""); } catch {} }
function resolverImgParaCarrinho(p) { if (!p) return "./assets/img/lamp.svg"; if (p.startsWith("./img/")) return "../home/" + p.slice(2); return p; }

/* ======================================================
   CSS DO BOTÃO “SELECIONAR/SELECIONADO” (injetado)
   ====================================================== */
function injectSelecionarStyles() {
  if (document.getElementById("bulbeSelecionarStyles")) return;
  const css = `
  .btn-selecao{
    cursor:pointer; user-select:none; pointer-events:auto;
    display:inline-flex; align-items:center; gap:.4rem;
    padding:.35rem .75rem; border-radius:9999px;
    border:1px solid rgba(8,6,141,.28); background:#fff;
    font-weight:600; line-height:1; font-size:.95rem;
    transition: box-shadow .15s ease, transform .05s ease, background .2s ease, border-color .2s ease, color .2s ease;
  }
  .btn-selecao:hover{ box-shadow:0 2px 6px rgba(0,0,0,.08); background:#f7f8ff; border-color:#c9cdea; }
  .btn-selecao:active{ transform:translateY(1px); }
  .btn-selecao:focus-visible{ outline:2px solid #08068D; outline-offset:2px; }
  .cartao-produto.is-selecionado .btn-selecao{
    background:#08068D; border-color:#08068D; color:#fff;
  }
  .cartao-produto.is-selecionado .btn-selecao::before{
    content:"✓"; font-weight:700;
  }
  `;
  const style = document.createElement("style");
  style.id = "bulbeSelecionarStyles";
  style.textContent = css;
  document.head.appendChild(style);
}

/* ======================================================
   UPGRADE DOS GATILHOS “Selecionar/Selecionado” → BOTÃO
   ====================================================== */
function enhanceSelecionarUI() {
  const known = document.querySelectorAll(
    '[data-action="selecionar"], .selecionar, .texto-selecionar, .btn-selecionar'
  );
  const fallbacks = Array.from(document.querySelectorAll('article.cartao-produto *')).filter(el => {
    if (!(el instanceof HTMLElement)) return false;
    if (el.matches('input,button,select,textarea,[role="button"],a')) return false;
    const t = (el.textContent || "").trim().toLowerCase();
    return t === "selecionar" || t === "selecionado";
  });
  const triggers = new Set([...known, ...fallbacks]);
  triggers.forEach((el) => {
    el.classList.add("btn-selecao");
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    const card = el.closest(".cartao-produto");
    const selected = !!card?.classList.contains("is-selecionado");
    el.setAttribute("aria-pressed", selected ? "true" : "false");
    el.setAttribute("aria-label", selected ? "Selecionado" : "Selecionar produto");
    // Ajusta texto inicial de acordo com o estado atual do card
    try { el.textContent = selected ? "Selecionado" : "Selecionar"; } catch {}
  });
}

function updateTriggerLabel(card, selected) {
  card.querySelectorAll('[data-action="selecionar"], .selecionar, .texto-selecionar, .btn-selecionar, .btn-selecao')
    .forEach(el => { try { el.textContent = selected ? "Selecionado" : "Selecionar"; } catch {} });
}

function updateTriggerA11y(card, selected) {
  card.querySelectorAll('[data-action="selecionar"], .selecionar, .texto-selecionar, .btn-selecionar, .btn-selecao')
      .forEach(el=>{
        el.setAttribute("aria-pressed", selected ? "true" : "false");
        el.setAttribute("aria-label", selected ? "Selecionado" : "Selecionar produto");
      });
  updateTriggerLabel(card, selected);
}

/* ======================================================
   BLOCO DE ITENS NA BARRA DE RESUMO — mostrar/ocultar
   ====================================================== */
function getResumoItensNodes() {
  return document.querySelectorAll(
    "#resumoCarrinho .lista-resumo, #resumoCarrinho .itens-resumo, #resumoCarrinho .items, #resumoCarrinho .item-resumo"
  );
}
function mostrarItensResumo(mostrar) {
  getResumoItensNodes().forEach((n) => { n.style.display = mostrar ? "" : "none"; });
}

/* ======================================================
   ATALHO: Atualiza estado visual de #selecionarTudo
   ====================================================== */
function atualizarSelecionarTudoEstado() {
  const selecionarTudo = document.getElementById("selecionarTudo");
  if (!selecionarTudo) return;
  const cbs = Array.from(document.querySelectorAll(".selecao-individual"));
  const all = cbs.length > 0 && cbs.every((x) => x.checked);
  const any = cbs.some((x) => x.checked);
  selecionarTudo.checked = all;
  selecionarTudo.indeterminate = !all && any;
}

/* ======================================================
   CONTADORES (+/−) — com remoção ao tentar ir para 0
   ====================================================== */
function ativarContadores() {
  document.querySelectorAll(".contador").forEach((contador) => {
    const produtoPai = contador.closest(".cartao-produto");
    const chaveBase  = produtoPai?.dataset.produto || null;

    contador.addEventListener("click", (evento) => {
      const botao = evento.target.closest(".botao-quantidade");
      if (!botao) return;

      const acao  = botao.dataset.acao; // "aumentar" | "diminuir"
      const chave = contador.dataset.produto === "resumo" ? "lampada" : chaveBase;
      if (!chave || !produtos[chave]) return;

      const span = contador.querySelector("[data-quantidade]") || contador.querySelector(".quantidade-atual");
      let n = parseInt(span?.textContent || "1", 10) || 1;

      // Remoção quando iria a 0
      if (acao === "diminuir" && n === 1) {
        removerItemDoCarrinho(chave, produtoPai);
        return;
      }

      if (acao === "aumentar") n++;
      if (acao === "diminuir") n = Math.max(1, n - 1);

      span.textContent = String(n);
      produtos[chave].quantidade = n;

      const textoUnidades = produtoPai?.querySelector(".texto-unidades");
      if (textoUnidades) textoUnidades.textContent = `(${n} unidade${n > 1 ? "s" : ""})`;

      if (chave === "lampada") syncLampadaToStorageFromUI();

      atualizarResumo();
      atualizarResumoSelecionados();
    });
  });
}

/* ======================================================
   REMOÇÃO DE ITEM DO CARRINHO
   ====================================================== */
function removerItemDoCarrinho(chave, card) {
  // 1) Estado interno
  if (produtos[chave]) produtos[chave].quantidade = 0;

  // 2) Seleção: desmarcar e limpar classes/ARIA/label
  const cb = card?.querySelector(".selecao-individual");
  if (cb) cb.checked = false;
  selecionados[chave] = false;
  card?.classList.remove("is-selecionado");
  updateTriggerA11y(card, false);

  // 3) Persistência: remover do bulbe:cart (se existir)
  let title = (card?.querySelector(".titulo-produto, .title, h3, h2")?.textContent || "").trim();
  let priceEl = card?.querySelector(".valor-produto, .price, [data-preco]");
  let unit = 0;
  if (priceEl?.dataset?.preco) unit = Number(priceEl.dataset.preco);
  else unit = Number((priceEl?.textContent || "0").replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", "."));
  const idGuess = `${String(title).toLowerCase().replace(/\s+/g, " ").slice(0, 200)}|${Number(unit || 0).toFixed(2)}`;
  const cartArr = loadCart();
  const idx = cartArr.findIndex((it) => it.id === idGuess);
  if (idx >= 0) { cartArr.splice(idx, 1); saveCart(cartArr); }
  const last = getLastId();
  if (last && last === idGuess) setLastId("");

  // 4) Remover o card do DOM
  if (card && typeof card.remove === "function") card.remove();
  else if (card && card.style) card.style.display = "none";

  // 5) Atualizar "selecionar tudo" + resumos
  atualizarSelecionarTudoEstado();
  atualizarResumo();
  atualizarResumoSelecionados();
}

/* ======================================================
   TOTAL GERAL (fora da barra dos selecionados)
   ====================================================== */
function atualizarResumo() {
  const qtdLamp   = produtos.lampada.quantidade;
  const valorLamp = produtos.lampada.preco * qtdLamp;
  document.querySelectorAll("#quantidadeResumoLampada").forEach((el) => (el.textContent = String(qtdLamp)));
  document.querySelectorAll("#precoResumoLampada").forEach((el) => (el.textContent = moedaBR(valorLamp)));

  const qtdParaf   = produtos.parafusadeira.quantidade;
  const valorParaf = produtos.parafusadeira.preco * qtdParaf;
  document.querySelectorAll("#quantidadeResumoParafusadeira").forEach((el) => (el.textContent = String(qtdParaf)));
  document.querySelectorAll("#precoResumoParafusadeira").forEach((el) => (el.textContent = moedaBR(valorParaf)));
}

/* ======================================================
   RESUMO (BARRA INFERIOR) — APENAS SELECIONADOS
   ====================================================== */
function atualizarResumoSelecionados() {
  const chavesSel = Object.keys(produtos).filter((k) => selecionados[k]);

  let qtdTotalSel = 0;
  let subtotalSel = 0;
  chavesSel.forEach((k) => {
    const q = Number(produtos[k].quantidade || 0);
    const p = Number(produtos[k].preco || 0);
    qtdTotalSel += q;
    subtotalSel += p * q;
  });

  const qtdResumo   = document.getElementById("quantidadeResumo");
  const precoResumo = document.getElementById("precoResumo");
  const totalResumo = document.getElementById("totalResumo");
  if (qtdResumo)   qtdResumo.textContent   = String(qtdTotalSel);
  if (precoResumo) precoResumo.textContent = moedaBR(subtotalSel);
  if (totalResumo) totalResumo.textContent = moedaBR(subtotalSel);

  const tituloResumo = document.getElementById("tituloResumo");
  const miniImg      = document.querySelector("#resumoCarrinho .item-resumo img");

  if (chavesSel.length) {
    const first = chavesSel[0];
    const card  = document.querySelector(`article.cartao-produto[data-produto="${first}"]`);
    const tituloCard = produtos[first]?.titulo || card?.querySelector(".titulo-produto, .title, h3, h2")?.textContent || "Produto";
    const imgCard    = card?.querySelector(".imagem-produto img, .img img, picture img, img");
    const src        = imgCard?.getAttribute("src") || "./assets/img/lamp.svg";
    if (tituloResumo) tituloResumo.textContent = String(tituloCard).trim();
    if (miniImg) { miniImg.src = src; miniImg.alt = String(tituloCard).trim(); }
    mostrarItensResumo(true);
  } else {
    if (tituloResumo) tituloResumo.textContent = "";
    if (miniImg) { miniImg.src = ""; miniImg.alt = ""; }
    mostrarItensResumo(false);
  }
}

/* ======================================================
   CARROSSEL E CONTINUAR (fade+redirect)
   ====================================================== */
const trilha = document.getElementById("trilhaCarrossel");
document.querySelector(".seta-carrossel.esquerda")?.addEventListener("click", () => {
  trilha?.scrollBy({ left: -trilha.clientWidth * 0.9, behavior: "smooth" });
});
document.querySelector(".seta-carrossel.direita")?.addEventListener("click", () => {
  trilha?.scrollBy({ left: +trilha.clientWidth * 0.9, behavior: "smooth" });
});

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

/* ======================================================
   IMPORTAÇÃO E PERSISTÊNCIA (lâmpada como template)
   ====================================================== */
function aplicarLampadaDoCarrinho() {
  const cart   = loadCart();
  const lastId = getLastId();
  const item   = (lastId && cart.find((it) => it.id === lastId)) || cart[0];
  if (!item) return false;

  const lamp = document.querySelector('article.cartao-produto[data-produto="lampada"]');
  if (!lamp) return false;

  // Garante que o card apareça se estava oculto pelo "carrinho vazio"
  lamp.style.display = "";

  const imgEl      = lamp.querySelector(".imagem-produto img, .img img, picture img, img");
  const titleEl    = lamp.querySelector(".titulo-produto, .title, h3, h2");
  const priceEl    = lamp.querySelector(".valor-produto, .price, [data-preco]");
  const qtdEl      = lamp.querySelector("[data-quantidade], .qtd, .quantidade");
  const unidadesEl = lamp.querySelector(".texto-unidades, .units, .info-qtd");

  if (imgEl)   { imgEl.src = resolverImgParaCarrinho(item.img); imgEl.alt = item.alt || item.title || "Produto"; }
  if (titleEl) { titleEl.innerHTML = (item.title || "Produto").replace(/\s{2,}/g, " "); }
  if (priceEl) {
    const unit = Number(item.price || 0);
    if (priceEl instanceof HTMLElement) priceEl.dataset.preco = String(unit.toFixed(2));
    priceEl.textContent = moedaBR(unit);
  }
  const q = Number(item.qty || 1);
  if (qtdEl)  qtdEl.textContent = String(q);
  if (unidadesEl) unidadesEl.textContent = `(${q} unidade${q > 1 ? "s" : ""})`;

  if (produtos.lampada) {
    produtos.lampada.titulo     = item.title || produtos.lampada.titulo;
    produtos.lampada.preco      = Number(item.price || produtos.lampada.preco);
    produtos.lampada.quantidade = q;
  }

  setLastId(item.id || "");
  return true;
}

function syncLampadaToStorageFromUI() {
  const card = document.querySelector('article.cartao-produto[data-produto="lampada"]');
  if (!card) return;

  const title   = (card.querySelector(".titulo-produto, .title, h3, h2")?.textContent || "").trim();
  const priceEl = card.querySelector(".valor-produto, .price, [data-preco]");
  const qtyEl   = card.querySelector("[data-quantidade], .qtd, .quantidade");

  const unit = priceEl?.dataset?.preco
    ? Number(priceEl.dataset.preco)
    : Number((priceEl?.textContent || "0").replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", "."));
  const qty  = Math.max(1, parseInt(qtyEl?.textContent || "1", 10) || 1);

  const id = `${String(title).toLowerCase().replace(/\s+/g, " ").slice(0, 200)}|${Number(unit || 0).toFixed(2)}`;

  const cart = loadCart();
  const ix   = cart.findIndex((it) => it.id === id);

  const imgEl = card.querySelector(".imagem-produto img, .img img, picture img, img");
  const img   = imgEl?.getAttribute("src") || "";
  const alt   = imgEl?.getAttribute("alt") || title;

  if (ix >= 0) {
    cart[ix].qty = qty;
  } else {
    cart.push({ id, title, price: Number(unit || 0), img, alt, qty });
  }
  saveCart(cart);
  setLastId(id);
}

function importarDoLocalStorage() {
  aplicarLampadaDoCarrinho();

  const raw = localStorage.getItem("bulbe:addToCart");
  if (raw) {
    try {
      const incoming = JSON.parse(raw);
      localStorage.removeItem("bulbe:addToCart");
      if (incoming && incoming.title) {
        const lamp = document.querySelector('article.cartao-produto[data-produto="lampada"]');
        if (lamp) {
          lamp.style.display = ""; // garantir visibilidade
          const imgEl      = lamp.querySelector(".imagem-produto img, .img img, picture img, img");
          const titleEl    = lamp.querySelector(".titulo-produto, .title, h3, h2");
          const priceEl    = lamp.querySelector(".valor-produto, .price, [data-preco]");
          const qtdEl      = lamp.querySelector("[data-quantidade], .qtd, .quantidade");
          const unidadesEl = lamp.querySelector(".texto-unidades, .units, .info-qtd");

          if (imgEl)   { imgEl.src = resolverImgParaCarrinho(incoming.img); imgEl.alt = incoming.alt || incoming.title || "Produto"; }
          if (titleEl) { titleEl.innerHTML = (incoming.title || "Produto").replace(/\s{2,}/g, " "); }
          if (priceEl) {
            const unit = Number(incoming.price || 0);
            if (priceEl instanceof HTMLElement) priceEl.dataset.preco = String(unit.toFixed(2));
            priceEl.textContent = moedaBR(unit);
          }
          const q = Number(incoming.qty || 1);
          if (qtdEl)  qtdEl.textContent = String(q);
          if (unidadesEl) unidadesEl.textContent = `(${q} unidade${q > 1 ? "s" : ""})`;
        }

        produtos.lampada.titulo     = incoming.title || produtos.lampada.titulo;
        produtos.lampada.preco      = Number(incoming.price || produtos.lampada.preco);
        produtos.lampada.quantidade = Number(incoming.qty || 1);

        const id  = `${String(produtos.lampada.titulo).toLowerCase().replace(/\s+/g, " ").slice(0,200)}|${Number(produtos.lampada.preco||0).toFixed(2)}`;
        const img = resolverImgParaCarrinho(incoming.img || "");
        const alt = incoming.alt || incoming.title || produtos.lampada.titulo;

        const cart = loadCart();
        const ix   = cart.findIndex((it) => it.id === id);
        if (ix >= 0) cart[ix].qty = Number(incoming.qty || 1);
        else cart.push({ id, title: produtos.lampada.titulo, price: produtos.lampada.preco, img, alt, qty: Number(incoming.qty || 1) });

        saveCart(cart);
        setLastId(id);
      }
    } catch {}
  }

  atualizarResumo();
  atualizarResumoSelecionados();
}

/* ======================================================
   CARRINHO VAZIO POR PADRÃO (se não houver storage nem payload)
   ====================================================== */
function inicializarCarrinhoVazioSeNecessario() {
  const cart = loadCart();
  const hasCart = Array.isArray(cart) && cart.length > 0;
  const hasPayload = !!localStorage.getItem("bulbe:addToCart");

  if (hasCart || hasPayload) return; // há itens → não esconder

  // Zera quantidades internas
  produtos.lampada.quantidade = 0;
  produtos.parafusadeira.quantidade = 0;

  // Oculta cards padrão
  const cLamp = document.querySelector('article.cartao-produto[data-produto="lampada"]');
  const cPar  = document.querySelector('article.cartao-produto[data-produto="parafusadeira"]');
  if (cLamp) { cLamp.style.display = "none"; cLamp.classList.remove("is-selecionado"); }
  if (cPar)  { cPar.style.display  = "none"; cPar.classList.remove("is-selecionado"); }

  // Desmarca checkboxes e rótulos → “Selecionar”
  [cLamp, cPar].forEach(card => {
    if (!card) return;
    const cb = card.querySelector(".selecao-individual");
    if (cb) cb.checked = false;
    updateTriggerA11y(card, false);
  });
  selecionados.lampada = false;
  selecionados.parafusadeira = false;

  // Resumos zerados + bloco de itens oculto
  atualizarResumo();
  atualizarResumoSelecionados();
}

/* ======================================================
   LIMPAR CARRINHO
   ====================================================== */
document.getElementById("botaoLimpar")?.addEventListener("click", limparCarrinho);
function limparCarrinho() {
  // Mantém comportamento anterior (quantidade volta a 1 nos cards presentes)
  produtos.lampada.quantidade       = 1;
  produtos.parafusadeira.quantidade = 1;

  document.querySelectorAll('[data-produto="lampada"] [data-quantidade]').forEach((el) => (el.textContent = "1"));
  document.querySelectorAll('[data-produto="parafusadeira"] [data-quantidade]').forEach((el) => (el.textContent = "1"));
  document.querySelectorAll('[data-produto="lampada"] .texto-unidades').forEach((el) => (el.textContent = "(1 unidade)"));
  document.querySelectorAll('[data-produto="parafusadeira"] .texto-unidades').forEach((el) => (el.textContent = "(1 unidade)"));

  try { localStorage.removeItem("bulbe:cart"); } catch {}
  try { localStorage.removeItem("bulbe:lastAddedId"); } catch {}

  document.querySelectorAll("article.cartao-produto").forEach(card => {
    const cb = card.querySelector(".selecao-individual");
    if (cb) cb.checked = false;
    card.classList.remove("is-selecionado");
    updateTriggerA11y(card, false); // volta rótulo para “Selecionar”
  });
  selecionados.lampada = false;
  selecionados.parafusadeira = false;

  atualizarSelecionarTudoEstado();
  atualizarResumo();
  atualizarResumoSelecionados(); // oculta bloco de itens do resumo
}

/* ======================================================
   EVENTOS: “Selecionar/Selecionado” com TOGGLE
   ====================================================== */
function onClickSelecionar(e) {
  let trigger = e.target.closest('[data-action="selecionar"], .selecionar, .texto-selecionar, .btn-selecionar, .btn-selecao');
  if (!trigger && (e.target?.textContent || "").trim().toLowerCase() === "selecionar") {
    trigger = e.target;
  }
  if (!trigger) return;

  e.preventDefault();

  const card  = trigger.closest("article.cartao-produto");
  const chave = card?.dataset.produto;
  if (!chave || !(chave in produtos)) return;

  const novoEstado = !selecionados[chave];
  selecionados[chave] = novoEstado;

  const cb = card.querySelector(".selecao-individual");
  if (cb) cb.checked = novoEstado;

  card.classList.toggle("is-selecionado", novoEstado);
  updateTriggerA11y(card, novoEstado);
  atualizarSelecionarTudoEstado();
  atualizarResumoSelecionados();
}

function onKeydownSelecionar(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const trigger = document.activeElement?.closest?.('[data-action="selecionar"], .selecionar, .texto-selecionar, .btn-selecionar, .btn-selecao');
  if (!trigger) return;
  e.preventDefault();
  trigger.click();
}

/* ======================================================
   CHECKBOXES: individuais e “Selecionar tudo”
   ====================================================== */
function bindCheckboxesSelecao() {
  const selecionarTudo = document.getElementById("selecionarTudo");
  const cbs = Array.from(document.querySelectorAll(".selecao-individual"));

  selecionarTudo?.addEventListener("change", () => {
    cbs.forEach((c) => (c.checked = selecionarTudo.checked));
    syncSelectionFromCheckboxes();
  });

  cbs.forEach((c) => {
    c.addEventListener("change", () => {
      if (selecionarTudo) {
        const all = cbs.every((x) => x.checked);
        const any = cbs.some((x) => x.checked);
        selecionarTudo.indeterminate = !all && any;
        selecionarTudo.checked = all;
      }
      syncSelectionFromCheckboxes();
    });
  });
}

function syncSelectionFromCheckboxes() {
  document.querySelectorAll("article.cartao-produto").forEach((card) => {
    const k  = card.dataset.produto;
    if (!k || !(k in produtos)) return;
    const cb = card.querySelector(".selecao-individual");
    const isOn = cb ? !!cb.checked : false;
    selecionados[k] = isOn;
    card.classList.toggle("is-selecionado", isOn);
    updateTriggerA11y(card, isOn);
  });
  atualizarSelecionarTudoEstado();
  atualizarResumoSelecionados();
}

/* ======================================================
   INICIALIZAÇÃO (com proteção contra listeners duplicados)
   ====================================================== */
function init() {
  if (window.__bulbeCartInit) return;
  window.__bulbeCartInit = true;

  injectSelecionarStyles();
  enhanceSelecionarUI();

  // Estado inicial: SEM selecionados
  document.querySelectorAll(".selecao-individual").forEach((cb) => (cb.checked = false));
  selecionados.lampada = false;
  selecionados.parafusadeira = false;
  const selecionarTudo = document.getElementById("selecionarTudo");
  if (selecionarTudo) { selecionarTudo.checked = false; selecionarTudo.indeterminate = false; }

  // Carrinho vazio por padrão (se não houver storage/payload)
  inicializarCarrinhoVazioSeNecessario();

  bindCheckboxesSelecao();
  ativarContadores();
  importarDoLocalStorage();

  // Delegação única
  document.addEventListener("click", onClickSelecionar);
  document.addEventListener("keydown", onKeydownSelecionar);

  atualizarResumo();
  atualizarResumoSelecionados();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}

// Reexecuta quando voltar via bfcache
window.addEventListener("pageshow", (ev) => {
  if (ev.persisted) {
    enhanceSelecionarUI();
    atualizarResumo();
    atualizarResumoSelecionados();
  }
});
