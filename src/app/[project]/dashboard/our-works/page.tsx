"use client";

import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { OurWorksAdminClient } from "@/components/admin/our-works/OurWorksAdminClient";

export default function OurWorksPage() {
  const params = useParams();
  const slug = typeof params?.project === "string" ? params.project : "";
  return (
    <DashboardShell activeView="our-works">
      <OurWorksAdminClient projectSlug={slug} />
    </DashboardShell>
  );
}
