-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ConsultationStatus" AS ENUM ('new', 'reviewed', 'contacted', 'archived');

-- CreateEnum
CREATE TYPE "WorkflowStageKey" AS ENUM ('consultation_submitted', 'internal_review', 'approval_verification', 'strategy_discussion', 'execution_planning', 'project_kickoff');

-- CreateEnum
CREATE TYPE "WorkflowStageStatus" AS ENUM ('locked', 'active', 'waiting', 'completed', 'rejected');

-- CreateEnum
CREATE TYPE "UploadedDocumentKind" AS ENUM ('submission', 'response');

-- CreateTable
CREATE TABLE "Consultation" (
    "id" TEXT NOT NULL,
    "trackingToken" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "budgetRange" TEXT NOT NULL,
    "projectTimeline" TEXT NOT NULL,
    "projectDescription" TEXT NOT NULL,
    "preferredConsultationType" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'book-consultation-page',
    "status" "ConsultationStatus" NOT NULL DEFAULT 'new',
    "currentStageKey" "WorkflowStageKey" NOT NULL DEFAULT 'internal_review',
    "notificationSent" BOOLEAN NOT NULL DEFAULT false,
    "notificationSkipped" BOOLEAN NOT NULL DEFAULT false,
    "notificationError" TEXT,
    "notificationSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowStage" (
    "id" TEXT NOT NULL,
    "consultationId" TEXT NOT NULL,
    "key" "WorkflowStageKey" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "status" "WorkflowStageStatus" NOT NULL DEFAULT 'locked',
    "stateLabel" TEXT NOT NULL DEFAULT 'Locked',
    "startedAt" TIMESTAMP(3),
    "unlockedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowLog" (
    "id" TEXT NOT NULL,
    "consultationId" TEXT NOT NULL,
    "stageId" TEXT,
    "stageKey" "WorkflowStageKey",
    "action" TEXT NOT NULL,
    "actorId" TEXT,
    "actorEmail" TEXT,
    "actorRole" TEXT,
    "note" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadedDocument" (
    "id" TEXT NOT NULL,
    "consultationId" TEXT NOT NULL,
    "stageId" TEXT,
    "stageKey" "WorkflowStageKey",
    "kind" "UploadedDocumentKind" NOT NULL DEFAULT 'submission',
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'metadata',
    "providerId" TEXT,
    "uploadedBy" TEXT NOT NULL DEFAULT 'client',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UploadedDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusHistory" (
    "id" TEXT NOT NULL,
    "consultationId" TEXT NOT NULL,
    "stageId" TEXT,
    "stageKey" "WorkflowStageKey",
    "fromStatus" TEXT,
    "toStatus" TEXT NOT NULL,
    "label" TEXT,
    "changedBy" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Consultation_trackingToken_key" ON "Consultation"("trackingToken");

-- CreateIndex
CREATE INDEX "Consultation_emailAddress_idx" ON "Consultation"("emailAddress");

-- CreateIndex
CREATE INDEX "Consultation_status_idx" ON "Consultation"("status");

-- CreateIndex
CREATE INDEX "Consultation_currentStageKey_idx" ON "Consultation"("currentStageKey");

-- CreateIndex
CREATE INDEX "Consultation_createdAt_idx" ON "Consultation"("createdAt");

-- CreateIndex
CREATE INDEX "WorkflowStage_consultationId_position_idx" ON "WorkflowStage"("consultationId", "position");

-- CreateIndex
CREATE INDEX "WorkflowStage_status_idx" ON "WorkflowStage"("status");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowStage_consultationId_key_key" ON "WorkflowStage"("consultationId", "key");

-- CreateIndex
CREATE INDEX "WorkflowLog_consultationId_createdAt_idx" ON "WorkflowLog"("consultationId", "createdAt");

-- CreateIndex
CREATE INDEX "WorkflowLog_stageId_idx" ON "WorkflowLog"("stageId");

-- CreateIndex
CREATE INDEX "UploadedDocument_consultationId_kind_idx" ON "UploadedDocument"("consultationId", "kind");

-- CreateIndex
CREATE INDEX "UploadedDocument_stageId_idx" ON "UploadedDocument"("stageId");

-- CreateIndex
CREATE INDEX "StatusHistory_consultationId_createdAt_idx" ON "StatusHistory"("consultationId", "createdAt");

-- CreateIndex
CREATE INDEX "StatusHistory_stageId_idx" ON "StatusHistory"("stageId");

-- AddForeignKey
ALTER TABLE "WorkflowStage" ADD CONSTRAINT "WorkflowStage_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowLog" ADD CONSTRAINT "WorkflowLog_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowLog" ADD CONSTRAINT "WorkflowLog_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "WorkflowStage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedDocument" ADD CONSTRAINT "UploadedDocument_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedDocument" ADD CONSTRAINT "UploadedDocument_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "WorkflowStage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusHistory" ADD CONSTRAINT "StatusHistory_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusHistory" ADD CONSTRAINT "StatusHistory_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "WorkflowStage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
