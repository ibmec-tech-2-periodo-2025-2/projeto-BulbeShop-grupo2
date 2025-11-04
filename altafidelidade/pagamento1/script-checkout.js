// /altafidelidade/pagamento1/script-checkout.js

(function () {
  // Elementos do select custom
  const select = document.getElementById('paySelect');
  const head   = select?.querySelector('.selectbox__head');
  const list   = select?.querySelector('.selectbox__list');
  const label  = select?.querySelector('.selectbox__label');

  // Botão "Prosseguir para pagamento"
  const btn = document.querySelector('.cta__btn');

  function isDefault() {
    const t = (label?.textContent || '').trim().toLowerCase();
    // Seu placeholder é "Selecionado"
    return !t || t === 'selecionado' || t === 'selecionar';
  }

  function refreshCTA() {
    if (btn) btn.disabled = isDefault();
  }

  // Estado inicial: desabilita se estiver no placeholder
  refreshCTA();

  // Abre/fecha a caixa
  head?.addEventListener('click', () => {
    const open = select.getAttribute('aria-expanded') === 'true';
    select.setAttribute('aria-expanded', String(!open));
  });

  // Escolha de opção
  list?.addEventListener('click', (ev) => {
    const li = ev.target.closest('.selectbox__opt');
    if (!li) return;

    const choice = li.textContent.trim();
    if (label) label.textContent = choice;

    // fecha dropdown
    select.setAttribute('aria-expanded', 'false');

    // Atualiza botão
    refreshCTA();
  });

  // Prosseguir
  btn?.addEventListener('click', () => {
    if (isDefault()) return;
    const method = (label?.textContent || '').trim().toLowerCase();

    // salva método para o próximo passo
    localStorage.setItem('payMethod', method);

    // rota para a página de cadastro (pagamento2.html)
    window.location.href = '/altafidelidade/pagamento2/pagamento2.html';
  });
})();
