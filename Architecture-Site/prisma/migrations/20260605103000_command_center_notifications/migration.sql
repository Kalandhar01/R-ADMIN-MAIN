CREATE TYPE "NotificationPriority" AS ENUM ('low', 'medium', 'high', 'critical');

CREATE TYPE "NotificationStatus" AS ENUM ('unread', 'read', 'archived');

CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "adminId" TEXT,
    "dedupeKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "project" TEXT NOT NULL DEFAULT 'group',
    "priority" "NotificationPriority" NOT NULL DEFAULT 'medium',
    "status" "NotificationStatus" NOT NULL DEFAULT 'unread',
    "entity" TEXT,
    "entityId" TEXT,
    "actionUrl" TEXT,
    "metadata" JSONB,
    "readAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Notification_dedupeKey_key" ON "Notification"("dedupeKey");
CREATE INDEX "Notification_adminId_status_createdAt_idx" ON "Notification"("adminId", "status", "createdAt");
CREATE INDEX "Notification_project_status_createdAt_idx" ON "Notification"("project", "status", "createdAt");
CREATE INDEX "Notification_priority_createdAt_idx" ON "Notification"("priority", "createdAt");
CREATE INDEX "Notification_entity_entityId_idx" ON "Notification"("entity", "entityId");

ALTER TABLE "Notification" ADD CONSTRAINT "Notification_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
