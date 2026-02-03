# 🎮 Jogo da Forca

Aplicação fullstack com multiplayer em tempo real, geração de palavras via IA, autenticação e ranking.

## 📋 Índice

- [Stack](#-stack)
- [Estrutura](#-estrutura)
- [Início Rápido](#-início-rápido)
- [Comandos](#-comandos)
- [API](#-api)
- [Testes](#-testes)

## 🚀 Stack

**Backend:** AdonisJS 6, TypeScript, PostgreSQL 16, Redis 7, Socket.IO, OpenAI/Gemini
**Frontend:** React 19, TypeScript, Vite, TailwindCSS, Socket.IO Client
**Infra:** Docker, Docker Compose

## 📦 Requisitos

- Docker >= 20.10
- Docker Compose >= 2.0
- Node.js >= 20.x (opcional, para dev local)

## 📁 Estrutura

```
gasola/
├── backend/              # API AdonisJS
│   ├── app/
│   │   ├── controllers/  # Controladores HTTP
│   │   ├── models/       # Modelos Lucid ORM
│   │   ├── services/     # Lógica de negócio
│   │   ├── middleware/   # Middlewares
│   │   └── validators/   # Validações Vine
│   ├── database/
│   │   ├── migrations/   # Migrações do banco
│   │   └── seeders/      # Seeds de dados
│   ├── start/
│   │   ├── routes.ts     # Rotas HTTP
│   │   └── socket.ts     # Configuração Socket.IO
│   ├── tests/            # Testes (Japa)
│   ├── docker-entrypoint.sh
│   └── Dockerfile
├── frontend/             # App React
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── views/        # Páginas
│   │   ├── hooks/        # Custom hooks
│   │   ├── api/          # Clientes HTTP/Socket
│   │   └── utils/        # Utilitários
│   └── Dockerfile
├── shared/               # Código compartilhado
│   └── src/
│       ├── interface.ts  # Interfaces TypeScript
│       ├── enum.ts       # Enums compartilhados
│       └── types.ts      # Tipos comuns
├── docker-compose.yml
├── package.json
└── README.md
```

### 🗄️ Banco de Dados

**Tabelas:** `usuarios`, `temas`, `palavras`, `jogos`, `access_tokens`
**Relacionamentos:** usuarios → jogos ← palavras ← temas

## ⚙️ Início Rápido

### 1. Clone e Configure

```bash
git clone <url-do-repositorio>
cd gasola
```

### 2. Variáveis de Ambiente

Crie `backend/.env`:
```env
PORT=3333
HOST=0.0.0.0
APP_KEY=seu_app_key_32_caracteres
NODE_ENV=development

DB_HOST=db
DB_PORT=5432
DB_USER=root
DB_PASSWORD=rootpassword
DB_DATABASE=jogodaforca

REDIS_HOST=redis
REDIS_PORT=6379

# Opcional - IA
OPENAI_API_KEY=sua_chave
GEMINI_API_KEY=sua_chave
```

Crie `backend/.env.test` (usa localhost, não db):
```env
DB_HOST=localhost
DB_DATABASE=jogodaforca_test
# ... demais variáveis iguais ao .env
```

Crie `frontend/.env`:
```env
VITE_API_URL=http://localhost:3333
VITE_SOCKET_URL=http://localhost:3333
```

### 3. Instalar Dependências

**IMPORTANTE:** Antes de iniciar o Docker, instale as dependências localmente:

```bash
npm run install:all
```

Este comando:
- ✅ Instala dependências do pacote `shared`
- ✅ Constrói o pacote `shared`
- ✅ Instala dependências do `backend` (inclui link para shared)
- ✅ Instala dependências do `frontend` (inclui link para shared)

> **Por quê?** O backend e frontend dependem de `jogodaforca-shared` via `file:../shared`. O Docker usa bind mounts que compartilham a pasta local, então as dependências precisam existir antes de iniciar os containers.

### 4. Inicie a Aplicação

```bash
npm run dev
# ou
docker-compose up
```

O `docker-entrypoint.sh` automaticamente:
- ✅ Cria bancos de dados (produção e testes)
- ✅ Executa migrations
- ✅ Popula dados iniciais (seeds)

**Acessos:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3333
- Health: http://localhost:3333/health

## 🎯 Comandos

### Principais (Raiz)
```bash
npm run dev              # Iniciar aplicação
npm run dev:build        # Rebuild + iniciar
npm run stop             # Parar containers
npm run stop:clean       # Parar + limpar volumes
npm run logs             # Ver logs
npm run db:reset         # Resetar banco
npm test                 # Rodar testes
npm run shell:backend    # Shell do backend
npm run shell:db         # PostgreSQL
```

### Backend
```bash
cd backend
npm run dev              # Dev local (sem Docker)
npm test                 # Testes
npm run db:migrate       # Migrations
npm run db:seed          # Seeds
npm run db:fresh         # Limpar + recriar
```

### Frontend
```bash
cd frontend
npm run dev              # Dev local
npm run build            # Build produção
```

## 🧪 Testes

```bash
npm test                 # Rodar todos os testes
npm run test:watch       # Modo watch
```

- Framework: **Japa**
- Banco: `jogodaforca_test` (criado automaticamente pelo docker-entrypoint)
- Limpeza: `testUtils.db().truncate()` entre testes
- Config: `.env.test` com `DB_HOST=localhost`

## 📡 API

### HTTP
```
POST /usuario/guest        # Criar usuário guest
GET  /temas                # Listar temas
GET  /jogo/ranking         # Top 10 ranking
GET  /usuario/:id/historico # Histórico do usuário
```

### Socket.IO
**Client → Server:** `novoJogo`, `novoJogoTemaIA`, `tentarJogada`, `pedirHint`, `restaurarJogo`, `finalizarJogo`
**Server → Client:** `estadoDoJogo`, `erro`, `dica`

## 🐛 Troubleshooting

### Problema de Permissões

Se precisar limpar as pastas criadas pelo Docker (como `shared/build`), use:

```bash
sudo rm -rf shared/build shared/node_modules
sudo rm -rf backend/node_modules
sudo rm -rf frontend/node_modules
```

Depois reinstale:
```bash
npm run install:all
```

> **Por quê?** O Docker cria arquivos como root. Para evitar isso no futuro, você pode configurar o Docker para rodar com seu usuário (veja Docker rootless mode).

### Reinstalação Limpa

Para uma reinstalação completa do zero:

```bash
# Parar e limpar containers/volumes
npm run stop:clean

# Limpar dependências locais (com sudo se necessário)
sudo rm -rf shared/build shared/node_modules backend/node_modules frontend/node_modules

# Reinstalar tudo
npm run install:all

# Rebuild e iniciar
npm run dev:build
```

**Logs:**
```bash
npm run logs              # Todos os serviços
npm run logs:backend      # Apenas backend
```

**Resetar tudo:**
```bash
npm run stop:clean
npm run dev:build
```

**Testes falhando:** O banco `jogodaforca_test` é criado automaticamente pelo docker-entrypoint. Se os testes falharem, verifique `.env.test` com `DB_HOST=localhost`.

---

Leandro Carvalho
