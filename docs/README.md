# Documentation

This folder holds the reasoning behind the codebase — not just what it does (see the root [`README.md`](../README.md) for that), but why it's built this way and what was traded off to get there.

| Document                                               | Covers                                                                                                          |
| :----------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------- |
| [`architecture.md`](./architecture.md)                 | How a request actually moves through the system: routing, auth, data layer, file handling, testing, deployment. |
| [`tech-stack-decisions.md`](./tech-stack-decisions.md) | Every major technology choice — what else was considered, why this option won, and what was given up to get it. |

**Audience:** a technical reviewer, consultant, or future maintainer evaluating whether this codebase's decisions hold up — not the coding agents themselves. Agent-facing operational rules (breaking-change gotchas, mandatory workflows, file ownership) live in [`CLAUDE.md`](../CLAUDE.md) and [`AGENTS.md`](../AGENTS.md) instead; this folder doesn't duplicate those.

**Scope note:** this is a personal portfolio for a single developer/admin, not a multi-tenant product. Several decisions below (single shared admin password, in-memory rate limiting, SQLite-family database) are correct _for that scope_ and explicitly would not be for a product with multiple admins or high write concurrency. Each decision below says so where it matters, rather than presenting the choice as universally correct.
