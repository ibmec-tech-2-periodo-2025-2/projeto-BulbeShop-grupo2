// Botões da página de sucesso
document.getElementById('btnResumo')?.addEventListener('click', () => {
  // redirecione para o resumo (ajuste a rota se quiser)
  alert('Ir para resumo da compra');
});
document.getElementById('btnInicio')?.addEventListener('click', () => {
  history.back();
});

// Botões da página de erro
document.getElementById('btnRetry')?.addEventListener('click', () => {
  alert('Tentar novamente o pagamento');
});
document.getElementById('btnSair')?.addEventListener('click', () => {
  // volta para tela inicial
  history.back();
});

// Back do header
document.querySelector('.appbar__back')?.addEventListener('click', () => history.back());
