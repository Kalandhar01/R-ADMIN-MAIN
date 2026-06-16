DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CareerApplicationStatus') THEN
    CREATE TYPE "CareerApplicationStatus" AS ENUM ('new', 'reviewed', 'shortlisted', 'rejected', 'hired');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "CareerApplication" (
  "id" TEXT NOT NULL,
  "jobId" TEXT,
  "fullName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "position" TEXT NOT NULL DEFAULT 'General Application',
  "experience" TEXT NOT NULL DEFAULT 'Not provided',
  "message" TEXT NOT NULL DEFAULT '',
  "resumeUrl" TEXT,
  "portfolioUrl" TEXT,
  "coverLetter" TEXT,
  "status" "CareerApplicationStatus" NOT NULL DEFAULT 'new',
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CareerApplication_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "CareerApplication" ADD COLUMN IF NOT EXISTS "position" TEXT;
ALTER TABLE "CareerApplication" ADD COLUMN IF NOT EXISTS "experience" TEXT;
ALTER TABLE "CareerApplication" ADD COLUMN IF NOT EXISTS "message" TEXT;

UPDATE "CareerApplication"
SET
  "position" = COALESCE(NULLIF("position", ''), 'General Application'),
  "experience" = COALESCE(NULLIF("experience", ''), 'Not provided'),
  "message" = COALESCE(NULLIF("message", ''), "coverLetter", "notes", '')
WHERE "position" IS NULL
  OR "position" = ''
  OR "experience" IS NULL
  OR "experience" = ''
  OR "message" IS NULL;

ALTER TABLE "CareerApplication" ALTER COLUMN "position" SET NOT NULL;
ALTER TABLE "CareerApplication" ALTER COLUMN "experience" SET NOT NULL;
ALTER TABLE "CareerApplication" ALTER COLUMN "message" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "CareerApplication_jobId_idx" ON "CareerApplication"("jobId");
CREATE INDEX IF NOT EXISTS "CareerApplication_email_idx" ON "CareerApplication"("email");
CREATE INDEX IF NOT EXISTS "CareerApplication_position_idx" ON "CareerApplication"("position");
CREATE INDEX IF NOT EXISTS "CareerApplication_status_idx" ON "CareerApplication"("status");
CREATE INDEX IF NOT EXISTS "CareerApplication_createdAt_idx" ON "CareerApplication"("createdAt");

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'CareerJob'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'CareerApplication'
      AND constraint_name = 'CareerApplication_jobId_fkey'
  ) THEN
    ALTER TABLE "CareerApplication"
      ADD CONSTRAINT "CareerApplication_jobId_fkey"
      FOREIGN KEY ("jobId") REFERENCES "CareerJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
