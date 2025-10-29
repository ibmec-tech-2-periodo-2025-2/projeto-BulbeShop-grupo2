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