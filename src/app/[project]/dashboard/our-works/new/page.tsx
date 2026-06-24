"use client";

import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { OurWorksForm } from "@/components/admin/our-works/OurWorksForm";

export default function NewOurWorkPage() {
  const params = useParams();
  const slug = typeof params?.project === "string" ? params.project : "";
  return (
    <DashboardShell activeView="our-works">
      <OurWorksForm projectSlug={slug} />
    </DashboardShell>
  );
}
