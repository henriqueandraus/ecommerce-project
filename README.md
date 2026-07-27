# Ecommerce Project

Aplicação de e-commerce full stack, dividida em um cliente React e uma API Express/PostgreSQL.

## Estrutura do repositório

```
ecommerce/
├── ecommerce-client/   # Frontend em React + Vite
└── ecommerce-api/      # Backend em Express + PostgreSQL
```

## Tecnologias

**Frontend (`ecommerce-client`)**
- React 19 + Vite
- React Router
- Stripe (`@stripe/react-stripe-js`, `@stripe/stripe-js`)
- lucide-react (ícones)

**Backend (`ecommerce-api`)**
- Node.js + Express
- PostgreSQL (`pg`)
- Passport (login local e Google OAuth 2.0)
- Stripe (pagamentos)
- Swagger UI (documentação da API via `openapi.yaml`)

## Pré-requisitos

- Node.js 18+
- PostgreSQL em execução com o banco de dados criado

## Configuração

### API

```bash
cd ecommerce-api
npm install
```

Crie um arquivo `.env` em `ecommerce-api/` com as seguintes variáveis:

```
DB_USER=
DB_HOST=
DB_NAME=
DB_PASSWORD=
DB_PORT=
SESSION_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
```

Inicie a API:

```bash
npm run dev
```

A documentação interativa (Swagger) fica disponível em `/api-docs`.

### Cliente

```bash
cd ecommerce-client
npm install
npm run dev
```

## Funcionalidades da API

- Autenticação local e via Google OAuth
- CRUD de produtos e usuários
- Carrinho de compras (adicionar, remover itens, checkout)
- Criação de pagamentos e checkout via Stripe
- Consulta de pedidos e detalhes de pedidos

## Scripts úteis

| Local              | Comando       | Descrição                       |
|--------------------|---------------|----------------------------------|
| `ecommerce-api`    | `npm run dev` | Sobe a API com nodemon           |
| `ecommerce-api`    | `npm start`   | Sobe a API em modo produção      |
| `ecommerce-client` | `npm run dev` | Sobe o frontend em modo dev      |
| `ecommerce-client` | `npm run build` | Build de produção do frontend  |
| `ecommerce-client` | `npm run lint`  | Roda o ESLint                   |
