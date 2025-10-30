// Seleciona elementos
const menuBtn = document.getElementById("menu-btn");
const sideMenu = document.getElementById("side-menu");
const overlay = document.getElementById("overlay");

// Abre o menu
menuBtn.addEventListener("click", () => {
    sideMenu.classList.add("active");
    overlay.classList.add("active");
});

// Fecha o menu ao clicar fora
overlay.addEventListener("click", () => {
    sideMenu.classList.remove("active");
    overlay.classList.remove("active");
});

// === MENU DE FILTRO ===
const filterBtn = document.getElementById("filter-btn");
const filterMenu = document.getElementById("filter-menu");

filterBtn.addEventListener("click", () => {
    filterMenu.style.display =
        filterMenu.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", (e) => {
    if (!filterBtn.contains(e.target) && !filterMenu.contains(e.target)) {
        filterMenu.style.display = "none";
    }
});

// === PLACEHOLDER ANIMADO ===
const searchInput = document.getElementById("search-input");
const text = "Busque por marcas, categorias ou produtos";
let index = 0;

function typeEffect() {
    if (index < text.length) {
        searchInput.setAttribute("placeholder", text.slice(0, index + 1));
        index++;
        setTimeout(typeEffect, 80);
    } else {
        // Espera e reinicia
        setTimeout(() => {
            index = 0;
            searchInput.setAttribute("placeholder", "");
            typeEffect();
        }, 2000);
    }
}

typeEffect();

// Rolagem suave com clique e arraste (melhor usabilidade mobile)
const navScroll = document.querySelector(".nav-scroll");
let isDown = false;
let startX;
let scrollLeft;

navScroll.addEventListener("mousedown", (e) => {
    isDown = true;
    navScroll.classList.add("active");
    startX = e.pageX - navScroll.offsetLeft;
    scrollLeft = navScroll.scrollLeft;
});

navScroll.addEventListener("mouseleave", () => {
    isDown = false;
});

navScroll.addEventListener("mouseup", () => {
    isDown = false;
});

navScroll.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - navScroll.offsetLeft;
    const walk = (x - startX) * 2; // Velocidade do arrasto
    navScroll.scrollLeft = scrollLeft - walk;
});

//CATEGORIAS
document.querySelectorAll('.categoria').forEach(item => {
    item.addEventListener('click', () => {
        window.location.href = item.dataset.url;
    });
});

// Modal "Saiba Mais"
const openBtn = document.getElementById("saibaMaisBtn");
const modal = document.getElementById("modalCashback");
const toClose = document.querySelectorAll("[data-close]");

let lastFocused = null;

function openModal() {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.hidden = false;

    const firstFocus = modal.querySelector("button, .btn-primary");
    if (firstFocus) firstFocus.focus();

    document.body.style.overflow = "hidden"; // trava scroll do fundo
}
function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
}

if (openBtn) openBtn.addEventListener("click", openModal);
toClose.forEach(el => el.addEventListener("click", closeModal));
document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal && !modal.hidden) closeModal();
});

//icones que preenchem
// Toggle dos ícones (preencher com a cor ao clicar)

document.querySelectorAll('.icon-btn').forEach(btn => {
    btn.addEventListener('click', (event) => {
        event.stopPropagation(); // impede que o clique afete o card
        btn.classList.toggle('active');
    });
});