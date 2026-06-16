-- Architecture website/admin integration.
-- Additive and idempotent so existing Ractysh databases can adopt the Architecture CMS safely.

DO $$
BEGIN
  CREATE TYPE "ArchitectureLeadStatus" AS ENUM ('new', 'contacted', 'qualified', 'converted', 'closed', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "ArchitectureProjectStatus" AS ENUM ('draft', 'concept', 'design', 'planning', 'active', 'completed', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "ArchitectureMediaKind" AS ENUM ('image', 'video', 'hero_video', 'project_image', 'gallery_asset', 'document', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "ArchitectureLead" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "projectType" TEXT NOT NULL,
  "location" TEXT,
  "budget" TEXT,
  "message" TEXT NOT NULL,
  "sourcePage" TEXT,
  "status" "ArchitectureLeadStatus" NOT NULL DEFAULT 'new',
  "contactedAt" TIMESTAMP(3),
  "convertedAt" TIMESTAMP(3),
  "archivedAt" TIMESTAMP(3),
  "notes" TEXT,
  "metadata" JSONB,
  "contactInquiryId" TEXT,
  "legacyLeadId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ArchitectureLead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ArchitectureProject" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "projectType" TEXT NOT NULL,
  "year" TEXT NOT NULL,
  "area" TEXT,
  "status" "ArchitectureProjectStatus" NOT NULL DEFAULT 'draft',
  "coverImage" TEXT,
  "coverImageAlt" TEXT,
  "galleryImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "position" INTEGER NOT NULL DEFAULT 0,
  "viewCount" INTEGER NOT NULL DEFAULT 0,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ArchitectureProject_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ArchitectureMedia" (
  "id" TEXT NOT NULL,
  "kind" "ArchitectureMediaKind" NOT NULL DEFAULT 'image',
  "title" TEXT NOT NULL,
  "altText" TEXT,
  "url" TEXT NOT NULL,
  "provider" TEXT NOT NULL DEFAULT 'local',
  "providerId" TEXT,
  "mimeType" TEXT,
  "size" INTEGER,
  "width" INTEGER,
  "height" INTEGER,
  "usage" TEXT NOT NULL DEFAULT 'project',
  "projectId" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ArchitectureMedia_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ArchitectureHero" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL DEFAULT 'architecture-home',
  "heading" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "videoUrl" TEXT NOT NULL,
  "posterUrl" TEXT,
  "primaryCtaText" TEXT NOT NULL DEFAULT 'View Works',
  "primaryCtaHref" TEXT NOT NULL DEFAULT '#works',
  "secondaryCtaText" TEXT NOT NULL DEFAULT 'Consultation',
  "secondaryCtaHref" TEXT NOT NULL DEFAULT '#consultation',
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ArchitectureHero_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ArchitecturePageView" (
  "id" TEXT NOT NULL,
  "path" TEXT NOT NULL,
  "projectId" TEXT,
  "projectSlug" TEXT,
  "referrer" TEXT,
  "userAgent" TEXT,
  "ipHash" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ArchitecturePageView_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ArchitectureProject_slug_key" ON "ArchitectureProject"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "ArchitectureHero_key_key" ON "ArchitectureHero"("key");

CREATE INDEX IF NOT EXISTS "ArchitectureLead_email_idx" ON "ArchitectureLead"("email");
CREATE INDEX IF NOT EXISTS "ArchitectureLead_status_createdAt_idx" ON "ArchitectureLead"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "ArchitectureLead_projectType_idx" ON "ArchitectureLead"("projectType");
CREATE INDEX IF NOT EXISTS "ArchitectureLead_location_idx" ON "ArchitectureLead"("location");
CREATE INDEX IF NOT EXISTS "ArchitectureLead_createdAt_idx" ON "ArchitectureLead"("createdAt");

CREATE INDEX IF NOT EXISTS "ArchitectureProject_published_featured_position_idx" ON "ArchitectureProject"("published", "featured", "position");
CREATE INDEX IF NOT EXISTS "ArchitectureProject_status_published_idx" ON "ArchitectureProject"("status", "published");
CREATE INDEX IF NOT EXISTS "ArchitectureProject_projectType_idx" ON "ArchitectureProject"("projectType");
CREATE INDEX IF NOT EXISTS "ArchitectureProject_location_idx" ON "ArchitectureProject"("location");
CREATE INDEX IF NOT EXISTS "ArchitectureProject_position_idx" ON "ArchitectureProject"("position");
CREATE INDEX IF NOT EXISTS "ArchitectureProject_viewCount_idx" ON "ArchitectureProject"("viewCount");

CREATE INDEX IF NOT EXISTS "ArchitectureMedia_kind_createdAt_idx" ON "ArchitectureMedia"("kind", "createdAt");
CREATE INDEX IF NOT EXISTS "ArchitectureMedia_usage_createdAt_idx" ON "ArchitectureMedia"("usage", "createdAt");
CREATE INDEX IF NOT EXISTS "ArchitectureMedia_projectId_idx" ON "ArchitectureMedia"("projectId");

CREATE INDEX IF NOT EXISTS "ArchitecturePageView_path_createdAt_idx" ON "ArchitecturePageView"("path", "createdAt");
CREATE INDEX IF NOT EXISTS "ArchitecturePageView_projectId_createdAt_idx" ON "ArchitecturePageView"("projectId", "createdAt");
CREATE INDEX IF NOT EXISTS "ArchitecturePageView_projectSlug_createdAt_idx" ON "ArchitecturePageView"("projectSlug", "createdAt");
CREATE INDEX IF NOT EXISTS "ArchitecturePageView_createdAt_idx" ON "ArchitecturePageView"("createdAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'ArchitectureMedia'
      AND constraint_name = 'ArchitectureMedia_projectId_fkey'
  ) THEN
    ALTER TABLE "ArchitectureMedia"
      ADD CONSTRAINT "ArchitectureMedia_projectId_fkey"
      FOREIGN KEY ("projectId") REFERENCES "ArchitectureProject"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'ArchitecturePageView'
      AND constraint_name = 'ArchitecturePageView_projectId_fkey'
  ) THEN
    ALTER TABLE "ArchitecturePageView"
      ADD CONSTRAINT "ArchitecturePageView_projectId_fkey"
      FOREIGN KEY ("projectId") REFERENCES "ArchitectureProject"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
