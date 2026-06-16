import { NextRequest, NextResponse } from "next/server";
import {
  adminSessionCookieOptions,
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  signInWithGoogleProfile
} from "@/lib/admin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GoogleTokenInfo = {
  sub?: string;
  aud?: string;
  email?: string;
  email_verified?: string | boolean;
  name?: string;
  picture?: string;
};

function expectedClientId(): string | undefined {
  return process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
}

export async function POST(request: NextRequest) {
  const clientId = expectedClientId();
  if (!clientId) {
    return NextResponse.json({ success: false, message: "Google auth is not configured." }, { status: 503 });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const credential = typeof body.credential === "string" ? body.credential : "";
  if (!credential) {
    return NextResponse.json({ success: false, message: "Google credential is required." }, { status: 400 });
  }

  const tokenResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`, {
    cache: "no-store"
  });

  if (!tokenResponse.ok) {
    return NextResponse.json({ success: false, message: "Google credential could not be verified." }, { status: 401 });
  }

  const token = (await tokenResponse.json()) as GoogleTokenInfo;
  const verified = token.email_verified === true || token.email_verified === "true";
  if (!token.email || token.aud !== clientId || !verified) {
    return NextResponse.json({ success: false, message: "Google account is not allowed." }, { status: 403 });
  }

  const admin = await signInWithGoogleProfile({
    email: token.email,
    name: token.name,
    picture: token.picture,
    googleId: token.sub,
    ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip"),
    userAgent: request.headers.get("user-agent")
  });

  if (!admin) {
    return NextResponse.json({ success: false, message: "Google email is not registered as an admin." }, { status: 403 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(admin), adminSessionCookieOptions());

  return response;
}
