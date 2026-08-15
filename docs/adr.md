# Architecture Decision Record (ADR)

This is a **single-file ADR log** — one file holding every decision as its own numbered, dated entry — rather than the more common one-file-per-decision layout (`docs/adr/0001-*.md`, `docs/adr/0002-*.md`, ...). For a project this size, one file is easier to read start to finish and to grep; each entry below is still self-contained and follows the standard ADR fields (Status, Context, Decision, Consequences), so it splits cleanly into separate files later if the log outgrows a single document.

**Status** on each entry is almost always **Accepted** — this project hasn't yet revisited a decision — but the field is there so a future change can be recorded as **Superseded by ADR-00XX** rather than silently edited away.

**Scope note**, applying throughout: this is a personal portfolio for a single developer/admin, not a multi-tenant product. Several entries below (single shared admin password, in-memory rate limiting, a SQLite-family database) are correct _for that scope_ and explicitly would not be for a product with multiple admins or high write concurrency — each entry says so where it matters.

---

## ADR-0001: Use Next.js 16 App Router as the framework

**Status:** Accepted

**Context:** The project needs server-rendered bilingual content, a protected admin panel that mutates a database, and PDF file handling — all in one deployable unit, built and maintained by a single developer.

**Decision:** Next.js 16 with the App Router, Server Components by default, and Server Actions for all mutations. Server Components let public pages fetch directly from the query layer with zero client-side data-fetching code; Server Actions remove the need for a hand-rolled REST/JSON API layer between the admin forms and the database. One framework, one deploy target (Vercel), no separate backend to operate.

**Alternatives Considered:** A plain Vite + React SPA with a separate API (Express/Fastify); Remix; a static site generator (Astro) with a headless CMS.

**Consequences:**

- Next.js 16 is genuinely new — its APIs (`proxy.ts` instead of `middleware.ts`, Promise-based `params`/`searchParams`) don't match most existing training data or tutorials, which is why `CLAUDE.md`/`AGENTS.md` open with an explicit "this is not the Next.js you know" warning. That's a real cost paid on every future change, not a one-time cost.
- Server Actions being callable as raw HTTP endpoints (not just internal function calls) means every mutating action must re-check authorization itself (`requireAdmin()`) rather than trusting that only the UI can reach it — see [`architecture.md`](./architecture.md#request-lifecycle).
- A separate SPA + API would have made the API independently testable and reusable by a future mobile client; this architecture couples the UI and the mutation layer more tightly by design, which is the right trade for a project with exactly one client.

---

## ADR-0002: Use Material UI v9 as the component library

**Status:** Accepted

**Context:** A single developer needs to build a full admin CRUD panel — six content types × list/create/edit/delete forms — without spending disproportionate time on form controls, dialogs, and validation-state styling.

**Decision:** Material UI (MUI) v9 for all components, with `AppRouterCacheProvider` handling SSR emotion styling. MUI's `TextField`, `Alert`, `Dialog` (used by the shared `DeleteButton` confirmation) cover most of the admin UI without custom component work.

**Alternatives Considered:** Tailwind CSS as the primary styling system (utility classes, no component library); shadcn/ui (Radix primitives + Tailwind, copy-paste components); Chakra UI.

**Consequences:**

- MUI v9's strict TypeScript rejects layout props (`gap`, `justifyContent`, `flexWrap`, `fontWeight`) as direct JSX attributes on components like `Stack` — everything has to go through `sx={{}}`, more verbose than Tailwind classes and an easy mistake for anyone used to earlier MUI versions or other libraries.
- Tailwind is still present in the project (`globals.css`, a CSS reset only) purely for its reset, which means **two styling systems coexist** and mixing their layout primitives on the same element silently breaks MUI's layout system — a real footgun documented in `CLAUDE.md` precisely because it has bitten development before.
- A Tailwind-only or shadcn/ui approach would produce a smaller bundle and full control over markup, at the cost of building every admin form control by hand — not worth it for this project's size, but the trade reverses on a larger team building more custom UI.

---

## ADR-0003: Use Turso (libSQL/SQLite) as the database

**Status:** Accepted

**Context:** The content model is simple — eight tables, no complex joins — with low write volume: an admin editing their own CV occasionally. The app deploys to Vercel, whose serverless functions have no persistent local disk between invocations, ruling out a bare local SQLite file.

**Decision:** Turso — hosted libSQL, SQLite's wire-compatible fork — accessed via `@libsql/client`. It gives SQLite's zero-ops simplicity (one file, `schema.sql` applied by hand, no connection pooling to tune) with a real network endpoint (`TURSO_URL`/`TURSO_AUTH_TOKEN`) that survives across cold starts.

**Alternatives Considered:** Managed Postgres (Supabase, Neon, Vercel Postgres); a self-hosted SQLite file on a persistent volume; Firebase/Firestore.

**Consequences:**

- SQLite-family databases serialize writes; a non-issue at this project's write volume, but it would not scale to a multi-tenant SaaS product without a different database. The choice is scope-appropriate, not universally right.
- Postgres would have offered richer types (native JSON columns instead of `technologies` being a hand-serialized JSON array string in a `TEXT` column, see ADR-0004) and a larger ecosystem of hosted tooling, at the cost of more operational surface area (connection limits, migration tooling) this project has no use for.
- Turso is a smaller, younger company than the established managed-Postgres providers — a real vendor-risk trade-off worth naming even though it hasn't caused a problem so far.

---

## ADR-0004: Model bilingual content as database columns, not an i18n library

**Status:** Accepted

**Context:** Content is bilingual (Finnish/English), but it's _user-generated data_ (job descriptions, project write-ups) rather than static UI strings — the problem an i18n library like `next-intl` is built to solve.

**Decision:** Every content table carries parallel `*_fi`/`*_en` columns; the active language is a `lang` cookie read server-side (default `en`). Both columns exist for every row unconditionally, enforced `NOT NULL` at the schema level — there's no "missing translation" runtime state to handle.

**Alternatives Considered:** `next-intl` or `react-i18next` with locale-prefixed routes (`/fi/work`, `/en/work`) and JSON translation files.

**Consequences:**

- No locale-prefixed URLs means no per-language SEO indexing (`/work` serves either language depending on a cookie, not two distinct crawlable URLs) — a real SEO cost accepted because this is a personal portfolio, not a content site competing on search traffic.
- Every new content field means writing the same field twice (`_fi`/`_en`) in the schema, the Zod schema, and the admin form — a small but real tax on every future field, with no abstraction hiding the duplication.
- An i18n library would suit static UI copy (nav labels, buttons) better than this pattern does — and in fact the project doesn't use one for that either; nav strings are hardcoded per language inline. A smaller-scope inconsistency worth flagging rather than hiding.

---

## ADR-0005: Hand-roll the auth session instead of adopting an auth library

**Status:** Accepted

**Context:** The admin panel has exactly one user. Auth libraries (NextAuth/Auth.js, Clerk, Supabase Auth) are built to solve multi-provider, multi-user problems — OAuth flows, user tables, role management — that don't exist here.

**Decision:** `jose` for JWT sign/verify, a single shared `ADMIN_PASSWORD` compared with `crypto.timingSafeEqual` (not `===`, to avoid a timing side-channel), a 7-day session cookie. The `SESSION_SECRET` length check throws at import time if it's under 32 characters — a misconfigured secret should break the build, not silently issue weak sessions in production.

**Alternatives Considered:** NextAuth.js (now Auth.js); Clerk; Supabase Auth.

**Consequences:**

- A single shared plaintext password in an environment variable is explicitly _not_ a pattern that scales past one admin — `AGENTS.md`'s Security Agent checklist calls this out directly: "Acceptable for personal single-user admin." Adding a second admin, or wanting per-user audit trails, would require rebuilding this from scratch rather than extending it.
- No password reset flow, no MFA, no account lockout beyond the rate limiter (ADR-0006) — an auth library would provide these largely for free. Here they're either absent or hand-built narrowly.

---

## ADR-0006: Rate-limit admin login in-memory, not via Redis

**Status:** Accepted

**Context:** The login endpoint needs _some_ brute-force deterrent, but the realistic threat model is one admin's occasional login attempts, not a high-value multi-tenant auth endpoint under sustained attack.

**Decision:** `lib/rate-limiter.ts` — a `Map` keyed by attempt identity, 5 attempts per 15-minute window, active in production only (disabled in dev/test so the Playwright suite can log in repeatedly across parallel workers without needing a way to reset distributed state between runs).

**Alternatives Considered:** Upstash Redis (Vercel's recommended pattern for serverless rate limiting); Vercel Edge Config; a database-backed attempts table.

**Consequences:**

- **This is the trade-off most worth stating plainly:** Vercel serverless functions do not guarantee a warm, shared process between invocations. An in-memory `Map` only limits attempts that happen to land on the same warm instance — it is not a distributed rate limit. For a single admin's occasional login, the failure mode (an attacker spreading requests across cold starts) is low-stakes; for anything with real brute-force exposure, this would need Redis or a database-backed counter to be meaningful. The current implementation is a reasonable deterrent, not a hard guarantee, and should not be described as one.
- Zero additional infrastructure, cost, or new environment variables — the trade that makes the above acceptable at this project's scale.

---

## ADR-0007: Use Zod for Server Action input validation

**Status:** Accepted

**Context:** Every Server Action needs to validate untrusted form input before it reaches the database, with error messages specific enough to show inline on the admin form.

**Decision:** Zod schemas validate every Server Action input. Zod's TypeScript-first design means a validated schema also produces the TypeScript type for that data — no separate type definitions to keep in sync with validation rules. Shared field helpers (`lib/zod-fields.ts`) let the CSV-to-JSON-array transform for the `technologies` column be written once and reused across every content type's schema.

**Alternatives Considered:** Yup; manual `if`-based validation; no validation library, relying on SQLite's own constraints (`NOT NULL`, `CHECK`) alone.

**Consequences:**

- Zod adds a dependency and a learning curve for anyone unfamiliar with schema-based validation, versus plain `if` checks anyone can read without prior knowledge of the library's API.
- Relying on SQLite's constraints alone would push invalid-data errors to the database layer, producing less specific error messages for the admin form — `validationError()` (`lib/action-utils.ts`) exists specifically to turn Zod's field-level errors into form-usable messages, which a database-only approach couldn't provide.

---

## ADR-0008: Drive admin forms with Server Actions + `useActionState`, not a client form library

**Status:** Accepted

**Context:** Every admin form needs the same shape — submit, validate, show errors or redirect on success — and the project already commits to Server Actions for mutations (ADR-0001).

**Decision:** React 19's `useActionState` hook drives every admin form, wrapped in a shared `useAdminForm(action, redirectPath)` hook once every form needed the identical sequence: call the action, read `ActionState`, redirect via `router.push` on success (not `redirect()`, which throws when called from a Client Component). This preserves progressive enhancement — forms work even if JavaScript fails to load, since they're real `<form action={...}>` submissions under the hood.

**Alternatives Considered:** `react-hook-form`; Formik; plain controlled-component state with `useState`.

**Consequences:**

- No client-side field-level validation-as-you-type — validation only runs after submission, on the server, via Zod. Libraries like `react-hook-form` would give instant per-keystroke feedback at the cost of duplicating the Zod validation rules on the client.
- `useActionState`/Server Actions are a comparatively new pattern; more of the ecosystem's tutorials and AI training data assume `react-hook-form` or similar, which is part of why this project leans so heavily on its own `CLAUDE.md`/`AGENTS.md` for guidance rather than general web knowledge.

---

## ADR-0009: Split testing between Vitest (unit) and Playwright (E2E)

**Status:** Accepted

**Context:** The codebase has two distinct kinds of testable surface: pure functions with no I/O, and full request/render/Server-Action round trips that need a real running app.

**Decision:** Vitest for pure functions (`tests/unit/`) — fast, no DOM or browser needed. Playwright for anything involving rendering or a Server Action round-trip (`tests/e2e/`), run against an isolated `test.db` seeded fresh every run via its `webServer` config, which boots the app, waits on `/api/health`, and tears it down automatically.

**Alternatives Considered:** Jest for unit tests; Cypress for end-to-end; one framework doing both jobs.

**Consequences:**

- Running two frameworks means two configs and two APIs to know — a single framework would be simpler to onboard into, at the cost of either running fast unit tests through a full browser (Cypress component testing) or awkwardly mocking the DOM for Vitest-only E2E-style tests.
- `workers: 2` in `playwright.config.ts` is a measured ceiling, not a default left untouched — raising it was tried and produced spurious admin-login failures, because the dev server and in-memory session/rate-limit state (ADR-0006) don't parallelize cleanly beyond that. A real capacity constraint of the current architecture, not an arbitrary conservative setting.

---

## ADR-0010: Store uploaded files on the local filesystem, not object storage

**Status:** Accepted

**Context:** The admin panel needs to serve a handful of PDFs (CVs, certificates) that rarely change, for a low-traffic personal portfolio.

**Decision:** Uploaded PDFs land in `public/documents/` (public) or are placed manually in `private-documents/` (password-gated via `/api/protected-doc`) — both served from Vercel's filesystem/build output, not S3 or Vercel Blob. Vercel's static asset serving handles `public/` files for free with no additional service, credentials, or SDK to integrate.

**Alternatives Considered:** Vercel Blob Storage; AWS S3 (or S3-compatible) with signed URLs.

**Consequences:**

- `public/documents/*.pdf` uploaded through the admin panel at runtime does **not** persist across Vercel deployments the way files committed to git do — Vercel's filesystem for serverless functions is ephemeral per deployment. This works today because upload volume is low and deployments are infrequent, but a redeploy can lose files uploaded through `/api/upload` since the last deploy if they were never committed.
- Object storage would also enable signed, expiring URLs for the password-protected certificates instead of the current password-in-request-body model — a stronger access-control primitive this project doesn't currently use, in exchange for not needing an S3/Blob account, credentials, or SDK at all.

---

## ADR-0011: Use a manual `sort_order` field instead of drag-and-drop reordering

**Status:** Accepted

**Context:** Content items (work entries, projects, etc.) need a display order, edited by an admin who adds a handful of entries a year and rarely reorders them.

**Decision:** Every content table has a plain integer `sort_order` column, edited as a number field in each admin form — no drag-and-drop library, drag handles, or optimistic-reordering state.

**Alternatives Considered:** A drag-and-drop reordering UI (`dnd-kit` or similar) that writes sort positions on drop.

**Consequences:**

- Typing sort numbers requires the admin to know or guess what number puts an item where they want it relative to existing rows — no visual feedback until after saving, unlike drag-and-drop's immediate reordering. A real usability cost, accepted because the operation is infrequent enough that it doesn't outweigh the implementation cost of the alternative.

---

## ADR-0012: Deploy to Vercel + Turso, with GitHub Actions gating `main`

**Status:** Accepted

**Context:** The project needs a deployment target that supports App Router features (Server Actions, `proxy.ts`) without infrastructure tuning, operated by a single developer with no interest in managing servers.

**Decision:** Vercel for hosting (serverless functions + static assets), Turso for the database (ADR-0003), GitHub Actions running Build → Lint → Format check → Unit tests → E2E tests → Deploy Gate on every push/PR to `main`, deploying automatically once CI is green.

**Alternatives Considered:** Self-hosting on a VPS (Docker + Caddy/nginx); Netlify; Railway/Render with a bundled Postgres.

**Consequences:**

- **Environment variables live in two places with no automated sync**: `.env.local` for local dev, Vercel's dashboard for production, plus GitHub repository secrets for CI. This is a real, already-materialized cost, not a hypothetical one — production admin login broke in the past specifically because `ADMIN_PASSWORD` was set locally but empty in Vercel's Production scope, and the failure mode looked like "wrong password" rather than "missing config," which is misleading during debugging. A single-source-of-truth secrets manager would remove this seam entirely, at the cost of another service/subscription this project doesn't otherwise need.
- Vercel's serverless model is also the direct cause of ADR-0006's rate-limiter limitation and ADR-0010's ephemeral-upload limitation — the deployment choice and those two trade-offs aren't independent decisions, they're downstream of this one.
- Self-hosting would remove both the env-var-sync seam (one server, one `.env` file) and the ephemeral-filesystem limitation, in exchange for owning patching, TLS, and uptime — not a trade worth making for a personal portfolio's traffic and stakes.
