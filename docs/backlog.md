BackLog - Projeto Bulbe
PARTICIPANTES: Beatriz Samaha, Bruna Bento, Júlia Leal e Pedro Paulucci.


REQUISITOS FUNCIONAIS:


1. DOCUMENTAÇÃO
Organização
    Definir as funções dos integrantes (ESSENCIAL - nível de complexidade = 3)
    Definir a gestão do código (ESSENCIAL - nível de complexidade = 5)
    Escolher o formato e a identidade visual do slide (ESSENCIAL - nível de complexidade = 3)
    Organização de pastas deve ser definida e arquivos do projeto (ESSENCIAL - nível de complexidade = 5)
    Definir lista de requisitos funcionais (DESEJÁVEL - nível de complexidade = 3)
    Definir nível de complexidade das tarefas com atribuição de prioridade (ESSENCIAL - nível de complexidade = 3)


2. DESIGN (UX/UI)
Arquitetura da Informação
    Definir se cada página é parte de um fluxo linear (onde você vai de uma página para outra) ou se a navegação é baseada em abas ou menus. (ESSENCIAL - nível de complexidade = 3)

Wireframes e Protótipos
    Criar wireframes de baixa fidelidade de todas as telas: página inicial, página de produto, carrinho e contato/login (ESSENCIAL - nível de complexidade = 5)
    Criar protótipos navegáveis de alta fidelidade (ESSENCIAL - nível de complexidade = 5)
    Validar usabilidade com usuários (DESEJAVEL- nível de complexidade = 3)

Layout e Identidade Visual
    Aplicar identidade visual da marca ao layout da página (ESSENCIAL - nível de complexidade = 3)
    Criar componente visual para destacar o desconto (ESSENCIAL - nível de complexidade = 3)
    Garantir acessibilidade (cores, contraste, tamanho de fontes) (ESSENCIAL - nível de complexidade = 5)
    Definir o tipo de navegação utilizado no aplicativo (ESSENCIAL - nível de complexidade = 3)
    Definir posição dos componentes na tela: onde os elementos (botões, texto, imagens, etc.) são posicionados na interface (ESSENCIAL - nível de complexidade = 5)
    Responsividade: a capacidade da página se ajustar a diferentes tamanhos de tela (em dispositivos móveis, tablets, computadores) (ESSENCIAL - nível de complexidade = 8)
    Espaçamento e alinhamento: uso de margens, preenchimentos, e alinhamento dos componentes para uma estética e usabilidade agradáveis (ESSENCIAL - nível de complexidade = 5)
    Criar variações de layout para testar identidade visual (DESEJÁVEL- nível de complexidade = 5)


3. FRONT-END (INTEGRAÇÃO NO APP)
Estrutura da Página
    Desenvolver componentes da página que os produtos serão localizados (ESSENCIAL - nível de complexidade = 5)
    Exibir imagem, nome, preço original, preço com desconto ,descrição sobre o produto, avaliações. (ESSENCIAL - nível de complexidade = 8)
    Adicionar filtros por categoria, faixa de preço e porcentagem de desconto (ESSENCIAL - nível de complexidade = 8)
    Adicionar filtro de ordenação (ex: mais vendidos) (DESEJÁVEL - nível de complexidade = 8)
    Incluir informações de validade das promoções (DESEJÁVEL - nível de complexidade = 8)
    Criação de páginas básicas para cada seção (com título e placeholders) (ESSENCIAL - nível de complexidade = 3)
    index.html com header, main e footer (ESSENCIAL - nível de complexidade = 3)
    Carrinho simples com produto de exemplo (ESSENCIAL - nível de complexidade = 8)
    Estrutura de cards de produtos (mesmo sem backend) (ESSENCIAL - nível de complexidade = 5)
    Seção de promoções ou destaques (DESEJÁVEL - nível de complexidade = 5)
    Links de rodapé (redes sociais, termos de uso, política de privacidade) (OPCIONAIS- nível de complexidade = 5)
    
Integração e Navegação
    Adicionar botão/menu de acesso à página de descontos (ESSENCIAL - nível de complexidade = 5)
    Adicionar barra de pesquisa funcional (ESSENCIAL - nível de complexidade = 5)
    Integrar com tela de detalhes do produto (ESSENCIAL - nível de complexidade = 8)
    Integrar com carrinho de compras já existente(ESSENCIAL - nível de complexidade = 8)
    Integrar com a página de finalização de compras (ESSENCIAL - nível de complexidade = 8)
    Menu de navegação com links entre páginas (Home, Produtos, Carrinho, Contato) (ESSENCIAL - nível de complexidade = 8)
    Página de FAQ ou suporte simples (DESEJÁVEL- nível de complexidade = 5)

Responsividade e Otimizações
    Garantir responsividade para todos os tamanhos de tela (ESSENCIAL - nível de complexidade = 8)
    Otimizar imagens para carregamento rápido(DESEJÁVEL - nível de complexidade = 5)


4. BACK-END (SERVIÇOS E DADOS)
Catálogo de Produtos
    Criar API para buscar produtos com desconto ativo (ESSENCIAL- nível de complexidade = 13 )
    Criar API para o pagamento do produto (ESSENCIAL- nível de complexidade = 13)
    Integração da página principal com página de pagamento (ESSENCIAL- nível de complexidade = 13)
    Integração do aplicativo com o site do vendedor/empresa afiliada (DESEJÁVEL- nível de complexidade = 8)
    Arquivo main.js criado e conectado ao HTML (ESSENCIAL- nível de complexidade = 5)
    Função simples para simular adicionar item ao carrinho (mesmo que apenas no console) (DESEJÁVEL- nível de complexidade = 5)
    Validação mínima em formulário de contato/login (ex.: campo obrigatório) (ESSENCIAL- nível de complexidade = 5)
    Simulação de soma de preços no carrinho (ESSENCIAL- nível de complexidade = 8)
    Função para limpar carrinho (ESSENCIAL- nível de complexidade = 8)
    Mensagem de confirmação ao enviar formulário (ESSENCIAL - nível de complexidade = 5)

Gestão de Descontos (Admin)
    Implementar funcionalidade no painel interno para criar novas promoções (ESSENCIAL - nível de complexidade = 8)
    Implementar funcionalidade no painel interno para editar valores e datas (DESEJÁVEL- nível de complexidade = 8)
    Implementar funcionalidade no painel interno inativar promoções expiradas (DESEJÁVEL- nível de complexidade = 8)
    Adicionar suporte a diferentes tipos de desconto (fixo, porcentagem) (DESEJÁVEL- nível de complexidade = 8)


5. TESTES
Testes Funcionais
    Validar exibição correta dos produtos com desconto (ESSENCIAL- nível de complexidade = 5)
    Testar aplicação correta dos filtros (ESSENCIAL - nível de complexidade = 5)
    Testar ordenação de produtos (ESSENCIAL- nível de complexidade = 5)
    Verificar se os descontos estão sendo aplicados corretamente (ESSENCIAL- nível de complexidade = 5)

Testes de Integração
    Validar integração entre front-end e API de descontos (DESEJÁVEL- nível de complexidade = 8)
    Testar fluxo completo de compra com produto promocional (ESSENCIAL - nível de complexidade = 5)
    Testar fallback para erro na API (mensagens amigáveis) (DESEJÁVEL- nível de complexidade = 5)

Testes de Performance
    Realizar testes de carga com alto volume de acessos (DESEJÁVEL- nível de complexidade = 8)
    Garantir que o tempo de carregamento da página esteja dentro da meta (OPCIONAL - nível de complexidade = 5)

Testes de Usabilidade
    Aplicar testes com versões de layout diferentes (OPCIONAL - nível de complexidade = 5)
    Coletar feedback de usuários reais (DESEJÁVEL- nível de complexidade = 5)
    Ajustar com base nos resultados de navegação e conversão (DESEJÁVEL- nível de complexidade = 5)


6. PUBLICAÇÃO E MONITORAMENTO
Lançamento
    Monitorar erros em tempo real após lançamento (ESSENCIAL - nível de complexidade = 8)

Monitoramento de Métricas
    Implementar tracking de eventos (DESEJÁVEL- nível de complexidade = 8)
    Cliques em produtos
    Conversão (visita > compra)
    Tempo médio na página
    Uso de filtros e ordenações
    Configurar alertas para queda de performance ou conversão (DESEJÁVEL- nível de complexidade = 13)

Observações Técnicas e Legais
     Verificar compatibilidade com sistema de login e histórico de compras (ESSENCIAL - nível de complexidade = 8)



REQUISITOS NÃO FUNCIONAIS:


7. IMPLEMENTAÇÕES
Performance
    O site deve carregar rápido. (ESSENCIAL – nível de complexidade = 8)
    A API deve responder rápido para buscar produtos e para pagamento. (ESSENCIAL – nível de complexidade = 8)
    O sistema deve aguentar picos de muitos acessos. (DESEJÁVEL – nível de complexidade = 8)

Disponibilidade e Confiabilidade
    O site e a API devem estar no ar 99,5% do tempo por mês. (ESSENCIAL – nível de complexidade = 8)
    O sistema deve ter backup diário e possibilidade de restaurar em até 4h. (DESEJÁVEL – nível de complexidade = 5)

Segurança
    Todo acesso deve ser via HTTPS com certificado válido. (ESSENCIAL – nível de complexidade = 5)
    Proteger contra falhas comuns. (ESSENCIAL – nível de complexidade = 8)
    Cookies de sessão devem ser seguros. (ESSENCIAL – nível de complexidade = 5)
    O sistema de pagamento deve seguir regras de segurança PCI (sem guardar dados do cartão). (ESSENCIAL – nível de complexidade = 13)

Acessibilidade e Usabilidade
    Seguir boas práticas de acessibilidade (contraste de cores, navegação por teclado, textos alternativos). (ESSENCIAL – nível de complexidade = 5)
    O site deve se adaptar a telas de celular, tablet e computador. (ESSENCIAL – nível de complexidade = 5)
    O layout deve funcionar nos principais navegadores (Chrome, Firefox, Edge, Safari). (ESSENCIAL – nível de complexidade = 3)
Monitoramento e Qualidade
    Coletar métricas de uso (cliques, conversões, tempo de página). (ESSENCIAL – nível de complexidade = 5)
    Ter alertas para quando houver queda de desempenho ou aumento de erros. (ESSENCIAL – nível de complexidade = 5)

Conteúdo
    Usar metadados e dados estruturados para produtos e avaliações. (DESEJÁVEL – nível de complexidade = 3)

Manutenção e Publicação
    O projeto deve ter documentação (README, instruções de instalação, endpoints da API). (ESSENCIAL – nível de complexidade = 3)
    O código deve seguir padrões definidos (formatação). (DESEJÁVEL – nível de complexidade = 3)











