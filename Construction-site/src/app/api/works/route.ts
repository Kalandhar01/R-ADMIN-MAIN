import { getConstructionWorks } from "@/lib/server/construction-works";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function numberParam(value: string | null, fallback: number) {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await getConstructionWorks({
      skip: numberParam(searchParams.get("skip"), 0),
      take: numberParam(searchParams.get("take"), 6),
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to load project work.",
      },
      { status: 500 },
    );
  }
}
