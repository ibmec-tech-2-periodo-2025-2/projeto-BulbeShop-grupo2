/* === VOLTAR === */
document.getElementById("btnVoltar")?.addEventListener("click", () => {
  history.back();
});


document.querySelectorAll(".card-produto").forEach(card => {
  const id = card.dataset.id;

  card.addEventListener("click", (e) => {
    if (e.target.closest("button")) return;

    window.location.href = `../produto/produto-${id}.html`;
  });

  card.querySelector(".btn-add")?.addEventListener("click", (e) => {
    e.stopPropagation();

    const titulo = card.querySelector("h3").textContent;
    const preco  = card.querySelector(".preco-atual").textContent.replace("R$", "").trim();
    const img    = card.querySelector("img").src;

    const payload = {
      title: titulo,
      price: Number(preco.replace(",", ".")),
      img: img,
      qty: 1
    };

    localStorage.setItem("bulbe:addToCart", JSON.stringify(payload));

    window.location.href = "../carrinho/carrinho.html";
  });
});
