CREATE TYPE "NewsletterStatus" AS ENUM ('draft', 'scheduled', 'published', 'archived');

CREATE TABLE "Newsletter" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "excerpt" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "coverImage" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "author" TEXT NOT NULL,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "status" "NewsletterStatus" NOT NULL DEFAULT 'draft',
  "publishDate" TIMESTAMP(3),
  "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "readTime" TEXT NOT NULL,
  "views" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Newsletter_slug_key" ON "Newsletter"("slug");
CREATE INDEX "Newsletter_status_publishDate_idx" ON "Newsletter"("status", "publishDate");
CREATE INDEX "Newsletter_featured_status_idx" ON "Newsletter"("featured", "status");
CREATE INDEX "Newsletter_category_idx" ON "Newsletter"("category");
CREATE INDEX "Newsletter_views_idx" ON "Newsletter"("views");

CREATE TABLE "Subscriber" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "status" "SubscriptionStatus" NOT NULL DEFAULT 'active',
  "source" TEXT NOT NULL DEFAULT 'executive-intelligence-center',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Subscriber_email_key" ON "Subscriber"("email");
CREATE INDEX "Subscriber_status_idx" ON "Subscriber"("status");
CREATE INDEX "Subscriber_source_idx" ON "Subscriber"("source");
CREATE INDEX "Subscriber_createdAt_idx" ON "Subscriber"("createdAt");
