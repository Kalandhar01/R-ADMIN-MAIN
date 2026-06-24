import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminFromRequest } from "@/lib/admin/auth";
import { prisma as _prisma } from "@/lib/server/prisma";
const prisma = _prisma as any;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_STATUSES = ["new", "contacted", "completed", "archived"] as const;

export async function GET(request: NextRequest) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));
  const status = searchParams.get("status") || "";
  const search = searchParams.get("search") || "";
  const source = searchParams.get("source") || "";
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") || "desc";

  const where: Record<string, unknown> = {};
  if (status && VALID_STATUSES.includes(status as any)) where.status = status;
  if (source) where.source = source;
  if (search) {
    where.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
      { message: { $regex: search, $options: "i" } },
    ];
  }

  try {
    const [leads, total] = await Promise.all([
      prisma.contactInquiry.findMany({
        where,
        orderBy: { [sort]: order },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.contactInquiry.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: leads,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[leads-list]", error);
    return NextResponse.json({ success: false, message: "Failed to fetch leads." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ success: false, message: "id and status are required." }, { status: 400 });
    }
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status." }, { status: 400 });
    }

    const lead = await prisma.contactInquiry.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    });

    return NextResponse.json({ success: true, data: lead });
  } catch (error) {
    console.error("[leads-update]", error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Failed to update lead." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ success: false, message: "id is required." }, { status: 400 });
    }

    await prisma.contactInquiry.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Lead deleted." });
  } catch (error) {
    console.error("[leads-delete]", error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Failed to delete lead." }, { status: 500 });
  }
}
