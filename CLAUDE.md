# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commit Message Format

Use the format `type(scope): short description` with imperative mood.

```
feat(ui): add mobile gallery layout
fix(events): preserve endDate when startDate changes
docs(readme): add gpush helper instructions
chore(deps): upgrade Next.js to 16.3
```

| Type       | When to use                              |
| ---------- | ---------------------------------------- |
| `feat`     | new feature                              |
| `fix`      | bug fix                                  |
| `docs`     | documentation only                       |
| `refactor` | structural improvement, no new behaviour |
| `test`     | adding or fixing tests                   |
| `chore`    | maintenance — deps, config, scripts      |

Rules: first line short, imperative verb ("add", "fix", "update"), no period at end.

## CI Pipeline

GitHub Actions workflow at `.github/workflows/ci.yml` runs on every push and PR to `main`:

```
Security audit → Build (tsc) → Lint → Unit tests → E2E tests → Deploy Gate
```

The **Deploy Gate** job runs only on pushes to `main` and requires CI to pass — explicit confirmation that deployment is allowed.

The pipeline uses two GitHub repository secrets (Settings → Secrets and variables → Actions):

| Secret           | Purpose                                                  |
| ---------------- | -------------------------------------------------------- |
| `SESSION_SECRET` | JWT signing key — same value as `.env.local` (32+ chars) |
| `ADMIN_PASSWORD` | Admin password — same value as `.env.local`              |

`TURSO_URL` and `TURSO_AUTH_TOKEN` are **not** needed as secrets — E2E tests override them with `file:./test.db` automatically (see `playwright.config.ts` `webServer.env`).

On failure, Playwright test results are uploaded as an artifact (`playwright-report`, 7-day retention).

## Commands

```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # production build + TypeScript check
npm run lint     # ESLint
npm run start    # serve the production build
```

E2E tests (Playwright) live in `tests/e2e/` in the same repo:

```bash
npm test                                    # run all tests (starts own server on :3001 with local test.db)
npm test -- tests/e2e/homepage.spec.ts      # run a single spec file
npm run test:ui                             # interactive UI mode
```

Unit tests (Vitest) live in `tests/unit/` and cover pure helper functions:

```bash
npm run test:unit                           # run all unit tests (no dev server needed)
```

Unit tests cover: `parseTechnologies` (`lib/utils.ts`), `technologiesField` (`lib/zod-fields.ts`), `toArgs` (`lib/db/utils.ts`), `validationError` (`lib/action-utils.ts`), session `encrypt`/`decrypt` (`lib/session.ts`).

TypeScript errors surface through `npm run build`.

## Testing Rules — MANDATORY

These rules apply to every code change, no exceptions:

1. **New feature → write tests.** Every new public page, form, or user-facing feature must have corresponding Playwright tests added in `tests/e2e/`. New pure helper functions must have Vitest unit tests in `tests/unit/`.
2. **Run tests after every code change** — before considering any task done.
3. **Run tests before every `git commit`** — do not commit if tests fail.

Workflow:

```
code change → npm run build (TypeScript check) → npm run lint → npm run test:unit → npm test → git commit
```

**Role checks alongside the workflow above — not optional extras, part of the same change:**

- Touched `app/api/**`, auth (`proxy.ts`, `lib/session.ts`, `lib/auth.ts`), or any input validation → adopt the **Security Agent** role (checklist in `AGENTS.md`) before committing.
- Added/removed a file, route, test, dependency version, or env var; or a "Known gaps"/count claim in `README.md`/`CLAUDE.md`/`AGENTS.md` is now stale → adopt the **Documentation Agent** role and fix it in the same change, not a follow-up.
- Non-trivial new code (new component, new Server Action, a refactor) → run a **Code Quality Agent** pass (DRY, dead code, complexity — checklist in `AGENTS.md`) before committing.

`git commit` itself now runs `lint-staged` via a Husky pre-commit hook (`.husky/pre-commit`) — ESLint + Prettier on staged files happen automatically and will block a commit that fails them. This does **not** run tests or the role checks above; those still require deliberately following the workflow.

**Test database:** `npm test` starts its own Next.js server on port 3001 using a local SQLite file (`test.db` in the repo root). The test database is created and seeded fresh on every run by `tests/e2e/global-setup.ts` → `seed-test-db.ts`. This means tests never touch the production Turso database. Do not run a separate dev server on port 3001 when running tests.

**Concurrency:** `playwright.config.ts` sets `workers: 2`. Do not raise this — 6 parallel workers overwhelm the dev server and cause spurious admin login failures.

**Bilingual assertions:** All pages default to English (`?? 'en'`). Write test assertions with both languages: `getByRole('link', { name: /Etusivu|Home/i })` rather than Finnish-only.

**Schema change → update `tests/e2e/seed-test-db.ts` in sync.** The seeder contains a copy of `lib/db/schema.sql` and deletes `test.db` on every run. If you add or alter a table, update both files or all E2E tests will fail.

**New admin section → update `global-setup.ts` warmup list.** After login, global setup visits every admin route to pre-compile it. If you add a new `/admin/{type}` route and omit it from the warmup loop, the first test that hits it will likely time out.

**`admin.spec.ts` has a hardcoded password** (`const ADMIN_PASSWORD = 'vaihda_tama_salasana'`). If you change the password in `.env.local`, update this constant too. Other admin tests use saved `storageState` so they won't break, making the mismatch easy to miss.

**Known E2E gaps (pre-existing):** `/courses` and `/cv` are not in `smoke.spec.ts` (each has its own dedicated spec file instead). API routes `/api/upload` and `/api/protected-doc` have no tests.

## Next.js 16 Breaking Changes

This project uses **Next.js 16.3.1**, which differs from earlier versions:

- **`proxy.ts` replaces `middleware.ts`** — repo root exports `async function proxy(request: NextRequest)`, not `middleware`.
- **Dynamic route params are Promises** — always `await params` before destructuring:
  ```ts
  export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
  }
  ```
- **`searchParams` is also a Promise.**
- **`useActionState`** (React 19) replaces `useFormState` for Server Action forms.

When in doubt, read `node_modules/next/dist/docs/` for the authoritative API.

## proxy.ts: Exclude /admin/login From Auth Check

The `config.matcher` in `proxy.ts` uses `/admin/:path+` which matches `/admin/login` too, causing an infinite redirect loop. The proxy function itself must short-circuit for the login page:

```ts
if (request.nextUrl.pathname === "/admin/login") {
  return NextResponse.next();
}
```

## Next.js 16 + React 19: No Function Props Across Server/Client Boundary

You **cannot** pass a function (e.g. Next.js `Link`) as a prop from a Server Component to a Client Component (like MUI `Button`):

```tsx
// ❌ crashes at runtime in server components
import Link from "next/link";
<Button component={Link} href="...">
  text
</Button>;

// ✅ use LinkButton from components/ui/LinkButton.tsx instead
import { LinkButton } from "@/components/ui/LinkButton";
<LinkButton href="...">text</LinkButton>;
```

`LinkButton` is a `'use client'` wrapper that handles this internally. Use it in any Server Component that needs a styled navigation button.

Card components (`WorkCard`, `ProjectCard`, `EducationCard`) use `component={Link}` on `CardActionArea`. Since they are used in Server Components, they must be marked `'use client'` to avoid the function-prop boundary error.

## Material UI v9 Props

MUI v9 enforces strict TypeScript — layout props **cannot** be passed as direct JSX attributes on `Stack`. They must go inside `sx={{}}`:

```tsx
// ❌ breaks TypeScript
<Stack gap={2} justifyContent="center" flexWrap="wrap">

// ✅ correct
<Stack sx={{ gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
```

Same applies to `fontWeight` on `Typography` — use `sx={{ fontWeight: 700 }}`.

MUI SSR is wired via `AppRouterCacheProvider` from `@mui/material-nextjs/v16-appRouter` in `components/providers/MuiProvider.tsx`. Theme is in `lib/mui-theme.ts` (primary `#1a1a2e`, secondary `#e94560`).

**Tailwind is a CSS reset only.** `globals.css` uses `@import "tailwindcss"` and `<body>` has a few utility classes. Do **not** add Tailwind layout classes (`flex`, `gap-4`) to MUI components — use `sx={{}}` instead. Mixing them breaks the MUI layout system.

## Architecture

### Data flow

```
Turso (remote libSQL — TURSO_URL + TURSO_AUTH_TOKEN)
  └── lib/db/index.ts          @libsql/client singleton
  └── lib/db/schema.sql        run manually via: turso db shell portfolio < lib/db/schema.sql
  └── lib/db/queries/*.ts      typed query functions (server-only)
        └── actions/*.ts       Server Actions — Zod validation, call queries, revalidatePath
              └── app/**       Server Components fetch directly from queries
              └── components/admin/*Form.tsx  Client Components use useActionState
```

### Auth flow

- `SESSION_SECRET` + `ADMIN_PASSWORD` in `.env.local`
- `lib/session.ts` — `jose` SignJWT/jwtVerify, 7-day `session` cookie. **Throws at import time if `SESSION_SECRET` is shorter than 32 characters** — the app will not start, it does not degrade gracefully.
- `proxy.ts` — guards every `/admin/*` request (except `/admin/login`)
- `lib/auth.ts` — `requireAdmin()` for Server Components and Server Actions
- `actions/auth.ts` — `login()` / `logout()` Server Actions. Login uses `crypto.timingSafeEqual` on SHA-256 hashes — do not simplify to a string compare.

`submitFeedback` in `actions/feedback.ts` is the **only Server Action callable without authentication**. All other actions call `requireAdmin()` first.

### Bilingual content

Every DB table has `*_fi` and `*_en` columns. Active language is in a `lang` cookie (`fi` | `en`). **Default is `'en'`** when no cookie is present. Server Components read it:

```ts
const cookieStore = await cookies();
const lang = (cookieStore.get("lang")?.value ?? "en") as Lang;
```

`LanguageToggle` (Client Component) sets the cookie and calls `router.refresh()`.

### API routes

| Route                | Method | Purpose                                                                                                |
| :------------------- | :----- | :----------------------------------------------------------------------------------------------------- |
| `/api/health`        | GET    | Returns `{ ok: true }`. Used by Playwright `webServer` startup check.                                  |
| `/api/upload`        | POST   | PDF upload (max 10 MB, PDF-only). Saves to `public/documents/{uuid}-{filename}`. Returns `{ url }`.    |
| `/api/protected-doc` | GET    | Password-protected document serving from `private-documents/`. Requires `CERTIFICATE_PASSWORD` header. |

### PDF documents

Admin uploads via `POST /api/upload` → saved to `public/documents/{uuid}-{filename}` → row in `pdf_documents` → FK stored on content rows. Public URLs are `/documents/{filename}`. CV PDFs belong in `public/documents/`.

### `technologies` field

Stored as a JSON array string in SQLite. Server Actions accept comma-separated input and convert it: if the value starts with `[` it is passed through; otherwise split on `,` and serialized. Cards call `JSON.parse(work.technologies)`.

### Admin CRUD pattern

All content types follow this structure:

- `app/admin/{type}/page.tsx` — list with Edit + Delete buttons
- `app/admin/{type}/new/page.tsx` — `create*Action`
- `app/admin/{type}/[id]/page.tsx` — `update*Action.bind(null, id)`
- `components/admin/*Form.tsx` — Client Component, `useActionState`, redirects on success
- `components/admin/DeleteButton.tsx` — shared confirmation Dialog

All admin forms use `useAdminForm(action, redirectPath)` from `lib/hooks/useAdminForm.ts`. On success it calls `router.push(redirectPath)` (client-side nav — **not** `redirect()`, which throws in a `'use client'` context). Forms accept `{ action: FormAction, defaultValues? }` props; `FormAction` is exported from the hook.

**Delete actions return `Promise<void>`, not `ActionState`.** Errors are caught and logged to console only — there is no user-facing error on delete failure. `DeleteButton` invokes them directly, not via `useActionState`.

Current types: **work, projects, education, courses, skills, recommendations**. Feedback is read-only in admin (no create/edit).

**Skills:** There is no public `/skills/` listing page. Skills appear only in `SkillsSection` on the homepage and on the `/cv` page.

**Sort order:** All content tables have a `sort_order` integer column. Lower values appear first. Managed via a numeric field in each admin form.

### Static content

**Certifications** are hardcoded in `lib/static-content.ts` as a `certifications` array (bilingual, with `imageUrl` pointing to `public/images/`). Both the `/cv` page and `CertificationsSection` on the homepage read this array directly. To add a new certification, edit this file and place the image in `public/images/`. There is no admin UI for certifications.

**Recommendations** have a single `text` field (no `_fi`/`_en`). They are not bilingual — the page renders `rec.text` as-is regardless of the active language.

### Public routes

**`/cv`** lives at `app/cv/page.tsx` (outside the `(public)/` route group), so it has **no Nav or Footer**. It reads the `lang` cookie independently and fetches data directly from DB queries.

**`/contact`** — the `ContactForm` is currently commented out. The page only shows contact links. To re-enable: uncomment the two imports and the Grid block in `app/(public)/contact/page.tsx`.

**`/courses`** has no detail page. Courses appear on the list page and nested inside `/education/[id]` (filtered by `education_id`).

**Homepage anchors:** `#tyokokemus`, `#osaaminen`, `#koulutus`, `#sertifikaatit`, `#hackathon`, `#jarjesto`, `#harrastukset`. Any new homepage section must add its `id` here and to the `anchorLinks` array in `HeroSection.tsx`.

### SidebarNav

`SidebarNav` (used on `/projects` and `/education/[id]`) requires each content section to have a matching `id` attribute and `sx={{ scrollMarginTop: '80px' }}` to compensate for the sticky AppBar. Omitting `scrollMarginTop` causes headings to scroll under the nav bar.

## Environment Variables

| Variable               | Purpose                                                                       |
| ---------------------- | ----------------------------------------------------------------------------- |
| `TURSO_URL`            | Turso database URL (`libsql://portfolio-*.turso.io`)                          |
| `TURSO_AUTH_TOKEN`     | Turso auth token                                                              |
| `SESSION_SECRET`       | JWT signing key (base64, 32+ bytes)                                           |
| `ADMIN_PASSWORD`       | Plain-text admin password compared in `actions/auth.ts`                       |
| `CERTIFICATE_PASSWORD` | Password for `/api/protected-doc` — protects private-documents/               |
| `RESEND_API_KEY`       | Resend API key for contact form emails (optional — form is hidden without it) |
| `CONTACT_EMAIL`        | Recipient email address for contact form messages                             |

## Path Alias

`@/` maps to the repo root (set in `tsconfig.json`).

## Keeping the repo root clean

The Playwright MCP tool saves screenshots to the **repo root** automatically during browser sessions. These are never needed after the session ends.

**After every browser/Playwright session, delete leftover screenshots:**

```bash
rm -f /Users/virva/portfolio/*.png
```

Never commit PNG files from the root — `*.png` is in `.gitignore` to prevent accidents. If you see any `.png` files in the root at the start of a session, delete them before starting work.

## Maintaining README.md

Owned by the **Documentation Agent** (see `AGENTS.md`) — adopt that role for dedicated documentation passes; its checklist there covers accuracy, currency, and onboarding completeness in more depth than the bullets below.

Keep `README.md` up to date as the project evolves. After completing any significant change, update the relevant section:

- New feature or section → add to **Features**
- New dependency or architectural change → update **Tech Stack** or **Project Structure**
- Bug or constraint discovered → add to the **Notable issues** list in the Agentic Development Workflow section
- V2 item completed → move from Roadmap to the appropriate section and mark done

Do not rewrite the README from scratch — make targeted edits to the affected sections only.

# Project Context & Rules ## Agent Roles The specific roles, responsibilities, and workflows for this project are defined in @AGENTS.md. - Please adopt the appropriate role (e.g., Architect, Coder, Reviewer) based on the task at hand. - Follow the guidelines specified in @AGENTS.md for inter-agent collaboration and quality control.
