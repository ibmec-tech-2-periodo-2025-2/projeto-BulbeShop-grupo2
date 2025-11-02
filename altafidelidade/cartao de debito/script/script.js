/* Validação simples para habilitar o botão “Concluir compra”
   Requisitos: número (16 dígitos), expiração selecionada, CVV (3–4 dígitos) */

const elNumber = document.getElementById('debitNumber');
const elExpiry = document.getElementById('debitExpiry');
const elCVV    = document.getElementById('debitCVV');
const btn      = document.getElementById('btnFinish');
const hint     = document.getElementById('ctaHint');

// máscara rápida do cartão (0000 0000 0000 0000)
elNumber.addEventListener('input', () => {
  let v = elNumber.value.replace(/\D/g, '').slice(0,16);
  v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
  elNumber.value = v;
  validate();
});

elCVV.addEventListener('input', () => {
  elCVV.value = elCVV.value.replace(/\D/g, '').slice(0,4);
  validate();
});
elExpiry.addEventListener('change', validate);

function validate(){
  // limpa estados
  clearInvalid(elNumber); clearInvalid(elCVV); clearInvalid(elExpiry.closest('.select-inline'));

  const digits = elNumber.value.replace(/\s/g,'');
  const okNumber = /^\d{16}$/.test(digits);
  const okExpiry = !!elExpiry.value;
  const okCVV    = /^\d{3,4}$/.test(elCVV.value);

  // marca inválidos (visual leve)
  if(!okNumber && elNumber.value.length) markInvalid(elNumber);
  if(!okExpiry) markInvalid(elExpiry.closest('.select-inline'));
  if(!okCVV && elCVV.value.length) markInvalid(elCVV);

  const allOk = okNumber && okExpiry && okCVV;
  btn.disabled = !allOk;
  hint.textContent = allOk ? '' : 'Preencha os campos obrigatórios corretamente.';
}

function markInvalid(el){ el.classList.add('is-invalid'); }
function clearInvalid(el){ el.classList.remove('is-invalid'); }

// Ação do botão
btn.addEventListener('click', () => {
  if(btn.disabled) return;
  alert('Pagamento por débito confirmado ✅');
});

// valida no load
validate();
