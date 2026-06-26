import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminFromRequest } from "@/lib/admin/auth";
import { prisma as _prisma } from "@/lib/server/prisma";
const prisma = _prisma as any;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  try {
    const CATEGORIES = ["architecture", "construction", "real-estate", "import-export", "otc"];

    const [
      total, featured, completed, architecture,
      construction, realEstate, otc, importExport
    ] = await Promise.all([
      prisma.ourWork.count({}),
      prisma.ourWork.count({ where: { featured: true } }),
      prisma.ourWork.count({ where: { status: "Completed" } }),
      prisma.ourWork.count({ where: { category: "architecture" } }),
      prisma.ourWork.count({ where: { category: "construction" } }),
      prisma.ourWork.count({ where: { category: "real-estate" } }),
      prisma.ourWork.count({ where: { category: "otc" } }),
      prisma.ourWork.count({ where: { category: "import-export" } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        total,
        featured,
        completed,
        architecture,
        construction,
        "real-estate": realEstate,
        otc,
        "import-export": importExport,
      }
    });
  } catch (error) {
    console.error("[our-works-stats]", error);
    return NextResponse.json({ success: false, message: "Failed to fetch stats." }, { status: 500 });
  }
}
