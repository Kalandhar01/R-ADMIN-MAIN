import { after, NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendConsultationEmails } from "@/lib/consultation-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(value: unknown, limit = 1000) {
  return typeof value === "string" ? value.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, limit) : "";
}

function emailOk(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function requestHeader(request: NextRequest, names: string[]) {
  for (const name of names) {
    const value = request.headers.get(name);
    if (value) return clean(value, 240);
  }

  return "";
}

function decodedHeader(request: NextRequest, names: string[]) {
  const value = requestHeader(request, names);

  if (!value) return "";

  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value;
  }
}

function ipAddress(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  return clean(
    request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-real-ip") ||
      request.headers.get("x-client-ip") ||
      forwardedFor ||
      "",
    120
  );
}

function browserName(userAgent: string) {
  if (/Edg\//.test(userAgent)) return "Microsoft Edge";
  if (/OPR\//.test(userAgent)) return "Opera";
  if (/Chrome\//.test(userAgent) && !/Chromium\//.test(userAgent)) return "Google Chrome";
  if (/Safari\//.test(userAgent) && /Version\//.test(userAgent)) return "Safari";
  if (/Firefox\//.test(userAgent)) return "Firefox";
  if (/MSIE|Trident/.test(userAgent)) return "Internet Explorer";
  return userAgent ? "Unknown browser" : "";
}

function deviceName(userAgent: string) {
  if (/iPad|Tablet|PlayBook|Silk/i.test(userAgent)) return "Tablet";
  if (/Mobi|Android|iPhone|iPod|BlackBerry|IEMobile/i.test(userAgent)) return "Mobile";
  return userAgent ? "Desktop" : "";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = clean(body.name, 160);
    const email = clean(body.email, 180).toLowerCase();
    const phone = clean(body.phone, 80);
    const propertyIdInput = clean(body.propertyId, 120);
    const propertySlug = clean(body.propertySlug, 160);
    const interestType = clean(body.interestType, 80) || "consultation";
    const budget = clean(body.budget, 120);
    const message = clean(body.message, 2000);
    const referer = clean(request.headers.get("referer"), 600);
    const sourcePage = clean(body.sourcePage, 600) || referer || undefined;

    if (!name || !emailOk(email)) {
      return NextResponse.json({ success: false, message: "Please share your name and a valid email." }, { status: 400 });
    }

    const property = propertyIdInput
      ? await prisma.property.findUnique({ where: { id: propertyIdInput }, select: { id: true, title: true, propertyType: true } })
      : propertySlug
        ? await prisma.property.findUnique({ where: { slug: propertySlug }, select: { id: true, title: true, propertyType: true } })
        : null;

    const lead = await prisma.propertyLead.create({
      data: {
        propertyId: property?.id || null,
        name,
        email,
        phone: phone || null,
        interestType,
        budget: budget || null,
        message: message || null,
        sourcePage,
        metadata: {
          propertySlug: propertySlug || null,
          propertyTitle: property?.title || clean(body.propertyTitle, 180) || null,
          channel: "real-estate-standalone-site"
        }
      },
      select: { id: true, createdAt: true }
    });

    after(() =>
      sendConsultationEmails({
        leadId: lead.id,
        name,
        email,
        phone: phone || null,
        investmentInterest: interestType,
        budget: budget || null,
        propertyType: property?.propertyType || clean(body.propertyType, 160) || null,
        message: message || null,
        createdAt: lead.createdAt,
        ipAddress: ipAddress(request) || null,
        city: decodedHeader(request, ["x-vercel-ip-city", "cf-ipcity"]) || null,
        state: decodedHeader(request, ["x-vercel-ip-country-region", "cf-region"]) || null,
        country: decodedHeader(request, ["x-vercel-ip-country", "cf-ipcountry"]) || null,
        browser: browserName(request.headers.get("user-agent") || "") || null,
        device: deviceName(request.headers.get("user-agent") || "") || null,
        source: clean(body.source, 160) || "Ractysh Real Estate Platform",
        pageUrl: sourcePage || null,
        currentPage: clean(body.currentPage, 600) || sourcePage || null,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || request.nextUrl.origin,
        consultationType: interestType,
        priority: interestType === "consultation" ? "High Intent" : "Priority Inquiry"
      }).catch((error) => {
        console.error("[real-estate-lead-email] Background email notification failed.", {
          leadId: lead.id,
          error
        });
      })
    );

    return NextResponse.json({
      success: true,
      id: lead.id,
      message: "Consultation request received. Our real estate desk will reach out shortly."
    });
  } catch (error) {
    console.error("[real-estate-lead]", error);
    return NextResponse.json({ success: false, message: "Unable to receive the request right now." }, { status: 500 });
  }
}
