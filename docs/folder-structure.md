# Folder Structure Guide

## Top Level

```text
apps/
  web/
  admin/
  api/
packages/
  auth/
  db/
  shared/
  types/
  ui/
docs/
```

## Web App

```text
apps/web/src/
  app/            Route entrypoints and route handlers
  assets/         Source-imported images used by Next image optimization
  components/     Page sections, layouts, forms, cards, UI primitives and 3D scenes
  data/           Static route data and service catalogs
  emails/         React Email templates
  lib/            Server services, client helpers, API clients and utilities
```

Keep public URL assets in `apps/web/public` only when they must be addressable by path. Prefer `apps/web/src/assets` for images imported directly by React components.

## Admin App

```text
apps/admin/src/
  app/            Admin pages and API routes
  components/     Admin command center and auth UI
  lib/            Admin auth, data access and Prisma server helpers
```

## API App

```text
apps/api/src/
  routes/         Express route modules
  services/       Business services and notification workflows
  validation/     Zod schemas
  lib/            Database and Prisma helpers
  types/          API-local contracts
```

## Shared Packages

`packages/db/prisma` owns Prisma. Avoid adding app-local Prisma schema copies. Shared contracts that cross app boundaries belong in `packages/types` or `packages/shared`, not inside one app.
