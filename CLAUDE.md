# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

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

Unit tests cover: `parseTechnologies` (`lib/utils.ts`), `technologiesField` (`lib/zod-fields.ts`), `toArgs` (`lib/db/utils.ts`).

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

**Test database:** `npm test` starts its own Next.js server on port 3001 using a local SQLite file (`test.db` in the repo root). The test database is created and seeded fresh on every run by `tests/e2e/global-setup.ts` → `seed-test-db.ts`. This means tests never touch the production Turso database. Do not run a separate dev server on port 3001 when running tests.

**Concurrency:** `playwright.config.ts` sets `workers: 2`. Do not raise this — 6 parallel workers overwhelm the dev server and cause spurious admin login failures.

**Bilingual assertions:** All pages default to English (`?? 'en'`). Write test assertions with both languages: `getByRole('link', { name: /Etusivu|Home/i })` rather than Finnish-only.

## Next.js 16 Breaking Changes

This project uses **Next.js 16.2.9**, which differs from earlier versions:

- **`proxy.ts` replaces `middleware.ts`** — repo root exports `async function proxy(request: NextRequest)`, not `middleware`.
- **Dynamic route params are Promises** — always `await params` before destructuring:
  ```ts
  export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
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
- `lib/session.ts` — `jose` SignJWT/jwtVerify, 7-day `session` cookie
- `proxy.ts` — guards every `/admin/*` request (except `/admin/login`)
- `lib/auth.ts` — `requireAdmin()` for Server Components and Server Actions
- `actions/auth.ts` — `login()` / `logout()` Server Actions

### Bilingual content

Every DB table has `*_fi` and `*_en` columns. Active language is in a `lang` cookie (`fi` | `en`). **Default is `'en'`** when no cookie is present. Server Components read it:

```ts
const cookieStore = await cookies();
const lang = (cookieStore.get("lang")?.value ?? "en") as Lang;
```

`LanguageToggle` (Client Component) sets the cookie and calls `router.refresh()`.

### API routes

| Route | Method | Purpose |
| :--- | :--- | :--- |
| `/api/health` | GET | Returns `{ ok: true }`. Used by Playwright `webServer` startup check. |
| `/api/upload` | POST | PDF upload (max 10 MB, PDF-only). Saves to `public/documents/{uuid}-{filename}`. Returns `{ url }`. |
| `/api/protected-doc` | GET | Password-protected document serving from `private-documents/`. Requires `CERTIFICATE_PASSWORD` header. |

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

Current types: **work, projects, education, courses, skills, recommendations**. Feedback is read-only in admin (no create/edit).

**Skills:** There is no public `/skills/` listing page. Skills appear only in `SkillsSection` on the homepage and on the `/cv` page.

**Sort order:** All content tables have a `sort_order` integer column. Lower values appear first. Managed via a numeric field in each admin form.

## Environment Variables

| Variable               | Purpose                                                            |
| ---------------------- | ------------------------------------------------------------------ |
| `TURSO_URL`            | Turso database URL (`libsql://portfolio-*.turso.io`)               |
| `TURSO_AUTH_TOKEN`     | Turso auth token                                                   |
| `SESSION_SECRET`       | JWT signing key (base64, 32+ bytes)                                |
| `ADMIN_PASSWORD`       | Plain-text admin password compared in `actions/auth.ts`            |
| `CERTIFICATE_PASSWORD` | Password for `/api/protected-doc` — protects private-documents/    |
| `RESEND_API_KEY`       | Resend API key for contact form emails (optional — form is hidden without it) |

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

Keep `README.md` up to date as the project evolves. After completing any significant change, update the relevant section:

- New feature or section → add to **Features**
- New dependency or architectural change → update **Tech Stack** or **Project Structure**
- Bug or constraint discovered → add to the **Notable issues** list in the Agentic Development Workflow section
- V2 item completed → move from Roadmap to the appropriate section and mark done

Do not rewrite the README from scratch — make targeted edits to the affected sections only.

# Project Context & Rules ## Agent Roles The specific roles, responsibilities, and workflows for this project are defined in @AGENTS.md. - Please adopt the appropriate role (e.g., Architect, Coder, Reviewer) based on the task at hand. - Follow the guidelines specified in @AGENTS.md for inter-agent collaboration and quality control.
