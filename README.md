# Virva Svala — Portfolio

A personal portfolio website for software developer Virva Svala. Built with Next.js 16 App Router, Material UI, and SQLite — with a protected admin panel for managing all content without touching code.

> **This project is an agentic coding exercise.**
> The entire codebase was developed using [Claude Code](https://claude.ai/code) (Anthropic's AI coding agent) through a structured multi-agent workflow. Different agents were assigned to different layers of the stack (data, UI, auth, upload, pages) and worked in parallel or in sequence according to a pre-defined implementation plan. See [`AGENTS.md`](./AGENTS.md) for the agent roles and responsibilities.

---

## Features

- **Bilingual (Finnish / English)** — all content has `_fi` and `_en` variants; a language toggle cookie switches the active language across all server-rendered pages
- **Portfolio sections** — Work experience, Projects, Education, Skills — each with clickable cards linking to full detail views
- **CV downloads** — direct PDF download links for both Finnish and English CVs from the hero section
- **PDF attachments** — work certificates and study certificates can be attached to individual entries and downloaded from their detail pages
- **Protected admin panel** — add, edit, and delete all content at `/admin` without touching code or redeploying
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
│   │   └── education/[id]/page.tsx
│   ├── admin/                      # Protected admin panel
│   │   ├── layout.tsx              # AdminNav only (no public Nav)
│   │   ├── login/page.tsx
│   │   ├── page.tsx                # Dashboard with content counts
│   │   ├── work/                   # List · New · Edit
│   │   ├── projects/
│   │   └── education/
│   └── api/upload/route.ts         # PDF upload endpoint
├── components/
│   ├── providers/MuiProvider.tsx   # SSR emotion + ThemeProvider
│   ├── public/                     # Nav, Footer, HeroSection, cards, SkillsSection
│   ├── admin/                      # AdminNav, WorkForm, ProjectForm, EducationForm, DeleteButton
│   └── ui/LinkButton.tsx           # 'use client' wrapper for MUI Button + Next.js Link
├── lib/
│   ├── db/
│   │   ├── index.ts                # Turso/libSQL client (TURSO_URL + TURSO_AUTH_TOKEN)
│   │   ├── schema.sql              # Table definitions
│   │   └── queries/                # work.ts · projects.ts · education.ts · documents.ts · feedback.ts
│   ├── session.ts                  # JWT encrypt / decrypt
│   ├── auth.ts                     # getSession(), requireAdmin()
│   ├── types.ts                    # Shared TypeScript interfaces
│   └── mui-theme.ts                # MUI theme (primary #1a1a2e, accent #e94560)
├── actions/                        # Server Actions: auth · work · projects · education
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
| 6 — Testing | Test Agent | 32 Playwright E2E tests on branch `test/e2e-playwright` |

Each agent received a scoped task with clear input/output contracts. Shared knowledge (breaking API changes, MUI constraints, security rules) was captured in [`CLAUDE.md`](./CLAUDE.md) and [`AGENTS.md`](./AGENTS.md) so that every agent — and every future Claude Code session — starts with the same context.

Notable issues discovered during development and now documented for future agents:
- Next.js 16 uses `proxy.ts` instead of `middleware.ts`; dynamic `params` and `searchParams` are Promises
- MUI v9 does not accept layout props (`gap`, `justifyContent`, `flexWrap`) directly on `Stack` — they must go in `sx={{}}`
- React 19 / Next.js 16 forbids passing functions (like `Link`) as props across the Server/Client boundary — solved with a `LinkButton` client wrapper and `'use client'` card components
- `proxy.ts` matcher must explicitly skip `/admin/login` to avoid an infinite redirect loop
- Zod optional FK fields need `.default(null)` to avoid better-sqlite3 "Missing named parameter" errors

---

## Testing

End-to-end tests live in a separate git worktree on branch `test/e2e-playwright` at `/Users/virva/portfolio-test`.

```bash
# In the test worktree
cd /Users/virva/portfolio-test

npm test          # run all tests (headless)
npm run test:ui   # open Playwright UI mode
```

The dev server must be running (`npm run dev` in the main repo) before running tests, or Playwright will start it automatically via `webServer` in `playwright.config.ts`.

**Test coverage (32 tests):**

| File | What it covers |
| :--- | :--- |
| `smoke.spec.ts` | All public routes return HTTP 200; 404 for unknown routes |
| `navigation.spec.ts` | Nav links, GitHub icon, language toggle FI↔EN, logo |
| `homepage.spec.ts` | Hero, CV buttons, anchor sidebar, section IDs, card links |
| `admin.spec.ts` | Auth redirect, login form, wrong password error, successful login |
| `feedback.spec.ts` | Feedback button and form on work, projects, and education detail pages |

---

## Enabling the Contact Form

The contact form (`/contact`) is built and ready but disabled until a Resend API key is configured.

**Steps to enable:**

1. Create a free account at [resend.com](https://resend.com)
2. Copy your API key and add it to `.env.local`:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxx
   ```
3. Open `app/(public)/contact/page.tsx` and uncomment the form block (the `{/* Contact form — disabled ... */}` section)
4. Restart the dev server — the form will appear on the right side of the Contact page

> **Production note:** The `from` address in `actions/contact.ts` uses `onboarding@resend.dev` (Resend's sandbox sender). For production, verify your own domain in the Resend dashboard and update the `from` field to e.g. `Portfolio <noreply@yourdomain.com>`.

---

## Roadmap (V2+)

- [ ] Dark mode toggle
- [x] Contact form (Resend API) — implemented, enable by adding `RESEND_API_KEY`
- [ ] `/certifications` section — courses and certificates with progress tracking
- [ ] GitHub integration — pinned repos pulled from the GitHub API
- [x] Feedback / "Suggest edit" form on detail pages — collapsible form, admin inbox at `/admin/feedback`
- [ ] RAG chat — portfolio bot powered by Claude API + sqlite-vec embeddings
- [ ] Dynamic CV print view (`@media print`)
- [ ] Privacy-friendly analytics (Plausible / Umami)

---

## License

Personal portfolio — not intended for reuse as a template.
