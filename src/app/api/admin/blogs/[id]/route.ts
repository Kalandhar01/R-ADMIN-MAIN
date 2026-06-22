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
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200) || `post-${Date.now()}`;
}

async function audit(request: NextRequest, adminId: string, action: string, entityId: string, summary: string) {
  await prisma.auditLog.create({
    data: {
      adminId, action, entity: "Blog", entityId, summary,
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    }
  });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  const { id } = await params;
  try {
    const blogs = await prisma.blog.findMany({ where: { id }, take: 1 });
    const blog = blogs?.[0] || null;
    if (!blog) return NextResponse.json({ success: false, message: "Blog not found." }, { status: 404 });

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    console.error("[blog-get]", error);
    return NextResponse.json({ success: false, message: "Failed to fetch blog." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  const { id } = await params;
  try {
    const body = await request.json();
    const parsed = blogSchema.parse(body);

    const existing = await prisma.blog.findMany({ where: { id }, take: 1 });
    if (!existing?.[0]) return NextResponse.json({ success: false, message: "Blog not found." }, { status: 404 });

    const slug = parsed.slug?.trim() || slugify(parsed.title);
    const now = new Date();
    const wasPublished = parsed.status === "published" && existing[0].status !== "published";

    const blog = await prisma.blog.update({
      where: { id },
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
        publishedAt: wasPublished ? now : parsed.status === "published" ? existing[0].publishedAt || now : null,
        updatedAt: now,
      }
    });

    await audit(request, admin.id, "update", blog.id, `Updated blog: ${blog.title}.`);

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: "Validation failed.", issues: error.issues }, { status: 400 });
    }
    console.error("[blog-update]", error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Failed to update blog." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  const { id } = await params;
  try {
    const existing = await prisma.blog.findMany({ where: { id }, take: 1 });
    if (!existing?.[0]) return NextResponse.json({ success: false, message: "Blog not found." }, { status: 404 });

    await prisma.blog.delete({ where: { id } });
    await audit(request, admin.id, "delete", id, `Deleted blog: ${existing[0].title}.`);

    return NextResponse.json({ success: true, message: "Blog deleted." });
  } catch (error) {
    console.error("[blog-delete]", error);
    return NextResponse.json({ success: false, message: "Failed to delete blog." }, { status: 500 });
  }
}
