// Voltar
document.getElementById('btnBack')?.addEventListener('click', ()=> history.back());

// Selecionar tudo
const checkAll = document.getElementById('checkAll');
const rowChecks = Array.from(document.querySelectorAll('.row-check'));
checkAll?.addEventListener('change', () => {
  rowChecks.forEach(c => c.checked = checkAll.checked);
});

// Quantidades (– / +)
function wireQty(root=document){
  root.querySelectorAll('.qty').forEach(q => {
    const val = q.querySelector('.qty__val');
    q.addEventListener('click', ev => {
      const btn = ev.target.closest('.qty__btn');
      if(!btn) return;
      let n = parseInt(val.textContent,10)||1;
      if(btn.dataset.act==='minus') n = Math.max(1, n-1);
      if(btn.dataset.act==='plus')  n++;
      val.textContent = n;
      // atualiza “(n unidades)” mais próximo, se houver
      const units = q.parentElement.parentElement.querySelector('.units');
      if(units) units.textContent = `(${n} ${n>1?'unidades':'unidade'})`;
    });
  });
}
wireQty();

// Carrossel setas
const track = document.getElementById('carTrack');
document.querySelector('.car-arrow.left')?.addEventListener('click', ()=> {
  track.scrollBy({left:-track.clientWidth*0.9, behavior:'smooth'});
});
document.querySelector('.car-arrow.right')?.addEventListener('click',()=> {
  track.scrollBy({left:+track.clientWidth*0.9, behavior:'smooth'});
});

// Bottom-sheet abre ao clicar em qualquer botão “adicionar”
const sheet = document.getElementById('sheet');
document.querySelectorAll('[data-add]')?.forEach(btn=>{
  btn.addEventListener('click', ()=> sheet.classList.add('is-open'));
});
sheet.querySelector('.sheet__drag')?.addEventListener('click', ()=> sheet.classList.remove('is-open'));

// Quantidade dentro do sheet
wireQty(sheet);

// Continuar compra (troque pela rota da próxima etapa se quiser)
document.getElementById('btnContinue')?.addEventListener('click', ()=>{
  // exemplo: window.location.href = '/altafidelidade/pagamento1/pagamento.html';
  alert('Itens adicionados! Seguindo o fluxo…');
});
