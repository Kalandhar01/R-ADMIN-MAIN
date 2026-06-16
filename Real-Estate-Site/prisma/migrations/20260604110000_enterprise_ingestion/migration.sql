CREATE TYPE "IngestionSourceType" AS ENUM (
  'website_contact_form',
  'book_consultation_form',
  'newsletter_form',
  'service_inquiry_form',
  'career_form',
  'admin_newsletter',
  'admin_project',
  'admin_document',
  'admin_media',
  'api'
);

CREATE TYPE "IngestionEntityType" AS ENUM (
  'lead',
  'newsletter',
  'project',
  'document',
  'media'
);

CREATE TYPE "IngestionStatus" AS ENUM (
  'received',
  'processing',
  'completed',
  'failed'
);

CREATE TYPE "IngestionPriority" AS ENUM (
  'low',
  'medium',
  'high'
);

CREATE TYPE "LeadStatus" AS ENUM (
  'new',
  'qualified',
  'contacted',
  'closed',
  'archived'
);

CREATE TYPE "IngestedProjectStatus" AS ENUM (
  'concept',
  'active',
  'delayed',
  'completed',
  'archived'
);

CREATE TYPE "IngestedMediaKind" AS ENUM (
  'image',
  'video',
  'document',
  'model',
  'other'
);

CREATE TABLE "IngestionEvent" (
  "id" TEXT NOT NULL,
  "sourceType" "IngestionSourceType" NOT NULL,
  "entityType" "IngestionEntityType" NOT NULL,
  "status" "IngestionStatus" NOT NULL DEFAULT 'received',
  "priority" "IngestionPriority" NOT NULL DEFAULT 'high',
  "source" TEXT NOT NULL,
  "service" TEXT,
  "location" TEXT,
  "entityId" TEXT,
  "entityModel" TEXT,
  "payload" JSONB NOT NULL DEFAULT '{}',
  "aiSummary" TEXT,
  "errorMessage" TEXT,
  "startedAt" TIMESTAMP(3),
  "processedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "IngestionEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Lead" (
  "id" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "companyName" TEXT,
  "source" TEXT NOT NULL,
  "sourceType" "IngestionSourceType" NOT NULL DEFAULT 'website_contact_form',
  "service" TEXT,
  "location" TEXT,
  "status" "LeadStatus" NOT NULL DEFAULT 'new',
  "message" TEXT,
  "aiSummary" TEXT,
  "metadata" JSONB,
  "ingestionEventId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "IngestedProject" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "division" TEXT NOT NULL,
  "status" "IngestedProjectStatus" NOT NULL DEFAULT 'active',
  "progress" INTEGER NOT NULL DEFAULT 0,
  "owner" TEXT,
  "dueDate" TIMESTAMP(3),
  "priority" "IngestionPriority" NOT NULL DEFAULT 'high',
  "budget" DECIMAL(14,2),
  "location" TEXT,
  "summary" TEXT,
  "aiSummary" TEXT,
  "metadata" JSONB,
  "ingestionEventId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "IngestedProject_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "IngestedDocument" (
  "id" TEXT NOT NULL,
  "filename" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "size" INTEGER,
  "url" TEXT,
  "provider" TEXT NOT NULL DEFAULT 'metadata',
  "providerId" TEXT,
  "category" TEXT NOT NULL,
  "projectId" TEXT,
  "projectName" TEXT,
  "uploadedBy" TEXT NOT NULL DEFAULT 'admin',
  "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "aiSummary" TEXT,
  "metadata" JSONB,
  "ingestionEventId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "IngestedDocument_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "IngestedMedia" (
  "id" TEXT NOT NULL,
  "kind" "IngestedMediaKind" NOT NULL DEFAULT 'image',
  "title" TEXT NOT NULL,
  "altText" TEXT,
  "url" TEXT,
  "category" TEXT NOT NULL,
  "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "projectId" TEXT,
  "metadata" JSONB,
  "aiDescription" TEXT,
  "ingestionEventId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "IngestedMedia_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "IngestionEvent_sourceType_createdAt_idx" ON "IngestionEvent"("sourceType", "createdAt");
CREATE INDEX "IngestionEvent_entityType_createdAt_idx" ON "IngestionEvent"("entityType", "createdAt");
CREATE INDEX "IngestionEvent_status_createdAt_idx" ON "IngestionEvent"("status", "createdAt");
CREATE INDEX "IngestionEvent_priority_createdAt_idx" ON "IngestionEvent"("priority", "createdAt");
CREATE INDEX "IngestionEvent_entityModel_entityId_idx" ON "IngestionEvent"("entityModel", "entityId");

CREATE UNIQUE INDEX "Lead_ingestionEventId_key" ON "Lead"("ingestionEventId");
CREATE INDEX "Lead_email_idx" ON "Lead"("email");
CREATE INDEX "Lead_sourceType_createdAt_idx" ON "Lead"("sourceType", "createdAt");
CREATE INDEX "Lead_status_createdAt_idx" ON "Lead"("status", "createdAt");
CREATE INDEX "Lead_service_idx" ON "Lead"("service");
CREATE INDEX "Lead_location_idx" ON "Lead"("location");

CREATE UNIQUE INDEX "IngestedProject_ingestionEventId_key" ON "IngestedProject"("ingestionEventId");
CREATE INDEX "IngestedProject_division_status_idx" ON "IngestedProject"("division", "status");
CREATE INDEX "IngestedProject_status_dueDate_idx" ON "IngestedProject"("status", "dueDate");
CREATE INDEX "IngestedProject_priority_dueDate_idx" ON "IngestedProject"("priority", "dueDate");
CREATE INDEX "IngestedProject_owner_idx" ON "IngestedProject"("owner");

CREATE UNIQUE INDEX "IngestedDocument_ingestionEventId_key" ON "IngestedDocument"("ingestionEventId");
CREATE INDEX "IngestedDocument_category_uploadDate_idx" ON "IngestedDocument"("category", "uploadDate");
CREATE INDEX "IngestedDocument_projectId_idx" ON "IngestedDocument"("projectId");
CREATE INDEX "IngestedDocument_projectName_idx" ON "IngestedDocument"("projectName");
CREATE INDEX "IngestedDocument_uploadDate_idx" ON "IngestedDocument"("uploadDate");

CREATE UNIQUE INDEX "IngestedMedia_ingestionEventId_key" ON "IngestedMedia"("ingestionEventId");
CREATE INDEX "IngestedMedia_kind_idx" ON "IngestedMedia"("kind");
CREATE INDEX "IngestedMedia_category_createdAt_idx" ON "IngestedMedia"("category", "createdAt");
CREATE INDEX "IngestedMedia_projectId_idx" ON "IngestedMedia"("projectId");
CREATE INDEX "IngestedMedia_createdAt_idx" ON "IngestedMedia"("createdAt");

ALTER TABLE "Lead" ADD CONSTRAINT "Lead_ingestionEventId_fkey" FOREIGN KEY ("ingestionEventId") REFERENCES "IngestionEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "IngestedProject" ADD CONSTRAINT "IngestedProject_ingestionEventId_fkey" FOREIGN KEY ("ingestionEventId") REFERENCES "IngestionEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "IngestedDocument" ADD CONSTRAINT "IngestedDocument_ingestionEventId_fkey" FOREIGN KEY ("ingestionEventId") REFERENCES "IngestionEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "IngestedMedia" ADD CONSTRAINT "IngestedMedia_ingestionEventId_fkey" FOREIGN KEY ("ingestionEventId") REFERENCES "IngestionEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
