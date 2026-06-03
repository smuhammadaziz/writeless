# Writeless — Project Rules & Architecture

> **For AI agents:** Read this file at the start of every task. Monorepo root is `product/writeless/` (not `student-prep/`). Do not commit unless the user explicitly asks.

## Product

**Writeless** — voice/recording app (transcribe, summarize). Monorepo for a startup product.

**Vision:** Recording → transcript → summary → key points. Max recording **20 minutes** (1200s). Status: `processing` → `done` | `failed`.

## Monorepo

- **Package manager:** pnpm workspaces ONLY — never npm or yarn
- **Root scripts:** `pnpm dev:api` | `dev:web` | `dev:admin` | `dev:mobile`
- **Workspaces:** `apps/*`, `packages/*` (see `pnpm-workspace.yaml`)

| Package | Path | Dev port |
|---------|------|----------|
| `@writeless/api` | `apps/api` | 3001 (Bun) |
| `@writeless/web` | `apps/web` | 3000 |
| `@writeless/admin` | `apps/admin` | 3002 |
| `@writeless/mobile` | `apps/mobile` | Expo |
| `@writeless/types` | `packages/types` | — |

### Commands (from monorepo root)

```bash
pnpm install
cp apps/api/.env.example apps/api/.env   # first time

pnpm dev:api      # Bun API :3001
pnpm dev:web      # Next :3000
pnpm dev:admin    # Next :3002
pnpm dev:mobile   # Expo

pnpm --filter @writeless/api typecheck
pnpm --filter @writeless/web typecheck
# ... per package
```

**Prerequisites:** pnpm, Bun (API), MongoDB for API, Node >= 18.

**Verify API:** `curl http://localhost:3001/health`

---

## Global coding rules (STRICT)

1. **TypeScript only** for application source: `.ts` and `.tsx` only — no `.js` app files
2. **Every app/package** `tsconfig.json` must extend `../../tsconfig.base.json` (`packages/types` too)
3. **Strict TypeScript** — from `tsconfig.base.json` (`strict: true`, `moduleResolution: "bundler"`, `target: "ES2020"`)
4. **Shared types** in `@writeless/types` (`packages/types/src/index.ts`) — `import type { X } from "@writeless/types"`
5. **Never duplicate** domain types (`User`, `Recording`, `ApiResponse`) in apps — extend `packages/types` first
6. **Each app runs independently** — own `package.json` with `dev` script; root only orchestrates via filters
7. **Minimal diffs** — match existing patterns; no over-engineering or unrelated refactors
8. **No placeholder comments** like "add code here" — ship real working code
9. **Do not commit** `.env` — only `.env.example` in `apps/api`
10. **Do not create git commits** unless the user explicitly asks

---

## Brand / UI (all frontends)

| Token | Hex |
|-------|-----|
| Primary | `#6C63FF` |
| Background | `#F5F5FF` |
| Text / dark | `#1A1A2E` |

- **Mobile:** `apps/mobile/src/constants/colors.ts` + `StyleSheet`
- **Web / Admin:** CSS variables in `src/app/globals.css` (`.page`, `.title`)

---

## `packages/types` — single source of truth

Path: `packages/types/src/index.ts`

- `ApiResponse<T>` — `{ success, data, message? }`
- `User` — `_id`, `email`, `name`, `createdAt`
- `Recording` — `_id`, `userId`, `title`, `duration` (seconds, max 1200), optional `transcript`, `summary`, `keyPoints`, `status: "processing" | "done" | "failed"`, `createdAt`

**Rule:** New cross-app contracts → add here first, then `pnpm install` if needed.

---

## `apps/api` — Elysia + Bun + MongoDB

- **Runtime:** Bun (`bun run dev`, `bun run --watch src/index.ts`)
- **Framework:** Elysia.js with plugins (`@elysiajs/cors`, etc.)
- **DB:** Official `mongodb` driver — **NOT Mongoose**
- **Env:** `MONGODB_URI`, `PORT` (default 3001) — see `apps/api/.env.example`
- **Dependency:** `@sinclair/typebox` (^0.34.x) for Elysia peer compatibility

### API folder pattern (clean architecture)

```
apps/api/src/
  config/          # db, env helpers
  modules/
    <feature>/
      <feature>.route.ts      # Elysia plugin, wires HTTP
      <feature>.controller.ts # business logic, DB calls
  index.ts         # connectDb() then mount routes
```

### API conventions

- New features = new folder under `modules/` (route + controller)
- Routes return typed payloads; use `ApiResponse<T>` for standard JSON envelopes when appropriate
- Health check: `GET /health` → `{ status: "All good", timestamp: Date }`
- Server starts only after `connectDb()` in `index.ts`

---

## `apps/web` & `apps/admin` — Next.js 14

- **Router:** App Router only — `src/app/layout.tsx`, `page.tsx`, `globals.css`
- **Next 14:** No `next.config.ts` — omit config or use `.mjs` only if required
- **Styling:** Global CSS with brand variables (Tailwind only if user asks)
- **web** = public landing (3000); **admin** = internal dashboard (3002)
- Both depend on `@writeless/types` via `workspace:*`

---

## `apps/mobile` — Expo + React Navigation

- **Expo SDK ~52**, TypeScript template style
- **Navigation:** `@react-navigation/native` + `native-stack` — `src/navigation/RootNavigator.tsx`
- **Screens:** `src/screens/<Name>Screen.tsx`
- **Reanimated:** import `"react-native-reanimated"` at top of `App.tsx`; `babel.config.ts` has reanimated plugin
- **Monorepo:** `metro.config.ts` — `watchFolders` + `nodeModulesPaths` for pnpm
- **Types:** `src/types/index.ts` re-exports from `@writeless/types`
- **Entry:** `App.tsx` → `NavigationContainer` + `RootNavigator`

---

## Feature checklist

When adding or changing features:

- [ ] Types in `@writeless/types` if shared across apps
- [ ] API: `modules/<name>/` with route + controller
- [ ] `tsconfig.json` still extends `tsconfig.base.json`
- [ ] `pnpm --filter <package> typecheck` passes
- [ ] Brand colors on any new UI
- [ ] No mongoose, no npm/yarn, no stray `.js` source files

---

## Current scaffold (baseline)

All apps show centered **"All good"** placeholder UI. API has health module only. No auth, uploads, or AI pipeline yet — build on this structure.

---

## Short prompt for new chats

> Working on **Writeless** at `product/writeless/`. pnpm monorepo: Expo mobile, Bun+Elysia API (MongoDB official driver, no Mongoose), Next.js web (3000) + admin (3002). Strict TS, shared types in `@writeless/types`, every tsconfig extends `tsconfig.base.json`. Brand: `#6C63FF`, `#F5F5FF`, `#1A1A2E`. API: `modules/<feature>/{route,controller}.ts`. Follow **AGENTS.md**. No npm/yarn. Don't commit unless I ask.

**What to say each session:** project is Writeless — follow `AGENTS.md`, plus one sentence for the task (e.g. auth, recordings CRUD, upload pipeline).
