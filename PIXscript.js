// COPIAR CÓDIGO PIX
const btnCopiar = document.getElementById("btnCopiar");
const pixCode = document.getElementById("pixCode");

btnCopiar?.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(pixCode.value);

        // troca a imagem ao copiar com sucesso
        const img = btnCopiar.querySelector("img");
        img.src = "img/check.png";   // sucesso

        setTimeout(() => {
            img.src = "img/Icon (1).png"; // volta ao ícone normal de copiar
        }, 1500);

    } catch (e) {
        alert("Não foi possível copiar o código Pix.");
    }
});

// REDIRECIONAR AO CONCLUIR COMPRA
const btnConcluir = document.getElementById("btnConcluir");

btnConcluir?.addEventListener("click", () => {
    // troque o nome do arquivo abaixo para a página de destino:
    window.location.href = "/altafidelidade/pagamento e recusado/status-recusada.html";
});

// (Opcional) clique em "PIX Automático programado"
const btnPixAuto = document.getElementById("btnPixAuto");
btnPixAuto?.addEventListener("click", () => {
    alert("Aqui você pode abrir outro modal ou página com as regras do Pix automático.");
});