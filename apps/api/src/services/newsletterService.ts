import { Prisma, type Newsletter, type NewsletterStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import type { NewsletterCreateInput, NewsletterSubscribeInput, NewsletterUpdateInput } from "../validation/newsletter.js";
import { safelyIngestLead, safelyIngestNewsletter } from "./ingestionService.js";

export class NewsletterDatabaseUnavailableError extends Error {
  constructor(message = "Newsletter database is unavailable.") {
    super(message);
    this.name = "NewsletterDatabaseUnavailableError";
  }
}

export class NewsletterNotFoundError extends Error {
  constructor(message = "Newsletter not found.") {
    super(message);
    this.name = "NewsletterNotFoundError";
  }
}

type NewsletterRecord = Newsletter;

export interface NewsletterDto {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  coverImage: string;
  category: string;
  author: string;
  featured: boolean;
  status: NewsletterStatus;
  publishDate: string | null;
  tags: string[];
  readTime: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterTickerItem {
  label: string;
  title: string;
  category: string;
  slug: string;
}

let newsletterPrismaEnabled = false;
let schemaWarningLogged = false;
let databaseUnavailableMessage = "Newsletter database is unavailable.";
let publicSchemaReady: boolean | undefined;

export function setNewsletterPrismaEnabled(value: boolean): void {
  newsletterPrismaEnabled = value;
  if (value) {
    databaseUnavailableMessage = "Newsletter database is unavailable.";
    publicSchemaReady = undefined;
  }
}

function assertDatabase(): void {
  if (!newsletterPrismaEnabled) {
    throw new NewsletterDatabaseUnavailableError(databaseUnavailableMessage);
  }
}

function emptyExecutiveIntelligence() {
  return {
    featured: null,
    latest: null,
    recentIssues: [],
    trending: null,
    ticker: [],
    metrics: {
      subscriberCount: 0,
      issueCount: 0,
      recentPublication: null
    }
  };
}

function isNewsletterSchemaMismatch(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;
  if (error.code !== "P2021" && error.code !== "P2022") return false;

  const modelName = typeof error.meta?.modelName === "string" ? error.meta.modelName : "";
  return modelName === "Newsletter" || /Newsletter/i.test(error.message);
}

function useSchemaFallback(): void {
  newsletterPrismaEnabled = false;
  publicSchemaReady = false;
  databaseUnavailableMessage = "Newsletter database schema is out of date. Run the latest Prisma migration.";

  if (!schemaWarningLogged) {
    schemaWarningLogged = true;
    console.warn(
      "[newsletter] Database schema is missing Newsletter fields. Public newsletter endpoints are using empty fallbacks until migrations are applied."
    );
  }
}

function shouldUsePublicFallback(error: unknown): boolean {
  if (error instanceof NewsletterDatabaseUnavailableError) return true;
  if (!isNewsletterSchemaMismatch(error)) return false;

  useSchemaFallback();
  return true;
}

async function hasNewsletterDivisionColumn(): Promise<boolean> {
  const rows = await prisma.$queryRaw<Array<{ exists: boolean }>>`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND table_name = 'Newsletter'
        AND column_name = 'division'
    ) AS "exists"
  `;

  return Boolean(rows[0]?.exists);
}

async function hasPublicNewsletterDatabase(): Promise<boolean> {
  try {
    assertDatabase();
  } catch (error) {
    if (shouldUsePublicFallback(error)) return false;
    throw error;
  }

  if (publicSchemaReady !== undefined) return publicSchemaReady;

  if (!(await hasNewsletterDivisionColumn())) {
    useSchemaFallback();
    return false;
  }

  publicSchemaReady = true;
  return true;
}

function iso(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

function publicWhere(now = new Date()) {
  return {
    status: "published" as const,
    publishDate: {
      lte: now
    }
  };
}

function slugify(value: string): string {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug || `executive-intelligence-${Date.now()}`;
}

function computeReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

function parsePublishDate(value: string | undefined): Date | null | undefined {
  if (value === undefined) return undefined;
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Publish date must be a valid date.");
  }

  return date;
}

function mapNewsletter(record: NewsletterRecord, includeContent = false): NewsletterDto {
  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    excerpt: record.excerpt,
    content: includeContent ? record.content : undefined,
    coverImage: record.coverImage,
    category: record.category,
    author: record.author,
    featured: record.featured,
    status: record.status,
    publishDate: iso(record.publishDate),
    tags: record.tags,
    readTime: record.readTime,
    views: record.views,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString()
  };
}

function newsletterIngestionPayload(record: NewsletterRecord, action: "created" | "updated") {
  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    excerpt: record.excerpt,
    category: record.category,
    author: record.author,
    featured: record.featured,
    status: record.status,
    publishDate: iso(record.publishDate),
    tags: record.tags,
    action
  };
}

async function ensureUniqueSlug(base: string, existingId?: string): Promise<string> {
  let candidate = slugify(base);
  let suffix = 2;

  while (true) {
    const existing = await prisma.newsletter.findUnique({
      where: { slug: candidate },
      select: { id: true }
    });

    if (!existing || existing.id === existingId) return candidate;

    candidate = `${slugify(base)}-${suffix}`;
    suffix += 1;
  }
}

function publishDateForStatus(status: NewsletterStatus, publishDate: Date | null | undefined): Date | null | undefined {
  if (status === "published") {
    return publishDate === undefined || publishDate === null ? new Date() : publishDate;
  }

  if (status === "scheduled") {
    if (!publishDate) {
      throw new Error("Scheduled newsletters require a publish date.");
    }
    return publishDate;
  }

  return publishDate;
}

async function normalizeCreateInput(input: NewsletterCreateInput) {
  const status = input.status as NewsletterStatus;
  const publishDate = publishDateForStatus(status, parsePublishDate(input.publishDate));

  return {
    title: input.title,
    slug: await ensureUniqueSlug(input.slug || input.title),
    excerpt: input.excerpt,
    content: input.content,
    coverImage: input.coverImage,
    category: input.category,
    author: input.author,
    featured: input.featured,
    status,
    publishDate,
    tags: input.tags || [],
    readTime: input.readTime || computeReadTime(input.content)
  };
}

async function normalizeUpdateInput(id: string, input: NewsletterUpdateInput) {
  const next: Record<string, unknown> = {};

  if (input.title !== undefined) next.title = input.title;
  if (input.excerpt !== undefined) next.excerpt = input.excerpt;
  if (input.content !== undefined) next.content = input.content;
  if (input.coverImage !== undefined) next.coverImage = input.coverImage;
  if (input.category !== undefined) next.category = input.category;
  if (input.author !== undefined) next.author = input.author;
  if (input.featured !== undefined) next.featured = input.featured;
  if (input.tags !== undefined) next.tags = input.tags;

  if (input.slug !== undefined || input.title !== undefined) {
    next.slug = await ensureUniqueSlug(input.slug || input.title || "executive-intelligence", id);
  }

  const status = input.status as NewsletterStatus | undefined;
  const parsedPublishDate = parsePublishDate(input.publishDate);

  if (status !== undefined) {
    next.status = status;
    const date = publishDateForStatus(status, parsedPublishDate);
    if (date !== undefined) next.publishDate = date;
  } else if (parsedPublishDate !== undefined) {
    next.publishDate = parsedPublishDate;
  }

  if (input.readTime !== undefined) {
    next.readTime = input.readTime || computeReadTime(input.content || "");
  } else if (input.content !== undefined) {
    next.readTime = computeReadTime(input.content);
  }

  return next;
}

async function normalizeFeatured(id: string, featured: boolean): Promise<void> {
  if (!featured) return;

  await prisma.newsletter.updateMany({
    where: {
      id: {
        not: id
      },
      featured: true
    },
    data: {
      featured: false
    }
  });
}

export async function listAdminNewsletters(): Promise<NewsletterDto[]> {
  assertDatabase();

  const newsletters = await prisma.newsletter.findMany({
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }]
  });

  return newsletters.map((record) => mapNewsletter(record, true));
}

export async function createNewsletter(input: NewsletterCreateInput): Promise<NewsletterDto> {
  assertDatabase();

  const data = await normalizeCreateInput(input);
  const newsletter = await prisma.newsletter.create({ data });
  await normalizeFeatured(newsletter.id, newsletter.featured);

  const fresh = newsletter.featured
    ? await prisma.newsletter.findUniqueOrThrow({ where: { id: newsletter.id } })
    : newsletter;

  await safelyIngestNewsletter(newsletterIngestionPayload(fresh, "created"));
  return mapNewsletter(fresh, true);
}

export async function updateNewsletter(id: string, input: NewsletterUpdateInput): Promise<NewsletterDto> {
  assertDatabase();

  const data = await normalizeUpdateInput(id, input);
  const newsletter = await prisma.newsletter.update({ where: { id }, data });
  await normalizeFeatured(newsletter.id, newsletter.featured);

  const fresh = newsletter.featured
    ? await prisma.newsletter.findUniqueOrThrow({ where: { id: newsletter.id } })
    : newsletter;

  await safelyIngestNewsletter(newsletterIngestionPayload(fresh, "updated"));
  return mapNewsletter(fresh, true);
}

export async function deleteNewsletter(id: string): Promise<void> {
  assertDatabase();
  await prisma.newsletter.delete({ where: { id } });
}

export async function getPublicNewsletterBySlug(slug: string): Promise<NewsletterDto | null> {
  try {
    if (!(await hasPublicNewsletterDatabase())) return null;

    const record = await prisma.newsletter.findFirst({
      where: {
        slug,
        ...publicWhere()
      }
    });

    if (!record) return null;

    const updated = await prisma.newsletter.update({
      where: { id: record.id },
      data: { views: { increment: 1 } }
    });

    return mapNewsletter(updated, true);
  } catch (error) {
    if (shouldUsePublicFallback(error)) return null;
    throw error;
  }
}

export async function getFeaturedNewsletter(): Promise<NewsletterDto | null> {
  try {
    if (!(await hasPublicNewsletterDatabase())) return null;

    const record = await prisma.newsletter.findFirst({
      where: {
        featured: true,
        ...publicWhere()
      },
      orderBy: [{ publishDate: "desc" }, { updatedAt: "desc" }]
    });

    if (record) return mapNewsletter(record);

    const latest = await prisma.newsletter.findFirst({
      where: publicWhere(),
      orderBy: [{ publishDate: "desc" }, { updatedAt: "desc" }]
    });

    return latest ? mapNewsletter(latest) : null;
  } catch (error) {
    if (shouldUsePublicFallback(error)) return null;
    throw error;
  }
}

export async function getLatestNewsletter(): Promise<NewsletterDto | null> {
  try {
    if (!(await hasPublicNewsletterDatabase())) return null;

    const record = await prisma.newsletter.findFirst({
      where: publicWhere(),
      orderBy: [{ publishDate: "desc" }, { updatedAt: "desc" }]
    });

    return record ? mapNewsletter(record) : null;
  } catch (error) {
    if (shouldUsePublicFallback(error)) return null;
    throw error;
  }
}

export async function getExecutiveIntelligence(limit = 6) {
  try {
    if (!(await hasPublicNewsletterDatabase())) return emptyExecutiveIntelligence();

    const take = Math.min(Math.max(limit, 3), 12);
    const where = publicWhere();
    const [newsletters, featured, latest, trending, subscriberCount, issueCount] = await Promise.all([
      prisma.newsletter.findMany({
        where,
        take,
        orderBy: [{ publishDate: "desc" }, { updatedAt: "desc" }]
      }),
      getFeaturedNewsletter(),
      getLatestNewsletter(),
      prisma.newsletter.findFirst({
        where,
        orderBy: [{ views: "desc" }, { publishDate: "desc" }]
      }),
      prisma.subscriber.count({ where: { status: "active" } }),
      prisma.newsletter.count({ where })
    ]);

    const mapped = newsletters.map((record) => mapNewsletter(record));
    const trendingDto = trending ? mapNewsletter(trending) : null;
    const ticker: NewsletterTickerItem[] = [
      latest ? { label: "Latest Publication", title: latest.title, category: latest.category, slug: latest.slug } : null,
      featured ? { label: "Featured Insight", title: featured.title, category: featured.category, slug: featured.slug } : null,
      trendingDto ? { label: "Trending Issue", title: trendingDto.title, category: trendingDto.category, slug: trendingDto.slug } : null,
      ...mapped.slice(0, 4).map((item) => ({
        label: "Executive Brief",
        title: item.title,
        category: item.category,
        slug: item.slug
      }))
    ].filter((item): item is NewsletterTickerItem => Boolean(item));

    return {
      featured,
      latest,
      recentIssues: mapped,
      trending: trendingDto,
      ticker,
      metrics: {
        subscriberCount,
        issueCount,
        recentPublication: latest?.publishDate || null
      }
    };
  } catch (error) {
    if (shouldUsePublicFallback(error)) return emptyExecutiveIntelligence();
    throw error;
  }
}

export async function subscribeToNewsletter(input: NewsletterSubscribeInput) {
  assertDatabase();

  const now = new Date();
  const subscriber = await prisma.subscriber.upsert({
    where: { email: input.email.toLowerCase() },
    create: {
      email: input.email.toLowerCase(),
      division: input.division,
      source: input.source || "executive-intelligence-center",
      status: "active"
    },
    update: {
      division: input.division,
      source: input.source || "executive-intelligence-center",
      status: "active",
      updatedAt: now
    }
  });

  await safelyIngestLead({
    fullName: input.email.split("@")[0] || "Newsletter Subscriber",
    email: input.email,
    division: input.division,
    source: input.source || "executive-intelligence-center",
    sourceType: "newsletter_form",
    service: "Executive Intelligence",
    status: "new",
    message: "Newsletter subscription captured for future client intelligence and communications.",
    metadata: {
      subscriberId: subscriber.id,
      subscriptionStatus: subscriber.status
    },
    externalEntityId: subscriber.id,
    externalEntityModel: "Subscriber"
  });

  return {
    id: subscriber.id,
    email: subscriber.email,
    status: subscriber.status,
    source: subscriber.source,
    createdAt: subscriber.createdAt.toISOString(),
    updatedAt: subscriber.updatedAt.toISOString()
  };
}
