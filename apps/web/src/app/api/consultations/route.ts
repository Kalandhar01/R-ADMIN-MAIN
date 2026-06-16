import { NextResponse } from "next/server";

const DEFAULT_API_URL = "http://localhost:5000";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBackendApiUrl(): string {
  return (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/+$/, "");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const response = await fetch(`${getBackendApiUrl()}/api/consultations`, {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(12_000)
    });

    const payload = await response.json().catch(() => ({ message: "Demo service returned an invalid response." }));

    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "Demo service is unavailable. Please try again shortly." },
      { status: 503 }
    );
  }
}
