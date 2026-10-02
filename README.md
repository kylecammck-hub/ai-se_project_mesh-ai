# Mesh AI

Mesh AI is a full-stack knowledge-base assistant. Upload PDF documents, and chat with an AI that answers questions using only the content of your documents (retrieval-augmented generation).

**Live app:** https://meshai-kyle.duckdns.org

## Tech stack

- **Frontend:** React 18, TypeScript, Vite, React Router, react-markdown
- **Backend:** Node.js 22, Express, TypeScript, Mongoose
- **Database:** MongoDB 7
- **AI:** Nebius AI Studio (OpenAI-compatible API) — `Qwen/Qwen3-Embedding-8B` for embeddings, `Qwen/Qwen3-30B-A3B-Instruct-2507` for chat
- **Auth & security:** JWT, bcryptjs, express-rate-limit
- **Logging:** Winston, Morgan
- **Infrastructure:** Docker (multi-stage builds), Docker Compose, Caddy (reverse proxy + automatic HTTPS), AWS EC2
- **CI:** GitHub Actions

## Project structure

```
client/        React app (Vite) + Dockerfile (served by Caddy)
server/        Express API + Dockerfile
compose.yaml   mongo, backend, frontend, caddy services
Caddyfile      Public reverse proxy: /api/* -> backend, everything else -> frontend
.env.example   Required environment variables
```

## Local setup

### Option 1: Docker Compose (recommended)

Requirements: Docker Desktop.

```bash
git clone https://github.com/kylecammck-hub/ai-se_project_mesh-ai.git
cd ai-se_project_mesh-ai
cp .env.example .env        # then fill in JWT_SECRET and NEBIUS_API_KEY
docker compose up --build
```

Open http://localhost.

### Option 2: Run without Docker

Requirements: Node.js 22+, a local MongoDB running on port 27017.

```bash
npm run install:all
```

Create `server/.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/meshai
JWT_SECRET=any-long-random-string
NEBIUS_API_KEY=your-nebius-api-key
PORT=3000
```

Then start both apps from the project root:

```bash
npm run dev
```

The client runs at http://localhost:5173 and the API at http://localhost:3000.

## Environment variables

| Variable | Required | Where | Description |
| --- | --- | --- | --- |
| `MONGO_URI` | Yes | backend | MongoDB connection string. In Compose: `mongodb://mongo:27017/meshai` |
| `JWT_SECRET` | Yes | backend | Secret used to sign auth tokens |
| `NEBIUS_API_KEY` | Yes | backend | Nebius AI Studio API key for embeddings and chat |
| `SITE_ADDRESS` | Yes (prod) | caddy | Domain Caddy serves, without `https://` (e.g. `meshai.example.com`). Use `:80` locally |
| `PORT` | No | backend | API port (default `3000`) |
| `NODE_ENV` | No | backend | `development` in `npm run dev`; `production` in Docker |
| `CLIENT_ORIGIN` | No | backend | Allowed CORS origin for local dev (default `http://localhost:5173`) |
| `VITE_API_URL` | No | client (build time) | Override the API base URL. Defaults to `/api` in production builds |

## Deployment (AWS EC2)

1. Launch an EC2 instance; security group allows inbound TCP 22, 80, 443.
2. Install Docker + the Compose plugin, clone the repo.
3. Point a DNS A record for your subdomain at the instance's public IP.
4. Create `.env` in the project root with `MONGO_URI`, `JWT_SECRET`, `NEBIUS_API_KEY`, and `SITE_ADDRESS=your.subdomain.com`.
5. `sudo docker compose up -d --build` — Caddy obtains a TLS certificate automatically.

## API overview

All routes are served under `/api` in production (Caddy strips the prefix).

- `POST /auth/register`, `POST /auth/login` (rate limited)
- `GET /users/me`
- `GET/POST /documents`, `GET/DELETE /documents/:id` (list is cached per user)
- `GET/POST /chats`, `GET/DELETE /chats/:id`, `POST /chats/:id/messages` (list is cached per user)
- `POST /query`
