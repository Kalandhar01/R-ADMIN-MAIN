"use client";

import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { AllWorksView } from "@/components/admin/our-works/AllWorksView";

export default function AllWorksPage() {
  const params = useParams();
  const slug = typeof params?.project === "string" ? params.project : "";
  return (
    <DashboardShell activeView="all-works">
      <AllWorksView projectSlug={slug} />
    </DashboardShell>
  );
}
