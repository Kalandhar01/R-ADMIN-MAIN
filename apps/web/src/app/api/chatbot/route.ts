import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, answer, pageUrl } = body;

    if (!question || !answer) {
      return NextResponse.json({ message: "question and answer are required" }, { status: 400 });
    }

    const query = await prisma.chatbotQuery.create({
      data: {
        question: question.slice(0, 2000),
        answer: answer.slice(0, 5000),
        pageUrl: pageUrl || null,
      },
    });

    return NextResponse.json({ success: true, id: query.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to save chatbot query:", error);
    return NextResponse.json({ message: "Failed to save query" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const expected = process.env.ADMIN_SECRET;

  if (!expected || auth !== `Bearer ${expected}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const queries = await prisma.chatbotQuery.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json({ queries });
  } catch (error) {
    console.error("Failed to fetch chatbot queries:", error);
    return NextResponse.json({ message: "Failed to fetch queries" }, { status: 500 });
  }
}
