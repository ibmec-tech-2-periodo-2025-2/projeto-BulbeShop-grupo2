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

// Abrir Modal
document.getElementById("btnModal").addEventListener("click", () => {
    document.getElementById("modalCashback").style.display = "flex";
});

// Fechar Modal
document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("modalCashback").style.display = "none";
});

// Fechar ao clicar fora do conteúdo
window.addEventListener("click", (e) => {
    const modal = document.getElementById("modalCashback");
    if (e.target === modal) modal.style.display = "none";
});