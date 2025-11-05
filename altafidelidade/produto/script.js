/* =========================================================
   Bulbe • Produto — script.js
   ========================================================= */

/* --------- Caminhos de imagens --------- */
const IMG_BASE           = "./.assets/altafidelidade/img/";
const IMG_HEART_OUTLINE  = IMG_BASE + "./img/heart-outline.png";
const IMG_HEART_FILLED   = IMG_BASE + "./img/Exclude.png"; // coração cheio (laranja)

/* =========================================================
   Header condensado no scroll
   ========================================================= */
(() => {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  const THRESHOLD = 24;
  let ticking = false;
  let active  = false;

  const setCondensed = (on) => {
    if (active === on) return;
    active = on;
    header.classList.toggle("is-condensed", on);
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      setCondensed(window.scrollY > THRESHOLD);
      ticking = false;
    });
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

/* =========================================================
   Busca
   ========================================================= */
function wireSearch(form) {
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = form.querySelector('input[type="search"]')?.value?.trim();
    if (q) alert(`Busca por: ${q}`);
  });
}
wireSearch(document.querySelector(".search"));
wireSearch(document.querySelector(".search--condensed"));

/* =========================================================
   Galeria
   ========================================================= */
(() => {
  const img  = document.getElementById("gallery-img");
  const dots = document.querySelectorAll(".dots .dot");
  if (!img || !dots.length) return;
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      dots.forEach((d) => d.classList.remove("is-active"));
      dot.classList.add("is-active");
      const src = dot.getAttribute("data-src");
      if (src) img.src = src;
    });
  });
})();

/* =========================================================
   Chips (cor/voltagem)
   ========================================================= */
document.querySelectorAll(".variations .choices").forEach((group) => {
  const chips = group.querySelectorAll(".chip");
  chips.forEach((chip) =>
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
    })
  );
});

/* =========================================================
   Quantidade
   ========================================================= */
(() => {
  const sel = document.getElementById("qty-select");
  const lab = document.getElementById("qty-label");
  if (!sel || !lab) return;
  sel.addEventListener("change", () => (lab.textContent = sel.value));
})();

/* =========================================================
   Comprar / Adicionar (demo)
   ========================================================= */
const getSelection = () => ({
  color:   document.querySelector('[data-variation="color"] .chip.is-active')?.textContent?.trim(),
  voltage: document.querySelector('[data-variation="voltage"] .chip.is-active')?.textContent?.trim(),
  qty:     document.getElementById("qty-select")?.value || 1
});

document.getElementById("btn-buy")?.addEventListener("click", () => {
  const s = getSelection();
  alert(`Comprar agora:\nCor: ${s.color}\nVoltagem: ${s.voltage}\nQtd: ${s.qty}`);
});

document.getElementById("btn-add")?.addEventListener("click", () => {
  const s = getSelection();
  alert(`Adicionado ao carrinho:\nCor: ${s.color}\nVoltagem: ${s.voltage}\nQtd: ${s.qty}`);
});

/* =========================================================
   Snackbar (toast)
   ========================================================= */
function showToast(msg) {
  const el = document.getElementById("snackbar");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("is-show");
  clearTimeout(showToast.__t);
  showToast.__t = setTimeout(() => el.classList.remove("is-show"), 2200);
}

/* =========================================================
   Likes (Curtidos) com persistência localStorage
   ========================================================= */
const LS_KEY_LIKES = "bulbe_likes_v1";

/* Lê o conjunto de curtidos */
function getLikes() {
  try {
    const raw = localStorage.getItem(LS_KEY_LIKES);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

/* Salva o conjunto de curtidos */
function setLikes(set) {
  try {
    localStorage.setItem(LS_KEY_LIKES, JSON.stringify(Array.from(set)));
  } catch {}
}

/* Verifica se id está curtido */
function isLiked(id) {
  return getLikes().has(id);
}

/* Define estado de curtido para um id */
function setLike(id, liked) {
  const set = getLikes();
  if (liked) set.add(id);
  else set.delete(id);
  setLikes(set);
}

/* Pinta o coração e ajusta acessibilidade */
function paintHeart(btn, liked) {
  btn.src = liked ? IMG_HEART_FILLED : IMG_HEART_OUTLINE;
  btn.dataset.on = liked ? "1" : "0";
  btn.setAttribute("aria-pressed", liked ? "true" : "false");
}

/* Alterna curtido de um botão específico */
function toggleLike(btn, announce = true) {
  const id = btn.getAttribute("data-like-id") || btn.id || Math.random().toString(36).slice(2);
  const liked = !isLiked(id);
  setLike(id, liked);
  paintHeart(btn, liked);
  if (announce) {
    showToast(liked ? 'Adicionado aos Curtidos' : 'Removido dos Curtidos');
  }
}

/* Inicializa todos os botões de curtir */
function initLikes() {
  const allHearts = document.querySelectorAll('.btn-fav, #btn-fav');
  allHearts.forEach((btn) => {
    // Estado inicial conforme localStorage
    const id = btn.getAttribute("data-like-id") || btn.id || "";
    const liked = id ? isLiked(id) : false;
    paintHeart(btn, liked);

    // Clique
    btn.style.cursor = "pointer";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      toggleLike(btn, true);
    });

    // Teclado (Enter/Espaço)
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleLike(btn, true);
      }
    });
  });
}
initLikes();

/* =========================================================
   Rating inline (estrelas parcialmente preenchidas)
   ========================================================= */
(function applyInlineRating() {
  document.querySelectorAll(".rating-inline").forEach((b) => {
    const rating = Math.max(0, Math.min(5, parseFloat(b.dataset.rating || "0")));
    const count  = parseInt(b.dataset.count || "0", 10);
    const stars  = b.querySelector(".rating-stars");
    const num    = b.querySelector(".rating-number");
    const cnt    = b.querySelector(".rating-count");

    if (stars) {
      const pct = Math.min(99.4, (rating / 5) * 100); // >99% vira 100% visual, então limito um pouco
      stars.style.setProperty("--percent", pct.toFixed(2));
    }
    if (num) num.textContent = rating.toFixed(1).replace(".", ",");
    if (cnt) cnt.textContent = `(${count})`;
  });
})();
