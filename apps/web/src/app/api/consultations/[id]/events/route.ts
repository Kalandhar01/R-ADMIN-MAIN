import { NextResponse } from "next/server";
import {
  getFallbackConsultationRecord,
  subscribeFallbackConsultationRecord
} from "@/lib/consultationWorkflowFallback";
import type { ConsultationRequest } from "@/lib/types";

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

function createFallbackEventStream(id: string, trackingToken: string): Response | null {
  const initialWorkflow = getFallbackConsultationRecord(id, trackingToken);
  if (!initialWorkflow) return null;

  const encoder = new TextEncoder();
  let unsubscribe: (() => void) | undefined;
  let heartbeat: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const writeEvent = (event: string, payload: ConsultationRequest) => {
        controller.enqueue(encoder.encode(`event: ${event}\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      writeEvent("workflow", initialWorkflow);
      unsubscribe = subscribeFallbackConsultationRecord(id, (record) => writeEvent("workflow", record));
      heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(": heartbeat\n\n"));
      }, 25_000);
    },
    cancel() {
      unsubscribe?.();
      if (heartbeat) clearInterval(heartbeat);
    }
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no"
    }
  });
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
      `${getBackendApiUrl()}/api/consultations/${encodeURIComponent(id)}/events?trackingToken=${encodeURIComponent(trackingToken)}`,
      {
        cache: "no-store",
        headers: {
          Accept: "text/event-stream"
        }
      }
    );

    if (!response.ok || !response.body) {
      const fallback = createFallbackEventStream(id, trackingToken);
      if (fallback) return fallback;

      const payload = await response.json().catch(() => ({ message: "Unable to open consultation workflow stream." }));
      return NextResponse.json(payload, { status: response.status });
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no"
      }
    });
  } catch (error) {
    console.error("Consultation workflow event proxy failed:", error);

    const fallback = createFallbackEventStream(id, trackingToken);
    if (fallback) return fallback;

    return NextResponse.json(
      { message: "Consultation workflow stream is unavailable." },
      { status: 503 }
    );
  }
}
