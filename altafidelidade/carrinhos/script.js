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
  const qtdResumo = document.getElementById('quantidadeResumo');
  const precoResumo = document.getElementById('precoResumo');
  const totalResumo = document.getElementById('totalResumo');

  qtdResumo.textContent = produtos.lampada.quantidade;
  precoResumo.textContent = `R$${formatoBR(produtos.lampada.quantidade * produtos.lampada.preco)}`;
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
document.getElementById('botaoContinuar')?.addEventListener('click', () => {
  alert('Seguindo para pagamento…');
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
