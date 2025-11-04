document.addEventListener('DOMContentLoaded', () => {
  const box    = document.getElementById('paySelect');
  if (!box) return;

  const head   = box.querySelector('.selectbox__head');
  const list   = box.querySelector('.selectbox__list');
  const label  = box.querySelector('.selectbox__label');
  const btn    = document.querySelector('.cta__btn');

  const BLUE = '#08068D';

  function norm(s=''){ return s.trim().toLowerCase(); }
  function getMethod(){ return norm(label?.textContent || ''); }

  function refreshCTA(){
    if (!btn) return;
    // habilita somente quando NÃO for “Selecionado”
    const isDefault = getMethod() === 'selecionado' || getMethod() === '';
    btn.disabled = isDefault;
  }

  // Abre/fecha a lista
  head?.addEventListener('click', () => {
    const open = box.getAttribute('aria-expanded') === 'true';
    box.setAttribute('aria-expanded', String(!open));
  });

  // Clique nas opções
  list?.addEventListener('click', (ev) => {
    const opt = ev.target.closest('.selectbox__opt');
    if (!opt) return;

    // limpa estado anterior
    list.querySelectorAll('.selectbox__opt').forEach(li => {
      li.classList.remove('is-active');
      li.removeAttribute('aria-selected');
    });

    // aplica ativo e acessibilidade
    opt.classList.add('is-active');
    opt.setAttribute('aria-selected','true');

    // atualiza rótulo do cabeçalho
    const text = opt.textContent.trim();
    if (label) label.textContent = text;

    // fecha o dropdown e habilita CTA
    box.setAttribute('aria-expanded','false');
    refreshCTA();

    // salva método para o fluxo
    localStorage.setItem('payMethod', norm(text));
  });

  // Sincroniza rótulo com item ativo que possa vir no HTML
  (function syncOnLoad(){
    const active = list?.querySelector('.selectbox__opt.is-active');
    if (active && label) {
      label.textContent = active.textContent.trim();
      localStorage.setItem('payMethod', norm(active.textContent));
    }
    refreshCTA();
  })();

  // Fluxo do CTA
  btn?.addEventListener('click', () => {
    if (btn.disabled) return;

    const method = localStorage.getItem('payMethod') || '';
    // define a próxima página depois do cadastro
    let nextAfterCadastro = '';
    if (method === 'débito' || method === 'debito') {
      nextAfterCadastro = '/altafidelidade/cartao de debito/index.html';
    } else if (method === 'crédito' || method === 'credito') {
      nextAfterCadastro = '/altafidelidade/pagamento3/pagamento3.html';
    } else if (method === 'pix' || method === 'boleto bancário' || method === 'boleto bancario') {
      // se for implementar depois, já fica salvo
      nextAfterCadastro = method;
    }

    localStorage.setItem('nextAfterCadastro', nextAfterCadastro);

    // vai para o cadastro (pagamento2)
    window.location.href = '/altafidelidade/pagamento2/pagamento2.html';
  });
});
