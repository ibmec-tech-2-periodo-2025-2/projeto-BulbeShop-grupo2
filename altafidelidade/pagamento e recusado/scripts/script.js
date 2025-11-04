// ——— navegação do header
document.getElementById('btnBack')?.addEventListener('click', () => {
  // volta para a tela de pagamento 3 mantendo os dados
  window.location.href = '/altafidelidade/pagamento3/pagamento3.html';
});

document.getElementById('btnLogo')?.addEventListener('click', () => {
  // leve o usuário para sua “home”
  window.location.href = '/altafidelidade/home/index.html';
});

// ——— carrega dados do pedido / cartão (salvos na etapa de pagamento)
(function hydrateFromStorage(){
  try{
    const data = JSON.parse(localStorage.getItem('bulbeCheckout') || '{}');

    // gera e mostra (se não existir) um nº de pedido simples
    if(!data.orderId){
      const rnd = Math.random().toString(36).slice(2,8).toUpperCase();
      data.orderId = `AP${Date.now().toString().slice(-6)}${rnd}`;
      localStorage.setItem('bulbeCheckout', JSON.stringify(data));
    }

    const el = document.getElementById('orderInfo');
    if(el){
      el.innerHTML = `Número do pedido: ${data.orderId}<br>Código de rastreio: (será atualizado em breve)`;
    }
  }catch(e){}
})();

// ——— botões da página
document.getElementById('btnResumo')?.addEventListener('click', () => {
  // ajuste a rota do seu resumo se já existir
  alert('Abrir resumo de compra (defina a rota do seu resumo aqui).');
});

document.getElementById('btnInicio')?.addEventListener('click', () => {
  window.location.href = '/altafidelidade/home/paginicial.html';
});
