ELECTORAL OS - RESUMO EXECUTIVO (PT-BR)

1) O QUE E O SISTEMA
O Electoral OS e uma plataforma web para organizacao de operacoes eleitorais. Ele centraliza cadastro, acompanhamento e analise de dados de coordenadores, eleitores e locais de votacao.

2) PRINCIPAIS BENEFICIOS
- Organiza a base de eleitores em um unico lugar.
- Melhora o acompanhamento de coordenadores por regiao/bairro.
- Facilita a distribuicao por local de votacao, zona e secao.
- Acelera tomada de decisao com dashboard e relatorios.

3) FUNCIONALIDADES-CHAVE
- Login seguro com controle de sessao (JWT).
- Dashboard com visao geral operacional.
- CRUD completo de Coordenadores.
- CRUD completo de Eleitores.
- CRUD completo de Locais de Votacao.
- Relatorios com exportacao em PDF.
- Configuracoes de sistema.

4) CONTROLE DE ACESSO
- Rotas protegidas por autenticacao.
- Gestao de usuarios restrita a perfil admin.
- Em sessao invalida, o sistema redireciona para login automaticamente.

5) MELHORIAS RECENTES DE UX
- Mascara automatica para telefone/WhatsApp: (**) 99999-0000.
- Campo de Local de Votacao com busca por digitacao e sugestoes a partir de 3 letras.

6) PILHA TECNOLOGICA
- Frontend: React + TypeScript + Vite.
- Backend: Node.js + Express + Prisma.
- Banco de dados: PostgreSQL.

7) COMO EXECUTAR (LOCAL)
- Backend: na pasta server, executar npm run dev.
- Frontend: na raiz, executar npm run dev.
- URLs padrao: frontend http://localhost:5173 | backend http://localhost:3001.

8) USUARIO PADRAO LOCAL
- E-mail: admin@electoralos.com.br
- Senha: Admin@2025

9) CONCLUSAO
O sistema oferece uma base robusta para operacao eleitoral, com foco em produtividade, rastreabilidade e qualidade dos dados, apoiando tanto a execucao do time quanto a gestao estrategica.
