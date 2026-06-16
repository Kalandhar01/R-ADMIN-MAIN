CREATE TABLE IF NOT EXISTS "Admin" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "imageUrl" TEXT,
  "passwordHash" TEXT,
  "googleId" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "lastLoginAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Role" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AuditLog" (
  "id" TEXT NOT NULL,
  "adminId" TEXT,
  "action" TEXT NOT NULL,
  "entity" TEXT NOT NULL,
  "entityId" TEXT,
  "summary" TEXT NOT NULL,
  "metadata" JSONB,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Settings" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "scope" TEXT NOT NULL DEFAULT 'global',
  "value" JSONB NOT NULL DEFAULT '{}',
  "updatedById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "_AdminRoles" (
  "A" TEXT NOT NULL,
  "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "Admin_email_key" ON "Admin"("email");
CREATE INDEX IF NOT EXISTS "Admin_active_idx" ON "Admin"("active");
CREATE INDEX IF NOT EXISTS "Admin_lastLoginAt_idx" ON "Admin"("lastLoginAt");

CREATE UNIQUE INDEX IF NOT EXISTS "Role_name_key" ON "Role"("name");

CREATE INDEX IF NOT EXISTS "AuditLog_adminId_createdAt_idx" ON "AuditLog"("adminId", "createdAt");
CREATE INDEX IF NOT EXISTS "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt");
CREATE INDEX IF NOT EXISTS "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");

CREATE UNIQUE INDEX IF NOT EXISTS "Settings_key_key" ON "Settings"("key");
CREATE INDEX IF NOT EXISTS "Settings_scope_idx" ON "Settings"("scope");
CREATE INDEX IF NOT EXISTS "Settings_updatedById_idx" ON "Settings"("updatedById");

CREATE UNIQUE INDEX IF NOT EXISTS "_AdminRoles_AB_unique" ON "_AdminRoles"("A", "B");
CREATE INDEX IF NOT EXISTS "_AdminRoles_B_index" ON "_AdminRoles"("B");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'AuditLog'
      AND constraint_name = 'AuditLog_adminId_fkey'
  ) THEN
    ALTER TABLE "AuditLog"
      ADD CONSTRAINT "AuditLog_adminId_fkey"
      FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'Settings'
      AND constraint_name = 'Settings_updatedById_fkey'
  ) THEN
    ALTER TABLE "Settings"
      ADD CONSTRAINT "Settings_updatedById_fkey"
      FOREIGN KEY ("updatedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = '_AdminRoles'
      AND constraint_name = '_AdminRoles_A_fkey'
  ) THEN
    ALTER TABLE "_AdminRoles"
      ADD CONSTRAINT "_AdminRoles_A_fkey"
      FOREIGN KEY ("A") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = '_AdminRoles'
      AND constraint_name = '_AdminRoles_B_fkey'
  ) THEN
    ALTER TABLE "_AdminRoles"
      ADD CONSTRAINT "_AdminRoles_B_fkey"
      FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

ALTER TABLE "ServiceOffer" ADD COLUMN IF NOT EXISTS "heroContent" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "ServiceOffer" ADD COLUMN IF NOT EXISTS "metrics" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "ServiceOffer" ADD COLUMN IF NOT EXISTS "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "ServiceOffer" ADD COLUMN IF NOT EXISTS "sections" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "ServiceOffer" ADD COLUMN IF NOT EXISTS "cta" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "ServiceOffer" ADD COLUMN IF NOT EXISTS "seo" JSONB NOT NULL DEFAULT '{}';
