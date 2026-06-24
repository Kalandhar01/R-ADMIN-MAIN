"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "architecture", label: "Architecture" },
  { value: "construction", label: "Construction" },
  { value: "real-estate", label: "Real Estate" },
  { value: "import-export", label: "Import Export" },
  { value: "otc", label: "OTC" },
] as const;

const STATUSES = ["Completed", "Ongoing", "Upcoming"] as const;

type WorkFormData = {
  title: string;
  slug: string;
  category: string;
  description: string;
  location: string;
  status: string;
  coverImage: string;
  galleryImages: string[];
  featured: boolean;
  order: number;
};

export function OurWorksForm({
  initialData,
  projectSlug,
  isEditing,
}: {
  initialData?: WorkFormData & { id?: string };
  projectSlug: string;
  isEditing?: boolean;
}) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [galleryInput, setGalleryInput] = React.useState("");

  const [form, setForm] = React.useState<WorkFormData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    category: initialData?.category || "architecture",
    description: initialData?.description || "",
    location: initialData?.location || "",
    status: initialData?.status || "Ongoing",
    coverImage: initialData?.coverImage || "",
    galleryImages: initialData?.galleryImages || [],
    featured: initialData?.featured || false,
    order: initialData?.order || 0,
  });

  function slugify(value: string): string {
    return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 200);
  }

  function handleTitleChange(title: string) {
    const updates: Partial<WorkFormData> = { title };
    if (!isEditing || !form.slug) updates.slug = slugify(title);
    setForm((prev) => ({ ...prev, ...updates }));
  }

  function addGalleryImage() {
    const url = galleryInput.trim();
    if (url && !form.galleryImages.includes(url)) {
      setForm((prev) => ({ ...prev, galleryImages: [...prev.galleryImages, url] }));
    }
    setGalleryInput("");
  }

  function removeGalleryImage(url: string) {
    setForm((prev) => ({ ...prev, galleryImages: prev.galleryImages.filter((u) => u !== url) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const url = isEditing && initialData?.id
        ? `/api/admin/our-works/${initialData.id}`
        : "/api/admin/our-works";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (result.success) {
        router.push(`/${projectSlug}/dashboard/our-works`);
      } else {
        setError(result.message || "Failed to save work.");
        if (result.issues) {
          const firstIssue = result.issues[0];
          setError(`${firstIssue.path.join(".")}: ${firstIssue.message}`);
        }
      }
    } catch {
      setError("Failed to save work. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-[#555] focus:border-[#D4AF37]/30";
  const labelClass = "text-[11px] font-semibold uppercase tracking-wider text-[#555]";
  const errorClass = "rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400";

  return (
    <div className="space-y-6 px-3 py-4 sm:px-4 lg:p-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <button
          onClick={() => router.push(`/${projectSlug}/dashboard/our-works`)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#666] transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-white">{isEditing ? "Edit Work" : "Create Work"}</h1>
          <p className="text-sm text-[#888]">{isEditing ? "Update your project" : "Add a new project"}</p>
        </div>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className={errorClass}>
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <label className={labelClass}>Title *</label>
              <input type="text" required value={form.title} onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Project title" className={cn(inputClass, "mt-1.5")} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              <label className={labelClass}>Slug</label>
              <input type="text" value={form.slug} onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
                placeholder="auto-generated-from-title" className={cn(inputClass, "mt-1.5 text-[#888]")} />
              <p className="mt-1 text-[11px] text-[#555]">Auto-generated from title. You can customize it.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <label className={labelClass}>Description</label>
              <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Project description" rows={6} className={cn(inputClass, "mt-1.5 resize-none")} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
              <label className={labelClass}>Cover Image</label>
              <div className="mt-1.5 flex gap-2">
                <input type="url" value={form.coverImage} onChange={(e) => setForm((prev) => ({ ...prev, coverImage: e.target.value }))}
                  placeholder="https://res.cloudinary.com/..." className={cn(inputClass, "flex-1")} />
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 text-sm font-medium text-[#D4AF37] hover:bg-[#D4AF37]/20">
                  <Upload className="h-4 w-4" />
                  Upload
                  <input type="file" accept="image/*" className="hidden" disabled={uploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploading(true);
                      try {
                        const fd = new FormData();
                        fd.append("file", file);
                        fd.append("folder", "ractysh-admin/our-works");
                        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
                        const data = await res.json();
                        if (data.success) setForm((prev) => ({ ...prev, coverImage: data.url }));
                        else setError(data.message || "Upload failed.");
                      } catch { setError("Upload failed."); }
                      finally { setUploading(false); e.target.value = ""; }
                    }} />
                </label>
              </div>
              {uploading && <p className="mt-1 text-xs text-[#D4AF37]">Uploading cover image...</p>}
              {form.coverImage && (
                <div className="mt-2 overflow-hidden rounded-xl border border-white/[0.06]">
                  <img src={form.coverImage} alt="Preview" className="h-40 w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
              <label className={labelClass}>Gallery Images</label>
              <div className="mt-1.5 flex gap-2">
                <input type="url" value={galleryInput} onChange={(e) => setGalleryInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGalleryImage())}
                  placeholder="https://res.cloudinary.com/..." className={cn(inputClass, "flex-1")} />
                <button type="button" onClick={addGalleryImage}
                  className="rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 text-sm font-medium text-[#D4AF37] hover:bg-[#D4AF37]/20">Add URL</button>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 text-sm font-medium text-[#D4AF37] hover:bg-[#D4AF37]/20">
                  <Upload className="h-4 w-4" />
                  Upload
                  <input type="file" accept="image/*" className="hidden" disabled={uploading} multiple
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      if (!files.length) return;
                      setUploading(true);
                      let uploaded = 0;
                      for (const file of files) {
                        try {
                          const fd = new FormData();
                          fd.append("file", file);
                          fd.append("folder", "ractysh-admin/our-works");
                          const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
                          const data = await res.json();
                          if (data.success) {
                            setForm((prev) => ({ ...prev, galleryImages: [...prev.galleryImages, data.url] }));
                            uploaded++;
                          }
                        } catch { /* skip failed */ }
                      }
                      setUploading(false);
                      e.target.value = "";
                      if (!uploaded) setError("No images were uploaded.");
                    }} />
                </label>
              </div>
              {uploading && <p className="mt-1 text-xs text-[#D4AF37]">Uploading gallery images...</p>}
              {form.galleryImages.length > 0 && (
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {form.galleryImages.map((url) => (
                    <div key={url} className="group relative overflow-hidden rounded-lg border border-white/[0.06]">
                      <img src={url} alt="" className="h-20 w-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      <button type="button" onClick={() => removeGalleryImage(url)}
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          <div className="space-y-5">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <label className={labelClass}>Category *</label>
              <select required value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                className={cn(inputClass, "mt-1.5 cursor-pointer")}
              >
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}>
              <label className={labelClass}>Status</label>
              <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                className={cn(inputClass, "mt-1.5 cursor-pointer")}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <label className={labelClass}>Location</label>
              <input type="text" value={form.location} onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Dubai, UAE" className={cn(inputClass, "mt-1.5")} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}>
              <label className={labelClass}>Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                className={cn(inputClass, "mt-1.5")} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.19 }}>
              <button type="button" onClick={() => setForm((prev) => ({ ...prev, featured: !prev.featured }))}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                  form.featured
                    ? "border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]"
                    : "border-white/[0.06] text-[#666] hover:bg-white/[0.04]"
                )}
              >
                <Star className={cn("h-4 w-4", form.featured && "fill-current")} />
                {form.featured ? "Featured" : "Mark as Featured"}
              </button>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-[#D4AF37] px-4 py-3 text-sm font-semibold text-[#050505] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {saving ? (
                <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Saving...</span>
              ) : (
                <span className="inline-flex items-center gap-2"><Save className="h-4 w-4" /> {isEditing ? "Update Work" : "Create Work"}</span>
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Star(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
