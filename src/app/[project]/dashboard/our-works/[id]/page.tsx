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

  React.useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/our-works/${id}`);
        const result = await res.json();
        if (result.success) setWork(result.data);
        else setError(result.message || "Work not found.");
      } catch {
        setError("Failed to load work.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

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
        isEditing
        initialData={{
          id: work.id as string,
          title: work.title as string,
          slug: work.slug as string,
          category: (work.category as string) || "architecture",
          description: (work.description as string) || "",
          location: (work.location as string) || "",
          status: (work.status as string) || "Ongoing",
          coverImage: (work.coverImage as string) || "",
          galleryImages: (work.galleryImages as string[]) || [],
          featured: !!work.featured,
          order: typeof work.order === "number" ? work.order : 0,
        }}
      />
    </DashboardShell>
  );
}
