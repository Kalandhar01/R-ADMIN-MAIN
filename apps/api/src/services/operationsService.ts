import { prisma } from "../lib/prisma.js";

type SystemStatus = "online" | "degraded" | "offline";
type OverallStatus = "healthy" | "attention" | "degraded";

interface OperationsSystem {
  key: string;
  label: string;
  status: SystemStatus;
  detail: string;
}

let operationsPrismaEnabled = false;

export function setOperationsPrismaEnabled(value: boolean): void {
  operationsPrismaEnabled = value;
}

function hasEnv(key: string): boolean {
  return Boolean(process.env[key]?.trim());
}

function hasAllEnv(keys: string[]): boolean {
  return keys.every(hasEnv);
}

function statusFromConfig(configured: boolean, connected = configured): SystemStatus {
  if (connected) return "online";
  return configured ? "degraded" : "offline";
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3_600);
  const minutes = Math.floor((seconds % 3_600) / 60);

  if (days) return `${days}d ${hours}h`;
  if (hours) return `${hours}h ${minutes}m`;
  return `${Math.max(1, minutes)}m`;
}

function overallStatus(statuses: SystemStatus[]): OverallStatus {
  if (statuses.includes("offline")) return "attention";
  if (statuses.includes("degraded")) return "degraded";
  return "healthy";
}

function baseCounts() {
  return {
    content: {
      siteConfigs: 0,
      publishedBlogs: 0,
      draftBlogs: 0,
      publishedNewsletters: 0,
      draftNewsletters: 0,
      subscribers: 0
    },
    intake: {
      newLeads: 0,
      pendingLeads: 0,
      serviceRequests: 0,
      consultations: 0
    },
    intelligence: {
      ingestionEvents7d: 0,
      failedIngestions: 0,
      processingQueue: 0,
      activeProjects: 0,
      delayedProjects: 0,
      documents: 0,
      media: 0
    }
  };
}

export async function getOperationsOverview() {
  const now = new Date();
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const databaseConfigured = hasEnv("DATABASE_URL");
  const mongoConfigured = hasEnv("MONGODB_URI");
  const emailConfigured = hasEnv("RESEND_API_KEY");
  const cloudinaryConfigured = hasAllEnv(["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"]);
  const corsConfigured = hasEnv("WEB_ORIGIN");
  const counts = baseCounts();
  const warnings: string[] = [];
  let databaseError: string | null = null;

  if (!databaseConfigured) {
    warnings.push("DATABASE_URL is missing. Ingestion, newsletters, consultations and admin intelligence cannot persist.");
  }

  if (databaseConfigured && !operationsPrismaEnabled) {
    warnings.push("Database URL is configured, but the API could not connect to Prisma at startup.");
  }

  if (!emailConfigured) {
    warnings.push("RESEND_API_KEY is missing. Contact, consultation, career and service request emails will be skipped or fail.");
  }

  if (!cloudinaryConfigured) {
    warnings.push("Cloudinary credentials are incomplete. Upload flows will keep metadata, but file storage is limited.");
  }

  if (!mongoConfigured) {
    warnings.push("MONGODB_URI is missing. Site content API is using its fallback content store.");
  }

  if (!corsConfigured) {
    warnings.push("WEB_ORIGIN is not configured. Localhost origins are allowed, but production should set explicit origins.");
  }

  if (operationsPrismaEnabled) {
    try {
      const [
        siteConfigs,
        publishedBlogs,
        draftBlogs,
        publishedNewsletters,
        draftNewsletters,
        subscribers,
        newLeads,
        pendingLeads,
        serviceRequests,
        consultations,
        ingestionEvents7d,
        failedIngestions,
        processingQueue,
        activeProjects,
        delayedProjects,
        documents,
        media
      ] = await Promise.all([
        prisma.siteConfig.count(),
        prisma.blogPost.count({ where: { status: "published" } }),
        prisma.blogPost.count({ where: { status: "draft" } }),
        prisma.newsletter.count({ where: { status: "published" } }),
        prisma.newsletter.count({ where: { status: { in: ["draft", "scheduled"] } } }),
        prisma.subscriber.count({ where: { status: "active" } }),
        prisma.lead.count({ where: { status: "new" } }),
        prisma.lead.count({ where: { status: { in: ["new", "qualified"] } } }),
        prisma.serviceRequest.count(),
        prisma.consultation.count({ where: { status: { in: ["new", "reviewed", "contacted"] } } }),
        prisma.ingestionEvent.count({ where: { createdAt: { gte: since } } }),
        prisma.ingestionEvent.count({ where: { status: "failed" } }),
        prisma.ingestionEvent.count({ where: { status: { in: ["received", "processing"] } } }),
        prisma.ingestedProject.count({ where: { status: "active" } }),
        prisma.ingestedProject.count({ where: { status: "delayed" } }),
        prisma.ingestedDocument.count(),
        prisma.ingestedMedia.count()
      ]);

      counts.content = {
        siteConfigs,
        publishedBlogs,
        draftBlogs,
        publishedNewsletters,
        draftNewsletters,
        subscribers
      };
      counts.intake = {
        newLeads,
        pendingLeads,
        serviceRequests,
        consultations
      };
      counts.intelligence = {
        ingestionEvents7d,
        failedIngestions,
        processingQueue,
        activeProjects,
        delayedProjects,
        documents,
        media
      };
    } catch (error) {
      databaseError = error instanceof Error ? error.message : "Unknown Prisma operations error.";
      warnings.push("Database overview queries failed. Check Prisma migrations and table availability.");
    }
  }

  const systems: OperationsSystem[] = [
    {
      key: "api",
      label: "API Runtime",
      status: "online" as const,
      detail: `Online for ${formatUptime(Math.floor(process.uptime()))}.`
    },
    {
      key: "database",
      label: "Database",
      status: databaseError ? "degraded" : statusFromConfig(databaseConfigured, operationsPrismaEnabled),
      detail: databaseError || (operationsPrismaEnabled ? "Prisma connected." : "Prisma is not connected.")
    },
    {
      key: "content",
      label: "Content Store",
      status: statusFromConfig(mongoConfigured, mongoConfigured),
      detail: mongoConfigured ? "MongoDB configured." : "Using fallback site content."
    },
    {
      key: "email",
      label: "Email Delivery",
      status: statusFromConfig(emailConfigured),
      detail: emailConfigured ? "Resend configured." : "Email delivery key missing."
    },
    {
      key: "media",
      label: "Media Storage",
      status: statusFromConfig(cloudinaryConfigured),
      detail: cloudinaryConfigured ? "Cloudinary configured." : "Uploads will rely on metadata fallback."
    },
    {
      key: "ingestion",
      label: "Ingestion Layer",
      status: operationsPrismaEnabled && counts.intelligence.failedIngestions === 0 ? "online" : "degraded",
      detail:
        counts.intelligence.failedIngestions > 0
          ? `${counts.intelligence.failedIngestions} failed ingestion event(s) need review.`
          : "Central ingestion is available."
    }
  ];

  const nextActions = [
    counts.intake.newLeads > 0 ? `Qualify ${counts.intake.newLeads} new lead(s).` : null,
    counts.intelligence.failedIngestions > 0
      ? `Review ${counts.intelligence.failedIngestions} failed ingestion event(s).`
      : null,
    counts.intelligence.delayedProjects > 0 ? `Review ${counts.intelligence.delayedProjects} delayed project(s).` : null,
    counts.content.publishedNewsletters === 0 ? "Publish the first database-backed newsletter issue." : null,
    warnings.length ? "Resolve configuration warnings before production launch." : null
  ].filter((item): item is string => Boolean(item));

  return {
    generatedAt: now.toISOString(),
    status: overallStatus(systems.map((system) => system.status)),
    environment: process.env.NODE_ENV || "development",
    uptimeSeconds: Math.floor(process.uptime()),
    systems,
    counts,
    warnings,
    nextActions: nextActions.length ? nextActions : ["No immediate operational actions detected."],
    configuration: {
      database: databaseConfigured,
      mongoContent: mongoConfigured,
      emailDelivery: emailConfigured,
      mediaStorage: cloudinaryConfigured,
      corsOrigins: corsConfigured
    }
  };
}
