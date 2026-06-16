import { Prisma, type Blog, type BlogStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import type { BlogCreateInput, BlogUpdateInput } from "../validation/blog.js";

export class BlogDatabaseUnavailableError extends Error {
  constructor(message = "Blog database is unavailable.") {
    super(message);
    this.name = "BlogDatabaseUnavailableError";
  }
}

export interface BlogPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BlogDto {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  coverImage: string;
  coverImageAlt: string | null;
  imageMetadata: Prisma.JsonValue | null;
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
  status: BlogStatus;
  publishedAt: string | null;
  readTime: string;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  views: number;
  likes: number;
  relatedSlugs: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogListOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: BlogStatus;
}

export interface BlogListPayload {
  blogs: BlogDto[];
  featured: BlogDto | null;
  latest: BlogDto[];
  recentInsights: BlogDto[];
  categories: string[];
  pagination: BlogPagination;
}

type BlogRecord = Blog;

let blogPrismaEnabled = false;
let schemaWarningLogged = false;
let databaseUnavailableMessage = "Blog database is unavailable.";
let publicSchemaReady: boolean | undefined;

export function setBlogPrismaEnabled(value: boolean): void {
  blogPrismaEnabled = value;
  if (value) {
    databaseUnavailableMessage = "Blog database is unavailable.";
    publicSchemaReady = undefined;
  }
}

function assertDatabase(): void {
  if (!blogPrismaEnabled) {
    throw new BlogDatabaseUnavailableError(databaseUnavailableMessage);
  }
}

function emptyBlogListPayload(options: BlogListOptions = {}): BlogListPayload {
  const page = parsePage(options.page);
  const limit = parseLimit(options.limit);

  return {
    blogs: [],
    featured: null,
    latest: [],
    recentInsights: [],
    categories: [],
    pagination: pagination(page, limit, 0)
  };
}

function isBlogSchemaMismatch(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;
  if (error.code !== "P2021" && error.code !== "P2022") return false;

  const modelName = typeof error.meta?.modelName === "string" ? error.meta.modelName : "";
  return modelName === "Blog" || /Blog/i.test(error.message);
}

function useSchemaFallback(): void {
  blogPrismaEnabled = false;
  publicSchemaReady = false;
  databaseUnavailableMessage = "Blog database schema is out of date. Run the latest Prisma migration.";

  if (!schemaWarningLogged) {
    schemaWarningLogged = true;
    console.warn("[blog] Database schema is missing Blog fields. Public blog endpoints are using empty fallbacks until migrations are applied.");
  }
}

function shouldUsePublicFallback(error: unknown): boolean {
  if (error instanceof BlogDatabaseUnavailableError) return true;
  if (!isBlogSchemaMismatch(error)) return false;

  useSchemaFallback();
  return true;
}

async function hasBlogDivisionColumn(): Promise<boolean> {
  const rows = await prisma.$queryRaw<Array<{ exists: boolean }>>`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND table_name = 'Blog'
        AND column_name = 'division'
    ) AS "exists"
  `;

  return Boolean(rows[0]?.exists);
}

async function hasPublicBlogDatabase(): Promise<boolean> {
  try {
    assertDatabase();
  } catch (error) {
    if (shouldUsePublicFallback(error)) return false;
    throw error;
  }

  if (publicSchemaReady !== undefined) return publicSchemaReady;

  if (!(await hasBlogDivisionColumn())) {
    useSchemaFallback();
    return false;
  }

  publicSchemaReady = true;
  return true;
}

function iso(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

function publicWhere(now = new Date()): Prisma.BlogWhereInput {
  return {
    status: "published",
    OR: [{ publishedAt: null }, { publishedAt: { lte: now } }]
  };
}

function slugify(value: string): string {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);

  return slug || `blog-${Date.now()}`;
}

function computeReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

function parseDate(value: string | undefined): Date | null | undefined {
  if (value === undefined) return undefined;
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Published date must be a valid date.");
  }

  return date;
}

function mapBlog(record: BlogRecord, includeContent = false): BlogDto {
  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    excerpt: record.excerpt,
    content: includeContent ? record.content : undefined,
    coverImage: record.coverImage,
    coverImageAlt: record.coverImageAlt,
    imageMetadata: record.imageMetadata,
    author: record.author,
    category: record.category,
    tags: record.tags,
    featured: record.featured,
    status: record.status,
    publishedAt: iso(record.publishedAt),
    readTime: record.readTime,
    seoTitle: record.seoTitle,
    seoDescription: record.seoDescription,
    canonicalUrl: record.canonicalUrl,
    views: record.views,
    likes: record.likes,
    relatedSlugs: record.relatedSlugs,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString()
  };
}

async function ensureUniqueSlug(base: string, existingId?: string): Promise<string> {
  const normalized = slugify(base);
  let candidate = normalized;
  let suffix = 2;

  while (true) {
    const existing = await prisma.blog.findUnique({
      where: { slug: candidate },
      select: { id: true }
    });

    if (!existing || existing.id === existingId) return candidate;

    candidate = `${normalized}-${suffix}`;
    suffix += 1;
  }
}

function publishedAtForStatus(status: BlogStatus, publishedAt: Date | null | undefined): Date | null | undefined {
  if (status === "published") {
    return publishedAt === undefined || publishedAt === null ? new Date() : publishedAt;
  }

  if (status === "scheduled") {
    if (!publishedAt) {
      throw new Error("Scheduled blogs require a published date.");
    }
    return publishedAt;
  }

  return publishedAt;
}

function parsePage(value: number | undefined): number {
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.floor(Number(value)));
}

function parseLimit(value: number | undefined): number {
  if (!Number.isFinite(value)) return 12;
  return Math.min(48, Math.max(1, Math.floor(Number(value))));
}

function searchFilter(search: string | undefined): Prisma.BlogWhereInput | undefined {
  const query = search?.trim();
  if (!query) return undefined;

  return {
    OR: [
      { title: { contains: query, mode: "insensitive" } },
      { slug: { contains: query, mode: "insensitive" } },
      { excerpt: { contains: query, mode: "insensitive" } },
      { category: { contains: query, mode: "insensitive" } },
      { author: { contains: query, mode: "insensitive" } }
    ]
  };
}

function categoryFilter(category: string | undefined): Prisma.BlogWhereInput | undefined {
  const value = category?.trim();
  if (!value || value === "All Articles") return undefined;
  return { category: value };
}

function whereFromOptions(options: BlogListOptions, publicOnly: boolean): Prisma.BlogWhereInput {
  const filters: Prisma.BlogWhereInput[] = [];
  if (publicOnly) filters.push(publicWhere());
  if (!publicOnly && options.status) filters.push({ status: options.status });

  const category = categoryFilter(options.category);
  if (category) filters.push(category);

  const search = searchFilter(options.search);
  if (search) filters.push(search);

  return filters.length ? { AND: filters } : {};
}

function pagination(page: number, limit: number, total: number): BlogPagination {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit))
  };
}

async function normalizeFeatured(id: string, featured: boolean): Promise<void> {
  if (!featured) return;

  await prisma.blog.updateMany({
    where: {
      id: { not: id },
      featured: true
    },
    data: {
      featured: false
    }
  });
}

async function normalizeCreateInput(input: BlogCreateInput): Promise<Prisma.BlogCreateInput> {
  const status = input.status as BlogStatus;
  const publishedAt = publishedAtForStatus(status, parseDate(input.publishedAt));

  return {
    title: input.title,
    slug: await ensureUniqueSlug(input.slug || input.title),
    excerpt: input.excerpt,
    content: input.content,
    coverImage: input.coverImage,
    coverImageAlt: input.coverImageAlt || null,
    imageMetadata: input.imageMetadata as Prisma.InputJsonValue | undefined,
    author: input.author,
    category: input.category,
    tags: input.tags || [],
    featured: input.featured,
    status,
    publishedAt,
    readTime: input.readTime || computeReadTime(input.content),
    seoTitle: input.seoTitle || null,
    seoDescription: input.seoDescription || null,
    canonicalUrl: input.canonicalUrl || null,
    relatedSlugs: input.relatedSlugs || []
  };
}

async function normalizeUpdateInput(id: string, input: BlogUpdateInput): Promise<Prisma.BlogUpdateInput> {
  const existing = await prisma.blog.findUniqueOrThrow({ where: { id } });
  const next: Prisma.BlogUpdateInput = {};

  if (input.title !== undefined) next.title = input.title;
  if (input.excerpt !== undefined) next.excerpt = input.excerpt;
  if (input.content !== undefined) next.content = input.content;
  if (input.coverImage !== undefined) next.coverImage = input.coverImage;
  if (input.coverImageAlt !== undefined) next.coverImageAlt = input.coverImageAlt || null;
  if (input.imageMetadata !== undefined) next.imageMetadata = input.imageMetadata as Prisma.InputJsonValue;
  if (input.author !== undefined) next.author = input.author;
  if (input.category !== undefined) next.category = input.category;
  if (input.tags !== undefined) next.tags = input.tags;
  if (input.featured !== undefined) next.featured = input.featured;
  if (input.seoTitle !== undefined) next.seoTitle = input.seoTitle || null;
  if (input.seoDescription !== undefined) next.seoDescription = input.seoDescription || null;
  if (input.canonicalUrl !== undefined) next.canonicalUrl = input.canonicalUrl || null;
  if (input.relatedSlugs !== undefined) next.relatedSlugs = input.relatedSlugs;

  if (input.slug !== undefined || input.title !== undefined) {
    next.slug = await ensureUniqueSlug(input.slug || input.title || existing.title, id);
  }

  const status = input.status as BlogStatus | undefined;
  const parsedPublishedAt = parseDate(input.publishedAt);

  if (status !== undefined) {
    next.status = status;
    const date = publishedAtForStatus(status, parsedPublishedAt);
    if (date !== undefined) next.publishedAt = date;
  } else if (parsedPublishedAt !== undefined) {
    next.publishedAt = parsedPublishedAt;
  }

  if (input.readTime !== undefined) {
    next.readTime = input.readTime || computeReadTime(input.content || existing.content);
  } else if (input.content !== undefined) {
    next.readTime = computeReadTime(input.content);
  }

  return next;
}

export async function listAdminBlogs(options: BlogListOptions = {}): Promise<BlogListPayload> {
  assertDatabase();

  const page = parsePage(options.page);
  const limit = parseLimit(options.limit);
  const where = whereFromOptions(options, false);

  const [records, total, featured, latest, insights, categories] = await Promise.all([
    prisma.blog.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }]
    }),
    prisma.blog.count({ where }),
    prisma.blog.findFirst({
      where: { featured: true },
      orderBy: [{ updatedAt: "desc" }]
    }),
    prisma.blog.findMany({
      take: 6,
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }]
    }),
    prisma.blog.findMany({
      where: { category: "Insights" },
      take: 6,
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }]
    }),
    prisma.blog.groupBy({
      by: ["category"],
      orderBy: { category: "asc" }
    })
  ]);

  return {
    blogs: records.map((record) => mapBlog(record, true)),
    featured: featured ? mapBlog(featured, true) : null,
    latest: latest.map((record) => mapBlog(record)),
    recentInsights: insights.map((record) => mapBlog(record)),
    categories: categories.map((record) => record.category),
    pagination: pagination(page, limit, total)
  };
}

export async function listPublicBlogs(options: BlogListOptions = {}): Promise<BlogListPayload> {
  try {
    if (!(await hasPublicBlogDatabase())) return emptyBlogListPayload(options);

    const page = parsePage(options.page);
    const limit = parseLimit(options.limit);
    const where = whereFromOptions(options, true);
    const publicFilter = publicWhere();

    const [records, total, featured, latest, insights, categories] = await Promise.all([
      prisma.blog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }]
      }),
      prisma.blog.count({ where }),
      prisma.blog.findFirst({
        where: {
          featured: true,
          ...publicFilter
        },
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }]
      }),
      prisma.blog.findMany({
        where: publicFilter,
        take: 6,
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }]
      }),
      prisma.blog.findMany({
        where: {
          ...publicFilter,
          category: "Insights"
        },
        take: 6,
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }]
      }),
      prisma.blog.groupBy({
        by: ["category"],
        where: publicFilter,
        orderBy: { category: "asc" }
      })
    ]);

    const latestDtos = latest.map((record) => mapBlog(record));

    return {
      blogs: records.map((record) => mapBlog(record)),
      featured: featured ? mapBlog(featured) : latestDtos[0] || null,
      latest: latestDtos,
      recentInsights: insights.length ? insights.map((record) => mapBlog(record)) : latestDtos.slice(0, 3),
      categories: categories.map((record) => record.category),
      pagination: pagination(page, limit, total)
    };
  } catch (error) {
    if (shouldUsePublicFallback(error)) return emptyBlogListPayload(options);
    throw error;
  }
}

export async function getFeaturedBlog(): Promise<BlogDto | null> {
  try {
    if (!(await hasPublicBlogDatabase())) return null;

    const record = await prisma.blog.findFirst({
      where: {
        featured: true,
        ...publicWhere()
      },
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }]
    });

    if (record) return mapBlog(record);

    const latest = await prisma.blog.findFirst({
      where: publicWhere(),
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }]
    });

    return latest ? mapBlog(latest) : null;
  } catch (error) {
    if (shouldUsePublicFallback(error)) return null;
    throw error;
  }
}

export async function getLatestBlogs(limit = 6): Promise<BlogDto[]> {
  try {
    if (!(await hasPublicBlogDatabase())) return [];

    const records = await prisma.blog.findMany({
      where: publicWhere(),
      take: parseLimit(limit),
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }]
    });

    return records.map((record) => mapBlog(record));
  } catch (error) {
    if (shouldUsePublicFallback(error)) return [];
    throw error;
  }
}

export async function getPublicBlogBySlug(slug: string, options: { incrementViews?: boolean } = {}): Promise<BlogDto | null> {
  try {
    if (!(await hasPublicBlogDatabase())) return null;

    const record = await prisma.blog.findFirst({
      where: {
        slug,
        ...publicWhere()
      }
    });

    if (!record) return null;

    if (options.incrementViews === false) {
      return mapBlog(record, true);
    }

    const updated = await prisma.blog.update({
      where: { id: record.id },
      data: { views: { increment: 1 } }
    });

    return mapBlog(updated, true);
  } catch (error) {
    if (shouldUsePublicFallback(error)) return null;
    throw error;
  }
}

export async function createBlog(input: BlogCreateInput): Promise<BlogDto> {
  assertDatabase();

  const blog = await prisma.blog.create({ data: await normalizeCreateInput(input) });
  await normalizeFeatured(blog.id, blog.featured);

  const fresh = blog.featured ? await prisma.blog.findUniqueOrThrow({ where: { id: blog.id } }) : blog;
  return mapBlog(fresh, true);
}

export async function updateBlog(id: string, input: BlogUpdateInput): Promise<BlogDto> {
  assertDatabase();

  const blog = await prisma.blog.update({
    where: { id },
    data: await normalizeUpdateInput(id, input)
  });
  await normalizeFeatured(blog.id, blog.featured);

  const fresh = blog.featured ? await prisma.blog.findUniqueOrThrow({ where: { id: blog.id } }) : blog;
  return mapBlog(fresh, true);
}

export async function deleteBlog(id: string): Promise<void> {
  assertDatabase();
  await prisma.blog.delete({ where: { id } });
}
