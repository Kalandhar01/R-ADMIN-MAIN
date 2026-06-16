import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@ractysh/auth";

const publicAdminApi = new Set([
  "/api/admin/auth/credentials",
  "/api/admin/auth/google",
  "/api/admin/auth/logout"
]);

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasAdminCookie = Boolean(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);

  if (pathname.startsWith("/api/admin/")) {
    if (publicAdminApi.has(pathname)) return NextResponse.next();
    if (!hasAdminCookie) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*"]
};
