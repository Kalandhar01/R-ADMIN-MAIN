import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminFromRequest } from "@/lib/admin/auth";
import { prisma as _prisma } from "@/lib/server/prisma";
const prisma = _prisma as any;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const entityType = searchParams.get("entityType");
  const entityId = searchParams.get("entityId");

  if (!entityType || !entityId) {
    return NextResponse.json({ success: false, message: "entityType and entityId are required." }, { status: 400 });
  }

  const modelMap: Record<string, string> = {
    ContactInquiry: "contactInquiry",
    Consultation: "consultation",
    CareerApplication: "careerApplication",
    NewsletterSubscriber: "newsletterSubscriber",
    Subscriber: "subscriber",
    DemoInquiry: "demoInquiry",
    Blog: "blog",
    ServiceOffer: "serviceOffer",
  };

  const modelKey = modelMap[entityType];
  if (!modelKey) {
    return NextResponse.json({ success: false, message: `Unknown entity type: ${entityType}` }, { status: 400 });
  }

  try {
    const docs = await prisma[modelKey].findMany({ where: { id: entityId }, take: 1 });
    const doc = docs?.[0] || null;

    if (!doc) {
      return NextResponse.json({ success: false, message: "Entity not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: doc });
  } catch (error) {
    console.error("[entity-detail]", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to fetch entity details." },
      { status: 500 }
    );
  }
}
