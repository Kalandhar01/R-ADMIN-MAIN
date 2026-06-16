# Ractysh Group Platform

Production monorepo for the Ractysh public website, admin command center, API services, shared domain helpers, Prisma schema, and transactional email flows.

## Apps

| Workspace | Purpose | Local command |
| --- | --- | --- |
| `apps/web` | Public website, App Router API routes, careers, consultations, contact, blog, services, email rendering | `npm run dev:web` |
| `apps/admin` | Enterprise admin command center, authentication, content and operations workflows | `npm run dev:admin` |
| `apps/api` | Express API for ingestion, blogs, consultations, inquiries, newsletters and operations | `npm run dev:api` |

## Packages

| Package | Purpose |
| --- | --- |
| `packages/db` | Canonical Prisma schema, migrations, and Prisma client helpers |
| `packages/auth` | Shared admin auth constants and session types |
| `packages/shared` | Shared division normalization and inference helpers |
| `packages/types` | Shared admin/domain TypeScript contracts |
| `packages/ui` | Shared UI package placeholder for cross-app primitives |

## Quick Start

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
npm run dev:web
```

The web app runs on `http://localhost:3000`. Start the API with `npm run dev:api` and the admin app with `npm run dev:admin`.

## Quality Gates

```bash
npm run lint
npm run typecheck
npm run typecheck:admin
npm run build --workspace apps/web
npm run build --workspace apps/admin
npm run build --workspace apps/api
```

## Prisma

The canonical schema is `packages/db/prisma/schema.prisma`. App scripts generate Prisma from that schema:

```bash
npm run prisma:generate --workspace apps/web
npm run prisma:generate --workspace apps/api
```

Keep migrations in `packages/db/prisma/migrations`. Seed and verify scripts live in `apps/api/prisma` because the API owns operational seed data.

## Documentation

- [Architecture Overview](docs/architecture.md)
- [Folder Structure Guide](docs/folder-structure.md)
