// Select de País (abre/fecha empurrando conteúdo)
(function(){
  const block = document.getElementById('countrySelect');
  if(!block) return;

  const head  = block.querySelector('.select-head');
  const list  = block.querySelector('.select-list');
  const label = block.querySelector('.select-placeholder');

  head.addEventListener('click', ()=>{
    const open = block.getAttribute('aria-expanded') === 'true';
    block.setAttribute('aria-expanded', String(!open));
  });

  list.querySelectorAll('.opt').forEach(opt=>{
    opt.addEventListener('click', ()=>{
      label.textContent = opt.textContent.trim();
      label.style.color = '#3E4D5B';
      block.setAttribute('aria-expanded','false');
    });
  });

  document.addEventListener('click', (e)=>{
    if(!block.contains(e.target)) block.setAttribute('aria-expanded','false');
  });
})();

// Demo do botão salvar
document.getElementById('btnSave')?.addEventListener('click', ()=>{
  alert('Endereço e preferências de frete salvos.');
});
