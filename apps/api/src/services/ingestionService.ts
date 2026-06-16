import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import type {
  DocumentIngestionInput,
  LeadIngestionInput,
  MediaIngestionInput,
  ProjectIngestionInput,
  ProjectUpdateIngestionInput
} from "../validation/ingestion.js";

type SourceType = LeadIngestionInput["sourceType"];
type EntityType = "lead" | "newsletter" | "project" | "document" | "media";
type Priority = NonNullable<ProjectIngestionInput["priority"]>;

export class IngestionDatabaseUnavailableError extends Error {
  constructor() {
    super("Enterprise ingestion database is unavailable.");
    this.name = "IngestionDatabaseUnavailableError";
  }
}

export interface EntityIngestionResult {
  eventId: string;
  entityId: string;
  aiSummary: string;
}

export interface NewsletterIngestionInput {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  featured: boolean;
  status: string;
  publishDate: string | null;
  tags: string[];
  action: "created" | "updated";
}

let ingestionPrismaEnabled = false;

export function setIngestionPrismaEnabled(value: boolean): void {
  ingestionPrismaEnabled = value;
}

function assertDatabase(): void {
  if (!ingestionPrismaEnabled) {
    throw new IngestionDatabaseUnavailableError();
  }
}

function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue;
}

function excerpt(value: string | undefined, limit = 190): string {
  const trimmed = value?.replace(/\s+/g, " ").trim();
  if (!trimmed) return "";
  return trimmed.length <= limit ? trimmed : `${trimmed.slice(0, limit - 1)}...`;
}

function sourceLabel(sourceType: SourceType): string {
  const labels: Record<SourceType, string> = {
    website_contact_form: "website contact form",
    book_consultation_form: "book consultation form",
    newsletter_form: "newsletter form",
    service_inquiry_form: "service inquiry form",
    career_form: "career form",
    admin_newsletter: "admin newsletter desk",
    admin_project: "admin project desk",
    admin_document: "admin document desk",
    admin_media: "admin media desk",
    api: "API ingestion"
  };

  return labels[sourceType] || "enterprise ingestion";
}

function leadSummary(input: LeadIngestionInput): string {
  const leadState = input.status === "new" ? "New lead" : `${input.status} lead`;
  const parts = [
    `${leadState} from ${sourceLabel(input.sourceType)}`,
    input.service ? `for ${input.service}` : undefined,
    input.location ? `in ${input.location}` : undefined,
    input.companyName ? `from ${input.companyName}` : undefined
  ].filter(Boolean);
  const message = excerpt(input.message);

  return `${parts.join(" ")}.${message ? ` Signal: ${message}` : ""}`;
}

function newsletterSummary(input: NewsletterIngestionInput): string {
  const timing = input.status === "published" ? "published" : input.status;
  return `Newsletter ${input.action}: ${input.title} in ${input.category}, currently ${timing}.${input.excerpt ? ` Brief: ${excerpt(input.excerpt)}` : ""}`;
}

function projectSummary(input: ProjectIngestionInput | ProjectUpdateIngestionInput): string {
  const title = input.title || "Project update";
  const status = input.status ? `status ${input.status}` : "status unchanged";
  const progress = typeof input.progress === "number" ? `${input.progress}% progress` : "progress unchanged";
  const owner = input.owner ? `owned by ${input.owner}` : "owner unassigned";
  const dueDate = input.dueDate ? `due ${input.dueDate.toISOString().slice(0, 10)}` : "without a due date";

  return `${title}: ${status}, ${progress}, ${owner}, ${dueDate}.${input.summary ? ` Brief: ${excerpt(input.summary)}` : ""}`;
}

function documentSummary(input: DocumentIngestionInput): string {
  const project = input.projectName ? ` for ${input.projectName}` : "";
  return `${input.category} document ingested${project}: ${input.filename}.${input.mimeType ? ` Type: ${input.mimeType}.` : ""}`;
}

function mediaSummary(input: MediaIngestionInput): string {
  const tags = input.tags.length ? ` Tags: ${input.tags.join(", ")}.` : "";
  return `${input.kind} media ingested for ${input.category}: ${input.title}.${input.altText ? ` Description: ${excerpt(input.altText)}` : ""}${tags}`;
}

function baseEventData(input: {
  sourceType: SourceType;
  entityType: EntityType;
  source: string;
  service?: string;
  division?: string;
  location?: string;
  priority?: Priority;
  payload: unknown;
  aiSummary: string;
}) {
  const now = new Date();

  return {
    sourceType: input.sourceType,
    entityType: input.entityType,
    status: "completed" as const,
    priority: input.priority || "high",
    source: input.source,
    division: input.division || "ractysh-group",
    service: input.service,
    location: input.location,
    payload: toJson(input.payload),
    aiSummary: input.aiSummary,
    startedAt: now,
    processedAt: now
  };
}

export async function ingestLead(input: LeadIngestionInput): Promise<EntityIngestionResult> {
  assertDatabase();

  const aiSummary = leadSummary(input);
  const result = await prisma.$transaction(async (tx) => {
    const event = await tx.ingestionEvent.create({
      data: baseEventData({
        sourceType: input.sourceType,
        entityType: "lead",
        source: input.source,
        division: input.division,
        service: input.service,
        location: input.location,
        payload: input,
        aiSummary
      })
    });

    const lead = await tx.lead.create({
      data: {
        fullName: input.fullName,
        division: input.division,
        email: input.email,
        phone: input.phone,
        companyName: input.companyName,
        source: input.source,
        sourceType: input.sourceType,
        service: input.service,
        location: input.location,
        status: input.status,
        message: input.message,
        aiSummary,
        metadata: toJson({
          ...input.metadata,
          externalEntityId: input.externalEntityId,
          externalEntityModel: input.externalEntityModel
        }),
        ingestionEventId: event.id
      }
    });

    await tx.ingestionEvent.update({
      where: { id: event.id },
      data: {
        entityId: lead.id,
        entityModel: "Lead"
      }
    });

    return { eventId: event.id, entityId: lead.id };
  });

  return { ...result, aiSummary };
}

export async function ingestNewsletter(input: NewsletterIngestionInput): Promise<{ eventId: string; aiSummary: string }> {
  assertDatabase();

  const aiSummary = newsletterSummary(input);
  const event = await prisma.ingestionEvent.create({
    data: {
      ...baseEventData({
        sourceType: "admin_newsletter",
        entityType: "newsletter",
        source: "admin",
        service: "Executive Intelligence",
        priority: "high",
        payload: input,
        aiSummary
      }),
      entityId: input.id,
      entityModel: "Newsletter"
    }
  });

  return { eventId: event.id, aiSummary };
}

export async function ingestProject(input: ProjectIngestionInput): Promise<EntityIngestionResult> {
  assertDatabase();

  const aiSummary = projectSummary(input);
  const result = await prisma.$transaction(async (tx) => {
    const event = await tx.ingestionEvent.create({
      data: baseEventData({
        sourceType: "admin_project",
        entityType: "project",
        source: "admin",
        division: input.division,
        service: input.division,
        location: input.location,
        priority: input.priority,
        payload: input,
        aiSummary
      })
    });

    const project = await tx.ingestedProject.create({
      data: {
        title: input.title,
        division: input.division,
        status: input.status,
        progress: input.progress,
        owner: input.owner,
        dueDate: input.dueDate,
        priority: input.priority,
        budget: input.budget ? new Prisma.Decimal(input.budget) : undefined,
        location: input.location,
        summary: input.summary,
        aiSummary,
        metadata: toJson(input.metadata),
        ingestionEventId: event.id
      }
    });

    await tx.ingestionEvent.update({
      where: { id: event.id },
      data: {
        entityId: project.id,
        entityModel: "IngestedProject"
      }
    });

    return { eventId: event.id, entityId: project.id };
  });

  return { ...result, aiSummary };
}

export async function updateIngestedProject(
  id: string,
  input: ProjectUpdateIngestionInput
): Promise<EntityIngestionResult> {
  assertDatabase();

  const aiSummary = projectSummary(input);
  const result = await prisma.$transaction(async (tx) => {
    const project = await tx.ingestedProject.update({
      where: { id },
      data: {
        title: input.title,
        division: input.division,
        status: input.status,
        progress: input.progress,
        owner: input.owner,
        dueDate: input.dueDate,
        priority: input.priority,
        budget: input.budget ? new Prisma.Decimal(input.budget) : undefined,
        location: input.location,
        summary: input.summary,
        aiSummary,
        metadata: input.metadata ? toJson(input.metadata) : undefined
      }
    });

    const event = await tx.ingestionEvent.create({
      data: {
        ...baseEventData({
          sourceType: "admin_project",
          entityType: "project",
          source: "admin",
          service: project.division,
          location: project.location || undefined,
          priority: project.priority,
          payload: { action: "updated", id, changes: input },
          aiSummary
        }),
        entityId: project.id,
        entityModel: "IngestedProject"
      }
    });

    return { eventId: event.id, entityId: project.id };
  });

  return { ...result, aiSummary };
}

export async function ingestDocument(input: DocumentIngestionInput): Promise<EntityIngestionResult> {
  assertDatabase();

  const aiSummary = documentSummary(input);
  const result = await prisma.$transaction(async (tx) => {
    const event = await tx.ingestionEvent.create({
      data: baseEventData({
        sourceType: input.sourceType,
        entityType: "document",
        source: input.uploadedBy || "admin",
        division: input.division,
        service: input.category,
        priority: "high",
        payload: input,
        aiSummary
      })
    });

    const document = await tx.ingestedDocument.create({
      data: {
        filename: input.filename,
        division: input.division,
        mimeType: input.mimeType,
        size: input.size,
        url: input.url,
        provider: input.provider || "metadata",
        providerId: input.providerId,
        category: input.category,
        projectId: input.projectId,
        projectName: input.projectName,
        uploadedBy: input.uploadedBy || "admin",
        uploadDate: input.uploadDate || new Date(),
        aiSummary,
        metadata: toJson(input.metadata),
        ingestionEventId: event.id
      }
    });

    await tx.ingestionEvent.update({
      where: { id: event.id },
      data: {
        entityId: document.id,
        entityModel: "IngestedDocument"
      }
    });

    return { eventId: event.id, entityId: document.id };
  });

  return { ...result, aiSummary };
}

export async function ingestMedia(input: MediaIngestionInput): Promise<EntityIngestionResult> {
  assertDatabase();

  const aiDescription = mediaSummary(input);
  const result = await prisma.$transaction(async (tx) => {
    const event = await tx.ingestionEvent.create({
      data: baseEventData({
        sourceType: "admin_media",
        entityType: "media",
        source: "admin",
        division: input.division,
        service: input.category,
        priority: "medium",
        payload: input,
        aiSummary: aiDescription
      })
    });

    const media = await tx.ingestedMedia.create({
      data: {
        kind: input.kind,
        division: input.division,
        title: input.title,
        altText: input.altText,
        url: input.url,
        category: input.category,
        tags: input.tags,
        projectId: input.projectId,
        metadata: toJson(input.metadata),
        aiDescription,
        ingestionEventId: event.id
      }
    });

    await tx.ingestionEvent.update({
      where: { id: event.id },
      data: {
        entityId: media.id,
        entityModel: "IngestedMedia"
      }
    });

    return { eventId: event.id, entityId: media.id };
  });

  return { ...result, aiSummary: aiDescription };
}

export async function recordFailedIngestion(input: {
  sourceType: SourceType;
  entityType: EntityType;
  source: string;
  service?: string;
  division?: string;
  location?: string;
  priority?: Priority;
  payload: unknown;
  error: unknown;
}): Promise<void> {
  if (!ingestionPrismaEnabled) return;

  const errorMessage = input.error instanceof Error ? input.error.message : "Unknown ingestion failure.";

  await prisma.ingestionEvent.create({
    data: {
      sourceType: input.sourceType,
      entityType: input.entityType,
      status: "failed",
      priority: input.priority || "high",
      source: input.source,
      division: input.division || "ractysh-group",
      service: input.service,
      location: input.location,
      payload: toJson(input.payload),
      errorMessage,
      aiSummary: `Failed ${input.entityType} ingestion from ${sourceLabel(input.sourceType)}: ${errorMessage}`,
      startedAt: new Date(),
      processedAt: new Date()
    }
  });
}

export async function safelyIngestLead(input: LeadIngestionInput): Promise<EntityIngestionResult | null> {
  try {
    return await ingestLead(input);
  } catch (error) {
    console.error("Lead ingestion failed:", error);
    await recordFailedIngestion({
      sourceType: input.sourceType,
      entityType: "lead",
      source: input.source,
      division: input.division,
      service: input.service,
      location: input.location,
      payload: input,
      error
    }).catch((failedEventError) => {
      console.error("Failed to record lead ingestion failure:", failedEventError);
    });
    return null;
  }
}

export async function safelyIngestNewsletter(input: NewsletterIngestionInput): Promise<void> {
  try {
    await ingestNewsletter(input);
  } catch (error) {
    console.error("Newsletter ingestion failed:", error);
    await recordFailedIngestion({
      sourceType: "admin_newsletter",
      entityType: "newsletter",
      source: "admin",
      service: "Executive Intelligence",
      payload: input,
      error
    }).catch((failedEventError) => {
      console.error("Failed to record newsletter ingestion failure:", failedEventError);
    });
  }
}

export async function safelyIngestDocument(input: DocumentIngestionInput): Promise<EntityIngestionResult | null> {
  try {
    return await ingestDocument(input);
  } catch (error) {
    console.error("Document ingestion failed:", error);
    await recordFailedIngestion({
      sourceType: input.sourceType,
      entityType: "document",
      source: input.uploadedBy || "admin",
      division: input.division,
      service: input.category,
      payload: input,
      error
    }).catch((failedEventError) => {
      console.error("Failed to record document ingestion failure:", failedEventError);
    });
    return null;
  }
}

export async function getIngestionMonitor() {
  assertDatabase();

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const [
    newLeads,
    newDocuments,
    newNewsletterIssues,
    newMedia,
    failedIngestions,
    processingQueue,
    pendingLeads,
    activeProjects,
    delayedProjects,
    overdueProjects,
    totalEvents,
    todaysEvents,
    highPriorityEvents,
    sourceBreakdown,
    entityBreakdown,
    statusBreakdown,
    recentLeads,
    recentEvents
  ] = await Promise.all([
    prisma.lead.count({ where: { status: "new" } }),
    prisma.ingestedDocument.count({ where: { createdAt: { gte: since } } }),
    prisma.ingestionEvent.count({ where: { entityType: "newsletter", createdAt: { gte: since } } }),
    prisma.ingestedMedia.count({ where: { createdAt: { gte: since } } }),
    prisma.ingestionEvent.count({ where: { status: "failed" } }),
    prisma.ingestionEvent.count({ where: { status: { in: ["received", "processing"] } } }),
    prisma.lead.count({ where: { status: { in: ["new", "qualified"] } } }),
    prisma.ingestedProject.count({ where: { status: "active" } }),
    prisma.ingestedProject.count({ where: { status: "delayed" } }),
    prisma.ingestedProject.count({
      where: {
        dueDate: { lt: now },
        status: { in: ["concept", "active", "delayed"] }
      }
    }),
    prisma.ingestionEvent.count({ where: { createdAt: { gte: since } } }),
    prisma.ingestionEvent.count({ where: { createdAt: { gte: today } } }),
    prisma.ingestionEvent.count({ where: { priority: "high", createdAt: { gte: since } } }),
    prisma.ingestionEvent.groupBy({
      by: ["sourceType"],
      where: { createdAt: { gte: since } },
      _count: { _all: true }
    }),
    prisma.ingestionEvent.groupBy({
      by: ["entityType"],
      where: { createdAt: { gte: since } },
      _count: { _all: true }
    }),
    prisma.ingestionEvent.groupBy({
      by: ["status"],
      where: { createdAt: { gte: since } },
      _count: { _all: true }
    }),
    prisma.lead.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        companyName: true,
        service: true,
        location: true,
        status: true,
        aiSummary: true,
        createdAt: true
      }
    }),
    prisma.ingestionEvent.findMany({
      take: 12,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        sourceType: true,
        entityType: true,
        status: true,
        priority: true,
        source: true,
        service: true,
        location: true,
        entityId: true,
        entityModel: true,
        aiSummary: true,
        errorMessage: true,
        createdAt: true,
        processedAt: true
      }
    })
  ]);

  return {
    generatedAt: now.toISOString(),
    window: {
      label: "Last 7 days",
      since: since.toISOString()
    },
    metrics: {
      newLeads,
      newDocuments,
      newNewsletterIssues,
      newMedia,
      failedIngestions,
      processingQueue
    },
    activity: {
      totalEvents,
      todaysEvents,
      highPriorityEvents
    },
    sourceBreakdown: sourceBreakdown
      .map((item) => ({ sourceType: item.sourceType, count: item._count._all }))
      .sort((a, b) => b.count - a.count),
    entityBreakdown: entityBreakdown
      .map((item) => ({ entityType: item.entityType, count: item._count._all }))
      .sort((a, b) => b.count - a.count),
    statusBreakdown: statusBreakdown
      .map((item) => ({ status: item.status, count: item._count._all }))
      .sort((a, b) => b.count - a.count),
    executiveInsights: [
      `${pendingLeads} pending leads require qualification.`,
      `${activeProjects} active projects are visible to the intelligence layer.`,
      `${delayedProjects} delayed projects need review.`,
      `${overdueProjects} active or delayed projects are past due.`
    ],
    recentLeads: recentLeads.map((lead) => ({
      ...lead,
      createdAt: lead.createdAt.toISOString()
    })),
    recentEvents: recentEvents.map((event) => ({
      ...event,
      createdAt: event.createdAt.toISOString(),
      processedAt: event.processedAt?.toISOString() || null
    }))
  };
}

export async function getIngestionKnowledgeSnapshot() {
  assertDatabase();

  const now = new Date();
  const [activeProjects, delayedProjects, latestNewsletters, pendingLeads] = await Promise.all([
    prisma.ingestedProject.findMany({
      where: { status: "active" },
      take: 12,
      orderBy: [{ priority: "desc" }, { dueDate: "asc" }, { updatedAt: "desc" }]
    }),
    prisma.ingestedProject.findMany({
      where: {
        OR: [{ status: "delayed" }, { dueDate: { lt: now }, status: { in: ["concept", "active"] } }]
      },
      take: 12,
      orderBy: [{ dueDate: "asc" }, { updatedAt: "desc" }]
    }),
    prisma.newsletter.findMany({
      where: { status: "published" },
      take: 6,
      orderBy: [{ publishDate: "desc" }, { updatedAt: "desc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        excerpt: true,
        publishDate: true,
        updatedAt: true
      }
    }),
    prisma.lead.findMany({
      where: { status: { in: ["new", "qualified"] } },
      take: 12,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        companyName: true,
        service: true,
        location: true,
        status: true,
        aiSummary: true,
        createdAt: true
      }
    })
  ]);

  return {
    generatedAt: now.toISOString(),
    activeProjects,
    delayedProjects,
    latestNewsletters: latestNewsletters.map((issue) => ({
      ...issue,
      publishDate: issue.publishDate?.toISOString() || null,
      updatedAt: issue.updatedAt.toISOString()
    })),
    pendingLeads: pendingLeads.map((lead) => ({
      ...lead,
      createdAt: lead.createdAt.toISOString()
    }))
  };
}
