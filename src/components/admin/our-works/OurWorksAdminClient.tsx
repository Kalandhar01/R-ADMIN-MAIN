"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus, Search, Edit3, Trash2, Star, Eye, EyeOff,
  Loader2, Filter, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["", "architecture", "construction", "real-estate", "import-export", "otc"] as const;
const CATEGORY_LABELS: Record<string, string> = {
  architecture: "Architecture",
  construction: "Construction",
  "real-estate": "Real Estate",
  "import-export": "Import Export",
  otc: "OTC",
};
const STATUS_LABELS: Record<string, string> = {
  Completed: "Completed",
  Ongoing: "Ongoing",
  Upcoming: "Upcoming",
};

type Work = {
  id: string;
  _id?: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  featured: boolean;
  coverImage: string;
  location: string;
  order: number;
  createdAt: string;
};

export function OurWorksAdminClient({ projectSlug }: { projectSlug: string }) {
  const router = useRouter();
  const [works, setWorks] = React.useState<Work[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [deleting, setDeleting] = React.useState<string | null>(null);
  const limit = 20;

  async function fetchWorks() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set("search", search);
      if (categoryFilter) params.set("category", categoryFilter);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/our-works?${params}`);
      const result = await res.json();
      if (result.success) {
        setWorks(result.data);
        setTotalPages(result.pagination.totalPages);
        setTotal(result.pagination.total);
      } else {
        setError(result.message || "Failed to fetch works.");
      }
    } catch {
      setError("Failed to fetch works.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { fetchWorks(); }, [page, categoryFilter, statusFilter]);

  function handleSearch() {
    setPage(1);
    fetchWorks();
  }

  async function toggleFeatured(work: Work) {
    try {
      const res = await fetch(`/api/admin/our-works/${work.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...work, featured: !work.featured }),
      });
      const result = await res.json();
      if (result.success) {
        setWorks((prev) => prev.map((w) => w.id === work.id ? { ...w, featured: !w.featured } : w));
      }
    } catch { /* ignore */ }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this work?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/our-works/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setWorks((prev) => prev.filter((w) => w.id !== id));
        setTotal((prev) => prev - 1);
      }
    } catch { /* ignore */ }
    finally { setDeleting(null); }
  }

  const inputClass = "rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-[#555] focus:border-[#D4AF37]/30 w-full";

  return (
    <div className="space-y-6 px-3 py-4 sm:px-4 lg:p-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Our Works</h1>
          <p className="text-sm text-[#888]">Manage portfolio projects across all divisions</p>
        </div>
        <button
          onClick={() => router.push(`/${projectSlug}/dashboard/our-works/new`)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-[#050505] transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New Work
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#555]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search works..."
              className={cn(inputClass, "pl-10")}
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className={cn(inputClass, "w-auto min-w-[160px] cursor-pointer")}
          >
            <option value="">All Categories</option>
            {CATEGORIES.filter(Boolean).map((c) => (
              <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className={cn(inputClass, "w-auto min-w-[140px] cursor-pointer")}
          >
            <option value="">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Upcoming">Upcoming</option>
          </select>
          <span className="text-xs text-[#555]">{total} total</span>
        </div>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
          {error}
        </motion.div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
        </div>
      ) : works.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-medium text-[#888]">No works found</p>
          <p className="mt-1 text-sm text-[#555]">Create your first project to get started.</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {works.map((work) => (
            <motion.div
              key={work.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] transition-all hover:border-[#D4AF37]/20"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.03]">
                {work.coverImage ? (
                  <img src={work.coverImage} alt={work.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center text-[#333] text-4xl font-bold">
                    {work.title.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <span className={cn(
                    "inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                    work.status === "Completed" ? "bg-emerald-500/20 text-emerald-400" :
                    work.status === "Ongoing" ? "bg-amber-500/20 text-amber-400" :
                    "bg-blue-500/20 text-blue-400"
                  )}>
                    {work.status}
                  </span>
                </div>
                {work.featured && (
                  <div className="absolute right-2 top-2 rounded-full bg-[#D4AF37]/20 px-2 py-0.5 text-[10px] font-semibold text-[#D4AF37]">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium text-white">{work.title}</h3>
                    <p className="text-[11px] text-[#555]">
                      {CATEGORY_LABELS[work.category] || work.category}
                      {work.location ? ` · ${work.location}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 pt-1">
                  <button
                    onClick={() => router.push(`/${projectSlug}/dashboard/our-works/${work.id}`)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#555] transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => toggleFeatured(work)}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                      work.featured ? "text-[#D4AF37] hover:bg-[#D4AF37]/10" : "text-[#555] hover:bg-white/[0.06] hover:text-white"
                    )}
                  >
                    {work.featured ? <Star className="h-3.5 w-3.5 fill-current" /> : <Star className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => handleDelete(work.id)}
                    disabled={deleting === work.id}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#555] transition-colors hover:bg-red-500/10 hover:text-red-400"
                  >
                    {deleting === work.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-white/[0.06] px-3 py-1.5 text-sm text-[#888] transition-colors hover:bg-white/[0.04] disabled:opacity-30"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-all",
                p === page ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "text-[#555] hover:bg-white/[0.04] hover:text-white"
              )}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-white/[0.06] px-3 py-1.5 text-sm text-[#888] transition-colors hover:bg-white/[0.04] disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
