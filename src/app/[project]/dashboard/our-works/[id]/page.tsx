"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { OurWorksForm } from "@/components/admin/our-works/OurWorksForm";

export default function EditOurWorkPage() {
  const params = useParams();
  const slug = typeof params?.project === "string" ? params.project : "";
  const id = typeof params?.id === "string" ? params.id : "";

  const [work, setWork] = React.useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const DIVISION_SLUGS = ["architecture", "construction", "real-estate", "import-export", "otc"];

  React.useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const endpoints = DIVISION_SLUGS.includes(slug)
          ? [`/api/admin/portfolio-projects/${id}`]
          : [`/api/admin/our-works/${id}`, `/api/admin/portfolio-projects/${id}`];
        for (const ep of endpoints) {
          const res = await fetch(ep);
          if (!res.ok) continue;
          const result = await res.json();
          if (result.success && result.data) {
            setWork({ ...result.data, _apiBase: ep.includes("portfolio-projects") ? "/api/admin/portfolio-projects" : "/api/admin/our-works" });
            setLoading(false);
            return;
          }
        }
        setError("Work not found.");
      } catch {
        setError("Failed to load work.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, slug]);

  if (loading) {
    return (
      <DashboardShell activeView="our-works">
        <div className="flex items-center justify-center py-32"><Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" /></div>
      </DashboardShell>
    );
  }

  if (error || !work) {
    return (
      <DashboardShell activeView="our-works">
        <div className="px-3 py-16 text-center text-sm text-red-400">{error || "Work not found."}</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell activeView="our-works">
      <OurWorksForm
        projectSlug={slug}
        divisionSlug={slug}
        isEditing
        initialData={{
          id: work.id as string,
          title: (work.title as string) || "",
          slug: (work.slug as string) || "",
          category: (work.category as string) || "architecture",
          shortDescription: (work.shortDescription as string) || "",
          description: (work.description as string) || "",
          location: (work.location as string) || "",
          status: (work.status as string) || "Ongoing",
          coverImage: (work.coverImage as string) || "",
          galleryImages: (work.galleryImages as string[]) || [],
          featured: !!work.featured,
          displayOrder: typeof work.displayOrder === "number" ? work.displayOrder : 0,
          seoTitle: (work.seoTitle as string) || "",
          seoDescription: (work.seoDescription as string) || "",
        }}
      />
    </DashboardShell>
  );
}
