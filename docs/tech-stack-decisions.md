# Technical Stack Decisions

Each section below covers one real decision point in this codebase: what was picked, what else was on the table, why this option won, and — the part that's easy to skip — what was deliberately given up to get it. None of these are presented as universally "correct"; they're correct for a single-admin personal portfolio, and each entry says where that scope assumption is load-bearing.

---

## Framework: Next.js 16 App Router

**Decision:** Next.js 16 with the App Router, Server Components by default, Server Actions for all mutations.

**Alternatives considered:** A plain Vite + React SPA with a separate API (Express/Fastify); Remix; a static site generator (Astro) with a headless CMS.

**Why this:** The project needs server-rendered bilingual content (for reasonable load performance and no client-side flash-of-wrong-language), a protected admin panel that mutates a database, and PDF file handling — all in one deployable unit. The App Router's Server Components let public pages fetch directly from the query layer with zero client-side data-fetching code, and Server Actions remove the need for a hand-rolled REST/JSON API layer between the admin forms and the database. One framework, one deploy target (Vercel), no separate backend to operate.

**Trade-offs accepted:**

- Next.js 16 is genuinely new — its APIs (`proxy.ts` instead of `middleware.ts`, Promise-based `params`/`searchParams`) don't match most existing training data or tutorials, which is why `CLAUDE.md`/`AGENTS.md` open with an explicit "this is not the Next.js you know" warning. That's a real cost paid on every future change, not a one-time cost.
- Server Actions being callable as raw HTTP endpoints (not just internal function calls) means every mutating action must re-check authorization itself (`requireAdmin()`) rather than trusting that only the UI can reach it — see [`architecture.md`](./architecture.md#request-lifecycle).
- A separate SPA + API would have made the API independently testable and reusable by a future mobile client; this architecture couples the UI and the mutation layer more tightly by design, which is the right trade for a project with exactly one client.

---

## UI library: Material UI v9

**Decision:** Material UI (MUI) v9 for all components, with `AppRouterCacheProvider` handling SSR emotion styling.

**Alternatives considered:** Tailwind CSS as the primary styling system (utility classes, no component library); shadcn/ui (Radix primitives + Tailwind, copy-paste components); Chakra UI.

**Why this:** A single developer building a full admin CRUD panel (six content types × list/create/edit/delete forms) benefits enormously from a component library with forms, dialogs, tables, and validation-state styling already built — MUI's `TextField`, `Alert`, `Dialog` (used by the shared `DeleteButton` confirmation) cover most of the admin UI without custom component work. Tailwind alone would mean building every form control and its states from scratch.

**Trade-offs accepted:**

- MUI v9's strict TypeScript rejects layout props (`gap`, `justifyContent`, `flexWrap`, `fontWeight`) as direct JSX attributes on components like `Stack` — everything has to go through `sx={{}}`, which is more verbose than Tailwind classes and is an easy mistake for anyone used to earlier MUI versions or other libraries.
- Tailwind is still present in the project (`globals.css`, a CSS reset only) purely for its reset, which means **two styling systems coexist** and mixing their layout primitives on the same element silently breaks MUI's layout system. This is a real footgun documented in `CLAUDE.md` precisely because it has bitten development before.
- A Tailwind-only or shadcn/ui approach would produce a smaller bundle and full control over markup, at the cost of building every admin form control by hand — not worth it for this project's size, but the trade reverses on a larger team building more custom UI.

---

## Database: Turso (libSQL / SQLite)

**Decision:** Turso — hosted libSQL, SQLite's wire-compatible fork — accessed via `@libsql/client`.

**Alternatives considered:** Managed Postgres (Supabase, Neon, Vercel Postgres); a self-hosted SQLite file on a persistent volume; Firebase/Firestore.

**Why this:** The content model is simple (eight tables, no complex joins, low write volume — an admin editing their own CV occasionally), so Postgres's relational power isn't needed. SQLite's zero-ops simplicity — one file, `schema.sql` applied by hand, no connection pooling to tune — fits a single-developer project. Turso specifically was chosen over a bare SQLite file because Vercel's serverless functions have no persistent local disk between invocations; Turso gives SQLite's simplicity with a real network endpoint (`TURSO_URL`/`TURSO_AUTH_TOKEN`) that survives across cold starts.

**Trade-offs accepted:**

- SQLite-family databases serialize writes; this is a non-issue at the write volume a single-admin portfolio produces, but it would not scale to a multi-tenant SaaS product without a different database. The choice is scope-appropriate, not universally right.
- Postgres would have offered richer types (native JSON columns instead of `technologies` being a hand-serialized JSON array string in a `TEXT` column, see below) and a larger ecosystem of hosted tooling, at the cost of more operational surface area (connection limits, migrations tooling) that this project has no use for.
- Turso is a smaller, younger company than the established managed-Postgres providers — a real vendor-risk trade-off worth naming even though it hasn't caused a problem so far.

---

## Bilingual content: database columns vs an i18n library

**Decision:** Every content table has parallel `*_fi`/`*_en` columns; the active language is a `lang` cookie read server-side (default `en`).

**Alternatives considered:** `next-intl` or `react-i18next` with locale-prefixed routes (`/fi/work`, `/en/work`) and JSON translation files.

**Why this:** The bilingual content here is _user-generated data_ (job descriptions, project write-ups), not static UI strings — a translation-file approach is built for the latter. Storing both languages as sibling columns means there's no "missing translation" runtime state to handle: a row simply has both `_fi` and `_en` values by the time it's saved, enforced by `NOT NULL` at the schema level, not by a fallback chain at render time.

**Trade-offs accepted:**

- No locale-prefixed URLs means no per-language SEO indexing (`/work` serves either language depending on a cookie, not two distinct crawlable URLs) — a real SEO cost this project accepts because it's a personal portfolio, not a content site competing on search traffic.
- Every new content field means writing the same field twice (`_fi`/`_en`) in the schema, the Zod schema, and the admin form — there's no abstraction hiding that duplication, which is a small but real tax on every future field.
- An i18n library would suit static UI copy (nav labels, buttons) better than this pattern does — and in fact the project doesn't use one for that either; nav strings are hardcoded per language inline. That's a smaller-scope inconsistency worth flagging rather than hiding.

---

## Auth: hand-rolled JWT session, not an auth library

**Decision:** `jose` for JWT sign/verify, a single shared `ADMIN_PASSWORD` compared with `crypto.timingSafeEqual`, a 7-day session cookie. No NextAuth/Auth.js, Clerk, or Supabase Auth.

**Alternatives considered:** NextAuth.js (now Auth.js); Clerk; Supabase Auth.

**Why this:** There is exactly one admin user. Auth libraries are built to solve multi-provider, multi-user problems (OAuth flows, user tables, role management) that don't exist here — pulling one in would mean configuring and trusting a larger dependency for a problem that's genuinely three primitives: hash a password, sign a cookie, verify it on each request. `jose` alone covers the actual requirement.

**Trade-offs accepted:**

- A single shared plaintext password in an environment variable is explicitly _not_ a pattern that scales past one admin — `AGENTS.md`'s Security Agent checklist calls this out directly: "Acceptable for personal single-user admin." Adding a second admin, or wanting audit trails per user, would require rebuilding this from scratch rather than extending it.
- No password reset flow, no MFA, no account lockout beyond the in-memory rate limiter — an auth library would provide these largely for free. Here they're either absent or hand-built narrowly (rate limiting only, see below).
- The `SESSION_SECRET` length check throwing at import time (rather than degrading gracefully) is a deliberate fail-fast choice: a misconfigured secret should break the build, not silently issue weak sessions in production.

---

## Rate limiting: in-memory, not Redis-backed

**Decision:** `lib/rate-limiter.ts` — a `Map` keyed by attempt identity, 5 attempts per 15-minute window, active in production only.

**Alternatives considered:** Upstash Redis (Vercel's recommended pattern for serverless rate limiting); Vercel's Edge Config; a database-backed attempts table.

**Why this:** Zero additional infrastructure or cost for a login endpoint that, realistically, one person calls a handful of times. An in-memory map needs no provisioning, no new environment variables, no new failure mode to reason about.

**Trade-offs accepted:**

- This is the trade-off most worth being explicit about: **Vercel serverless functions do not guarantee a warm, shared process between invocations.** An in-memory `Map` only limits attempts that happen to land on the same warm instance — it is not a distributed rate limit. For a single admin's occasional login, the failure mode (a determined attacker spreading requests across cold starts) is low-stakes; for anything with real brute-force exposure, this would need Redis or a database-backed counter to be meaningful. The current implementation is a reasonable deterrent, not a hard guarantee, and should not be described as one.
- It's disabled outside production specifically because the E2E suite logs in repeatedly across parallel Playwright workers — a real distributed limiter would have needed a way to reset state between test runs that the in-memory version gets for free (server restart clears it).

---

## Validation: Zod

**Decision:** Zod schemas validate every Server Action input before it reaches the database.

**Alternatives considered:** Yup; manual `if`-based validation; no validation library (rely on SQLite constraints alone).

**Why this:** Zod's TypeScript-first design means a validated schema also produces the TypeScript type for that data — no separate type definitions to keep in sync with validation rules. `technologiesField` and other shared field helpers (`lib/zod-fields.ts`) mean the CSV-to-JSON-array transform for the `technologies` column is written once and reused across every content type's schema instead of repeated per form.

**Trade-offs accepted:**

- Zod adds a dependency and a learning curve for anyone unfamiliar with schema-based validation, versus plain `if` checks that anyone can read without prior knowledge of the library's API.
- Relying on SQLite's own constraints (`NOT NULL`, `CHECK`) as the only validation would push invalid-data errors to the database layer, producing less specific error messages for the admin form — Zod's `validationError()` normalization (`lib/action-utils.ts`) exists specifically to turn Zod's field-level errors into form-usable messages, which a database-only approach couldn't provide.

---

## Forms: Server Actions + `useActionState`, not a client form library

**Decision:** React 19's `useActionState` hook drives every admin form, wrapped in a shared `useAdminForm(action, redirectPath)` hook.

**Alternatives considered:** `react-hook-form`; Formik; plain controlled-component state with `useState`.

**Why this:** Server Actions already provide progressive enhancement (forms work even if JavaScript fails to load, since they're real `<form action={...}>` submissions under the hood) and eliminate the need for a client-side fetch wrapper around every mutation. `useAdminForm` was extracted once every admin form needed the identical shape — call the action, read `ActionState`, redirect on success via `router.push` (not `redirect()`, which throws when called from a Client Component).

**Trade-offs accepted:**

- No client-side field-level validation-as-you-type — validation only runs after submission, on the server, via Zod. Libraries like `react-hook-form` would give instant per-keystroke feedback at the cost of duplicating the Zod validation rules on the client.
- `useActionState`/Server Actions are a comparatively new pattern; more of the ecosystem's tutorials, Stack Overflow answers, and AI training data assume `react-hook-form` or similar, which is part of why this project leans so heavily on its own `CLAUDE.md`/`AGENTS.md` for guidance rather than general web knowledge.

---

## Testing: Playwright + Vitest split, not one framework for everything

**Decision:** Vitest for pure functions (`tests/unit/`), Playwright for anything involving rendering or a Server Action round-trip (`tests/e2e/`), run against an isolated `test.db` seeded fresh every run.

**Alternatives considered:** Jest for unit tests; Cypress for end-to-end; one framework doing both jobs.

**Why this:** Vitest is faster than Jest for this project's Vite-adjacent tooling and pure-function-only scope — there's no DOM or browser needed to test `parseTechnologies` or `toArgs`. Playwright was chosen over Cypress mainly for first-class multi-browser support and its `webServer` config, which can boot the Next.js app, wait on `/api/health`, and tear it down automatically — removing manual server-lifecycle management from the test run.

**Trade-offs accepted:**

- Running two frameworks means two configs, two sets of assertions/APIs to know, and two places a new contributor has to look to understand "how are things tested here" — a single framework would be simpler to onboard into, at the cost of either running fast unit tests through a full browser (Cypress component testing) or awkwardly mocking the DOM for Vitest-only E2E-style tests.
- `workers: 2` in `playwright.config.ts` is a measured ceiling, not a default left untouched — raising it was tried and produced spurious admin-login failures from the dev server and in-memory session/rate-limit state not parallelizing cleanly. That's a real capacity constraint of the current architecture (see [`architecture.md`](./architecture.md#testing-architecture)), not an arbitrary conservative setting.

---

## File storage: local filesystem, not object storage

**Decision:** Uploaded PDFs land in `public/documents/` (public) or are placed manually in `private-documents/` (password-gated via `/api/protected-doc`) — both on Vercel's filesystem/build output, not S3 or Vercel Blob.

**Alternatives considered:** Vercel Blob Storage; AWS S3 (or S3-compatible) with signed URLs.

**Why this:** Vercel's static asset serving handles `public/` files for free with no additional service, credentials, or SDK to integrate — appropriate for a low-volume personal portfolio where a handful of PDFs (CVs, certificates) rarely change.

**Trade-offs accepted:**

- `public/documents/*.pdf` uploaded through the admin panel at runtime does **not** persist across Vercel deployments the way files committed to git do — Vercel's filesystem for serverless functions is ephemeral per deployment. This works today because upload volume is low and deployments are infrequent, but it's a real limitation an object-storage approach wouldn't have; a redeploy can lose files uploaded through `/api/upload` since the last deploy if they were never committed.
- Object storage would also enable signed, expiring URLs for the password-protected certificates instead of the current password-in-request-body model — a stronger access-control primitive that this project doesn't currently use, in exchange for not needing an S3/Blob account, credentials, or SDK at all.

---

## Manual `sort_order` field vs drag-and-drop reordering

**Decision:** Every content table has a plain integer `sort_order` column, edited as a number field in each admin form.

**Alternatives considered:** A drag-and-drop reordering UI (`dnd-kit` or similar) that writes sort positions on drop.

**Why this:** Drag-and-drop reordering is meaningfully more UI code (a DnD library, optimistic reordering state, drag handles, touch support) for a benefit that matters most when reordering happens often. For a portfolio owner who adds a handful of work entries a year and rarely reorders them, typing a number is a five-second operation that doesn't justify the added dependency and complexity.

**Trade-offs accepted:**

- Typing sort numbers requires the admin to know or guess what number puts an item where they want it relative to existing rows — there's no visual feedback until after saving, unlike drag-and-drop's immediate visual reordering. This is a real usability cost, accepted because the operation is infrequent enough that it doesn't outweigh the implementation cost of the alternative.

---

## Deployment: Vercel + Turso, and the environment-variable seam between them

**Decision:** Vercel for hosting (serverless functions + static assets), Turso for the database, GitHub Actions for CI gating merges to `main`.

**Alternatives considered:** Self-hosting on a VPS (Docker + Caddy/nginx); Netlify; Railway/Render with a bundled Postgres.

**Why this:** Vercel is Next.js's reference deployment target — App Router features (Server Actions, `proxy.ts`, ISR-adjacent caching) are guaranteed to work without infrastructure tuning. Combined with Turso's serverless-friendly connection model, there's no server to patch, no container to build, no reverse proxy to configure.

**Trade-offs accepted:**

- **Environment variables live in two places with no automated sync**: `.env.local` for local dev, Vercel's dashboard for production, plus GitHub repository secrets for CI. This is a real, already-materialized cost, not a hypothetical one — production admin login broke in the past specifically because `ADMIN_PASSWORD` was set locally but empty in Vercel's Production scope, and the failure mode looked like "wrong password" rather than "missing config," which is misleading during debugging. A single-source-of-truth secrets manager would remove this seam entirely, at the cost of another service/subscription this project doesn't otherwise need.
- Vercel's serverless model is also the direct cause of the rate-limiter's "not truly distributed" limitation and the local-filesystem upload persistence limitation described above — the deployment choice and those two trade-offs aren't independent decisions, they're downstream of the same one.
- Self-hosting would remove both the env-var-sync seam (one server, one `.env` file) and the ephemeral-filesystem limitation, in exchange for owning patching, TLS, and uptime — not a trade worth making for a personal portfolio's traffic and stakes.
