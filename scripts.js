// Rolagem suave dos carrosséis
const carrosseis = document.querySelectorAll(".produtos");
carrosseis.forEach(carrossel => {
  carrossel.addEventListener("wheel", (e) => {
    e.preventDefault();
    carrossel.scrollLeft += e.deltaY;
  });
});

// === PLACEHOLDER ANIMADO ===
const searchInput = document.getElementById("input-pesquisa");
const text = "Clique aqui para buscar produtos";
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

// Toggle dos ícones (preencher com a cor ao clicar)
document.querySelectorAll('.icon-btn').forEach(btn => {
    btn.addEventListener('click', (event) => {
        event.stopPropagation(); // impede que o clique afete o card
        btn.classList.toggle('active');
    });
});
