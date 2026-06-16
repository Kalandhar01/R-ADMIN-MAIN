import { NextRequest, NextResponse } from "next/server";
import {
  adminSessionCookieOptions,
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  signInWithCredentials
} from "@/lib/admin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";
  const isJsonRequest = contentType.includes("application/json");
  const body = isJsonRequest
    ? ((await request.json().catch(() => ({}))) as Record<string, unknown>)
    : Object.fromEntries((await request.formData()).entries());
  const email = typeof body.email === "string" ? body.email : "";
  const password = typeof body.password === "string" ? body.password : "";

  const admin = await signInWithCredentials({
    email,
    password,
    ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip"),
    userAgent: request.headers.get("user-agent")
  });

  if (!admin) {
    if (!isJsonRequest) {
      return NextResponse.redirect(new URL("/?error=invalid_credentials", request.url), 303);
    }

    return NextResponse.json({ success: false, message: "Invalid admin credentials." }, { status: 401 });
  }

  const response = isJsonRequest ? NextResponse.json({ success: true }) : NextResponse.redirect(new URL("/", request.url), 303);
  response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(admin), adminSessionCookieOptions());

  return response;
}
