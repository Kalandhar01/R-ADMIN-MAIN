ALTER TYPE "InquiryStatus" ADD VALUE IF NOT EXISTS 'proposal_sent';
ALTER TYPE "InquiryStatus" ADD VALUE IF NOT EXISTS 'won';
ALTER TYPE "LeadStatus" ADD VALUE IF NOT EXISTS 'proposal_sent';
ALTER TYPE "LeadStatus" ADD VALUE IF NOT EXISTS 'won';

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ContactInquiry' AND column_name = 'fullName'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ContactInquiry' AND column_name = 'name'
  ) THEN
    ALTER TABLE "ContactInquiry" RENAME COLUMN "fullName" TO "name";
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ContactInquiry' AND column_name = 'companyName'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ContactInquiry' AND column_name = 'company'
  ) THEN
    ALTER TABLE "ContactInquiry" RENAME COLUMN "companyName" TO "company";
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ContactInquiry' AND column_name = 'interest'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ContactInquiry' AND column_name = 'service'
  ) THEN
    ALTER TABLE "ContactInquiry" RENAME COLUMN "interest" TO "service";
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ContactInquiry' AND column_name = 'source'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ContactInquiry' AND column_name = 'sourcePage'
  ) THEN
    ALTER TABLE "ContactInquiry" RENAME COLUMN "source" TO "sourcePage";
  END IF;
END $$;

ALTER TABLE "ContactInquiry" ADD COLUMN IF NOT EXISTS "name" TEXT;
ALTER TABLE "ContactInquiry" ADD COLUMN IF NOT EXISTS "company" TEXT;
ALTER TABLE "ContactInquiry" ADD COLUMN IF NOT EXISTS "service" TEXT;
ALTER TABLE "ContactInquiry" ADD COLUMN IF NOT EXISTS "subject" TEXT;
ALTER TABLE "ContactInquiry" ADD COLUMN IF NOT EXISTS "sourcePage" TEXT;
ALTER TABLE "ContactInquiry" ADD COLUMN IF NOT EXISTS "notes" TEXT;

UPDATE "ContactInquiry"
SET
  "name" = COALESCE(NULLIF("name", ''), "email", 'Unknown contact'),
  "sourcePage" = COALESCE(NULLIF("sourcePage", ''), 'website')
WHERE "name" IS NULL OR "name" = '' OR "sourcePage" IS NULL OR "sourcePage" = '';

ALTER TABLE "ContactInquiry" ALTER COLUMN "name" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "ContactInquiry_service_idx" ON "ContactInquiry"("service");
CREATE INDEX IF NOT EXISTS "ContactInquiry_sourcePage_idx" ON "ContactInquiry"("sourcePage");
