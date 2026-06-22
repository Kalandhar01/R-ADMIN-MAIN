import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminFromRequest } from "@/lib/admin/auth";
import { prisma as _prisma } from "@/lib/server/prisma";
const prisma = _prisma as any;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const blogSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(180),
  slug: z.string().trim().optional(),
  excerpt: z.string().trim().min(1, "Excerpt is required.").max(600),
  content: z.string().trim().min(1, "Content is required."),
  featuredImage: z.string().trim().max(1000).optional().default(""),
  category: z.string().trim().min(1, "Category is required.").max(120),
  tags: z.array(z.string()).optional().default([]),
  author: z.string().trim().min(1, "Author is required.").max(120),
  seoTitle: z.string().trim().optional().default(""),
  seoDescription: z.string().trim().optional().default(""),
  status: z.enum(["draft", "published", "archived"]).optional().default("draft"),
});

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200) || `post-${Date.now()}`;
}

async function audit(request: NextRequest, adminId: string, action: string, entityId: string, summary: string) {
  await prisma.auditLog.create({
    data: {
      adminId,
      action,
      entity: "Blog",
      entityId,
      summary,
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    }
  });
}

export async function GET(request: NextRequest) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "all";
  const search = searchParams.get("search") || "";

  const where: Record<string, unknown> = {};
  if (filter !== "all") where.status = filter;
  if (search) {
    where.$or = [
      { title: { $regex: search, $options: "i" } },
      { excerpt: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  try {
    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({ where, orderBy: { createdAt: "desc" }, take: 80 }),
      prisma.blog.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: { total }
    });
  } catch (error) {
    console.error("[blogs-list]", error);
    return NextResponse.json({ success: false, message: "Failed to fetch blogs." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = blogSchema.parse(body);

    const slug = parsed.slug?.trim() || slugify(parsed.title);
    const now = new Date();

    const blog = await prisma.blog.create({
      data: {
        title: parsed.title,
        slug,
        excerpt: parsed.excerpt,
        content: parsed.content,
        coverImage: parsed.featuredImage || "",
        category: parsed.category,
        tags: parsed.tags,
        author: parsed.author,
        seoTitle: parsed.seoTitle || null,
        seoDescription: parsed.seoDescription || null,
        status: parsed.status,
        views: 0,
        publishedAt: parsed.status === "published" ? now : null,
        createdAt: now,
        updatedAt: now,
      }
    });

    await audit(request, admin.id, "create", blog.id, `Created blog: ${blog.title}.`);

    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: "Validation failed.", issues: error.issues }, { status: 400 });
    }
    console.error("[blog-create]", error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Failed to create blog." }, { status: 500 });
  }
}
