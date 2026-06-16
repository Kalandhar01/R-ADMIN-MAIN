import { NextResponse } from "next/server";
import { getFallbackConsultationRecord } from "@/lib/consultationWorkflowFallback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_API_URL = "http://localhost:5000";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function getBackendApiUrl(): string {
  return (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/+$/, "");
}

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const url = new URL(request.url);
  const trackingToken = url.searchParams.get("trackingToken") || "";

  if (!id || !trackingToken) {
    return NextResponse.json(
      { message: "Missing consultation id or tracking token." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${getBackendApiUrl()}/api/consultations/${encodeURIComponent(id)}/workflow?trackingToken=${encodeURIComponent(trackingToken)}`,
      {
        cache: "no-store",
        signal: AbortSignal.timeout(12_000)
      }
    );
    const payload = await response.json().catch(() => ({
      message: response.ok ? "Workflow loaded." : "Unable to load consultation workflow."
    }));

    if (!response.ok) {
      const fallback = getFallbackConsultationRecord(id, trackingToken);
      if (fallback) return NextResponse.json(fallback);
    }

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    console.error("Consultation workflow proxy failed:", error);

    const fallback = getFallbackConsultationRecord(id, trackingToken);
    if (fallback) return NextResponse.json(fallback);

    return NextResponse.json(
      { message: "Consultation workflow service is unavailable." },
      { status: 503 }
    );
  }
}
