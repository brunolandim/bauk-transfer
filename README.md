# BAUK Transfer

Aplicação web fullstack de transferências internas entre usuários.

## Tecnologias

**Backend**
- Node.js + NestJS + TypeScript
- TypeORM + PostgreSQL

**Frontend**
- Vue 3 + TypeScript + Vite
- Tailwind CSS v4
- Vue Router + Axios + vue-sonner

**Infraestrutura**
- Docker + Docker Compose
- Nginx (serve o frontend e faz proxy para o backend)

## Funcionalidades

- Cadastro e login de usuários com JWT (24h de validade)
- Cada usuário recebe R$ 100,00 ao se cadastrar
- Transferências entre usuários com validação de saldo
- Histórico de transações com filtro por data e tipo (cash-in/cash-out)
- Visualização da contraparte em cada transação

## Como rodar

### Com Docker (recomendado)

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- PostgreSQL: localhost:5432

### Sem Docker

**Backend**
```bash
cd backend
npm install
npm run start:dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

> O backend requer uma instância do PostgreSQL rodando. Configure as variáveis de ambiente conforme o `docker-compose.yml`.

## Variáveis de ambiente (backend)

| Variável | Descrição |
|----------|-----------|
| `DB_HOST` | Host do PostgreSQL |
| `DB_PORT` | Porta do PostgreSQL |
| `DB_USER` | Usuário do banco |
| `DB_PASS` | Senha do banco |
| `DB_NAME` | Nome do banco |
| `JWT_SECRET` | Chave secreta para assinar os tokens JWT |
| `PORT` | Porta do servidor (padrão: 3000) |

## Estrutura do banco

```
Users
├── id (PK)
├── username
├── password (hash bcrypt)
└── accountId (FK → Accounts)

Accounts
├── id (PK)
└── balance

Transactions
├── id (PK)
├── debitedAccountId (FK → Accounts)
├── creditedAccountId (FK → Accounts)
├── value
└── createdAt
```
