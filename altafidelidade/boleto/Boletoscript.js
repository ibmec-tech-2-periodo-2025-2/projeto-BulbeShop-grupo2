

// Abrir modal ao clicar em "Não recebi o boleto"
const btnNaoRecebi = document.getElementById("btnNaoRecebi");
const modal = document.getElementById("modalBoleto");
const btnFecharModal = document.getElementById("btnFecharModal");
const btnTentarNovamente = document.getElementById("btnTentarNovamente");

function abrirModal() {
    if (!modal) return;
    modal.hidden = false;
}

function fecharModal() {
    if (!modal) return;
    modal.hidden = true;
}

btnNaoRecebi?.addEventListener("click", abrirModal);
btnFecharModal?.addEventListener("click", fecharModal);
btnTentarNovamente?.addEventListener("click", fecharModal);

// fechar clicando fora da caixa
modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
        fecharModal();
    }
});

// fechar com ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) {
        fecharModal();
    }
});

// Botão "Concluir compra" -> ir para página final
const btnConcluir = document.getElementById("btnConcluir");

btnConcluir?.addEventListener("click", () => {

    window.location.href = "/altafidelidade/pagamento e recusado/status-recusada.html"
    ;
});
