# Virva Svala — Portfolio

**Live:** https://virvasvala.vercel.app/ &nbsp; [![CI](https://github.com/vsvala/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/vsvala/portfolio/actions/workflows/ci.yml)

A personal portfolio website for software developer Virva Svala. Built with Next.js 16 App Router, Material UI, and SQLite — with a protected admin panel for managing all content without touching code.

> **This project is an agentic coding exercise.**
> The entire codebase was developed using [Claude Code](https://claude.ai/code) (Anthropic's AI coding agent) through a structured multi-agent workflow. Different agents were assigned to different layers of the stack (data, UI, auth, upload, pages) and worked in parallel or in sequence according to a pre-defined implementation plan. See [`AGENTS.md`](./AGENTS.md) for the agent roles and responsibilities.

---

## Features

- **Bilingual (Finnish / English)** — all content has `_fi` and `_en` variants; a language toggle cookie switches the active language across all server-rendered pages
- **Portfolio sections** — Work experience, Projects, Education, Courses, Certifications — clickable cards with full detail views for work, projects, and education; Skills shown as a grid (no individual detail pages)
- **CV downloads** — direct PDF download links for both Finnish and English CVs from the hero section
- **Profile photo** — circular avatar in the hero section
- **Anchor sidebar** — desktop-only left-column navigation with smooth-scroll links to all homepage sections
- **Online CV** — print-optimised `/cv` page with all content from the database; print or save as PDF via browser
- **PDF attachments** — work certificates and study certificates can be attached to individual entries and downloaded from their detail pages
- **Certifications section** — static credential cards (images, issuer, year, technologies) shown as a homepage section (data in `lib/static-content.ts`; no separate `/certifications` page)
- **Feedback form** — collapsible "anything unclear?" form on every detail page; submissions visible in admin at `/admin/feedback`
- **Recommendations** — admin-managed recommendations/testimonials shown publicly
- **Protected admin panel** — add, edit, and delete all content at `/admin` without touching code or redeploying; covers Work, Projects, Education, Courses, Skills, and Recommendations
- **File upload** — PDF documents uploaded through the admin panel are stored in `public/documents/` and linked to content entries
- **Responsive** — mobile-first layout with a hamburger menu on small screens

---

## Tech Stack

| Layer | Technology | Notes |
| :--- | :--- | :--- |
| Framework | Next.js 16.2.9 (App Router) | Uses `proxy.ts` instead of `middleware.ts`; dynamic params are Promises |
| UI | Material UI v9 | `AppRouterCacheProvider` for SSR emotion fix; all layout props via `sx={{}}` |
| Database | Turso (libSQL / SQLite) | `@libsql/client`; local dev also works with SQLite via same client |
| Auth | jose (JWT) | HS256, 7-day session cookie; single admin password |
| Validation | Zod | All Server Action inputs validated before hitting the DB |
| Forms | React 19 `useActionState` | Progressive enhancement; no separate form library |
| Language | TypeScript (strict) | |
| Deploy target | Vercel + Turso | Serverless functions on Vercel, database on Turso (EU West) |

---

## Project Structure

```
portfolio/
├── proxy.ts                        # Auth middleware for /admin/* routes
├── app/
│   ├── layout.tsx                  # Root layout — MuiProvider only
│   ├── (public)/                   # Route group: public pages with Nav + Footer
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Homepage: Hero + Skills + section previews
│   │   ├── work/[id]/page.tsx
│   │   ├── projects/[id]/page.tsx
│   │   ├── education/[id]/page.tsx
│   │   ├── courses/page.tsx
│   │   └── recommendations/page.tsx
│   ├── admin/                      # Protected admin panel
│   │   ├── layout.tsx              # AdminNav only (no public Nav)
│   │   ├── login/page.tsx
│   │   ├── page.tsx                # Dashboard with content counts
│   │   ├── work/                   # List · New · Edit
│   │   ├── projects/
│   │   ├── education/
│   │   ├── courses/
│   │   ├── skills/
│   │   └── recommendations/
│   └── api/upload/route.ts         # PDF upload endpoint
├── components/
│   ├── providers/MuiProvider.tsx   # SSR emotion + ThemeProvider
│   ├── public/                     # Nav, Footer, HeroSection, cards, SkillsSection, CertificationsSection
│   ├── admin/                      # AdminNav, *Form.tsx for all types, DeleteButton
│   └── ui/
│       ├── LinkButton.tsx          # 'use client' wrapper for MUI Button + Next.js Link
│       └── ReadMoreChip.tsx        # Expandable "read more" chip component
├── lib/
│   ├── db/
│   │   ├── index.ts                # Turso/libSQL client (TURSO_URL + TURSO_AUTH_TOKEN)
│   │   ├── schema.sql              # Table definitions
│   │   ├── utils.ts                # toArgs() helper — converts object to libSQL named params
│   │   └── queries/                # work.ts · projects.ts · education.ts · courses.ts · skills.ts · recommendations.ts · documents.ts · feedback.ts
│   ├── hooks/useAdminForm.ts       # Shared hook for admin form state + redirect on success
│   ├── action-utils.ts             # validationError() — normalises Zod errors to ActionState
│   ├── zod-fields.ts               # Shared Zod field definitions (technologiesField, etc.)
│   ├── static-content.ts           # Static certifications data (images, credential URLs)
│   ├── utils.ts                    # parseTechnologies() — JSON array string → string[]
│   ├── session.ts                  # JWT encrypt / decrypt
│   ├── auth.ts                     # getSession(), requireAdmin()
│   ├── types.ts                    # Shared TypeScript interfaces
│   └── mui-theme.ts                # MUI theme (primary #1a1a2e, accent #e94560)
├── actions/                        # Server Actions: auth · work · projects · education · courses · skills · recommendations
├── tests/
│   ├── e2e/                        # Playwright end-to-end tests (80 tests across 12 spec files)
│   └── unit/                       # Vitest unit tests for pure helper functions
└── public/documents/               # Uploaded PDFs served as static files
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
git clone https://github.com/vsvala/portfolio.git
cd portfolio
npm install
```

### Environment Variables

Create `.env.local` in the project root:

```env
SESSION_SECRET=<base64-encoded-32-byte-key>
ADMIN_PASSWORD=<your-admin-password>
TURSO_URL=libsql://<your-db>.turso.io
TURSO_AUTH_TOKEN=<your-turso-token>
```

Generate a session secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build   # TypeScript check + production build
npm run start   # Serve the production build
```

---

## Admin Panel

Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login) and enter the password from `.env.local`.

From the dashboard you can:
- Add / edit / delete work experience entries
- Add / edit / delete projects
- Add / edit / delete education entries
- Add / edit / delete courses
- Add / edit / delete skills
- Add / edit / delete recommendations
- Upload PDF documents (CV, work certificates, study certificates) and attach them to content entries

---

## Deployment (Vercel + Turso)

### 1 — Create a Turso database

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login and create database
turso auth login
turso db create portfolio

# Apply schema
turso db shell portfolio < lib/db/schema.sql

# Get credentials
turso db show portfolio --url      # → TURSO_URL
turso db tokens create portfolio   # → TURSO_AUTH_TOKEN
```

Seed initial data:

```bash
node scripts/seed-turso.mjs
```

### 2 — Deploy to Vercel

```bash
npx vercel --prod
```

### 3 — Add environment variables in Vercel

In the Vercel dashboard → **Settings → Environment Variables**, add all four variables for the **Production** environment:

| Variable | Value |
| :--- | :--- |
| `TURSO_URL` | `libsql://portfolio-<name>.turso.io` |
| `TURSO_AUTH_TOKEN` | token from `turso db tokens create` |
| `SESSION_SECRET` | base64 32-byte key |
| `ADMIN_PASSWORD` | your admin password |
| `CERTIFICATE_PASSWORD` | password for `/api/protected-doc` (protects `private-documents/`) |
| `RESEND_API_KEY` | Resend API key (optional — enables the contact form) |

Redeploy after adding variables.

---

## CV PDFs

Place the CV files in `public/documents/` for the download buttons in the hero section to work:

```
public/documents/cv_26_virva_svala_fi.pdf
public/documents/cv_26_virva_svala_en.pdf
```

---

## Agentic Development Workflow

This project was built as a hands-on exercise in **agentic software development** using Claude Code. The implementation followed a structured multi-agent plan:

| Phase | Agents | What was built |
| :--- | :--- | :--- |
| 1 — Foundation | Single agent (sequential) | Dependencies, `.env.local`, types, DB schema, session, auth, proxy |
| 2 — Core layers | 4 agents in parallel | Data queries, Server Actions, UI components, file upload |
| 3 — Public pages | Pages Agent | Homepage, list pages, detail pages |
| 4 — Admin UI | Pages Agent | Login, dashboard, CRUD forms for all content types |
| 5 — Polish | Reviewer Agent | Build fixes, TypeScript errors, runtime bug fixes, CLAUDE.md |
| 6 — Testing | Test Agent | 80 Playwright E2E tests + 20 Vitest unit tests in `tests/` |
| 7 — Refactor | Code Quality Agent | Shared action utils, Zod field helpers, DB utils, useAdminForm hook |

Each agent received a scoped task with clear input/output contracts. Shared knowledge (breaking API changes, MUI constraints, security rules) was captured in [`CLAUDE.md`](./CLAUDE.md) and [`AGENTS.md`](./AGENTS.md) so that every agent — and every future Claude Code session — starts with the same context.

Notable issues discovered during development and now documented for future agents:
- Next.js 16 uses `proxy.ts` instead of `middleware.ts`; dynamic `params` and `searchParams` are Promises
- MUI v9 does not accept layout props (`gap`, `justifyContent`, `flexWrap`) directly on `Stack` — they must go in `sx={{}}`
- React 19 / Next.js 16 forbids passing functions (like `Link`) as props across the Server/Client boundary — solved with a `LinkButton` client wrapper and `'use client'` card components
- `proxy.ts` matcher must explicitly skip `/admin/login` to avoid an infinite redirect loop
- Zod optional FK fields need `.default(null)` to avoid better-sqlite3 "Missing named parameter" errors

---

## CI Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and PR to `main`:

```
Build (tsc) → Lint → Unit tests → E2E tests → Deploy Gate
```

The **Deploy Gate** job runs only on pushes to `main` and requires the full CI job to pass — production deployment is blocked if any step fails.

Two repository secrets are required (GitHub → Settings → Secrets and variables → Actions):

| Secret | Value |
| :--- | :--- |
| `SESSION_SECRET` | Same as `.env.local` (32+ chars) |
| `ADMIN_PASSWORD` | Same as `.env.local` |

`TURSO_URL` and `TURSO_AUTH_TOKEN` are not needed — E2E tests use a local `test.db` automatically.

---

## Testing

Tests live in the main repo under `tests/`:

```bash
npm test               # run all E2E tests (Playwright — starts own server on :3001 with local test.db)
npm run test:ui        # interactive Playwright UI mode
npm run test:unit      # run unit tests (Vitest, no server needed)
```

`npm test` spins up a dedicated Next.js server on port **3001** backed by a local SQLite `test.db` — production Turso data is never touched. The test DB is created fresh on every run (seeded in `tests/e2e/seed-test-db.ts`). Stop any existing server on port 3001 before running tests.

**E2E coverage (80 tests across 12 spec files):**

| File | What it covers |
| :--- | :--- |
| `smoke.spec.ts` | All public routes return HTTP 200; 404 for unknown routes |
| `navigation.spec.ts` | Nav links, GitHub icon, language toggle FI↔EN, logo |
| `homepage.spec.ts` | Hero, CV buttons, anchor sidebar, section IDs, card links |
| `admin.spec.ts` | Auth redirect, login form, wrong password, successful login, dashboard |
| `feedback.spec.ts` | Feedback button and form on work, projects, and education detail pages |
| `work.spec.ts` | Work list and detail pages, admin CRUD |
| `projects.spec.ts` | Projects list and detail pages, admin CRUD |
| `education.spec.ts` | Education list and detail pages, admin CRUD |
| `courses.spec.ts` | Courses public page, education detail with courses, admin CRUD |
| `skills.spec.ts` | Skills section on homepage and CV, admin CRUD |
| `recommendations.spec.ts` | Recommendations public page, admin CRUD |
| `cv.spec.ts` | `/cv` page: all sections, print button, bilingual content |

**Unit tests (20 tests across 3 files):**

| File | What it covers |
| :--- | :--- |
| `utils.test.ts` | `parseTechnologies` — JSON parse and error cases |
| `zod-fields.test.ts` | `technologiesField` — CSV and JSON array transforms |
| `db-utils.test.ts` | `toArgs` — object-to-named-params conversion |

---

## Enabling the Contact Form

The contact form is not currently implemented — the `/contact` page shows contact links only. To add a message form:

1. Create a free account at [resend.com](https://resend.com) and copy your API key
2. Add to `.env.local`: `RESEND_API_KEY=re_xxxxxxxxxxxx` and `CONTACT_EMAIL=your@email.com`
3. Re-add `ContactForm` to `app/(public)/contact/page.tsx` — the component exists at `components/public/ContactForm.tsx`

> **Production note:** The `from` address in `actions/contact.ts` uses `onboarding@resend.dev` (Resend's sandbox sender). For production, verify your own domain in the Resend dashboard and update the `from` field.

---

## Roadmap (V2+)

- [ ] Dark mode toggle
- [x] Contact form (Resend API) — implemented, enable by adding `RESEND_API_KEY`
- [x] Certifications homepage section — static credential cards (`lib/static-content.ts`); standalone `/certifications` page is **not yet built**
- [x] Courses section — DB-driven list on `/courses` and linked from education detail pages
- [x] Recommendations — admin-managed testimonials on `/recommendations`
- [ ] GitHub integration — pinned repos pulled from the GitHub API
- [x] Feedback / "Suggest edit" form on detail pages — collapsible form, admin inbox at `/admin/feedback`
- [ ] RAG chat — portfolio bot powered by Claude API + sqlite-vec embeddings
- [x] Dynamic CV print view — `/cv` page with `@media print`, always up to date from database
- [ ] Privacy-friendly analytics (Plausible / Umami)

---

## License

Personal portfolio — not intended for reuse as a template.
