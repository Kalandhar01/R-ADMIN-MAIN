"use client";

import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { PortfolioManager } from "@/components/admin/our-works/PortfolioManager";

export default function PortfolioManagerPage() {
  const params = useParams();
  const slug = typeof params?.project === "string" ? params.project : "";
  return (
    <DashboardShell activeView="portfolio-manager">
      <PortfolioManager projectSlug={slug} />
    </DashboardShell>
  );
}
