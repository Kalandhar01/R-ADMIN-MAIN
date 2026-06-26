import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminFromRequest } from "@/lib/admin/auth";
import { prisma as _prisma } from "@/lib/server/prisma";
import { deleteFromCloudinary, parsePublicIdFromUrl } from "@/lib/server/cloudinary";
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
  displayOrder: z.number().int().optional().default(0),
});

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 200) || `project-${Date.now()}`;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  const { id } = await params;
  try {
    const projects = await prisma.portfolioProject.findMany({ where: { id }, take: 1 });
    const project = projects?.[0] || null;
    if (!project) {
      console.error("[portfolio-project-get] Not found for id:", id);
      return NextResponse.json({ success: false, message: "Project not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error("[portfolio-project-get]", error);
    return NextResponse.json({ success: false, message: "Failed to fetch project." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  const { id } = await params;
  try {
    const body = await request.json();

    if (body._action === "duplicate") {
      const originals = await prisma.portfolioProject.findMany({ where: { id }, take: 1 });
      const original = originals?.[0];
      if (!original) return NextResponse.json({ success: false, message: "Original project not found." }, { status: 404 });

      const dupSlug = `${original.slug}-copy-${Date.now()}`;
      const dup = await prisma.portfolioProject.create({
        data: {
          title: `${original.title} (Copy)`,
          slug: dupSlug,
          division: original.division,
          shortDescription: original.shortDescription || "",
          description: original.description || "",
          location: original.location || "",
          status: original.status || "Ongoing",
          coverImage: original.coverImage || "",
          galleryImages: original.galleryImages || [],
          featured: false,
          displayOrder: 0,
        }
      });

      return NextResponse.json({ success: true, data: dup });
    }

    if (body._action === "toggleFeatured") {
      const projects = await prisma.portfolioProject.findMany({ where: { id }, take: 1 });
      const project = projects?.[0];
      if (!project) return NextResponse.json({ success: false, message: "Project not found." }, { status: 404 });

      const updated = await prisma.portfolioProject.update({
        where: { id },
        data: { featured: !project.featured }
      });
      return NextResponse.json({ success: true, data: updated });
    }

    const parsed = projectSchema.partial().parse(body);

    const updateData: Record<string, unknown> = {};
    if (parsed.title !== undefined) updateData.title = parsed.title;
    if (parsed.slug !== undefined) updateData.slug = parsed.slug;
    if (parsed.division !== undefined) updateData.division = parsed.division;
    if (parsed.shortDescription !== undefined) updateData.shortDescription = parsed.shortDescription;
    if (parsed.description !== undefined) updateData.description = parsed.description;
    if (parsed.location !== undefined) updateData.location = parsed.location;
    if (parsed.status !== undefined) updateData.status = parsed.status;
    if (parsed.coverImage !== undefined) updateData.coverImage = parsed.coverImage;
    if (parsed.galleryImages !== undefined) updateData.galleryImages = parsed.galleryImages;
    if (parsed.featured !== undefined) updateData.featured = parsed.featured;
    if (parsed.displayOrder !== undefined) updateData.displayOrder = parsed.displayOrder;

    const updated = await prisma.portfolioProject.update({ where: { id }, data: updateData });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: "Validation failed.", issues: error.issues }, { status: 400 });
    }
    console.error("[portfolio-project-update]", error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Failed to update project." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  const { id } = await params;
  try {
    const projects = await prisma.portfolioProject.findMany({ where: { id }, take: 1 });
    const project = projects?.[0];
    if (!project) return NextResponse.json({ success: false, message: "Project not found." }, { status: 404 });

    const imagesToDelete: string[] = [];
    if (project.coverImage) imagesToDelete.push(project.coverImage);
    if (project.galleryImages?.length) imagesToDelete.push(...project.galleryImages);

    for (const url of imagesToDelete) {
      const publicId = parsePublicIdFromUrl(url);
      if (publicId) {
        deleteFromCloudinary(publicId).catch(() => {});
      }
    }

    await prisma.portfolioProject.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Project deleted successfully." });
  } catch (error) {
    console.error("[portfolio-project-delete]", error);
    return NextResponse.json({ success: false, message: "Failed to delete project." }, { status: 500 });
  }
}
