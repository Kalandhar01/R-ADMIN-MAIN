# Architecture Overview

## Runtime Shape

Ractysh is organized as an npm workspace monorepo:

- `apps/web` serves the public website and web-owned API routes for newsletter subscription, contact, careers, consultations and service requests.
- `apps/admin` serves the authenticated enterprise command center.
- `apps/api` serves the Express API for ingestion, blog, inquiry, consultation, newsletter and operations workflows.
- `packages/db` owns the Prisma schema and migrations used by all apps.
- `packages/shared`, `packages/types`, and `packages/auth` hold cross-app domain contracts.

## Data Layer

`packages/db/prisma/schema.prisma` is the only schema source. App-level Prisma commands point to it with `--schema ../../packages/db/prisma/schema.prisma`.

Prisma client access is wrapped by app-specific server modules:

- Web: `apps/web/src/lib/server/prisma.ts`
- Admin: `apps/admin/src/lib/server/prisma.ts`
- API: `apps/api/src/lib/prisma.ts`

## Web App

The web app uses Next.js App Router. Routes live in `apps/web/src/app`, while reusable route implementations live in `apps/web/src/components`, `apps/web/src/data`, and `apps/web/src/lib`.

Major public workflows:

- Careers: `apps/web/src/app/careers` and `apps/web/src/app/api/career-application`
- Contact: `apps/web/src/app/contact` and `apps/web/src/app/api/contact`
- Consultations: `apps/web/src/app/book-consultation`, `apps/web/src/app/consultation`, and consultation API routes
- Blogs: `apps/web/src/app/blog`, `apps/web/src/app/journal`, and blog data services
- Services: service route pages plus `apps/web/src/data/servicePages.ts` and `apps/web/src/data/commercialServices.ts`
- Newsletter email: `apps/web/src/emails/WelcomeNewsletterEmail.tsx` and `apps/web/src/lib/email/sendWelcomeEmail.ts`

## Admin App

The admin app is authenticated through shared auth constants and Prisma-backed admin sessions. The command center reads and writes operational data through `apps/admin/src/lib/admin/data.ts` and `apps/admin/src/app/api/admin/command-center/route.ts`.

## Asset Policy

Runtime uploads are ignored under `apps/web/public/uploads/`. Static public imagery should use WebP or AVIF unless there is a specific compatibility reason to keep PNG or JPEG.
