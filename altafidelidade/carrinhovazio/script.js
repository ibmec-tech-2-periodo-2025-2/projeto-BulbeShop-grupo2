// Exemplo básico para botão de voltar
document.querySelector(".btn-voltar").addEventListener("click", () => {
    window.history.back();
});

// Exemplo simples de curtir produto
const coracoes = document.querySelectorAll(".icone:last-child");

coracoes.forEach(coracao => {
    coracao.addEventListener("click", () => {
        coracao.classList.toggle("ativo");
    });
});
