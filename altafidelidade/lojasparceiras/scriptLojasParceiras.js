
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

//menu categoria
document.addEventListener("DOMContentLoaded", function() {
    const btnCategorias = document.getElementById("btn-categorias");
    const menuCategorias = document.getElementById("menu-categorias");
    const fecharMenu = document.getElementById("fechar-menu");

    btnCategorias.addEventListener("click", function(e) {
        e.preventDefault();
        menuCategorias.classList.add("active");
    });

    fecharMenu.addEventListener("click", function() {
        menuCategorias.classList.remove("active");
    });

    // Fecha o menu ao clicar fora do conteúdo
    menuCategorias.addEventListener("click", function(e) {
        if (e.target === menuCategorias) {
            menuCategorias.classList.remove("active");
        }
    });
});

//icones que preenchem
// Toggle dos ícones (preencher com a cor ao clicar)

document.querySelectorAll('.icon-btn').forEach(btn => {
    btn.addEventListener('click', (event) => {
        event.stopPropagation(); // impede que o clique afete o card
        btn.classList.toggle('active');
    });
});