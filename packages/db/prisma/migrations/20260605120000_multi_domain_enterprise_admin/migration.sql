-- Multi-domain enterprise admin support.
-- The migration is additive and safe for existing Ractysh data.

ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "Notification" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "SiteConfig" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "HeroSection" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "PageSection" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "ServiceOffer" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "MediaAsset" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "TeamMember" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "Blog" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "Newsletter" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "Subscriber" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "NewsletterSubscriber" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "IngestionEvent" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "IngestedProject" ALTER COLUMN "division" SET DEFAULT 'ractysh-group';
ALTER TABLE "IngestedDocument" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "IngestedMedia" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "Statistic" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "Testimonial" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "Location" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "Certification" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "TimelineEvent" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "CareerJob" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "CareerApplication" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "ContactInquiry" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "ServiceRequest" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';
ALTER TABLE "Consultation" ADD COLUMN IF NOT EXISTS "division" TEXT NOT NULL DEFAULT 'ractysh-group';

CREATE TABLE IF NOT EXISTS "DomainMapping" (
  "id" TEXT NOT NULL,
  "domain" TEXT NOT NULL,
  "division" TEXT NOT NULL,
  "companyId" TEXT,
  "status" "DivisionStatus" NOT NULL DEFAULT 'active',
  "primary" BOOLEAN NOT NULL DEFAULT false,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DomainMapping_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "DomainMapping_domain_key" ON "DomainMapping"("domain");
CREATE INDEX IF NOT EXISTS "DomainMapping_division_status_idx" ON "DomainMapping"("division", "status");
CREATE INDEX IF NOT EXISTS "DomainMapping_companyId_idx" ON "DomainMapping"("companyId");

DO $$
BEGIN
  ALTER TABLE "DomainMapping" ADD CONSTRAINT "DomainMapping_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "CompanyDivision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS "Settings_division_idx" ON "Settings"("division");
CREATE INDEX IF NOT EXISTS "Notification_division_status_createdAt_idx" ON "Notification"("division", "status", "createdAt");
CREATE INDEX IF NOT EXISTS "SiteConfig_division_idx" ON "SiteConfig"("division");
CREATE INDEX IF NOT EXISTS "HeroSection_division_pageSlug_idx" ON "HeroSection"("division", "pageSlug");
CREATE INDEX IF NOT EXISTS "PageSection_division_pageSlug_position_idx" ON "PageSection"("division", "pageSlug", "position");
CREATE INDEX IF NOT EXISTS "ServiceOffer_division_status_idx" ON "ServiceOffer"("division", "status");
CREATE INDEX IF NOT EXISTS "Project_division_status_idx" ON "Project"("division", "status");
CREATE INDEX IF NOT EXISTS "MediaAsset_division_idx" ON "MediaAsset"("division");
CREATE INDEX IF NOT EXISTS "TeamMember_division_idx" ON "TeamMember"("division");
CREATE INDEX IF NOT EXISTS "BlogPost_division_status_publishedAt_idx" ON "BlogPost"("division", "status", "publishedAt");
CREATE INDEX IF NOT EXISTS "Blog_division_status_publishedAt_idx" ON "Blog"("division", "status", "publishedAt");
CREATE INDEX IF NOT EXISTS "Newsletter_division_status_publishDate_idx" ON "Newsletter"("division", "status", "publishDate");
CREATE INDEX IF NOT EXISTS "Subscriber_division_status_idx" ON "Subscriber"("division", "status");
CREATE INDEX IF NOT EXISTS "NewsletterSubscriber_division_idx" ON "NewsletterSubscriber"("division");
CREATE INDEX IF NOT EXISTS "IngestionEvent_division_createdAt_idx" ON "IngestionEvent"("division", "createdAt");
CREATE INDEX IF NOT EXISTS "Lead_division_status_createdAt_idx" ON "Lead"("division", "status", "createdAt");
CREATE INDEX IF NOT EXISTS "IngestedProject_division_priority_idx" ON "IngestedProject"("division", "priority");
CREATE INDEX IF NOT EXISTS "IngestedDocument_division_uploadDate_idx" ON "IngestedDocument"("division", "uploadDate");
CREATE INDEX IF NOT EXISTS "IngestedMedia_division_createdAt_idx" ON "IngestedMedia"("division", "createdAt");
CREATE INDEX IF NOT EXISTS "Statistic_division_idx" ON "Statistic"("division");
CREATE INDEX IF NOT EXISTS "Testimonial_division_approved_idx" ON "Testimonial"("division", "approved");
CREATE INDEX IF NOT EXISTS "Location_division_idx" ON "Location"("division");
CREATE INDEX IF NOT EXISTS "Certification_division_idx" ON "Certification"("division");
CREATE INDEX IF NOT EXISTS "TimelineEvent_division_position_idx" ON "TimelineEvent"("division", "position");
CREATE INDEX IF NOT EXISTS "CareerJob_division_status_idx" ON "CareerJob"("division", "status");
CREATE INDEX IF NOT EXISTS "CareerApplication_division_status_createdAt_idx" ON "CareerApplication"("division", "status", "createdAt");
CREATE INDEX IF NOT EXISTS "ContactInquiry_division_status_createdAt_idx" ON "ContactInquiry"("division", "status", "createdAt");
CREATE INDEX IF NOT EXISTS "ServiceRequest_division_createdAt_idx" ON "ServiceRequest"("division", "createdAt");
CREATE INDEX IF NOT EXISTS "Consultation_division_status_createdAt_idx" ON "Consultation"("division", "status", "createdAt");
