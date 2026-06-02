# Deploy do Electoral OS

Stack recomendada para este projeto:

1. Frontend: Vercel
2. Backend: Railway
3. Banco PostgreSQL: Neon

## Estrutura atual

- Frontend Vite/React na raiz do projeto
- Backend Express/Prisma em `server/`
- Banco PostgreSQL via `DATABASE_URL`

## 1. Publicar o banco no Neon

1. Crie um projeto no Neon.
2. Copie a connection string do PostgreSQL.
3. No backend, use essa URL em `DATABASE_URL`.

Exemplo:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
```

## 2. Publicar o backend no Railway

Crie um novo projeto apontando para a pasta `server/`.

Configurações:

- Root Directory: `server`
- Build Command: `npm install && npm run build`
- Start Command: `npm run start`

Variáveis de ambiente:

```env
DATABASE_URL=postgresql://...
PORT=3001
JWT_SECRET=gere-um-segredo-forte
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://seu-frontend.vercel.app
```

Depois do primeiro deploy, rode no terminal do Railway:

```bash
npx prisma db push
npx tsx src/seed.ts
```

Se preferir, rode localmente dentro de `server/` apontando para o banco do Neon:

```bash
npm run db:push
npm run db:seed
```

Teste a API:

```text
https://seu-backend.up.railway.app/health
```

## 3. Publicar o frontend no Vercel

Crie o projeto usando a raiz do repositório.

Configurações:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

Variável de ambiente:

```env
VITE_API_URL=https://seu-backend.up.railway.app/api
```

O arquivo `vercel.json` já foi adicionado para suportar as rotas SPA do React Router.

## 4. Ordem ideal de publicação

1. Subir banco no Neon
2. Subir backend no Railway
3. Rodar `prisma db push`
4. Rodar seed inicial
5. Subir frontend no Vercel
6. Atualizar `FRONTEND_URL` no Railway com a URL final da Vercel

## 5. Atualizações pelo terminal

Fluxo simples:

1. Faça commit das mudanças
2. Envie para o repositório remoto
3. Vercel e Railway fazem redeploy automaticamente

Ou usando CLI quando quiser:

```bash
vercel --prod
railway up
```

## 6. Checklist de produção

1. Trocar `JWT_SECRET` por um valor forte
2. Confirmar que `VITE_API_URL` aponta para a API publicada
3. Confirmar que `FRONTEND_URL` aponta para o domínio do frontend
4. Rodar `prisma db push` no banco novo
5. Rodar a seed para criar o usuário inicial
6. Testar login, dashboard e CRUDs principais

## 7. Observações deste projeto

- O frontend usa `createBrowserRouter`, então precisava de rewrite para `index.html` na Vercel.
- O backend agora aceita CORS configurado por `FRONTEND_URL`.
- O backend agora tem `npm run start`, `npm run db:push` e `npm run db:seed` para facilitar deploy.
