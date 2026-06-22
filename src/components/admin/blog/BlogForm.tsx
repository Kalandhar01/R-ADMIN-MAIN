"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

type BlogFormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: string;
  seoTitle: string;
  seoDescription: string;
  status: "draft" | "published";
};

export function BlogForm({
  initialData,
  projectSlug,
  isEditing,
}: {
  initialData?: BlogFormData & { id?: string };
  projectSlug: string;
  isEditing?: boolean;
}) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [tagInput, setTagInput] = React.useState("");

  const [form, setForm] = React.useState<BlogFormData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    featuredImage: initialData?.featuredImage || "",
    category: initialData?.category || "",
    tags: initialData?.tags || [],
    author: initialData?.author || "",
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
    status: (initialData?.status as "draft" | "published") || "draft",
  });

  function slugify(value: string): string {
    return value
      .toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 200);
  }

  function handleTitleChange(title: string) {
    const updates: Partial<BlogFormData> = { title };
    if (!isEditing || !form.slug) {
      updates.slug = slugify(title);
    }
    setForm((prev) => ({ ...prev, ...updates }));
  }

  function handleSlugChange(slug: string) {
    setForm((prev) => ({ ...prev, slug: slugify(slug) }));
  }

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  }

  function handleTagKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); addTag(); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const url = isEditing && initialData?.id
        ? `/api/admin/blogs/${initialData.id}`
        : "/api/admin/blogs";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (result.success) {
        router.push(`/${projectSlug}/dashboard/blogs`);
      } else {
        setError(result.message || "Failed to save blog.");
        if (result.issues) {
          const firstIssue = result.issues[0];
          setError(`${firstIssue.path.join(".")}: ${firstIssue.message}`);
        }
      }
    } catch {
      setError("Failed to save blog. Please try again.");
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
          onClick={() => router.push(`/${projectSlug}/dashboard/blogs`)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#666] transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-white">{isEditing ? "Edit Blog" : "Create Blog"}</h1>
          <p className="text-sm text-[#888]">{isEditing ? "Update your blog post" : "Write a new blog post"}</p>
        </div>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className={errorClass}>
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-5 lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <label className={labelClass}>Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter blog title"
                className={cn(inputClass, "mt-1.5")}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              <label className={labelClass}>Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="auto-generated-from-title"
                className={cn(inputClass, "mt-1.5 text-[#888]")}
              />
              <p className="mt-1 text-[11px] text-[#555]">Auto-generated from title. You can customize it.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <label className={labelClass}>Excerpt *</label>
              <textarea
                required
                value={form.excerpt}
                onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief summary of the blog post"
                rows={3}
                className={cn(inputClass, "mt-1.5 resize-none")}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
              <label className={labelClass}>Content *</label>
              <textarea
                required
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Write your blog content here..."
                rows={16}
                className={cn(inputClass, "mt-1.5 resize-y font-mono text-sm leading-relaxed")}
              />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <label className={labelClass}>Status</label>
              <div className="mt-1.5 flex gap-2">
                {(["draft", "published"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, status: s }))}
                    className={cn(
                      "flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
                      form.status === s
                        ? s === "published"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                        : "border-white/[0.06] text-[#666] hover:bg-white/[0.04]"
                    )}
                  >
                    {s === "published" ? "Published" : "Draft"}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}>
              <label className={labelClass}>Category *</label>
              <input
                type="text"
                required
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Technology, Design"
                className={cn(inputClass, "mt-1.5")}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <label className={labelClass}>Author *</label>
              <input
                type="text"
                required
                value={form.author}
                onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
                placeholder="Author name"
                className={cn(inputClass, "mt-1.5")}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}>
              <label className={labelClass}>Featured Image URL</label>
              <input
                type="url"
                value={form.featuredImage}
                onChange={(e) => setForm((prev) => ({ ...prev, featuredImage: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                className={cn(inputClass, "mt-1.5")}
              />
              {form.featuredImage && (
                <div className="mt-2 overflow-hidden rounded-xl border border-white/[0.06]">
                  <img src={form.featuredImage} alt="Preview" className="h-32 w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.19 }}>
              <label className={labelClass}>Tags</label>
              <div className="mt-1.5 flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Add a tag"
                  className={cn(inputClass, "flex-1")}
                />
                <button type="button" onClick={addTag} className="rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 text-sm font-medium text-[#D4AF37] hover:bg-[#D4AF37]/20">Add</button>
              </div>
              {form.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {form.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-[#aaa]">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="text-[#555] hover:text-white"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.21 }}>
              <label className={labelClass}>SEO Title</label>
              <input
                type="text"
                value={form.seoTitle}
                onChange={(e) => setForm((prev) => ({ ...prev, seoTitle: e.target.value }))}
                placeholder="SEO title (optional)"
                className={cn(inputClass, "mt-1.5")}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.23 }}>
              <label className={labelClass}>SEO Description</label>
              <textarea
                value={form.seoDescription}
                onChange={(e) => setForm((prev) => ({ ...prev, seoDescription: e.target.value }))}
                placeholder="SEO description (optional)"
                rows={3}
                className={cn(inputClass, "mt-1.5 resize-none")}
              />
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
                <span className="inline-flex items-center gap-2"><Save className="h-4 w-4" /> {isEditing ? "Update Blog" : "Create Blog"}</span>
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
}
