-- Real Estate website/admin integration.
-- Additive and idempotent so existing Ractysh databases can adopt the Real Estate platform safely.

DO $$
BEGIN
  CREATE TYPE "RealEstatePropertyStatus" AS ENUM ('draft', 'private_review', 'available', 'reserved', 'sold', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "RealEstateMediaKind" AS ENUM ('image', 'video', 'floor_plan', 'brochure', 'gallery_asset', 'location_map', 'document', 'testimonial', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "RealEstateLeadStatus" AS ENUM ('new', 'contacted', 'qualified', 'closed', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "PropertyCategory" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "position" INTEGER NOT NULL DEFAULT 0,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PropertyCategory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PropertyLocation" (
  "id" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "microMarket" TEXT,
  "address" TEXT,
  "latitude" DECIMAL(10,7),
  "longitude" DECIMAL(10,7),
  "description" TEXT,
  "landmarks" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "connectivity" JSONB,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "position" INTEGER NOT NULL DEFAULT 0,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PropertyLocation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Property" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "categoryId" TEXT,
  "locationId" TEXT,
  "propertyType" TEXT NOT NULL,
  "status" "RealEstatePropertyStatus" NOT NULL DEFAULT 'draft',
  "investmentValue" TEXT,
  "priceLabel" TEXT,
  "roiIndicator" TEXT,
  "appreciation" TEXT,
  "ticketSize" TEXT,
  "area" TEXT,
  "bedrooms" TEXT,
  "handover" TEXT,
  "developer" TEXT,
  "coverImage" TEXT,
  "coverImageAlt" TEXT,
  "heroVideo" TEXT,
  "brochureUrl" TEXT,
  "floorPlanUrl" TEXT,
  "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "metrics" JSONB,
  "priceTrends" JSONB,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "position" INTEGER NOT NULL DEFAULT 0,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PropertyMedia" (
  "id" TEXT NOT NULL,
  "propertyId" TEXT,
  "kind" "RealEstateMediaKind" NOT NULL DEFAULT 'image',
  "title" TEXT NOT NULL,
  "altText" TEXT,
  "url" TEXT NOT NULL,
  "provider" TEXT NOT NULL DEFAULT 'local',
  "mimeType" TEXT,
  "size" INTEGER,
  "width" INTEGER,
  "height" INTEGER,
  "position" INTEGER NOT NULL DEFAULT 0,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PropertyMedia_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PropertyLead" (
  "id" TEXT NOT NULL,
  "propertyId" TEXT,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "interestType" TEXT NOT NULL DEFAULT 'site_visit',
  "budget" TEXT,
  "preferredDate" TIMESTAMP(3),
  "message" TEXT,
  "sourcePage" TEXT,
  "status" "RealEstateLeadStatus" NOT NULL DEFAULT 'new',
  "contactedAt" TIMESTAMP(3),
  "qualifiedAt" TIMESTAMP(3),
  "closedAt" TIMESTAMP(3),
  "archivedAt" TIMESTAMP(3),
  "notes" TEXT,
  "metadata" JSONB,
  "legacyLeadId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PropertyLead_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PropertyCategory_slug_key" ON "PropertyCategory"("slug");
CREATE INDEX IF NOT EXISTS "PropertyCategory_active_position_idx" ON "PropertyCategory"("active", "position");
CREATE INDEX IF NOT EXISTS "PropertyCategory_position_idx" ON "PropertyCategory"("position");

CREATE UNIQUE INDEX IF NOT EXISTS "PropertyLocation_slug_key" ON "PropertyLocation"("slug");
CREATE INDEX IF NOT EXISTS "PropertyLocation_active_position_idx" ON "PropertyLocation"("active", "position");
CREATE INDEX IF NOT EXISTS "PropertyLocation_city_idx" ON "PropertyLocation"("city");
CREATE INDEX IF NOT EXISTS "PropertyLocation_position_idx" ON "PropertyLocation"("position");

CREATE UNIQUE INDEX IF NOT EXISTS "Property_slug_key" ON "Property"("slug");
CREATE INDEX IF NOT EXISTS "Property_published_featured_position_idx" ON "Property"("published", "featured", "position");
CREATE INDEX IF NOT EXISTS "Property_status_published_idx" ON "Property"("status", "published");
CREATE INDEX IF NOT EXISTS "Property_categoryId_idx" ON "Property"("categoryId");
CREATE INDEX IF NOT EXISTS "Property_locationId_idx" ON "Property"("locationId");
CREATE INDEX IF NOT EXISTS "Property_propertyType_idx" ON "Property"("propertyType");
CREATE INDEX IF NOT EXISTS "Property_position_idx" ON "Property"("position");
CREATE INDEX IF NOT EXISTS "Property_createdAt_idx" ON "Property"("createdAt");

CREATE INDEX IF NOT EXISTS "PropertyMedia_propertyId_position_idx" ON "PropertyMedia"("propertyId", "position");
CREATE INDEX IF NOT EXISTS "PropertyMedia_kind_createdAt_idx" ON "PropertyMedia"("kind", "createdAt");
CREATE INDEX IF NOT EXISTS "PropertyMedia_position_idx" ON "PropertyMedia"("position");

CREATE INDEX IF NOT EXISTS "PropertyLead_propertyId_createdAt_idx" ON "PropertyLead"("propertyId", "createdAt");
CREATE INDEX IF NOT EXISTS "PropertyLead_email_idx" ON "PropertyLead"("email");
CREATE INDEX IF NOT EXISTS "PropertyLead_status_createdAt_idx" ON "PropertyLead"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "PropertyLead_interestType_idx" ON "PropertyLead"("interestType");
CREATE INDEX IF NOT EXISTS "PropertyLead_createdAt_idx" ON "PropertyLead"("createdAt");

DO $$
BEGIN
  ALTER TABLE "Property"
    ADD CONSTRAINT "Property_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "PropertyCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "Property"
    ADD CONSTRAINT "Property_locationId_fkey"
    FOREIGN KEY ("locationId") REFERENCES "PropertyLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "PropertyMedia"
    ADD CONSTRAINT "PropertyMedia_propertyId_fkey"
    FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "PropertyLead"
    ADD CONSTRAINT "PropertyLead_propertyId_fkey"
    FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
