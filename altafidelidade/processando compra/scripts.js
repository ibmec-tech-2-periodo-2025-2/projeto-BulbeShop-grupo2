// Fecha o toast ao clicar no X
document.addEventListener('click', (e)=>{
  const btn = e.target.closest('.toast__close');
  if(btn){
    const toast = document.querySelector('.toast');
    toast?.remove();
  }
});

// (Opcional) auto-ocultar depois de X segundos
// setTimeout(()=> document.querySelector('.toast')?.remove(), 12000);
