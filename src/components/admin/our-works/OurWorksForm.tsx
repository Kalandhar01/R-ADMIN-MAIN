"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2, X, Upload, Star, ShieldCheck, ChevronDown, ImageOff, Building2, HardHat, Home, Globe, Landmark } from "lucide-react";
import { Select, type SelectOption } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const CATEGORIES: SelectOption[] = [
  { value: "architecture", label: "Architecture", icon: Building2 },
  { value: "construction", label: "Construction", icon: HardHat },
  { value: "real-estate", label: "Real Estate", icon: Home },
  { value: "import-export", label: "Import Export", icon: Globe },
  { value: "otc", label: "OTC", icon: Landmark },
];

const STATUSES: SelectOption[] = [
  { value: "Completed", label: "Completed" },
  { value: "Ongoing", label: "Ongoing" },
  { value: "Upcoming", label: "Upcoming" },
];

const SLUG_TO_DIVISION: Record<string, string> = {
  architecture: "architecture",
  construction: "construction",
  "real-estate": "real-estate",
  otc: "otc",
  "import-export": "import-export",
};

const SLUG_TO_DIVISION_LABEL: Record<string, string> = {
  architecture: "Architecture",
  construction: "Construction",
  "real-estate": "Real Estate",
  otc: "OTC",
  "import-export": "Import Export",
};


type WorkFormData = {
  title: string; slug: string; category: string;
  shortDescription: string; description: string; location: string;
  status: string; coverImage: string; galleryImages: string[];
  featured: boolean; displayOrder: number;
  seoTitle: string; seoDescription: string;
};

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 200);
}

const inputClass = "w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#555] focus:border-[#D4AF37]/30";
const labelClass = "text-[11px] font-semibold uppercase tracking-wider text-[#555]";

export function OurWorksForm({
  initialData, projectSlug, isEditing, divisionSlug,
}: {
  initialData?: WorkFormData & { id?: string };
  projectSlug: string; isEditing?: boolean; divisionSlug?: string;
}) {
  const router = useRouter();
  const isGroup = !divisionSlug || divisionSlug === "ractysh-group";
  const autoCategory = SLUG_TO_DIVISION[divisionSlug || ""] || "";
  const autoDivision = SLUG_TO_DIVISION_LABEL[divisionSlug || ""] || "";
  const apiBase = "/api/admin/portfolio-projects";
  const [saving, setSaving] = React.useState(false);
  const [uploadingCover, setUploadingCover] = React.useState(false);
  const [uploadingGallery, setUploadingGallery] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showSeo, setShowSeo] = React.useState(false);

  const [form, setForm] = React.useState<WorkFormData>({
    title: initialData?.title || "", slug: initialData?.slug || "",
    category: initialData?.category || (isGroup ? "architecture" : autoCategory),
    shortDescription: initialData?.shortDescription || "",
    description: initialData?.description || "",
    location: initialData?.location || "", status: initialData?.status || "Ongoing",
    coverImage: initialData?.coverImage || "",
    galleryImages: initialData?.galleryImages || [],
    featured: initialData?.featured || false,
    displayOrder: initialData?.displayOrder || 0,
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
  });

  function handleTitleChange(title: string) {
    const updates: Partial<WorkFormData> = { title };
    if (!isEditing || !form.slug) updates.slug = slugify(title);
    setForm((prev) => ({ ...prev, ...updates }));
  }

  async function uploadFiles(files: File[], target: "cover" | "gallery") {
    const total = files.length;
    let completed = 0;
    const urls: string[] = [];

    if (target === "cover") setUploadingCover(true);
    else setUploadingGallery(true);

    for (const file of files) {
      try {
        const b64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: b64, fileName: file.name, folder: "ractysh-admin/our-works" }),
        });
        const data = await res.json();
        if (data.success) urls.push(data.url);
      } catch { /* skip */ }
      completed++;
    }

    if (target === "cover" && urls.length) {
      setForm((prev) => ({ ...prev, coverImage: urls[0] }));
    } else if (target === "gallery" && urls.length) {
      setForm((prev) => ({ ...prev, galleryImages: [...prev.galleryImages, ...urls] }));
    }

    setUploadingCover(false);
    setUploadingGallery(false);
    if (!urls.length) setError("No images were uploaded.");
  }

  function removeGalleryImage(url: string) {
    setForm((prev) => ({ ...prev, galleryImages: prev.galleryImages.filter((u) => u !== url) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const url = isEditing && initialData?.id ? `${apiBase}/${initialData.id}` : apiBase;
      const method = isEditing ? "PUT" : "POST";
      const division = isGroup ? (SLUG_TO_DIVISION_LABEL[form.category] || form.category) : autoDivision;
      const body = { ...form, division, category: undefined };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await res.json();
      if (result.success) {
        router.push(`/${projectSlug}/dashboard/our-works`);
      } else {
        setError(result.message || "Failed to save.");
        if (result.issues) { const fi = result.issues[0]; setError(`${fi.path.join(".")}: ${fi.message}`); }
      }
    } catch { setError("Failed to save."); }
    finally { setSaving(false); }
  }

  return (
    <div className="px-3 py-4">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => router.push(`/${projectSlug}/dashboard/our-works`)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#666] hover:bg-white/[0.06] hover:text-white">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-white">{isEditing ? "Edit Project" : "New Project"}</h1>
          <p className="text-xs text-[#888]">{isEditing ? "Update portfolio project" : "Create a portfolio project"}</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Project Title *</label>
          <input type="text" required value={form.title} onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter project title" className={cn(inputClass, "mt-1.5")} />
        </div>

        <div>
          <label className={labelClass}>Slug</label>
          <input type="text" value={form.slug} onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
            placeholder="auto-generated-from-title" className={cn(inputClass, "mt-1.5 text-[#888]")} />
        </div>

        <div>
          <label className={labelClass}>Category *</label>
          <div className="mt-1.5">
            {isGroup ? (
              <Select options={CATEGORIES} value={form.category} onChange={(v) => setForm((prev) => ({ ...prev, category: v }))}
                placeholder="Select category" />
            ) : (
              <div className="flex items-center gap-2 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-3 text-sm text-[#D4AF37]">
                <ShieldCheck className="h-4 w-4" />
                <span>{CATEGORIES.find((c) => c.value === autoCategory)?.label || autoCategory}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className={labelClass}>Status</label>
            <div className="mt-1.5">
              <Select options={STATUSES} value={form.status} onChange={(v) => setForm((prev) => ({ ...prev, status: v }))}
                placeholder="Select status" />
            </div>
          </div>
          <div className="w-20">
            <label className={labelClass}>Order</label>
            <input type="number" value={form.displayOrder} onChange={(e) => setForm((prev) => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
              className={cn(inputClass, "mt-1.5 text-center")} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Location</label>
          <input type="text" value={form.location} onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
            placeholder="e.g., Dubai, UAE" className={cn(inputClass, "mt-1.5")} />
        </div>

        <div>
          <label className={labelClass}>Short Description</label>
          <input type="text" value={form.shortDescription} onChange={(e) => setForm((prev) => ({ ...prev, shortDescription: e.target.value }))}
            placeholder="Brief summary shown in cards" className={cn(inputClass, "mt-1.5")} />
        </div>

        <div>
          <label className={labelClass}>Full Description</label>
          <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Detailed project description" rows={5} className={cn(inputClass, "mt-1.5 resize-none")} />
        </div>

        <div>
          <label className={labelClass}>Cover Image</label>
          <div className="mt-1.5">
            <label className={cn(
              "relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 transition-all",
              form.coverImage
                ? "border-[#D4AF37]/20 bg-[#D4AF37]/5"
                : "border-white/[0.08] bg-white/[0.02] hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5"
            )}>
              {uploadingCover ? (
                <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" />
              ) : form.coverImage ? (
                <>
                  <img src={form.coverImage} alt="" className="h-28 w-full rounded-lg object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <button type="button" onClick={() => setForm((prev) => ({ ...prev, coverImage: "" }))}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white">
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <Upload className="h-6 w-6 text-[#666]" />
                  <span className="text-sm font-medium text-[#888]">Tap to upload cover</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" disabled={uploadingCover}
                onChange={(e) => { const f = Array.from(e.target.files || []); if (f.length) uploadFiles(f, "cover"); e.target.value = ""; }} />
            </label>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className={labelClass}>Gallery</label>
            {form.galleryImages.length > 0 && (
              <span className="text-xs text-[#555]">{form.galleryImages.length} image{form.galleryImages.length !== 1 ? "s" : ""}</span>
            )}
          </div>
          <div className="mt-1.5 space-y-2">
            {form.galleryImages.map((url, index) => (
              <div key={`${url}-${index}`} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2 pr-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.03]">
                  {url ? (
                    <img src={url} alt="" className="h-full w-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <div className="flex h-full items-center justify-center"><ImageOff className="h-5 w-5 text-[#444]" /></div>
                  )}
                </div>
                <span className="flex-1 truncate text-xs text-[#888]">{url.split("/").pop()}</span>
                <button type="button" onClick={() => removeGalleryImage(url)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#555] hover:bg-red-500/10 hover:text-red-400">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <label className={cn(
              "flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/[0.08] py-3 text-sm font-medium text-[#666] transition-colors hover:border-[#D4AF37]/30 hover:text-[#D4AF37]",
              uploadingGallery && "opacity-50"
            )}>
              {uploadingGallery ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploadingGallery ? "Uploading..." : "Add gallery images"}
              <input type="file" accept="image/*" multiple className="hidden" disabled={uploadingGallery}
                onChange={(e) => { const f = Array.from(e.target.files || []); if (f.length) uploadFiles(f, "gallery"); e.target.value = ""; }} />
            </label>
          </div>
        </div>

        <button type="button" onClick={() => setForm((prev) => ({ ...prev, featured: !prev.featured }))}
          className={cn("flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-all",
            form.featured ? "border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]" : "border-white/[0.06] text-[#666] hover:bg-white/[0.04]"
          )}>
          <Star className={cn("h-4 w-4", form.featured && "fill-current")} />
          {form.featured ? "Featured" : "Mark as Featured"}
        </button>

        <div>
          <button type="button" onClick={() => setShowSeo(!showSeo)}
            className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-[#888]">
            <span>SEO Settings</span>
            <ChevronDown className={cn("h-4 w-4 transition-transform", showSeo && "rotate-180")} />
          </button>
          {showSeo && (
            <div className="mt-3 space-y-3 pl-2 border-l-2 border-[#D4AF37]/20">
              <div>
                <label className={labelClass}>SEO Title</label>
                <input type="text" value={form.seoTitle} onChange={(e) => setForm((prev) => ({ ...prev, seoTitle: e.target.value }))}
                  placeholder="Leave empty to use title" className={cn(inputClass, "mt-1.5")} />
              </div>
              <div>
                <label className={labelClass}>SEO Description</label>
                <textarea value={form.seoDescription} onChange={(e) => setForm((prev) => ({ ...prev, seoDescription: e.target.value }))}
                  placeholder="Meta description" rows={2} className={cn(inputClass, "mt-1.5 resize-none")} />
              </div>
            </div>
          )}
        </div>

        <button type="submit" disabled={saving}
          className="w-full rounded-xl bg-[#D4AF37] px-4 py-3.5 text-sm font-semibold text-[#050505] transition-opacity hover:opacity-90 disabled:opacity-50">
          {saving ? (
            <span className="inline-flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Saving...</span>
          ) : (
            <span className="inline-flex items-center justify-center gap-2"><Save className="h-4 w-4" /> {isEditing ? "Update Project" : "Create Project"}</span>
          )}
        </button>
      </form>
    </div>
  );
}
