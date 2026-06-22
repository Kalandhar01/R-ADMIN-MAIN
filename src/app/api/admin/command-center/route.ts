import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminFromRequest } from "@/lib/admin/auth";
import { getAdminCommandCenterData } from "@/lib/admin/data";
import { prisma as _prisma } from "@/lib/server/prisma";
const prisma = _prisma as any;

type InquiryStatus = "new" | "contacted" | "archived";
type ConsultationStatus = "new" | "reviewed" | "contacted" | "archived";
type CareerApplicationStatus = "new" | "reviewed" | "shortlisted" | "hired" | "rejected";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const optionalText = z.string().trim().optional().nullable();
const statusFilterSchema = z.enum(["New", "Read", "Responded", "Archived"]);
const divisionSchema = z.string().trim().min(1).max(80).optional().default("ractysh-group").transform(normalizeDivision);

const blogSchema = z.object({
  id: optionalText,
  division: divisionSchema,
  title: z.string().trim().min(1).max(180),
  slug: optionalText,
  excerpt: z.string().trim().min(1).max(600),
  content: z.string().trim().min(1),
  coverImage: z.string().trim().max(1000).optional().default(""),
  coverImageAlt: optionalText,
  author: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(120),
  tags: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  status: z.enum(["draft", "scheduled", "published", "archived"]).optional().default("draft"),
  publishedAt: optionalText,
  readTime: optionalText,
  seoTitle: optionalText,
  seoDescription: optionalText,
  canonicalUrl: optionalText
});

const serviceSchema = z.object({
  id: optionalText,
  division: divisionSchema,
  companyId: optionalText,
  title: z.string().trim().min(1).max(180),
  slug: optionalText,
  summary: z.string().trim().min(1).max(800),
  description: optionalText,
  category: z.string().trim().min(1).max(120),
  href: optionalText,
  imageUrl: optionalText,
  heroContent: z.unknown().optional(),
  metrics: z.unknown().optional(),
  images: z.array(z.string()).optional().default([]),
  sections: z.unknown().optional(),
  cta: z.unknown().optional(),
  seo: z.unknown().optional(),
  tags: z.array(z.string()).optional().default([]),
  status: z.enum(["draft", "published", "archived"]).optional().default("published"),
  position: z.number().int().optional().default(0)
});

const jobSchema = z.object({
  id: optionalText,
  division: divisionSchema,
  title: z.string().trim().min(1).max(180),
  slug: optionalText,
  location: z.string().trim().min(1).max(160),
  type: z.string().trim().min(1).max(120),
  summary: z.string().trim().min(1).max(700),
  description: optionalText,
  status: z.enum(["draft", "published", "archived"]).optional().default("published")
});

const newsletterSchema = z.object({
  id: optionalText,
  division: divisionSchema,
  title: z.string().trim().min(1).max(180),
  slug: optionalText,
  excerpt: z.string().trim().min(1).max(600),
  content: z.string().trim().min(1),
  coverImage: z.string().trim().max(1000).optional().default(""),
  category: z.string().trim().min(1).max(120),
  author: z.string().trim().min(1).max(120),
  featured: z.boolean().optional().default(false),
  status: z.enum(["draft", "scheduled", "published", "archived"]).optional().default("scheduled"),
  publishDate: optionalText,
  tags: z.array(z.string()).optional().default([]),
  readTime: optionalText
});

const mediaUrlSchema = z.object({
  division: divisionSchema,
  title: z.string().trim().min(1).max(180),
  altText: optionalText,
  kind: z.enum(["image", "video", "document", "model", "other"]).optional().default("image"),
  url: z.string().trim().min(1).max(1200),
  folder: z.string().trim().max(80).optional().default("Unassigned"),
  provider: z.string().trim().max(80).optional().default("metadata"),
  providerId: optionalText,
  mimeType: optionalText
});

const businessSchema = z.object({
  id: optionalText,
  slug: z.string().trim().min(1).max(80).transform(normalizeDivision),
  name: z.string().trim().min(1).max(160),
  legalName: optionalText,
  summary: z.string().trim().min(1).max(700),
  description: optionalText,
  website: optionalText,
  status: z.enum(["active", "inactive", "archived"]).optional().default("active"),
  position: z.number().int().optional().default(0)
});

const domainSchema = z.object({
  id: optionalText,
  domain: z.string().trim().min(1).max(255).transform(normalizeDomain),
  division: divisionSchema,
  companyId: optionalText,
  status: z.enum(["active", "inactive", "archived"]).optional().default("active"),
  primary: z.boolean().optional().default(false),
  notes: optionalText
});

function normalizeDivision(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\botc\b/g, "otc-exchange")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (slug === "group" || slug === "ractysh") return "ractysh-group";
  if (slug === "import-and-export" || slug === "export-import") return "import-export";
  if (slug === "otc") return "otc-exchange";
  return slug || "ractysh-group";
}

function normalizeDomain(value: string): string {
  const raw = value.trim().toLowerCase();
  const withProtocol = /^[a-z]+:\/\//.test(raw) ? raw : `https://${raw}`;

  try {
    return new URL(withProtocol).hostname.replace(/^www\./, "");
  } catch {
    return raw.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] || raw;
  }
}

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `record-${Date.now()}`;
}

function compactStrings(values: string[] | undefined): string[] {
  return [...new Set((values || []).map((value) => value.trim()).filter(Boolean))];
}

function folderSlug(value: string | null | undefined): string {
  const slug = (value || "Unassigned")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "unassigned";
}

function dateOrNull(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function readTimeFor(content: string, provided?: string | null): string {
  if (provided?.trim()) return provided.trim();
  const words = content.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

function auditContext(request: NextRequest) {
  return {
    ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || undefined,
    userAgent: request.headers.get("user-agent") || undefined
  };
}

async function audit(
  request: NextRequest,
  adminId: string,
  action: string,
  entity: string,
  entityId: string | null | undefined,
  summary: string,
  metadata?: Record<string, unknown>
) {
  const context = auditContext(request);

  await prisma.auditLog.create({
    data: {
      adminId,
      action,
      entity,
      entityId: entityId || undefined,
      summary,
      metadata: metadata ? (metadata as Record<string, unknown>) : undefined,
      ...context
    }
  });
}

async function responseWithData(admin: { id: string; email: string; name: string; roles: string[] }, division?: string) {
  return NextResponse.json({
    success: true,
    data: await getAdminCommandCenterData(admin, division)
  });
}

function divisionLabel(value: string): string {
  if (value === "ractysh-group") return "Ractysh Group";
  if (value === "otc-exchange") return "OTC Exchange";
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
    .replace("Import Export", "Import & Export");
}

async function ensureServiceCompany(companyId?: string | null, division = "ractysh-group"): Promise<string> {
  if (companyId) return companyId;

  const normalizedDivision = normalizeDivision(division);
  const existing = await prisma.companyDivision.findUnique({
    where: { slug: normalizedDivision },
    select: { id: true }
  });
  if (existing) return existing.id;

  const company = await prisma.companyDivision.create({
    data: {
      slug: normalizedDivision,
      name: divisionLabel(normalizedDivision),
      legalName: `${divisionLabel(normalizedDivision)} - Ractysh Enterprise`,
      summary: `${divisionLabel(normalizedDivision)} enterprise division.`,
      description: "Division created from the Ractysh enterprise command center.",
      position: 0
    }
  });

  return company.id;
}

function cloudinarySignature(params: Record<string, string>, apiSecret: string): string {
  const serialized = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1").update(`${serialized}${apiSecret}`).digest("hex");
}

async function uploadToCloudinary(file: File, folderName: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) return null;

  const timestamp = String(Math.floor(Date.now() / 1000));
  const folder = `ractysh-command-center/${folderSlug(folderName)}`;
  const signature = cloudinarySignature({ folder, timestamp }, apiSecret);
  const uploadForm = new FormData();

  uploadForm.append("file", file, file.name);
  uploadForm.append("folder", folder);
  uploadForm.append("timestamp", timestamp);
  uploadForm.append("api_key", apiKey);
  uploadForm.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: uploadForm
  });

  if (!response.ok) {
    throw new Error(await response.text().catch(() => "Cloudinary upload failed."));
  }

  return (await response.json()) as {
    secure_url: string;
    public_id: string;
    resource_type?: string;
    format?: string;
    bytes?: number;
    width?: number;
    height?: number;
  };
}

async function deleteFromCloudinary(providerId: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) return;

  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = cloudinarySignature({ public_id: providerId, timestamp }, apiSecret);
  const form = new FormData();

  form.append("public_id", providerId);
  form.append("timestamp", timestamp);
  form.append("api_key", apiKey);
  form.append("signature", signature);

  await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: "POST",
    body: form
  }).catch(() => undefined);
}

async function handleMultipart(request: NextRequest, admin: { id: string; email: string; name: string; roles: string[] }) {
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "");
  if (intent !== "media.upload") {
    return NextResponse.json({ success: false, message: "Unsupported multipart intent." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size <= 0) {
    return NextResponse.json({ success: false, message: "Select a file to upload." }, { status: 400 });
  }

  const folder = String(formData.get("folder") || "Unassigned");
  const division = normalizeDivision(String(formData.get("division") || folder || "ractysh-group"));
  const upload = await uploadToCloudinary(file, folder);
  if (!upload?.secure_url) {
    return NextResponse.json(
      { success: false, message: "Cloudinary is not configured for media uploads." },
      { status: 503 }
    );
  }

  const asset = await prisma.mediaAsset.create({
    data: {
      title: String(formData.get("title") || file.name),
      division,
      altText: String(formData.get("altText") || "") || null,
      kind: String(formData.get("kind") || "image") as "image",
      url: upload.secure_url,
      provider: "cloudinary",
      providerId: upload.public_id,
      mimeType: file.type || null,
      size: upload.bytes || file.size,
      width: upload.width || null,
      height: upload.height || null,
      metadata: { ...upload, folder } as Record<string, unknown>
    }
  });

  await audit(request, admin.id, "create", "MediaAsset", asset.id, `Uploaded media asset ${asset.title}.`);
  return responseWithData(admin);
}

export async function GET(request: NextRequest) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const division = searchParams.get("division") || undefined;

  return responseWithData(admin, division);
}

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      return handleMultipart(request, admin);
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const intent = String(body.intent || "");

    const writeIntents = new Set([
      "lead.updateStatus", "contact.update", "contact.delete",
      "blog.upsert", "blog.delete", "blog.status", "blog.feature",
      "newsletter.upsert", "subscriber.delete",
      "service.upsert", "service.delete", "service.status",
      "media.createUrl", "media.delete", "media.upload",
      "job.upsert", "job.delete", "application.update", "application.delete",
      "settings.update", "business.upsert", "domain.upsert", "domain.delete"
    ]);
    if (writeIntents.has(intent) && !admin.roles?.length) {
      return NextResponse.json({ success: false, message: "Forbidden: no role assigned." }, { status: 403 });
    }

    if (intent === "lead.updateStatus") {
      const parsed = z.object({ id: z.string(), kind: z.enum(["Contact", "Consultation", "Career"]), status: statusFilterSchema }).parse(body);
      if (parsed.kind === "Contact") {
        const rawStatus: InquiryStatus = parsed.status === "Archived" ? "archived" : parsed.status === "New" ? "new" : "contacted";
        await prisma.contactInquiry.update({ where: { id: parsed.id }, data: { status: rawStatus } });
      } else if (parsed.kind === "Consultation") {
        const rawStatus: ConsultationStatus =
          parsed.status === "Archived" ? "archived" : parsed.status === "Read" ? "reviewed" : parsed.status === "New" ? "new" : "contacted";
        await prisma.consultation.update({ where: { id: parsed.id }, data: { status: rawStatus } });
      } else {
        const rawStatus: CareerApplicationStatus =
          parsed.status === "Read" ? "reviewed" : parsed.status === "Responded" ? "shortlisted" : parsed.status === "Archived" ? "rejected" : "new";
        await prisma.careerApplication.update({ where: { id: parsed.id }, data: { status: rawStatus } });
      }

      await audit(request, admin.id, "update", parsed.kind, parsed.id, `Updated ${parsed.kind} lead status to ${parsed.status}.`);
      return responseWithData(admin);
    }

    if (intent === "contact.update") {
      const parsed = z.object({ id: z.string(), status: z.string(), notes: optionalText }).parse(body);
      await prisma.contactInquiry.update({
        where: { id: parsed.id },
        data: { status: parsed.status as "new", notes: parsed.notes || null }
      });
      await audit(request, admin.id, "update", "ContactInquiry", parsed.id, "Updated contact submission.");
      return responseWithData(admin);
    }

    if (intent === "contact.delete") {
      const parsed = z.object({ id: z.string() }).parse(body);
      await prisma.contactInquiry.delete({ where: { id: parsed.id } });
      await audit(request, admin.id, "delete", "ContactInquiry", parsed.id, "Deleted contact submission.");
      return responseWithData(admin);
    }

    if (intent === "blog.upsert") {
      const parsed = blogSchema.parse(body);
      const data = {
        division: parsed.division,
        title: parsed.title,
        slug: parsed.slug?.trim() || slugify(parsed.title),
        excerpt: parsed.excerpt,
        content: parsed.content,
        coverImage: parsed.coverImage,
        coverImageAlt: parsed.coverImageAlt || null,
        author: parsed.author,
        category: parsed.category,
        tags: compactStrings(parsed.tags),
        featured: parsed.featured,
        status: parsed.status,
        publishedAt: parsed.status === "published" ? dateOrNull(parsed.publishedAt) || new Date() : dateOrNull(parsed.publishedAt),
        readTime: readTimeFor(parsed.content, parsed.readTime),
        seoTitle: parsed.seoTitle || null,
        seoDescription: parsed.seoDescription || null,
        canonicalUrl: parsed.canonicalUrl || null
      };
      const blog = parsed.id
        ? await prisma.blog.update({ where: { id: parsed.id }, data })
        : await prisma.blog.create({ data });

      await audit(request, admin.id, parsed.id ? "update" : "create", "Blog", blog.id, `${parsed.id ? "Updated" : "Created"} blog ${blog.title}.`);
      return responseWithData(admin);
    }

    if (intent === "blog.delete") {
      const parsed = z.object({ id: z.string() }).parse(body);
      await prisma.blog.delete({ where: { id: parsed.id } });
      await audit(request, admin.id, "delete", "Blog", parsed.id, "Deleted blog post.");
      return responseWithData(admin);
    }

    if (intent === "blog.status") {
      const parsed = z.object({ id: z.string(), status: z.enum(["draft", "scheduled", "published", "archived"]) }).parse(body);
      await prisma.blog.update({
        where: { id: parsed.id },
        data: { status: parsed.status, publishedAt: parsed.status === "published" ? new Date() : null }
      });
      await audit(request, admin.id, parsed.status === "published" ? "publish" : "update", "Blog", parsed.id, `Changed blog status to ${parsed.status}.`);
      return responseWithData(admin);
    }

    if (intent === "blog.feature") {
      const parsed = z.object({ id: z.string(), featured: z.boolean() }).parse(body);
      await prisma.blog.update({ where: { id: parsed.id }, data: { featured: parsed.featured } });
      await audit(request, admin.id, "update", "Blog", parsed.id, parsed.featured ? "Featured blog post." : "Removed blog feature flag.");
      return responseWithData(admin);
    }

    if (intent === "newsletter.upsert") {
      const parsed = newsletterSchema.parse(body);
      const data = {
        division: parsed.division,
        title: parsed.title,
        slug: parsed.slug?.trim() || slugify(parsed.title),
        excerpt: parsed.excerpt,
        content: parsed.content,
        coverImage: parsed.coverImage,
        category: parsed.category,
        author: parsed.author,
        featured: parsed.featured,
        status: parsed.status,
        publishDate: dateOrNull(parsed.publishDate),
        tags: compactStrings(parsed.tags),
        readTime: readTimeFor(parsed.content, parsed.readTime)
      };
      const newsletter = parsed.id
        ? await prisma.newsletter.update({ where: { id: parsed.id }, data })
        : await prisma.newsletter.create({ data });

      await audit(request, admin.id, parsed.id ? "update" : "create", "Newsletter", newsletter.id, `${parsed.id ? "Updated" : "Scheduled"} newsletter ${newsletter.title}.`);
      return responseWithData(admin);
    }

    if (intent === "subscriber.delete") {
      const parsed = z.object({ id: z.string(), table: z.enum(["NewsletterSubscriber", "Subscriber"]) }).parse(body);
      if (parsed.table === "NewsletterSubscriber") {
        await prisma.newsletterSubscriber.delete({ where: { id: parsed.id } });
      } else {
        await prisma.subscriber.delete({ where: { id: parsed.id } });
      }
      await audit(request, admin.id, "delete", parsed.table, parsed.id, "Deleted newsletter subscriber.");
      return responseWithData(admin);
    }

    if (intent === "service.upsert") {
      const parsed = serviceSchema.parse(body);
      const companyId = await ensureServiceCompany(parsed.companyId, parsed.division);
      const data = {
        companyId,
        division: parsed.division,
        title: parsed.title,
        slug: parsed.slug?.trim() || slugify(parsed.title),
        summary: parsed.summary,
        description: parsed.description || null,
        category: parsed.category,
        href: parsed.href || null,
        imageUrl: parsed.imageUrl || null,
        heroContent: (parsed.heroContent || {}) as object,
        metrics: (parsed.metrics || []) as object,
        images: compactStrings(parsed.images),
        sections: (parsed.sections || []) as object,
        cta: (parsed.cta || {}) as object,
        seo: (parsed.seo || {}) as object,
        tags: compactStrings(parsed.tags),
        status: parsed.status,
        position: parsed.position
      };
      const service = parsed.id
        ? await prisma.serviceOffer.update({ where: { id: parsed.id }, data })
        : await prisma.serviceOffer.create({ data });

      await audit(request, admin.id, parsed.id ? "update" : "create", "ServiceOffer", service.id, `${parsed.id ? "Updated" : "Created"} service ${service.title}.`);
      return responseWithData(admin);
    }

    if (intent === "service.delete") {
      const parsed = z.object({ id: z.string() }).parse(body);
      await prisma.serviceOffer.delete({ where: { id: parsed.id } });
      await audit(request, admin.id, "delete", "ServiceOffer", parsed.id, "Deleted service.");
      return responseWithData(admin);
    }

    if (intent === "service.status") {
      const parsed = z.object({ id: z.string(), status: z.enum(["draft", "published", "archived"]) }).parse(body);
      await prisma.serviceOffer.update({ where: { id: parsed.id }, data: { status: parsed.status } });
      await audit(request, admin.id, parsed.status === "published" ? "publish" : "update", "ServiceOffer", parsed.id, `Changed service status to ${parsed.status}.`);
      return responseWithData(admin);
    }

    if (intent === "media.createUrl") {
      const parsed = mediaUrlSchema.parse(body);
      const { folder, ...assetInput } = parsed;
      const asset = await prisma.mediaAsset.create({
        data: {
          ...assetInput,
          metadata: { folder } as Record<string, unknown>
        }
      });
      await audit(request, admin.id, "create", "MediaAsset", asset.id, `Added media asset ${asset.title}.`);
      return responseWithData(admin);
    }

    if (intent === "media.delete") {
      const parsed = z.object({ id: z.string() }).parse(body);
      const asset = await prisma.mediaAsset.findUnique({ where: { id: parsed.id } });
      if (asset?.provider === "cloudinary" && asset.providerId) {
        await deleteFromCloudinary(asset.providerId);
      }
      await prisma.mediaAsset.delete({ where: { id: parsed.id } });
      await audit(request, admin.id, "delete", "MediaAsset", parsed.id, "Deleted media asset.");
      return responseWithData(admin);
    }

    if (intent === "job.upsert") {
      const parsed = jobSchema.parse(body);
      const data = {
        division: parsed.division,
        title: parsed.title,
        slug: parsed.slug?.trim() || slugify(parsed.title),
        location: parsed.location,
        type: parsed.type,
        summary: parsed.summary,
        description: parsed.description || null,
        status: parsed.status
      };
      const job = parsed.id
        ? await prisma.careerJob.update({ where: { id: parsed.id }, data })
        : await prisma.careerJob.create({ data });

      await audit(request, admin.id, parsed.id ? "update" : "create", "CareerJob", job.id, `${parsed.id ? "Updated" : "Created"} job ${job.title}.`);
      return responseWithData(admin);
    }

    if (intent === "job.delete") {
      const parsed = z.object({ id: z.string() }).parse(body);
      await prisma.careerJob.delete({ where: { id: parsed.id } });
      await audit(request, admin.id, "delete", "CareerJob", parsed.id, "Deleted career job.");
      return responseWithData(admin);
    }

    if (intent === "application.update") {
      const parsed = z.object({
        id: z.string(),
        status: z.enum(["new", "reviewed", "shortlisted", "hired", "rejected"]),
        notes: optionalText
      }).parse(body);
      await prisma.careerApplication.update({
        where: { id: parsed.id },
        data: { status: parsed.status, notes: parsed.notes || null }
      });
      await audit(request, admin.id, "update", "CareerApplication", parsed.id, `Updated application status to ${parsed.status}.`);
      return responseWithData(admin);
    }

    if (intent === "application.delete") {
      const parsed = z.object({ id: z.string() }).parse(body);
      await prisma.careerApplication.delete({ where: { id: parsed.id } });
      await audit(request, admin.id, "delete", "CareerApplication", parsed.id, "Deleted career application.");
      return responseWithData(admin);
    }

    if (intent === "settings.update") {
      const parsed = z.object({
        id: optionalText,
        division: divisionSchema,
        key: z.string().trim().min(1).max(120),
        label: z.string().trim().min(1).max(160),
        scope: z.string().trim().max(80).optional().default("global"),
        value: z.unknown()
      }).parse(body);
      const setting = await prisma.settings.upsert({
        where: { key: parsed.key },
        update: {
          label: parsed.label,
          scope: parsed.scope,
          division: parsed.division,
          value: parsed.value as object,
          updatedById: admin.id
        },
        create: {
          key: parsed.key,
          label: parsed.label,
          scope: parsed.scope,
          division: parsed.division,
          value: parsed.value as object,
          updatedById: admin.id
        }
      });
      await audit(request, admin.id, "update", "Settings", setting.id, `Updated settings ${setting.label}.`);
      return responseWithData(admin);
    }

    if (intent === "business.upsert") {
      const parsed = businessSchema.parse(body);
      const legalName = parsed.legalName || `${parsed.name} - Ractysh Enterprise`;
      const business = parsed.id && !parsed.id.startsWith("default:")
        ? await prisma.companyDivision.update({
            where: { id: parsed.id },
            data: {
              slug: parsed.slug,
              name: parsed.name,
              legalName,
              summary: parsed.summary,
              description: parsed.description || null,
              website: parsed.website || null,
              status: parsed.status,
              position: parsed.position
            }
          })
        : await prisma.companyDivision.upsert({
            where: { slug: parsed.slug },
            update: {
              name: parsed.name,
              legalName,
              summary: parsed.summary,
              description: parsed.description || null,
              website: parsed.website || null,
              status: parsed.status,
              position: parsed.position
            },
            create: {
              slug: parsed.slug,
              name: parsed.name,
              legalName,
              summary: parsed.summary,
              description: parsed.description || null,
              website: parsed.website || null,
              status: parsed.status,
              position: parsed.position
            }
          });

      await audit(request, admin.id, parsed.id ? "update" : "create", "CompanyDivision", business.id, `Saved business ${business.name}.`);
      return responseWithData(admin);
    }

    if (intent === "domain.upsert") {
      const parsed = domainSchema.parse(body);
      const companyId = parsed.companyId || (await ensureServiceCompany(null, parsed.division));

      if (parsed.primary) {
        await prisma.domainMapping.updateMany({
          where: { division: parsed.division, ...(parsed.id ? { id: { not: parsed.id } } : {}) },
          data: { primary: false }
        });
      }

      const domain = parsed.id
        ? await prisma.domainMapping.update({
            where: { id: parsed.id },
            data: {
              domain: parsed.domain,
              division: parsed.division,
              companyId,
              status: parsed.status,
              primary: parsed.primary,
              notes: parsed.notes || null
            }
          })
        : await prisma.domainMapping.create({
            data: {
              domain: parsed.domain,
              division: parsed.division,
              companyId,
              status: parsed.status,
              primary: parsed.primary,
              notes: parsed.notes || null
            }
          });

      await audit(request, admin.id, parsed.id ? "update" : "create", "DomainMapping", domain.id, `Saved domain ${domain.domain}.`);
      return responseWithData(admin);
    }

    if (intent === "domain.delete") {
      const parsed = z.object({ id: z.string() }).parse(body);
      await prisma.domainMapping.delete({ where: { id: parsed.id } });
      await audit(request, admin.id, "delete", "DomainMapping", parsed.id, "Deleted domain mapping.");
      return responseWithData(admin);
    }

    if (intent === "notification.markRead") {
      const parsed = z.object({ id: z.string() }).parse(body);
      await prisma.notification.updateMany({
        where: { id: parsed.id, adminId: admin.id },
        data: { status: "read", readAt: new Date() }
      });
      return responseWithData(admin);
    }

    if (intent === "notification.markUnread") {
      const parsed = z.object({ id: z.string() }).parse(body);
      await prisma.notification.updateMany({
        where: { id: parsed.id, adminId: admin.id },
        data: { status: "unread", readAt: null }
      });
      return responseWithData(admin);
    }

    if (intent === "notification.archive") {
      const parsed = z.object({ id: z.string() }).parse(body);
      await prisma.notification.updateMany({
        where: { id: parsed.id, adminId: admin.id },
        data: { status: "archived", archivedAt: new Date() }
      });
      return responseWithData(admin);
    }

    if (intent === "notification.delete") {
      const parsed = z.object({ id: z.string() }).parse(body);
      const m = (await import("@/lib/server/prisma")).prisma;
      await prisma.notification.updateMany({
        where: { id: parsed.id, adminId: admin.id },
        data: { status: "archived", archivedAt: new Date() }
      });
      return responseWithData(admin);
    }

    if (intent === "notification.markAllRead") {
      await prisma.notification.updateMany({
        where: { adminId: admin.id, status: "unread" },
        data: { status: "read", readAt: new Date() }
      });
      await audit(request, admin.id, "update", "Notification", null, "Marked all notifications as read.");
      return responseWithData(admin);
    }

    if (intent === "audit.export") {
      const parsed = z.object({ entity: z.string().trim().min(1).max(120), summary: z.string().trim().min(1).max(240) }).parse(body);
      await audit(request, admin.id, "export", parsed.entity, null, parsed.summary);
      return responseWithData(admin);
    }

    return NextResponse.json({ success: false, message: "Unknown admin intent." }, { status: 400 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation failed.", issues: error.issues },
        { status: 400 }
      );
    }

    console.error("[admin-command-center]", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Admin command failed." },
      { status: 500 }
    );
  }
}
