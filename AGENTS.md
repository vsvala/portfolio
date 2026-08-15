# AGENTS.md

This file defines the agent roles and responsibilities for this portfolio project. When assigning tasks, reference these roles so the AI adopts the right perspective and focus.

> **IMPORTANT — This is NOT the Next.js you know**
> APIs, conventions, and file structure may all differ from your training data.
> Read the relevant guide in `node_modules/next/dist/docs/` before writing any code.
> Heed deprecation notices.

---

## Agent Roles

| Agent                  | Responsibility                                                                                                                                                                                        | Project Phase        |
| :--------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------- |
| **Architect Agent**    | System architecture, tech stack decisions, database modeling, API design, routing structure                                                                                                           | Phase 1 — Foundation |
| **Data Agent**         | SQLite schemas, `lib/db/queries/*.ts`, Zod validation in Server Actions, `actions/*.ts`                                                                                                               | Phase 2 — Data layer |
| **UI Agent**           | MUI components (`components/public/*`, `components/admin/*`), theme, responsiveness, bilingual support (fi/en)                                                                                        | Phase 2 — UI layer   |
| **Auth Agent**         | `proxy.ts`, `lib/session.ts`, `lib/auth.ts`, admin login, cookie management                                                                                                                           | Phase 2 — Auth       |
| **Upload Agent**       | `app/api/upload/route.ts`, PDF handling, `public/documents/` management                                                                                                                               | Phase 2 — Upload     |
| **Pages Agent**        | Public pages (`app/(public)/**`), admin pages (`app/admin/**`), `loading.tsx`, `error.tsx`                                                                                                            | Phases 3–4           |
| **Reviewer Agent**     | Code quality, TypeScript errors, security, MUI v9 compatibility, build verification                                                                                                                   | Phase 5 — Polish     |
| **Security Agent**     | Input validation, XSS/injection prevention, spam protection, auth hardening, public exposure audit                                                                                                    | Any phase            |
| **Test Agent**         | End-to-end tests (Playwright), smoke tests for all public routes, admin CRUD flows (list → create → edit/update → delete), language toggle, anchor navigation, form validation, mobile responsiveness | Phase 5+ — Ongoing   |
| **Code Quality Agent** | Clean Code compliance, DRY violations, dead code, complexity, readability, maintainability, refactoring proposals                                                                                     | Any phase — ongoing  |

---

## Key Constraints Every Agent Must Know

### Next.js 16 API Changes

- **`proxy.ts`** (not `middleware.ts`) — exports `async function proxy(request: NextRequest)`. There is no `middleware.ts` in this repo.
- **Dynamic params are Promises**: `const { id } = await params`
- **`useActionState`** (React 19) for forms, not `useFormState`
- Full API reference: `node_modules/next/dist/docs/`

### Skills content

- Skills are admin-managed (CRUD at `/admin/skills/`). There is **no public `/skills/` listing page**.
- Skills are displayed in `SkillsSection` on the homepage and on the `/cv` page only.

### Sort order

- Every content table has a `sort_order` integer column. Lower values appear first.
- Managed via a numeric field in each admin form — no drag-and-drop reordering.

### MUI v9 Props

- Layout props (`gap`, `justifyContent`, `flexWrap`) are **not** valid direct props on `Stack` — use `sx={{}}`
- `fontWeight` on Typography → `sx={{ fontWeight: 700 }}`

### Server/Client Boundary

- `component={Link}` cannot be passed from a Server Component — use `<LinkButton>` from `components/ui/LinkButton.tsx`
- Card components (`WorkCard`, `ProjectCard`, `EducationCard`) must be `'use client'` because they use `component={Link}` on `CardActionArea`

### Code Quality Agent checklist

For each finding, report: **problem** · **severity** (low / medium / high) · **recommendation** · **example refactor**.

- **DRY**: flag duplicated logic across Server Actions, queries, or components — extract shared helpers
- **Dead code**: unused imports, unreachable branches, components never rendered
- **Function size**: functions doing more than one thing — split at natural boundaries
- **Component responsibility**: components mixing data-fetching and rendering concerns
- **Complexity**: nested ternaries, deeply chained conditionals — simplify or extract
- **Naming**: misleading or overly generic identifiers (`data`, `item`, `res`)
- **Type safety**: `any`, non-null assertions (`!`), missing return types on exported functions
- **Repetitive JSX**: identical `sx={{}}` blocks — extract to shared `sx` constants or wrapper components
- **Action patterns**: Server Actions that share identical validation+revalidate+redirect shape — check if a factory or shared helper applies
- **Query patterns**: `lib/db/queries/*.ts` files that repeat the same SQL shape — evaluate shared query builder

Severity guide:

- **High** — causes maintenance debt now or likely bugs (e.g., duplicate validation logic that can drift)
- **Medium** — reduces readability or will grow harder to change (e.g., 5-level JSX nesting)
- **Low** — cosmetic or stylistic (e.g., variable name clarity)

### Security Agent checklist

- **Contact form**: Zod validates + caps all fields (name ≤100, email ≤200, message ≤2000). Honeypot field blocks bots. Email sent as plain text only — no HTML interpolation to avoid injection.
- **mailto: links** — intentionally public on a portfolio. Acceptable trade-off: recruiters can click directly; spam-bot harvesting risk is accepted.
- **Admin auth**: plain-text password in env var, compared in `actions/auth.ts`. Acceptable for personal single-user admin. Do not add to git.
- **Resend `from` address**: use `onboarding@resend.dev` for dev only. In production, verify a domain in Resend dashboard and update `actions/contact.ts`.
- **HTML in emails**: never interpolate user input into HTML email body — use `text:` only.
- **Public documents**: PDFs in `public/documents/` are intentionally public (CV downloads). Do not store sensitive files there.
- **XSS**: all user input goes through Zod before any use. No `dangerouslySetInnerHTML` in the codebase.
- **CSRF**: Next.js Server Actions have built-in CSRF protection via `SameSite` cookie and origin check.

### Testing Rules — MANDATORY

Every agent must follow these rules without exception:

1. **New feature → write Playwright tests** in `tests/e2e/` covering the new public page, form, or user interaction.
2. **For every admin CRUD type, cover: list → create → verify in list → edit/update → delete.** The edit/update flow (`/admin/{type}/[id]`) must be tested, not just create and delete.
3. **Run tests after every code change**: `npm test`
4. **Run tests before every `git commit`** — never commit failing tests.
5. **Fix failing tests before moving on** — do not proceed to the next task if tests are red.

Required workflow for every change:

```
implement → npm run build → npm run lint → npm test → git commit
```

**Known test gaps (pre-existing):** Admin edit/update flows for work, projects, education, courses, skills, and recommendations are not yet tested. API routes (`/api/health`, `/api/upload`, `/api/protected-doc`) have no tests. Feedback form submission is not tested.

### proxy.ts Redirect Loop

- The proxy must skip auth for `/admin/login`, otherwise an infinite redirect loop occurs
- Always include: `if (request.nextUrl.pathname === '/admin/login') return NextResponse.next()`

### SQLite + Zod

- Optional FK fields (`certificate_document_id`, `document_id`, `end_date`) need `.default(null)` or `.transform(v => v || null)` — otherwise better-sqlite3 throws "Missing named parameter"
- `technologies` field: stored as a JSON array string; forms submit CSV → actions convert automatically

---

## Usage Guidelines

- **Role switching:** At the start of a task: `"Adopt the **[Agent Name]** role and implement..."`
- **Collaboration:** The Pages or Coder Agent may call others: `"Ask the Data Agent to review this query"` or `"Ask the UI Agent to fix the responsiveness"`
- **Quality control:** The **Reviewer Agent** must verify code before committing or advancing to the next phase
- **Build before advancing:** Always run `npm run build` before moving to the next phase — TypeScript errors are caught there
- **Tests before commit:** Always run `npm test` from the project root before committing — see **Testing Rules** above

---

## Project Phases

```
Phase 1  [Foundation]   .env.local · types · db · session · auth · proxy
              │
Phase 2  [Parallel]     Data Agent · Auth Agent · UI Agent · Upload Agent
              │
Phase 3  [Public pages]   app/(public)/** — list and detail pages
Phase 4  [Admin UI]       app/admin/** — CRUD forms, dashboard
              │
Phase 5  [Polish]       loading.tsx · error.tsx · SEO · end-to-end testing
              │
V2+      [Future]       Dark mode · /certifications standalone page (NOT YET BUILT — only
                        a homepage section exists via CertificationsSection + lib/static-content.ts)
                        GitHub integration · RAG chat · Privacy analytics
```

---

## File Ownership by Agent

| Files / Directories                                                 | Owner                        |
| :------------------------------------------------------------------ | :--------------------------- |
| `actions/contact.ts`, `components/public/ContactForm.tsx`           | Security Agent / Pages Agent |
| `lib/db/schema.sql`, `lib/db/index.ts`                              | Architect Agent              |
| `lib/db/queries/*.ts`                                               | Data Agent                   |
| `actions/*.ts`                                                      | Data Agent                   |
| `lib/session.ts`, `lib/auth.ts`, `proxy.ts`                         | Auth Agent                   |
| `app/api/upload/route.ts`                                           | Upload Agent                 |
| `app/api/health/route.ts`                                           | Upload Agent                 |
| `app/api/protected-doc/route.ts`                                    | Auth Agent                   |
| `components/public/*`, `components/admin/*`, `lib/mui-theme.ts`     | UI Agent                     |
| `app/(public)/**`, `app/admin/**`                                   | Pages Agent                  |
| `app/cv/page.tsx`, `components/public/PrintButton.tsx`              | Pages Agent                  |
| `app/layout.tsx`, `app/(public)/layout.tsx`, `app/admin/layout.tsx` | Pages Agent                  |
| `lib/types.ts`, `CLAUDE.md`, `AGENTS.md`                            | Architect Agent              |

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
