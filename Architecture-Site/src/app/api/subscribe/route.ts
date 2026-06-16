import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESEND_EMAILS_API = "https://api.resend.com/emails";
const DEFAULT_FROM_EMAIL = "Ractysh Architecture <onboarding@resend.dev>";
const SUBSCRIBE_EMAIL_SUBJECT = "Welcome to RACTYSH Architecture";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const email = String(body.email || "").toLowerCase().trim();
    const source = String(body.source || "architecture_popup_newsletter");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, message: "Invalid email address." }, { status: 400 });
    }

    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ ok: true, alreadySubscribed: true, message: "Already subscribed." });
    }

    await prisma.subscriber.create({
      data: {
        email,
        source,
        division: "architecture",
        status: "active",
      },
    });

    const apiKey = process.env.RESEND_API_KEY || process.env.ARCHITECTURE_RESEND_API_KEY;
    if (apiKey) {
      await fetch(RESEND_EMAILS_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL,
          to: email,
          subject: SUBSCRIBE_EMAIL_SUBJECT,
          html: `<p>Welcome to RACTYSH Architecture Journal.</p><p>Thank you for joining us.</p>`,
        }),
      });
    }

    return NextResponse.json({ ok: true, success: true, message: "Subscribed successfully." });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ ok: false, message: "Service unavailable." }, { status: 500 });
  }
}
