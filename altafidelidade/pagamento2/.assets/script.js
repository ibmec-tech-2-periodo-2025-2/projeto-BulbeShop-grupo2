/* ========== Helper: abre/fecha selects que empurram conteúdo ========== */
function setupExpandable(rootSelector, optionSelector, labelSelector, headSelector, onChange){
  document.querySelectorAll(rootSelector).forEach(block=>{
    const head  = block.querySelector(headSelector);
    const label = block.querySelector(labelSelector);

    const toggle = (open) => {
      block.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    head.addEventListener('click', ()=>{
      const open = block.getAttribute('aria-expanded') === 'true';
      toggle(!open);
    });

    // clicar nas opções define o label e fecha
    block.querySelectorAll(optionSelector).forEach(opt=>{
      opt.addEventListener('click', ()=>{
        block.querySelectorAll(optionSelector).forEach(o=>o.classList.remove('is-active'));
        opt.classList.add('is-active');
        label.textContent = opt.textContent.trim();
        label.style.color = '#3E4D5B'; // muda de placeholder para texto
        toggle(false);
        if (typeof onChange === 'function') onChange();
      });
    });

    // fecha se clicar fora
    document.addEventListener('click', (e)=>{
      if(!block.contains(e.target) && block.getAttribute('aria-expanded') === 'true'){
        toggle(false);
      }
    });
  });
}

/* ====== Configura selects ====== */
const validateLater = () => requestAnimationFrame(validateForm);

/* País */
setupExpandable(
  '#countrySelect',
  '.select-list .opt',
  '.select-placeholder',
  '.select-head',
  validateLater
);

/* Estado e Cidade (mesmo comportamento) */
setupExpandable(
  '#stateSelect',
  '.inline-list .inline-opt',
  '.inline-label',
  '.inline-head',
  validateLater
);
setupExpandable(
  '#citySelect',
  '.inline-list .inline-opt',
  '.inline-label',
  '.inline-head',
  validateLater
);

/* ========== Frete: permitir apenas uma opção marcada (como radio) ========== */
const freteList = document.getElementById('freteList');
if(freteList){
  const boxes = freteList.querySelectorAll('input[type="checkbox"][name="frete"]');
  boxes.forEach(b=>{
    b.addEventListener('change', ()=>{
      if(b.checked){
        boxes.forEach(x=>{ if(x!==b) x.checked = false; });
      }
      validateForm();
    });
  });
}

/* ===== Validação dos obrigatórios e controle do botão Salvar ===== */
const btnSave = document.getElementById('btnSave');

function isFilledInput(fieldEl){
  const input = fieldEl.querySelector('.input');
  if(!input) return true;
  return String(input.value || '').trim().length > 0;
}
function selectValue(selectRoot, defaultText){
  const label = selectRoot?.querySelector('.select-placeholder, .inline-label');
  if(!label) return '';
  return label.textContent.trim();
}

function validateForm(){
  let ok = true;

  // País (obrigatório)
  const countryVal = selectValue(document.getElementById('countrySelect'), 'Selecionar');
  ok = ok && countryVal && countryVal !== 'Selecionar';

  // Campos obrigatórios: identifico pelo asterisco na label (.req)
  document.querySelectorAll('.field').forEach(field=>{
    const hasReq = !!field.querySelector('.req');
    if(hasReq){
      if(!isFilledInput(field)) ok = false;
    }
  });

  // Exceção: Número pode ser vazio se "Sem número" estiver marcado
  const semNumero = document.querySelector('.checkbox-inline input[type="checkbox"]');
  const numeroField = document.querySelectorAll('.field')[2]; // é o 3º field daquela linha (Número)
  if(semNumero){
    if(semNumero.checked){
      // ignora a obrigatoriedade do campo "Número"
    }else{
      // precisa estar preenchido
      const numeroInput = numeroField?.querySelector('.input');
      if(numeroInput && !String(numeroInput.value || '').trim()) ok = false;
    }
    semNumero.addEventListener('change', validateLater);
  }

  // Estado e Cidade obrigatórios
  const stateVal = selectValue(document.getElementById('stateSelect'), 'Selecione o estado');
  const cityVal  = selectValue(document.getElementById('citySelect'),  'Selecione a cidade');
  ok = ok && stateVal && stateVal !== 'Selecione o estado';
  ok = ok && cityVal  && cityVal  !== 'Selecione a cidade';

  // Pelo menos um frete selecionado
  const algumFrete = !!document.querySelector('#freteList input[type="checkbox"][name="frete"]:checked');
  ok = ok && algumFrete;

  // Habilita/Desabilita botão
  if(btnSave){
    btnSave.disabled = !ok;
  }
}

/* Observadores para inputs de texto/telefone/CPF/CEP/bairro/rua etc */
document.querySelectorAll('.input').forEach(el=>{
  el.addEventListener('input', validateLater);
  el.addEventListener('blur',  validateLater);
});

/* Primeira validação ao carregar */
validateForm();

/* Ação do botão Salvar (mantida) */
btnSave?.addEventListener('click', ()=>{
  if(btnSave.disabled) return; // guarda de segurança
  alert('Endereço e preferências salvos.');
});
