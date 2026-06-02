ELECTORAL OS - DOCUMENTACAO DO SISTEMA (PT-BR)

1. VISÃO GERAL

O Electoral OS e um sistema web para apoio a operacoes eleitorais, com foco em:
- Controle de coordenadores
- Cadastro e acompanhamento de eleitores
- Organizacao de locais de votacao
- Visualizacao de indicadores e relatorios
- Controle de acesso por autenticacao (JWT) e perfil de usuario

Arquitetura resumida:
- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + Prisma
- Banco de dados: PostgreSQL


2. FUNCIONALIDADES PRINCIPAIS

2.1 Autenticacao e sessao
- Tela de login com e-mail e senha.
- Geracao de token JWT no backend.
- Rotas protegidas no frontend (usuarios nao autenticados sao redirecionados para /login).
- Endpoint de validacao de sessao (/api/auth/me).

2.2 Dashboard
- Painel inicial com visao geral dos dados.
- Suporte a monitoramento rapido da operacao (ex.: volumes e distribuicao de cadastros).

2.3 Modulo de Coordenadores
- Listagem de coordenadores.
- Cadastro de novo coordenador.
- Edicao de coordenador existente.
- Visualizacao de detalhes.
- Exclusao de coordenador.
- Campos relevantes:
  - Nome
  - Telefone
  - WhatsApp
  - Municipio/regiao
  - Bairro
  - Status
  - Observacoes

2.4 Modulo de Eleitores
- Listagem de eleitores.
- Cadastro de novo eleitor.
- Edicao de eleitor existente.
- Visualizacao de detalhes.
- Exclusao de eleitor.
- Endpoint de estatisticas de eleitores (/api/voters/stats).
- Campos relevantes:
  - Nome
  - WhatsApp
  - Coordenador responsavel
  - Endereco
  - Bairro
  - Municipio/regiao
  - Titulo de eleitor
  - Zona e secao eleitoral
  - Local de votacao
  - Status de apoio
  - Origem do cadastro
  - Observacoes

2.5 Modulo de Locais de Votacao
- Listagem de locais.
- Cadastro de local.
- Edicao de local.
- Visualizacao de detalhes.
- Exclusao de local.
- Campos relevantes:
  - Nome do local
  - Endereco
  - Bairro
  - Regiao
  - Zona eleitoral
  - Secoes (lista)

2.6 Relatorios
- Tela de relatorios para consolidacao de dados cadastrados.
- Exportacao para PDF (conforme implementacao do frontend).

2.7 Configuracoes
- Tela de configuracoes do sistema.


3. MELHORIAS DE USABILIDADE JA IMPLEMENTADAS

3.1 Mascara automatica de telefone/WhatsApp
- Campos de telefone e WhatsApp aplicam automaticamente o formato:
  (**) 99999-0000
- A validacao exige 11 digitos numericos.
- Aplicado nos formularios de coordenador e eleitor (WhatsApp).

3.2 Selecao de Local de Votacao por digitacao
- No cadastro/edicao de eleitor, o campo de local de votacao permite digitar.
- A partir de 3 letras, a lista de sugestoes e exibida.
- Ao clicar em uma sugestao, o local e selecionado no formulario.


4. REGRAS DE ACESSO

- Rotas de coordenadores, eleitores e locais exigem autenticacao.
- Gerenciamento de usuarios (/api/users) exige perfil admin.
- Usuario com perfil nao-admin recebe erro de acesso negado (403) ao tentar gerenciar usuarios.


5. ROTAS DO FRONTEND

- /login
- /dashboard
- /coordinators
- /coordinators/new
- /coordinators/:id
- /coordinators/:id/edit
- /voters
- /voters/new
- /voters/:id
- /voters/:id/edit
- /polling-places
- /polling-places/new
- /polling-places/:id
- /polling-places/:id/edit
- /reports
- /settings


6. API BACKEND (RESUMO)

Base URL padrao: http://localhost:3001/api

6.1 Auth
- POST /auth/login
- GET  /auth/me

6.2 Coordenadores (protegido)
- GET    /coordinators
- GET    /coordinators/:id
- POST   /coordinators
- PUT    /coordinators/:id
- DELETE /coordinators/:id

6.3 Eleitores (protegido)
- GET    /voters
- GET    /voters/stats
- GET    /voters/:id
- POST   /voters
- PUT    /voters/:id
- DELETE /voters/:id

6.4 Locais de votacao (protegido)
- GET    /polling-places
- GET    /polling-places/:id
- POST   /polling-places
- PUT    /polling-places/:id
- DELETE /polling-places/:id

6.5 Usuarios (protegido + admin)
- GET    /users
- GET    /users/:id
- POST   /users
- PUT    /users/:id
- DELETE /users/:id


7. COMO EXECUTAR O SISTEMA

7.1 Backend
1) Acesse a pasta server
2) Execute: npm run dev
3) Servidor esperado em: http://localhost:3001

7.2 Frontend
1) Na raiz do projeto
2) Execute: npm run dev
3) Aplicacao esperada em: http://localhost:5173


8. USUARIO PADRAO (AMBIENTE LOCAL)

Usuario admin de seed:
- E-mail: admin@electoralos.com.br
- Senha: Admin@2025

Observacao: o usuario pode ja existir se o seed ja tiver sido executado anteriormente.


9. ESTRUTURA DE DADOS (ENTIDADES)

- User: usuarios do sistema (acesso e perfil)
- Coordinator: coordenadores responsaveis por eleitores
- Voter: eleitores cadastrados
- PollingPlace: locais de votacao


10. OBSERVACOES IMPORTANTES

- O token JWT e armazenado no frontend para autenticar requisicoes.
- Em caso de 401 (nao autorizado), o frontend limpa sessao e redireciona para /login.
- Para funcionamento completo, backend e frontend devem estar ativos simultaneamente.


FIM DO DOCUMENTO
