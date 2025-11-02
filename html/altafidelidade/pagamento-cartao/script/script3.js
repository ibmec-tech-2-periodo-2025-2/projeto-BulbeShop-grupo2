/* ===== Helpers ===== */
const onlyDigits = (s='') => s.replace(/\D/g, '');

/* Campos */
const elNumber   = document.getElementById('ccNumber');
const elExpiry   = document.getElementById('ccExpiry');
const elCVV      = document.getElementById('ccCVV');
const elGrid     = document.getElementById('parcelGrid');
const btnFinish  = document.getElementById('btnFinish');

/* Validação básica de cartão */
function isCardValid(){
  if(!elNumber || !elExpiry || !elCVV) return false;

  const num = onlyDigits(elNumber.value);
  const cvv = onlyDigits(elCVV.value);

  const numberOK = num.length >= 13 && num.length <= 19; // range comum
  const cvvOK    = cvv.length === 3 || cvv.length === 4;
  const expOK    = elExpiry.selectedIndex > 0;

  return numberOK && cvvOK && expOK;
}

/* Se há parcela selecionada */
function hasInstallment(){
  return !!(elGrid && elGrid.querySelector('.parcel.is-selected'));
}

/* Habilita/Desabilita CTA */
function refreshCTA(){
  if(!btnFinish) return;
  btnFinish.disabled = !(isCardValid() && hasInstallment());
}

/* Seleção das parcelas (com ARIA) */
(function wireInstallments(){
  if(!elGrid) return;

  elGrid.addEventListener('click', (ev)=>{
    const card = ev.target.closest('.parcel');
    if(!card) return;

    elGrid.querySelectorAll('.parcel').forEach(p=>{
      p.classList.remove('is-selected');
      p.setAttribute('aria-checked','false');
      p.tabIndex = -1;
    });

    card.classList.add('is-selected');
    card.setAttribute('aria-checked','true');
    card.tabIndex = 0;
    card.focus({ preventScroll:true });

    refreshCTA();
  });
})();

/* Máscara leve para o número do cartão (somente estética) */
elNumber && elNumber.addEventListener('input', ()=>{
  const digits = onlyDigits(elNumber.value).slice(0,19);
  const groups = digits.match(/.{1,4}/g) || [];
  elNumber.value = groups.join(' ');
  refreshCTA();
}, {passive:true});

/* CVV/validade → atualiza estado do botão */
elCVV    && elCVV.addEventListener('input',  refreshCTA, {passive:true});
elExpiry && elExpiry.addEventListener('change', refreshCTA);

/* Estado inicial */
refreshCTA();

/* Finalizar (dummy) */
btnFinish && btnFinish.addEventListener('click', ()=>{
  if(btnFinish.disabled) return;
  alert('Compra concluída com sucesso!');
});
