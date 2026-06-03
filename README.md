# Writeless

pnpm monorepo for the Writeless product.

## Structure

- `apps/mobile` — Expo (React Native)
- `apps/api` — Elysia + Bun + MongoDB
- `apps/web` — Next.js landing page
- `apps/admin` — Next.js admin dashboard
- `packages/types` — shared TypeScript types

## Prerequisites

- [pnpm](https://pnpm.io)
- [Bun](https://bun.sh) (API)
- MongoDB (for API)

## Setup

```bash
cd product/writeless
pnpm install
cp apps/api/.env.example apps/api/.env
```

## Development

From the monorepo root:

```bash
pnpm dev:api      # http://localhost:3001
pnpm dev:web      # http://localhost:3000
pnpm dev:admin    # http://localhost:3002
pnpm dev:mobile   # Expo dev server
```

Or from each app directory: `pnpm dev` or `bun run dev` (API).

## Health check

```bash
curl http://localhost:3001/health
```
# writeless
