import { NextRequest } from "next/server";
import { getCurrentAdminFromRequest } from "@/lib/admin/auth";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) {
    return new Response("Unauthorized", { status: 401 });
  }
  const adminId = admin.id;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      async function poll() {
        try {
          const [notifications, contacts, consultations, applications] = await Promise.all([
            prisma.notification.findMany({
              where: { adminId },
              orderBy: { createdAt: "desc" },
              take: 10,
            }),
            prisma.contactInquiry.count({}),
            prisma.consultation.count({}),
            prisma.careerApplication.count({}),
          ]);

          const unreadCount = notifications.filter((n: any) => n.status === "unread").length;

          const data = JSON.stringify({
            unreadNotifications: unreadCount,
            contactCount: contacts,
            consultationCount: consultations,
            applicationCount: applications,
            recentNotifications: notifications.map((n: any) => ({
              id: n._id || n.id,
              title: n.title,
              message: n.message,
              status: n.status,
              createdAt: typeof n.createdAt === "object" ? new Date(n.createdAt).toISOString() : n.createdAt,
            })),
          });

          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch {
          // continue
        }
      }

      const interval = setInterval(poll, 5000);

      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });

      poll();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
