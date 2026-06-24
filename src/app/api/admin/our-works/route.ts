import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminFromRequest } from "@/lib/admin/auth";
import { prisma as _prisma } from "@/lib/server/prisma";
const prisma = _prisma as any;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CATEGORIES = ["architecture", "construction", "real-estate", "import-export", "otc"] as const;
const STATUSES = ["Completed", "Ongoing", "Upcoming"] as const;

const ourWorkSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  slug: z.string().trim().optional(),
  category: z.enum(CATEGORIES, { message: "Invalid category." }),
  description: z.string().trim().optional().default(""),
  location: z.string().trim().optional().default(""),
  status: z.enum(STATUSES).optional().default("Ongoing"),
  coverImage: z.string().trim().optional().default(""),
  galleryImages: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  order: z.number().int().optional().default(0),
});

function slugify(value: string): string {
  return value
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200) || `work-${Date.now()}`;
}

export async function GET(request: NextRequest) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const category = searchParams.get("category") || "";
  const status = searchParams.get("status") || "";
  const featured = searchParams.get("featured") || "";
  const search = searchParams.get("search") || "";

  const where: Record<string, unknown> = {};
  if (category && CATEGORIES.includes(category as any)) where.category = category;
  if (status && STATUSES.includes(status as any)) where.status = status;
  if (featured === "true") where.featured = true;
  if (search) where.title = { $regex: search, $options: "i" };

  try {
    const [works, total] = await Promise.all([
      prisma.ourWork.findMany({
        where,
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.ourWork.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: works,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[our-works-list]", error);
    return NextResponse.json({ success: false, message: "Failed to fetch works." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = ourWorkSchema.parse(body);

    const slug = parsed.slug?.trim() || slugify(parsed.title);

    const existing = await prisma.ourWork.findMany({ where: { slug }, take: 1 });
    if (existing?.length) {
      return NextResponse.json({ success: false, message: "A work with this slug already exists." }, { status: 409 });
    }

    const work = await prisma.ourWork.create({
      data: {
        title: parsed.title,
        slug,
        category: parsed.category,
        description: parsed.description,
        location: parsed.location,
        status: parsed.status,
        coverImage: parsed.coverImage,
        galleryImages: parsed.galleryImages,
        featured: parsed.featured,
        order: parsed.order,
      }
    });

    return NextResponse.json({ success: true, data: work }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: "Validation failed.", issues: error.issues }, { status: 400 });
    }
    console.error("[our-work-create]", error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Failed to create work." }, { status: 500 });
  }
}
