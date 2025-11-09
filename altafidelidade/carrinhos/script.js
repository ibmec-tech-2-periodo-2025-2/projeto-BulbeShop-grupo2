/* ======================================================
   CARRINHO (BulbeShop) — script.js
   - "Selecionar" vira botão funcional (toggle) por produto
   - Resumo de compra mostra APENAS itens selecionados
   - Se não houver selecionados: OCULTA a barra de itens do resumo
     (apenas o bloco dos itens; o footer/total permanece)
   - Mantém: voltar, carrossel, +/−, continuar (fade+redirect), limpar, persistência
   - Não cria arquivos/HTML/CSS e não altera IDs/classes existentes
   ====================================================== */

/* ==== BOTÃO VOLTAR ==== */
document.getElementById("botaoVoltar")?.addEventListener("click", () => history.back());

/* ==== FORMATADORES ==== */
const formatoBR = (n) => (Number(n) || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const moedaBR   = (n) => `R$${formatoBR(n)}`;

/* ==== ESTADO INICIAL (espelho do template do seu HTML) ==== */
const produtos = {
  lampada:       { titulo: "Lâmpada de LED E27 Bulbo 9W 803lm Luz Branca Bivolt Black + Decker", preco: 4.59,  quantidade: 5 },
  parafusadeira: { titulo: "Parafusadeira Philco Force PPF120 3 em 1 1500RPM",                    preco: 199.9, quantidade: 1 },
};

/* ==== SELEÇÃO (quais entram no RESUMO) — começa tudo desmarcado ==== */
const selecionados = { lampada: false, parafusadeira: false };

/* ==== PERSISTÊNCIA DO CARRINHO ==== */
function loadCart() { try { return JSON.parse(localStorage.getItem("bulbe:cart")) || []; } catch { return []; } }
function saveCart(arr) { try { localStorage.setItem("bulbe:cart", JSON.stringify(arr)); } catch {} }
function getLastId() { try { return localStorage.getItem("bulbe:lastAddedId") || ""; } catch { return ""; } }
function setLastId(id) { try { localStorage.setItem("bulbe:lastAddedId", id || ""); } catch {} }
function resolverImgParaCarrinho(p) { if (!p) return "./assets/img/lamp.svg"; if (p.startsWith("./img/")) return "../home/" + p.slice(2); return p; }

/* ======================================================
   HELPERS — BLOCO DOS ITENS NA BARRA DE RESUMO
   (não alteramos HTML/CSS; apenas controlamos display via JS)
   ====================================================== */
function getResumoItensNodes() {
  // tente os contêineres mais comuns do "bloco de itens" do resumo
  return document.querySelectorAll(
    "#resumoCarrinho .lista-resumo, #resumoCarrinho .itens-resumo, #resumoCarrinho .items, #resumoCarrinho .item-resumo"
  );
}
function mostrarItensResumo(mostrar) {
  getResumoItensNodes().forEach((n) => {
    n.style.display = mostrar ? "" : "none";
  });
}

/* ======================================================
   CONTADORES (+/−) DOS CARDS
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

      if (acao === "aumentar") n++;
      if (acao === "diminuir") n = Math.max(1, n - 1);

      span.textContent = String(n);
      produtos[chave].quantidade = n;

      // "(N unidades)" no card
      const textoUnidades = produtoPai?.querySelector(".texto-unidades");
      if (textoUnidades) textoUnidades.textContent = `(${n} unidade${n > 1 ? "s" : ""})`;

      // se mudou a lâmpada, refletir no storage do carrinho
      if (chave === "lampada") syncLampadaToStorageFromUI();

      // Atualizações
      atualizarResumo();             // totais gerais do carrinho (todos os itens)
      atualizarResumoSelecionados(); // apenas itens selecionados na barra inferior
    });
  });
}

/* ======================================================
   TOTAL GERAL DO CARRINHO (todos os itens, independente de seleção)
   ====================================================== */
function calcularTotalCarrinho() {
  return produtos.lampada.preco       * produtos.lampada.quantidade +
         produtos.parafusadeira.preco * produtos.parafusadeira.quantidade;
}

/* Mantém seu painel/área de totais ORIGINAL (fora da barra dos selecionados) */
function atualizarResumo() {
  // Lâmpada
  const qtdLamp   = produtos.lampada.quantidade;
  const valorLamp = produtos.lampada.preco * qtdLamp;
  document.querySelectorAll("#quantidadeResumoLampada").forEach((el) => (el.textContent = String(qtdLamp)));
  document.querySelectorAll("#precoResumoLampada").forEach((el) => (el.textContent = moedaBR(valorLamp)));

  // Parafusadeira
  const qtdParaf   = produtos.parafusadeira.quantidade;
  const valorParaf = produtos.parafusadeira.preco * qtdParaf;
  document.querySelectorAll("#quantidadeResumoParafusadeira").forEach((el) => (el.textContent = String(qtdParaf)));
  document.querySelectorAll("#precoResumoParafusadeira").forEach((el) => (el.textContent = moedaBR(valorParaf)));
}

/* ======================================================
   RESUMO DE COMPRA (BARRA INFERIOR) — APENAS SELECIONADOS
   - Se não houver selecionados, oculta o bloco dos itens do resumo
   ====================================================== */
function atualizarResumoSelecionados() {
  // chaves atualmente selecionadas
  const chavesSel = Object.keys(produtos).filter((k) => selecionados[k]);

  // soma apenas selecionados
  let qtdTotalSel = 0;
  let subtotalSel = 0;
  chavesSel.forEach((k) => {
    const q = Number(produtos[k].quantidade || 0);
    const p = Number(produtos[k].preco || 0);
    qtdTotalSel += q;
    subtotalSel += p * q;
  });

  // Atualiza barra inferior (conteúdo, sem mexer em visibilidade do footer)
  const qtdResumo   = document.getElementById("quantidadeResumo");
  const precoResumo = document.getElementById("precoResumo");
  const totalResumo = document.getElementById("totalResumo"); // na barra, exibir o total dos selecionados
  if (qtdResumo)   qtdResumo.textContent   = String(qtdTotalSel);
  if (precoResumo) precoResumo.textContent = moedaBR(subtotalSel);
  if (totalResumo) totalResumo.textContent = moedaBR(subtotalSel);

  // Título e mini-imagem do primeiro selecionado (ou limpa se vazio)
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
    mostrarItensResumo(true);  // <-- há selecionados: mostra o bloco dos itens
  } else {
    if (tituloResumo) tituloResumo.textContent = "";
    if (miniImg) { miniImg.src = ""; miniImg.alt = ""; }
    mostrarItensResumo(false); // <-- sem selecionados: esconde o bloco dos itens
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
   IMPORTAR ITEM DA HOME + PERSISTÊNCIA (lâmpada)
   ====================================================== */
function aplicarLampadaDoCarrinho() {
  const cart   = loadCart();
  const lastId = getLastId();
  const item   = (lastId && cart.find((it) => it.id === lastId)) || cart[0];
  if (!item) return false;

  const lamp = document.querySelector('article.cartao-produto[data-produto="lampada"]');
  if (!lamp) return false;

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

  // estado interno
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
  aplicarLampadaDoCarrinho(); // tenta persistente

  const raw = localStorage.getItem("bulbe:addToCart");
  if (raw) {
    try {
      const incoming = JSON.parse(raw);
      localStorage.removeItem("bulbe:addToCart");
      if (incoming && incoming.title) {
        const lamp = document.querySelector('article.cartao-produto[data-produto="lampada"]');
        if (lamp) {
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

        // estado
        produtos.lampada.titulo     = incoming.title || produtos.lampada.titulo;
        produtos.lampada.preco      = Number(incoming.price || produtos.lampada.preco);
        produtos.lampada.quantidade = Number(incoming.qty || 1);

        // merge persistente
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
  atualizarResumoSelecionados(); // resumo segue apenas selecionados; oculta bloco se vazio
}

/* ======================================================
   LIMPAR CARRINHO — limpa seleção e zera resumo (sem esconder footer)
   ====================================================== */
document.getElementById("botaoLimpar")?.addEventListener("click", limparCarrinho);
function limparCarrinho() {
  // reset quantidades visuais (mantém 1 pra não quebrar layout do card)
  produtos.lampada.quantidade       = 1;
  produtos.parafusadeira.quantidade = 1;

  document.querySelectorAll('[data-produto="lampada"] [data-quantidade]').forEach((el) => (el.textContent = "1"));
  document.querySelectorAll('[data-produto="parafusadeira"] [data-quantidade]').forEach((el) => (el.textContent = "1"));
  document.querySelectorAll('[data-produto="lampada"] .texto-unidades').forEach((el) => (el.textContent = "(1 unidade)"));
  document.querySelectorAll('[data-produto="parafusadeira"] .texto-unidades').forEach((el) => (el.textContent = "(1 unidade)"));

  // zera carrinho persistente
  try { localStorage.removeItem("bulbe:cart"); } catch {}
  try { localStorage.removeItem("bulbe:lastAddedId"); } catch {}

  // zera seleção (checkboxes e estado)
  document.querySelectorAll(".selecao-individual").forEach((cb) => (cb.checked = false));
  selecionados.lampada = false;
  selecionados.parafusadeira = false;
  const selecionarTudo = document.getElementById("selecionarTudo");
  if (selecionarTudo) { selecionarTudo.checked = false; selecionarTudo.indeterminate = false; }

  // atualizações
  atualizarResumo();             // totais gerais
  atualizarResumoSelecionados(); // resumo zerado e bloco de itens oculto
}

/* ======================================================
   SELEÇÃO: "Selecionar" (texto/botão) + checkboxes
   ====================================================== */

// Delegação para o texto/botão "Selecionar"
document.addEventListener("click", (e) => {
  let trigger = e.target.closest('[data-action="selecionar"], .selecionar, .texto-selecionar, .btn-selecionar');
  if (!trigger && (e.target?.textContent || "").trim().toLowerCase() === "selecionar") {
    trigger = e.target;
  }
  if (!trigger) return;

  const card  = trigger.closest("article.cartao-produto");
  const chave = card?.dataset.produto;
  if (!chave || !produtos[chave]) return;

  // alterna seleção
  const novo = !Boolean(selecionados[chave]);
  selecionados[chave] = novo;

  // sincronia com checkbox (se existir) e classe visual opcional
  const cb = card.querySelector(".selecao-individual");
  if (cb) cb.checked = novo;
  card.classList.toggle("is-selecionado", novo);

  // manter coerência do "selecionar tudo"
  const selecionarTudo = document.getElementById("selecionarTudo");
  if (selecionarTudo) {
    const cards = Object.keys(produtos);
    const vals  = cards.map((k) => !!selecionados[k]);
    const all   = vals.every(Boolean);
    const any   = vals.some(Boolean);
    selecionarTudo.checked = all;
    selecionarTudo.indeterminate = !all && any;
  }

  atualizarResumoSelecionados();
});

// Teclado acessível para "Selecionar" (Enter/Espaço)
document.addEventListener("keydown", (e) => {
  const isEnterOrSpace = (e.key === "Enter" || e.key === " ");
  if (!isEnterOrSpace) return;
  const trigger = document.activeElement?.closest?.('[data-action="selecionar"], .selecionar, .texto-selecionar, .btn-selecionar');
  if (!trigger) return;
  e.preventDefault();
  trigger.click();
});

// Checkboxes individuais
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

// Sincroniza o objeto "selecionados" a partir dos checkboxes
function syncSelectionFromCheckboxes() {
  document.querySelectorAll("article.cartao-produto").forEach((card) => {
    const k  = card.dataset.produto;
    if (!k || !(k in produtos)) return;
    const cb = card.querySelector(".selecao-individual");
    const isOn = cb ? !!cb.checked : false;
    selecionados[k] = isOn;
    card.classList.toggle("is-selecionado", isOn);
  });
  atualizarResumoSelecionados();
}

/* ======================================================
   INICIALIZAÇÃO
   ====================================================== */
function init() {
  // Inicia SEM itens no resumo: força todos desmarcados
  document.querySelectorAll(".selecao-individual").forEach((cb) => (cb.checked = false));
  selecionados.lampada = false;
  selecionados.parafusadeira = false;
  const selecionarTudo = document.getElementById("selecionarTudo");
  if (selecionarTudo) { selecionarTudo.checked = false; selecionarTudo.indeterminate = false; }

  bindCheckboxesSelecao();
  ativarContadores();
  importarDoLocalStorage(); // aplica item salvo (se houver)

  // Atualiza áreas
  atualizarResumo();             // totais gerais (não mexe no bloco de itens)
  atualizarResumoSelecionados(); // resumo inicia zerado e bloco dos itens oculto
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
