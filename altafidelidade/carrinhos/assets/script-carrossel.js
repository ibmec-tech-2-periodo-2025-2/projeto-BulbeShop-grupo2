// === CONTROLE DO CARROSSEL ===
const trilhaCarrossel = document.querySelector("#trilhaCarrossel");
const botaoEsquerda = document.querySelector(".seta-carrossel.esquerda");
const botaoDireita = document.querySelector(".seta-carrossel.direita");

if (trilhaCarrossel && botaoEsquerda && botaoDireita) {
  botaoEsquerda.addEventListener("click", () => {
    trilhaCarrossel.scrollBy({ left: -250, behavior: "smooth" });
  });

  botaoDireita.addEventListener("click", () => {
    trilhaCarrossel.scrollBy({ left: 250, behavior: "smooth" });
  });
}
