"use client";

import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { NotificationsPageClient } from "@/components/admin/notifications/NotificationsPageClient";

export default function NotificationsPage() {
  const params = useParams();
  const slug = typeof params?.project === "string" ? params.project : "";
  return (
    <DashboardShell activeView="notifications">
      <NotificationsPageClient projectSlug={slug} />
    </DashboardShell>
  );
}
