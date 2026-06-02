# Electoral OS

Sistema com frontend Vite/React na raiz e backend Express/Prisma em `server/`.

## Execucao local

Frontend:

```bash
npm install
npm run dev
```

Backend:

```bash
cd server
npm install
npm run dev
```

## Variaveis de ambiente

Frontend:

```env
VITE_API_URL=http://localhost:3001/api
```

Backend:

```env
DATABASE_URL=postgresql://...
PORT=3001
JWT_SECRET=...
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

Veja os exemplos em `.env.example` e `server/.env.example`.

## Deploy

O caminho recomendado para este projeto e:

1. Vercel para o frontend
2. Railway para o backend
3. Neon para o PostgreSQL

Guia completo em `DEPLOY_PT-BR.md`.
