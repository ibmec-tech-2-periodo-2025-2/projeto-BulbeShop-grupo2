/* =========================================================
   Bulbe • Checkout — script-checkout.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  wirePaymentSelectMovesCTA();
});

function wirePaymentSelectMovesCTA() {
  const box   = document.getElementById('paySelect');
  if (!box) return;

  const head  = box.querySelector('.selectbox__head');
  const label = box.querySelector('.selectbox__label');
  const list  = box.querySelector('.selectbox__list');
  const opts  = Array.from(box.querySelectorAll('.selectbox__opt'));

  // CTA e spacer (criado antes da CTA)
  const cta = document.querySelector('.cta');
  let spacer = document.querySelector('.cta-spacer');

  if (!spacer) {
    spacer = document.createElement('div');
    spacer.className = 'cta-spacer';
    cta?.parentNode?.insertBefore(spacer, cta);
  }

  const EXTRA_GAP = 12; // respiro entre a lista e a CTA

  // utilitários
  const isOpen = () => box.getAttribute('aria-expanded') === 'true';

  function setOpen(open) {
    box.setAttribute('aria-expanded', open ? 'true' : 'false');
    head.setAttribute('aria-expanded', open ? 'true' : 'false');

    if (open) {
      // Empurra a CTA para baixo com a altura real do dropdown
      const h = (list?.scrollHeight || 0) + EXTRA_GAP;
      spacer.style.height = h + 'px';

      // foco no item ativo
      const active = box.querySelector('.selectbox__opt.is-active') || opts[0];
      active && active.focus && active.focus();
    } else {
      spacer.style.height = '0px';
      head.focus && head.focus();
    }
  }

  // abre/fecha no cabeçalho
  head.addEventListener('click', () => setOpen(!isOpen()));

  // acessibilidade no cabeçalho
  head.addEventListener('keydown', (e) => {
    const k = e.key;
    if (k === 'Enter' || k === ' ') {
      e.preventDefault();
      setOpen(!isOpen());
    } else if (k === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen()) setOpen(true);
      else {
        const active = box.querySelector('.selectbox__opt.is-active');
        const i = Math.max(0, opts.indexOf(active));
        const next = opts[Math.min(opts.length - 1, i + 1)];
        next?.focus?.();
      }
    } else if (k === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen()) setOpen(true);
      else {
        const active = box.querySelector('.selectbox__opt.is-active');
        const i = Math.max(0, opts.indexOf(active));
        const prev = opts[Math.max(0, i - 1)];
        prev?.focus?.();
      }
    }
  });

  // seleção das opções
  opts.forEach((opt) => {
    opt.setAttribute('tabindex', '0');

    opt.addEventListener('click', () => selectOption(opt));

    opt.addEventListener('keydown', (e) => {
      const k = e.key;
      if (k === 'Enter' || k === ' ') {
        e.preventDefault();
        selectOption(opt);
      } else if (k === 'ArrowDown') {
        e.preventDefault();
        const i = opts.indexOf(opt);
        const next = opts[Math.min(opts.length - 1, i + 1)];
        next?.focus?.();
      } else if (k === 'ArrowUp') {
        e.preventDefault();
        const i = opts.indexOf(opt);
        const prev = opts[Math.max(0, i - 1)];
        prev?.focus?.();
      } else if (k === 'Escape') {
        e.preventDefault();
        setOpen(false);
      }
    });
  });

  function selectOption(opt) {
    opts.forEach(o => {
      o.classList.remove('is-active');
      o.removeAttribute('aria-selected');
    });
    opt.classList.add('is-active');
    opt.setAttribute('aria-selected', 'true');
    label.textContent = opt.textContent.trim();
    setOpen(false);
  }

  // fechar ao clicar fora
  document.addEventListener('click', (e) => {
    if (!box.contains(e.target) && isOpen()) {
      setOpen(false);
    }
  });

  // recalcular altura se viewport mudar (teclado mobile, etc.)
  window.addEventListener('resize', () => {
    if (isOpen()) {
      const h = (list?.scrollHeight || 0) + EXTRA_GAP;
      spacer.style.height = h + 'px';
    }
  });
}
