// === BOTÃO VOLTAR ===
document.getElementById('botaoVoltar')?.addEventListener('click', () => history.back());

// === SELECIONAR TUDO ===
const selecionarTudo = document.getElementById('selecionarTudo');
const selecoesIndividuais = Array.from(document.querySelectorAll('.selecao-individual'));

selecionarTudo?.addEventListener('change', () => 
  selecoesIndividuais.forEach(c => c.checked = selecionarTudo.checked)
);

// === FORMATAÇÃO BR ===
const formatoBR = n => n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// === ESTADO DO CARRINHO ===
const produtos = {
  lampada: {
    titulo: 'Lâmpada de LED E27 Bulbo 9W 803lm Luz Branca Bivolt Black + Decker',
    preco: 4.59,
    quantidade: 5
  },
  parafusadeira: {
    titulo: 'Parafusadeira Philco Force PPF120 3 em 1 1500RPM',
    preco: 199.90,
    quantidade: 1
  }
};

// === CONTROLA BOTÕES “+” e “–” ===
function ativarContadores() {
  document.querySelectorAll('.contador').forEach(contador => {
    const produtoPai = contador.closest('.cartao-produto');
    const chave = produtoPai?.dataset.produto || (contador.dataset.produto === 'resumo' ? 'lampada' : null);
    if (!chave && contador.dataset.produto !== 'resumo') return;

    contador.addEventListener('click', evento => {
      const botao = evento.target.closest('.botao-quantidade');
      if (!botao) return;

      const acao = botao.dataset.acao;
      let item = chave;
      if (contador.dataset.produto === 'resumo') item = 'lampada';

      const span = contador.querySelector('[data-quantidade]') || contador.querySelector('.quantidade-atual');
      let n = parseInt(span.textContent, 10) || 1;

      if (acao === 'diminuir') n = Math.max(1, n - 1);
      if (acao === 'aumentar') n++;

      span.textContent = n;

      // Atualiza estado
      produtos[item].quantidade = n;

      // Atualiza texto “(n unidades)”
      const unidades = produtoPai?.querySelector('.texto-unidades');
      if (unidades) unidades.textContent = `(${n} ${n > 1 ? 'unidades' : 'unidade'})`;

      // Atualiza resumo inferior
      atualizarResumo();
    });
  });
}

// === TOTAL DO CARRINHO ===
function calcularTotal() {
  return (produtos.lampada.preco * produtos.lampada.quantidade) +
         (produtos.parafusadeira.preco * produtos.parafusadeira.quantidade);
}

// === ATUALIZA RESUMO (BOTTOM SHEET) ===
function atualizarResumo() {
   // --- Lâmpada ---
  const qtdResumo = document.getElementById('quantidadeResumo');
  const precoResumo = document.getElementById('precoResumo');
  const totalResumo = document.getElementById('totalResumo');

  qtdResumo.textContent = produtos.lampada.quantidade;
  precoResumo.textContent = `R$${formatoBR(produtos.lampada.quantidade * produtos.lampada.preco)}`;

  // --- Parafusadeira ---
  const qtdResumoParafusadeira = document.getElementById('quantidadeResumoParafusadeira');
  const precoResumoParafusadeira = document.getElementById('precoResumoParafusadeira');

  if (qtdResumoParafusadeira && precoResumoParafusadeira) {
    qtdResumoParafusadeira.textContent = produtos.parafusadeira.quantidade;
    precoResumoParafusadeira.textContent = `R$${formatoBR(produtos.parafusadeira.quantidade * produtos.parafusadeira.preco)}`;
  }

  // --- Total ---
  totalResumo.textContent = `R$${formatoBR(calcularTotal())}`;

}

// === CARROSSEL (SETA ESQUERDA / DIREITA) ===
const trilha = document.getElementById('trilhaCarrossel');
document.querySelector('.seta-carrossel.esquerda')?.addEventListener('click', () => {
  trilha.scrollBy({ left: -trilha.clientWidth * 0.9, behavior: 'smooth' });
});
document.querySelector('.seta-carrossel.direita')?.addEventListener('click', () => {
  trilha.scrollBy({ left: +trilha.clientWidth * 0.9, behavior: 'smooth' });
});

// === BOTÕES DO RESUMO ===
document.addEventListener("DOMContentLoaded", function () {
  const botaoContinuar = document.getElementById("botaoContinuar");
  const resumoCarrinho = document.getElementById("resumoCarrinho");

  if (botaoContinuar && resumoCarrinho) {
    botaoContinuar.addEventListener("click", function () {
      // Aplica classe para o fade
      resumoCarrinho.classList.add("fade-out");

      // Aguarda a animação antes de redirecionar
      setTimeout(() => {
        window.location.href = "../pagamento1/pagamento.html";
      }, 400);
    });
  }
});


document.getElementById('botaoLimpar')?.addEventListener('click', limparCarrinho);

// === FUNÇÃO LIMPAR CARRINHO ===
function limparCarrinho() {
  produtos.lampada.quantidade = 1;
  produtos.parafusadeira.quantidade = 1;

  // Atualiza visual dos produtos
  document.querySelectorAll('[data-produto="lampada"] [data-quantidade]')
    .forEach(e => e.textContent = produtos.lampada.quantidade);
  document.querySelectorAll('[data-produto="lampada"] .texto-unidades')
    .forEach(e => e.textContent = '(1 unidade)');
  document.querySelectorAll('[data-produto="parafusadeira"] [data-quantidade]')
    .forEach(e => e.textContent = produtos.parafusadeira.quantidade);
  document.querySelectorAll('[data-produto="parafusadeira"] .texto-unidades')
    .forEach(e => e.textContent = '(1 unidade)');

  atualizarResumo();
}

// === INICIALIZAÇÃO ===
ativarContadores();
atualizarResumo();


// === BRIDGE HOME->CARRINHO (definitivo, mínimo e sem conflitar) ===
(function () {
  'use strict';

  function moedaBR(n) {
    return (Number(n) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Ajusta caminho da imagem que veio da Home (ex.: "./img/xxx.png") para o contexto do carrinho
  function resolverImgParaCarrinho(p) {
    if (!p) return './assets/img/lamp.svg';
    // estamos em /altafidelidade/carrinhos/ — a Home fica em ../home/
    if (p.startsWith('./img/')) return '../home/' + p.slice(2);
    return p; // caminho absoluto ou já válido
  }

  try {
    const raw = localStorage.getItem('bulbe:addToCart');
    if (!raw) return; // nada a importar

    const incoming = JSON.parse(raw);
    localStorage.removeItem('bulbe:addToCart'); // evita duplicar em reload

    // 1) DOM: atualiza o cartão da LÂMPADA (mantém layout e JS existentes)
    const lamp = document.querySelector('article.cartao-produto[data-produto="lampada"]');
    if (!lamp) return;

    const imgEl = lamp.querySelector('.imagem-produto img');
    if (imgEl) {
      imgEl.src = resolverImgParaCarrinho(incoming.img);
      imgEl.alt = incoming.alt || incoming.title || 'Produto';
    }

    const titleEl = lamp.querySelector('.titulo-produto');
    if (titleEl) {
      // Mantém possíveis <br> do template, apenas troca o conteúdo
      titleEl.innerHTML = (incoming.title || 'Produto').replace(/\s{2,}/g, ' ');
    }

    const priceEl = lamp.querySelector('.valor-produto');
    if (priceEl) {
      const pv = Number(incoming.price || 0);
      priceEl.dataset.preco = String(pv.toFixed(2));
      priceEl.textContent = moedaBR(pv);
    }

    // Garante quantidade = 1 na UI do cartão da lâmpada
    const qtdSpan = lamp.querySelector('[data-quantidade]');
    if (qtdSpan) qtdSpan.textContent = '1';
    const unidades = lamp.querySelector('.texto-unidades');
    if (unidades) unidades.textContent = '(1 unidade)';

    // 2) ESTADO: atualiza o objeto já usado pelo seu carrinho
    if (typeof produtos === 'object' && produtos.lampada) {
      produtos.lampada.titulo = incoming.title || produtos.lampada.titulo;
      produtos.lampada.preco = Number(incoming.price || produtos.lampada.preco);
      produtos.lampada.quantidade = 1; // inicia com 1
    }

    // 3) Recalcula resumo usando suas funções existentes
    if (typeof atualizarResumo === 'function') {
      try { atualizarResumo(); } catch (e) { /* silencioso */ }
    }
  } catch (e) {
    console.error('[Cart Bridge] Falha ao importar item da Home:', e);
  }
})();

// === CONTROLE DE QUANTIDADE NO MINI-CARD (BOTTOM SHEET) ===
document.querySelectorAll('.contador[data-produto$="-resumo"]').forEach(contador => {
  contador.addEventListener('click', e => {
    const botao = e.target.closest('.botao-quantidade');
    if (!botao) return;

    const acao = botao.dataset.acao;
    const id = contador.dataset.produto;

    if (id === 'lampada-resumo') {
      if (acao === 'aumentar') produtos.lampada.quantidade++;
      if (acao === 'diminuir') produtos.lampada.quantidade = Math.max(1, produtos.lampada.quantidade - 1);
    }

    if (id === 'parafusadeira-resumo') {
      if (acao === 'aumentar') produtos.parafusadeira.quantidade++;
      if (acao === 'diminuir') produtos.parafusadeira.quantidade = Math.max(1, produtos.parafusadeira.quantidade - 1);
    }

    atualizarResumo();
  });
});

// === FUNÇÃO ATUALIZAR RESUMO (nova versão sincronizada) ===
function atualizarResumo() {
  const qtdLamp = produtos.lampada.quantidade;
  const qtdParaf = produtos.parafusadeira.quantidade;

  // Atualiza UI da lâmpada
  document.querySelectorAll('#quantidadeResumoLampada').forEach(el => el.textContent = qtdLamp);
  document.querySelectorAll('#precoResumoLampada').forEach(el =>
    el.textContent = `R$${formatoBR(produtos.lampada.preco * qtdLamp)}`
  );

  // Atualiza UI da parafusadeira
  document.querySelectorAll('#quantidadeResumoParafusadeira').forEach(el => el.textContent = qtdParaf);
  document.querySelectorAll('#precoResumoParafusadeira').forEach(el =>
    el.textContent = `R$${formatoBR(produtos.parafusadeira.preco * qtdParaf)}`
  );

  // Atualiza total geral
  const total = calcularTotal();
  document.querySelectorAll('#totalResumo').forEach(el => el.textContent = `R$${formatoBR(total)}`);
}
