# Exchanges Review & Arbitrage SaaS

This monorepo contains a proof‑of‑concept implementation of a SaaS panel for **exchanges review**, **spot arbitrage**, **triangular arbitrage** and **P2P scanners**.  It is designed to be self‑hosted via Docker Compose and includes a Next.js frontend, a NestJS API, background workers powered by BullMQ, a Postgres database with Prisma ORM, and Redis for caching/queueing.

> **Disclaimer**
>
> This project is provided for educational purposes only.  It analyses public market data and does **not** execute trades or circumvent KYC/AML procedures.  Use this code responsibly and at your own risk.

## Features

- **Exchanges review** – catalogue of exchanges with filters, reviews, SEO‑friendly profiles and admin import/export.
- **Spot arbitrage scanner (CEX ↔ CEX)** – compares best bid/ask prices across exchanges to identify spreads, accounting for fees, withdrawals and liquidity.  Workers update data periodically and store snapshots for history and graphs.
- **Triangular arbitrage scanner** – finds profitable cycles within a single exchange using orderbook depth and realistic fee models.
- **P2P scanner** – normalises and compares P2P offers across exchanges and between P2P and spot.  Supports manual import when no public API exists.
- **Real‑time UI** – pages under `/scanners` stream live opportunities via server‑sent events (SSE) and allow manual refresh.  Alerts can be configured for custom thresholds and delivered via email (console mock) or Telegram webhook.
- **Admin panel** – manage exchanges registry, configure scan frequencies, whitelists/blacklists and P2P adapters.  Seed includes at least 20 common CEX with logos and approximate fees.

## Tech stack

- **Frontend:** Next.js App Router, TypeScript, Tailwind CSS, [shadcn/ui](https://ui.shadcn.com) components, and `next-intl` for UA/RU/EN localisation.
- **API:** NestJS with Prisma ORM, JWT auth (access/refresh), role‑based guards (ADMIN/EDITOR/USER), SSE gateway and REST endpoints.
- **Workers:** BullMQ and Redis to schedule market scans and alert checks.
- **Database:** PostgreSQL accessed via Prisma.  Automatic migrations and seed scripts are included.
- **Market data:** [ccxt](https://github.com/ccxt/ccxt) for public spot market data.  WebSockets are used when available with REST fallback.  P2P adapters are implemented per‑exchange.
- **Observability:** `pino` logger and a simple `/metrics` endpoint for Prometheus scraping.
- **DevOps:** Docker Compose orchestrates services (`web`, `api`, `worker`, `postgres`, `redis`).  Running `docker compose up --build` builds images, runs migrations and seeds the database automatically.

## Local development

1. Copy `.env.example` to `.env` and fill in secrets.  At minimum set database and JWT secrets.
2. Install dependencies using npm: `npm install` (the root uses workspaces for sub‑packages).
3. Start the services:

```bash
docker compose up --build
```

This command builds containers, applies Prisma migrations, seeds the registry with 20 exchanges and starts the API, web frontend and worker.  Open [http://localhost:3000](http://localhost:3000) to view the frontend.

### Web

The Next.js app lives under `apps/web` and uses the new App Router with server components.  Pages for scanners are located in the `app/scanners` directory.  Tailwind and shadcn/ui are preconfigured.

### API

The NestJS API resides in `apps/api`.  Major modules include:

- `exchanges` – CRUD for the exchanges registry.
- `reviews` – user reviews with moderation.
- `scanner` – endpoints to fetch current opportunities (CEX, triangular, P2P) and to stream live updates via SSE.
- `alerts` – creating alerts and delivering them via email/Telegram.
- `auth` – JWT authentication with roles and guards.

Prisma schema is located in the `prisma` directory.  To generate types and apply migrations in development run:

```bash
npx prisma generate
npx prisma migrate dev
```

### Worker

The worker package (`apps/worker`) connects to Redis and uses BullMQ to periodically fetch orderbooks, compute spreads, detect triangular cycles, normalise P2P offers and persist opportunities.  It emits SSE events through the API via a simple Redis pub/sub channel.

### Testing

Unit tests covering spread calculations, fee calculations, P2P normalisation and triangular cycle detection are located under `packages/tests`.  Run tests with:

```bash
npm test
```

End‑to‑end tests simulate opening scanner pages and triggering alerts via mocked emails.

## Deployment on VPS

1. Install Docker and Docker Compose on your VPS.
2. Clone this repository and copy `.env.example` to `.env`, filling secrets.
3. Run `docker compose up -d --build` to build images and start services in the background.
4. The web UI will be available on the configured port (default : 3000).  Adjust ports and environment variables in `docker-compose.yml` as needed.

## Project structure

```
.
├── README.md         – this file
├── docker-compose.yml
├── .env.example
├── package.json      – root workspace configuration
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── apps/
│   ├── web/          – Next.js frontend
│   ├── api/          – NestJS API
│   └── worker/       – BullMQ workers
└── packages/
    ├── tests/        – jest unit tests
    └── util/         – shared util functions (fees, spreads, etc.)
```

Refer to each package’s README for details.