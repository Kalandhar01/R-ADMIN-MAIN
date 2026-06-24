import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminFromRequest } from "@/lib/admin/auth";
import { prisma as _prisma } from "@/lib/server/prisma";
import { deleteFromCloudinary, parsePublicIdFromUrl } from "@/lib/server/cloudinary";
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
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 200) || `work-${Date.now()}`;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  const { id } = await params;
  try {
    const works = await prisma.ourWork.findMany({ where: { id }, take: 1 });
    const work = works?.[0] || null;
    if (!work) return NextResponse.json({ success: false, message: "Work not found." }, { status: 404 });
    return NextResponse.json({ success: true, data: work });
  } catch (error) {
    console.error("[our-work-get]", error);
    return NextResponse.json({ success: false, message: "Failed to fetch work." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  const { id } = await params;
  try {
    const body = await request.json();
    const parsed = ourWorkSchema.parse(body);

    const existing = await prisma.ourWork.findMany({ where: { id }, take: 1 });
    if (!existing?.[0]) return NextResponse.json({ success: false, message: "Work not found." }, { status: 404 });

    const slug = parsed.slug?.trim() || slugify(parsed.title);

    const work = await prisma.ourWork.update({
      where: { id },
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

    return NextResponse.json({ success: true, data: work });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: "Validation failed.", issues: error.issues }, { status: 400 });
    }
    console.error("[our-work-update]", error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Failed to update work." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  const { id } = await params;
  try {
    const existing = await prisma.ourWork.findMany({ where: { id }, take: 1 });
    if (!existing?.[0]) return NextResponse.json({ success: false, message: "Work not found." }, { status: 404 });

    const work = existing[0];
    const publicIdsToDelete: string[] = [];

    if (work.coverImage) {
      const pid = parsePublicIdFromUrl(work.coverImage);
      if (pid) publicIdsToDelete.push(pid);
    }
    if (work.galleryImages?.length) {
      for (const url of work.galleryImages) {
        const pid = parsePublicIdFromUrl(url);
        if (pid) publicIdsToDelete.push(pid);
      }
    }

    await Promise.allSettled(publicIdsToDelete.map((pid) => deleteFromCloudinary(pid)));

    await prisma.ourWork.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Work deleted." });
  } catch (error) {
    console.error("[our-work-delete]", error);
    return NextResponse.json({ success: false, message: "Failed to delete work." }, { status: 500 });
  }
}
