# Writeless — Project Rules & Architecture

> **For AI agents:** Read this file at the start of every task. Monorepo root is `product/writeless/` (not `student-prep/`). Do not commit unless the user explicitly asks.

## Product

**Writeless** — voice/recording app (transcribe, summarize). Monorepo for a startup product.

**Vision:** Recording → transcript → summary → key points. Max recording **30 minutes** (1800s). Status: `processing` → `done` | `failed`.

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
11. **Mobile i18n every time** — any user-visible string → `t("…")` + keys in **all three** locale files (`en`, `uz`, `ru`). Never ship hardcoded UI copy on mobile. Run `pnpm --filter @writeless/mobile check:locales` before finishing mobile UI work.

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
- `Recording` — `_id`, `userId`, `title`, `duration` (seconds, max 1800), optional `transcript`, `summary`, `keyPoints`, `status: "processing" | "done" | "failed"`, `createdAt`

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

## `apps/mobile` — Expo + Expo Router

- **Expo SDK ~52**, entry `expo-router/entry`, screens in `src/app/`
- **UI:** NativeWind v4, Inter fonts, Zustand stores, **i18n (en / uz / ru) — mandatory on every UI change**
- **Reanimated + Gesture Handler** — `babel.config.ts` reanimated plugin last
- **Monorepo:** `metro.config.ts` — `watchFolders`, `nodeModulesPaths`, NativeWind
- **Types:** `src/types/index.ts` (app-specific; API may align with `@writeless/types` later)
- **Env:** `apps/mobile/.env` with `EXPO_PUBLIC_*` keys (not committed)
- **Recording limit:** `MAX_RECORDING_MINUTES` (30) in `apps/mobile/src/constants/config.ts` → `maxRecordingSeconds`; update locales + onboarding badge when changing

### Mobile i18n (STRICT — every task)

| Rule | Detail |
|------|--------|
| **Languages** | English (`en`), Uzbek (`uz`), Russian (`ru`) |
| **Files** | `apps/mobile/src/locales/en.json`, `uz.json`, `ru.json` |
| **Usage** | `const { t } = useTranslation()` then `t("section.key")` — **never** literal button/label text in JSX |
| **New copy** | Add the same key to **all three** JSON files in the same edit |
| **Verify** | `pnpm --filter @writeless/mobile check:locales` (key parity across locales) |
| **Init** | `src/i18n/index.ts` loads on app start; `hydrate()` awaits `initI18n()` before UI |
| **Change language** | Profile → Language (`LanguageModal`), or first-run `language` screen |
| **After locale edits** | Restart Expo with cache clear if keys show as `home.someKey` in UI: `npx expo start -c` |

**Common mistake:** Adding `t("home.newKey")` in TSX but only updating `en.json` → UI shows the raw key. Always update **en + uz + ru** together.

---

## Feature checklist

When adding or changing features:

- [ ] Types in `@writeless/types` if shared across apps
- [ ] API: `modules/<name>/` with route + controller
- [ ] `tsconfig.json` still extends `tsconfig.base.json`
- [ ] `pnpm --filter <package> typecheck` passes
- [ ] Brand colors on any new UI
- [ ] **Mobile:** new/changed UI strings in `en.json`, `uz.json`, `ru.json`; `check:locales` passes
- [ ] No mongoose, no npm/yarn, no stray `.js` source files

---

## Current scaffold (baseline)

All apps show centered **"All good"** placeholder UI. API has health module only. No auth, uploads, or AI pipeline yet — build on this structure.

---

## Short prompt for new chats

> Working on **Writeless** at `product/writeless/`. pnpm monorepo: Expo mobile, Bun+Elysia API (MongoDB official driver, no Mongoose), Next.js web (3000) + admin (3002). Strict TS, shared types in `@writeless/types`, every tsconfig extends `tsconfig.base.json`. Brand: `#6C63FF`, `#F5F5FF`, `#1A1A2E`. API: `modules/<feature>/{route,controller}.ts`. **Mobile: i18n en/uz/ru on every UI string — `check:locales`.** Follow **AGENTS.md**. No npm/yarn. Don't commit unless I ask.

**What to say each session:** project is Writeless — follow `AGENTS.md`, plus one sentence for the task (e.g. auth, recordings CRUD, upload pipeline).
