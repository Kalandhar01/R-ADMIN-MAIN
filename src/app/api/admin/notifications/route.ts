import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminFromRequest } from "@/lib/admin/auth";
import { prisma as _prisma } from "@/lib/server/prisma";
const prisma = _prisma as any;

export async function GET(request: NextRequest) {
  try {
    const admin = await getCurrentAdminFromRequest(request);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const notifications = await prisma.notification.findMany({
      where: { adminId: admin.id },
      orderBy: { createdAt: "desc" },
    });

    const unreadCount = notifications.filter((n: any) => n.status === "unread").length;

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error("[notifications] GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getCurrentAdminFromRequest(request);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { action, ids } = body || {};

    if (action === "markAllRead") {
      await prisma.notification.updateMany({
        where: { adminId: admin.id, status: "unread" },
        data: { status: "read", readAt: new Date() },
      });
      return NextResponse.json({ success: true });
    }

    if (action === "markRead" && Array.isArray(ids) && ids.length > 0) {
      for (const id of ids) {
        await prisma.notification.updateMany({
          where: { adminId: admin.id, id },
          data: { status: "read", readAt: new Date() },
        });
      }
      return NextResponse.json({ success: true });
    }

    if (action === "delete" && Array.isArray(ids) && ids.length > 0) {
      for (const id of ids) {
        await prisma.notification.deleteMany({
          where: { adminId: admin.id, id },
        });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[notifications] PUT Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
