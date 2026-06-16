import { NextResponse, type NextRequest } from "next/server";
import { recordArchitecturePageView } from "@/lib/architectureCms";

export const runtime = "nodejs";

function clean(value: unknown, limit = 240) {
  return typeof value === "string" ? value.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, limit) : "";
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const type = clean(body.type, 40);
    const path = clean(body.path, 500) || "/";
    const projectId = clean(body.projectId, 120) || null;
    const projectSlug = clean(body.projectSlug, 120) || null;

    if (type !== "page" && type !== "project") {
      return NextResponse.json({ success: false, message: "Unsupported analytics event." }, { status: 400 });
    }

    await recordArchitecturePageView({
      path,
      projectId: type === "project" ? projectId : null,
      projectSlug: type === "project" ? projectSlug : null,
      request
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Architecture analytics failed:", error);
    }
    return NextResponse.json({ success: false, queued: false }, { status: 202 });
  }
}
