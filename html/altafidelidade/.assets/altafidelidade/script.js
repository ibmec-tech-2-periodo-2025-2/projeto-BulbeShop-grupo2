document.addEventListener("DOMContentLoaded", () => {
  /* ===== Header condensado com animação ===== */
  const header = document.getElementById("siteHeader");
  const THRESHOLD = 20;
  const onScroll = () => {
    if (window.scrollY > THRESHOLD) header.classList.add("is-condensed");
    else header.classList.remove("is-condensed");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ===== Busca ===== */
  const wireSearch = (form) => {
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = form.querySelector('input[type="search"]')?.value?.trim();
      if (q) alert(`Busca por: ${q}`);
    });
  };
  wireSearch(document.querySelector("header .search"));
  wireSearch(document.querySelector("header .search--condensed"));

  /* ===== Galeria ===== */
  const galleryImg = document.getElementById("gallery-img");
  const dots = document.querySelectorAll(".dots .dot");
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      dots.forEach((d) => d.classList.remove("is-active"));
      dot.classList.add("is-active");
      const src = dot.getAttribute("data-src");
      if (src && galleryImg) galleryImg.src = src;
    });
  });

  /* ===== Chips (cor/voltagem) ===== */
  function wireChipGroup(container) {
    const chips = container.querySelectorAll(".chip");
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
      });
    });
  }
  document.querySelectorAll(".variations .choices").forEach(wireChipGroup);

  /* ===== Quantidade ===== */
  const qtySelect = document.querySelector("#qty-select");
  const qtyLabel  = document.querySelector("#qty-label");
  if (qtySelect && qtyLabel) {
    qtySelect.addEventListener("change", () => {
      qtyLabel.textContent = qtySelect.value;
    });
  }

  /* ===== Comprar / Adicionar ao carrinho ===== */
  const btnBuy = document.getElementById("btn-buy");
  const btnAdd = document.getElementById("btn-add");

  if (btnBuy) {
    btnBuy.addEventListener("click", () => {
      const color   = document.querySelector('[data-variation="color"] .chip.is-active')?.textContent?.trim();
      const voltage = document.querySelector('[data-variation="voltage"] .chip.is-active')?.textContent?.trim();
      const qty     = qtySelect?.value || 1;
      alert(`Comprar agora:\nCor: ${color}\nVoltagem: ${voltage}\nQtd: ${qty}`);
    });
  }

  if (btnAdd) {
    btnAdd.addEventListener("click", () => {
      const color   = document.querySelector('[data-variation="color"] .chip.is-active')?.textContent?.trim();
      const voltage = document.querySelector('[data-variation="voltage"] .chip.is-active')?.textContent?.trim();
      const qty     = qtySelect?.value || 1;
      alert(`Adicionado ao carrinho:\nCor: ${color}\nVoltagem: ${voltage}\nQtd: ${qty}`);
    });
  }

  /* ===== Favoritar (produto principal) -> curtidos ===== */
  const goToLiked = () => (window.location.href = "./produtos-curtidos.html");
  const btnFav = document.getElementById("btn-fav");
  if (btnFav) {
    btnFav.style.cursor = "pointer";
    btnFav.addEventListener("click", () => {
      const on = btnFav.dataset.on === "1";
      btnFav.dataset.on = on ? "0" : "1";
      btnFav.src = on
        ? "./.assets/altafidelidade/img/heart-outline.png"
        : "./.assets/altafidelidade/img/Exclude.png"; // coração preenchido
      if (!on) setTimeout(goToLiked, 200);
    });
  }

  /* ===== Curtir nas tiles: troca carrinho -> atalho curtidos ===== */
  function replaceCartWithLiked(tile) {
    const cart = tile.querySelector(".icon-cart");
    if (!cart) return;
    const img = document.createElement("img");
    img.src = "./.assets/altafidelidade/img/share-01.png";
    img.alt = "Ver produtos curtidos";
    img.className = "icon-liked";
    img.style.width = "20px";
    img.style.height = "20px";
    cart.replaceWith(img);
    img.addEventListener("click", (e) => {
      e.preventDefault();
      goToLiked();
    });
  }
  function restoreCartIcon(tile) {
    const liked = tile.querySelector(".icon-liked");
    if (!liked) return;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "icon-cart");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.innerHTML =
      '<path fill="currentColor" d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.16 14h9.45c.75 0 1.4-.41 1.73-1.03l3.24-6.16A1 1 0 0 0 20.7 5H6.21L5.27 3H2v2h2l3.6 7.59-1.35 2.44C5.52 16.37 6.48 18 8 18h12v-2H8l1.16-2z"/>';
    liked.replaceWith(svg);
  }
  document.querySelectorAll(".tile .btn-fav").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const tile = btn.closest(".tile");
      const on = btn.dataset.on === "1";
      btn.dataset.on = on ? "0" : "1";
      btn.src = on
        ? "./.assets/altafidelidade/img/heart-outline.png"
        : "./.assets/altafidelidade/img/Exclude.png";
      if (!on) {
        replaceCartWithLiked(tile);
        setTimeout(goToLiked, 160);
      } else {
        restoreCartIcon(tile);
      }
    });
  });
});
