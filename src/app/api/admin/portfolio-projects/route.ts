import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminFromRequest } from "@/lib/admin/auth";
import { prisma as _prisma } from "@/lib/server/prisma";
const prisma = _prisma as any;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DIVISIONS = ["Architecture", "Construction", "Real Estate", "OTC", "Import Export"] as const;
const STATUSES = ["Completed", "Ongoing", "Upcoming"] as const;

const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  slug: z.string().trim().optional(),
  division: z.enum(DIVISIONS, { message: "Invalid division." }),
  shortDescription: z.string().trim().optional().default(""),
  description: z.string().trim().optional().default(""),
  location: z.string().trim().optional().default(""),
  status: z.enum(STATUSES).optional().default("Ongoing"),
  coverImage: z.string().trim().optional().default(""),
  galleryImages: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(true),
  displayOrder: z.number().int().optional().default(0),
});

function slugify(value: string): string {
  return value
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200) || `project-${Date.now()}`;
}

const SORT_OPTIONS = ["newest", "oldest", "order"] as const;

export async function GET(request: NextRequest) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const division = searchParams.get("division") || "";
  const status = searchParams.get("status") || "";
  const featured = searchParams.get("featured") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "newest";

  const where: Record<string, unknown> = {};
  if (division && DIVISIONS.includes(division as any)) where.division = division;
  if (status && STATUSES.includes(status as any)) where.status = status;
  if (featured === "true") where.featured = true;
  if (featured === "false") where.featured = false;
  if (search) where.title = { $regex: search, $options: "i" };

  let orderBy: Record<string, string>[];
  if (sort === "oldest") orderBy = [{ createdAt: "asc" }];
  else if (sort === "order") orderBy = [{ displayOrder: "asc" }, { createdAt: "desc" }];
  else orderBy = [{ createdAt: "desc" }];

  try {
    const [projects, total] = await Promise.all([
      prisma.portfolioProject.findMany({ where, orderBy, take: limit, skip: (page - 1) * limit }),
      prisma.portfolioProject.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: projects,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[portfolio-projects-list]", error);
    return NextResponse.json({ success: false, message: "Failed to fetch projects." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = projectSchema.parse(body);

    const slug = parsed.slug?.trim() || slugify(parsed.title);

    const existing = await prisma.portfolioProject.findMany({ where: { slug }, take: 1 });
    if (existing?.length) {
      return NextResponse.json({ success: false, message: "A project with this slug already exists." }, { status: 409 });
    }

    const project = await prisma.portfolioProject.create({
      data: {
        title: parsed.title,
        slug,
        division: parsed.division,
        shortDescription: parsed.shortDescription,
        description: parsed.description,
        location: parsed.location,
        status: parsed.status,
        coverImage: parsed.coverImage,
        galleryImages: parsed.galleryImages,
        featured: parsed.featured,
        published: parsed.published,
        displayOrder: parsed.displayOrder,
      }
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: "Validation failed.", issues: error.issues }, { status: 400 });
    }
    console.error("[portfolio-project-create]", error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Failed to create project." }, { status: 500 });
  }
}
