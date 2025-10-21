/* =========================================================
   Bulbe • Produto — script.js
   ========================================================= */

/* Caminhos das imagens (ajuste se necessário) */
const IMG_BASE = "./.assets/altafidelidade/img/";
const IMG_HEART_OUTLINE = IMG_BASE + "heart-outline.png";
const IMG_HEART_FILLED  = IMG_BASE + "Exclude.png";

/* ===== Header: condensa ao scroll (barra superior some) ===== */
(() => {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  const THRESHOLD = 24;   // rolagem mínima para condensar
  let ticking = false;
  let active = false;

  function setCondensed(on){
    if (active === on) return;
    active = on;
    header.classList.toggle("is-condensed", on);
  }

  function onScroll(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      setCondensed(window.scrollY > THRESHOLD);
      ticking = false;
    });
  }

  // Estado correto ao carregar e nas rolagens:
  onScroll();
  window.addEventListener("scroll", onScroll, { passive:true });
})();

/* ===== Busca (normal/condensada) ===== */
function wireSearch(form){
  if(!form) return;
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const q = form.querySelector('input[type="search"]')?.value?.trim();
    if(q) alert(`Busca por: ${q}`);
  });
}
wireSearch(document.querySelector(".search"));
wireSearch(document.querySelector(".search--condensed"));

/* ===== Galeria ===== */
(() => {
  const img  = document.getElementById("gallery-img");
  const dots = document.querySelectorAll(".dots .dot");
  if(!img || !dots.length) return;
  dots.forEach(dot=>{
    dot.addEventListener("click", ()=>{
      dots.forEach(d=>d.classList.remove("is-active"));
      dot.classList.add("is-active");
      const src = dot.getAttribute("data-src");
      if(src) img.src = src;
    });
  });
})();

/* ===== Chips (cor/voltagem) ===== */
document.querySelectorAll(".variations .choices").forEach(group=>{
  const chips = group.querySelectorAll(".chip");
  chips.forEach(chip=>chip.addEventListener("click", ()=>{
    chips.forEach(c=>c.classList.remove("is-active"));
    chip.classList.add("is-active");
  }));
});

/* ===== Quantidade ===== */
(() => {
  const sel = document.getElementById("qty-select");
  const lab = document.getElementById("qty-label");
  if(!sel || !lab) return;
  sel.addEventListener("change", ()=> lab.textContent = sel.value);
})();

/* ===== Comprar / Adicionar (demo) ===== */
const getSelection = () => ({
  color:   document.querySelector('[data-variation="color"] .chip.is-active')?.textContent?.trim(),
  voltage: document.querySelector('[data-variation="voltage"] .chip.is-active')?.textContent?.trim(),
  qty:     document.getElementById("qty-select")?.value || 1
});

document.getElementById("btn-buy")?.addEventListener("click", ()=>{
  const s = getSelection();
  alert(`Comprar agora:\nCor: ${s.color}\nVoltagem: ${s.voltage}\nQtd: ${s.qty}`);
});

document.getElementById("btn-add")?.addEventListener("click", ()=>{
  const s = getSelection();
  alert(`Adicionado ao carrinho:\nCor: ${s.color}\nVoltagem: ${s.voltage}\nQtd: ${s.qty}`);
});

/* ===== Favoritar (produto principal) ===== */
(() => {
  const btn = document.getElementById("btn-fav");
  if(!btn) return;
  btn.style.cursor = "pointer";
  btn.addEventListener("click", ()=>{
    const on = btn.dataset.on === "1";
    btn.dataset.on = on ? "0" : "1";
    btn.src = on ? IMG_HEART_OUTLINE : IMG_HEART_FILLED;
  });
})();

/* ===== Favoritar nas tiles ===== */
document.querySelectorAll(".tile .btn-fav").forEach(btn=>{
  btn.addEventListener("click", (e)=>{
    e.preventDefault();
    const on = btn.dataset.on === "1";
    btn.dataset.on = on ? "0" : "1";
    btn.src = on ? IMG_HEART_OUTLINE : IMG_HEART_FILLED;
  });
});

/* ===== Rating à direita (estrelas parcialmente preenchidas) ===== */
(function applyInlineRating(){
  document.querySelectorAll('.rating-inline').forEach(b=>{
    const rating = Math.max(0, Math.min(5, parseFloat(b.dataset.rating || '0')));
    const count  = parseInt(b.dataset.count || '0', 10);
    const stars  = b.querySelector('.rating-stars');
    const num    = b.querySelector('.rating-number');
    const cnt    = b.querySelector('.rating-count');

    if (stars) {
      // 4.7 => ~94%; limitamos < 100% para evidenciar o “parcial”
      const pct = Math.min(99.4, (rating / 5) * 100);
      stars.style.setProperty('--percent', pct.toFixed(2));
    }
    if (num) num.textContent = rating.toFixed(1).replace('.', ',');
    if (cnt) cnt.textContent = `(${count})`;
  });
})();
/* Snackbar (toast) */
function showToast(msg){
  const el = document.getElementById('snackbar');
  if(!el) return;
  el.textContent = msg;
  el.classList.add('is-show');
  clearTimeout(showToast.__t);
  showToast.__t = setTimeout(()=> el.classList.remove('is-show'), 2200);
}

/* Integre nos fluxos existentes */
document.getElementById("btn-add")?.addEventListener("click", ()=>{
  const s = getSelection();
  showToast(`Adicionado ao carrinho • Qtd ${s.qty}`);
});

document.getElementById("btn-buy")?.addEventListener("click", ()=>{
  const s = getSelection();
  showToast(`Indo para compra • ${s.color} • ${s.voltage}`);
});

document.getElementById("btn-fav")?.addEventListener("click", function(){
  const on = this.dataset.on === "1";
  this.dataset.on = on ? "0" : "1";
  this.src = on ? IMG_HEART_OUTLINE : IMG_HEART_FILLED;
  showToast(on ? "Removido dos curtidos" : "Adicionado aos curtidos");
});

document.querySelectorAll(".tile .btn-fav").forEach(btn=>{
  btn.addEventListener("click", (e)=>{
    e.preventDefault();
    const on = btn.dataset.on === "1";
    btn.dataset.on = on ? "0" : "1";
    btn.src = on ? IMG_HEART_OUTLINE : IMG_HEART_FILLED;
    showToast(on ? "Removido dos curtidos" : "Adicionado aos curtidos");
  });
});
