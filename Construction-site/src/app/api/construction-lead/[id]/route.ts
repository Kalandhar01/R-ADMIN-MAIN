import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadStatusUpdateSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const lead = await prisma.constructionLead.findUnique({
      where: { id },
      include: {
        statusHistory: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(lead);
  } catch (err) {
    console.error("Failed to fetch lead:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const parsed = leadStatusUpdateSchema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return NextResponse.json({ error: "Validation failed", errors }, { status: 422 });
  }

  const { status, note } = parsed.data;

  try {
    const existing = await prisma.constructionLead.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 },
      );
    }

    const [lead] = await Promise.all([
      prisma.constructionLead.update({
        where: { id },
        data: {
          status,
          notes: note ? `${note}\n\n---\n${existing.notes ?? ""}`.trim() : undefined,
          statusHistory: {
            create: {
              fromStatus: existing.status,
              toStatus: status,
              note: note || null,
              changedBy: "admin",
            },
          },
        },
        include: {
          statusHistory: { orderBy: { createdAt: "desc" } },
        },
      }),
    ]);

    return NextResponse.json(lead);
  } catch (err) {
    console.error("Failed to update lead:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
