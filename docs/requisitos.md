Documentação do Projeto


Integrantes

Beatriz Samaha - Scrum Master (sprint1)
Bruna Bento - Desenvolvedor
Júlia Leal - Desenvolvedor
Pedro Paulucci - Desenvolvedor


Gestão de Código

Plataforma utilizada: GitHub, repositório compartilhado com todos da equipe e professor.
- Fluxo de trabalho:
Cada integrante desenvolve em branch própria.
Pull requests são revisados por pelo menos 1 colega antes de serem mesclados na ‘main’.


Padrões definidos

Commits: descritivos e curtos, seguindo o padrão ‘tipo(local):descrição’.
    - Tipos:
“feat:” para adição de nova funcionalidade;
“fix:” para correção de bug;
“docs:” para documentação;
“refactor:” para refatoração;
“style:” para formatação do código;
“test:” para testes adicionados ou modificados;
“chore:” para tarefas menores (ex: atualizações de dependência).
Branches: nomeadas de acordo com a tarefa, seguindo o padrão ‘feature/nome-funcionalidade’ ou ‘fix/nome-do-bug’.
    - Tipos:
“feature/” para adição de nova funcionalidade;
“fix/” para correção de bug;
“docs/” para alterar documentação;
“refactor/” para refatoração de código;
“style:” para formatação do código;
“test/” para testes adicionados ou modificados.


Apresentação do Projeto

O E-commerce Parceiros Bulbe é um site responsivo, desenvolvido em HTML, CSS e JavaScript, que simula um sistema de e-commerce com catálogo de produtos, carrinho e fluxo de checkout. O objetivo é oferecer uma experiência de navegação simples e clara, com interface visualmente consistente e responsiva, priorizando documentação, colaboração em equipe e boas práticas de versionamento.

O projeto será end-to-end pois queremos entregar um site completo, funcional com soluções centradas no usuário final, com foco em uma gestão integrada de um conjunto de etapas. Assim, permitindo analisar todas as telas durante o desenvolvimento e mapear as experiências durante o uso do site. Facilitando para o público da Bulbe a apresentação de novas funcionalidades no app já existente. 
Organização de Pastas e Arquivos

/docs
  backlog.md	      # backlog do produto
  requisitos.md       # documentação do projeto
  cerimonias.md       # atas de planning, dailies, reviews/retros
  .vscode
/src
  /assets
    /img              # imagens do projeto
    /js
      scripts.js      # scripts básicos
  index.html          # homepage
  catalogo.html       # catálogo de produtos
  produto.html        # detalhe de produto
  carrinho.html       # página do carrinho
  checkout.html       # etapa de checkout
  confirmacao.html    # tela de confirmação
/tests
  .# testes automatizados (Sprint 4 em diante)
README.md             # visão geral do projeto


Organização de tarefas

- Divisão de tarefas:
Técnica de classificação do nível de complexidade das tarefas por story points. Exemplo: Tarefa X (nível de complexidade).
    
- Divisão de prioridade:
Será usada uma classificação que sinalizará a prioridade da realização das tarefas no backlog. Serão elas: essenciais, desejáveis, opcionais e desnecessário. Exemplo: Item X do backlog – classificação de prioridade.


Lista de Requisitos Funcionais

Sprint 1 — Redesign & Documentação (10/09 a 01/10)

Construção do backlog:
Lista de tarefas detalhada com responsáveis atribuídos.

Documentação inicial
Integrantes, gestão de código, apresentação do projeto.
Organização de pastas e arquivos.
Lista de requisitos funcionais.

Protótipos de baixa fidelidade no Figma
Wireframes principais: homepage, catálogo, produto, carrinho, checkout, confirmação.

Estrutura inicial de código
HTML semântico criado para homepage e páginas-base.
Scripts JS parciais (placeholders, navegação simples).


Sprint 2 — Redesign & Desenvolvimento (01/10 a 15/10)

Protótipos de alta fidelidade no Figma
Versão final de todas as telas (cores, tipografia, imagens).

HTML e CSS completos
Estilização responsiva aplicada em todas as páginas.

Scripts em desenvolvimento
Interações básicas em JS (navegação, efeitos de hover, placeholders).


Sprint 3 — Desenvolvimento (15/10 a 29/10)

Ajustes pontuais no design
Correções de responsividade, refinamento de UI e acessibilidade.

Integração com bibliotecas e frameworks JS
Ex.: Swiper.js (carrossel), Chart.js (gráficos), bibliotecas de utilidade.

Integração opcional com Flask
Mock de backend (se necessário) para simulação de rotas/dados.


Sprint 4 — Desenvolvimento Avançado (29/10 a 05/11)

Testes automatizados
Configuração e execução de Jest (JS unit tests).
Cypress para testes de navegação.

Publicação do projeto
Deploy no GitHub Pages, Netlify ou Vercel.

Elaboração da apresentação final
Slides estruturados, prints do sistema e divisão de falas entre integrantes.


Sprint 5 — Entrega Final (05/11 a 19/11)

Apresentação AP2
Entrega oficial do projeto.
Demonstração funcional do sistema.
Exposição do processo de desenvolvimento, backlog e participação de cada integrante.
