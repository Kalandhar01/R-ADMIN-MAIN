"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Edit3, Trash2, Star, Eye, Copy, Loader2,
  FolderKanban, Building2, HardHat, Home, Globe, Landmark,
  CheckCircle2, Sparkles, ChevronLeft, ChevronRight,
  ArrowUpDown, X, ImageOff, ShieldCheck,
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
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  architecture: Building2,
  construction: HardHat,
  "real-estate": Home,
  "import-export": Globe,
  otc: Landmark,
};
const STATUS_STYLES: Record<string, string> = {
  Completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Ongoing: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Upcoming: "bg-blue-500/15 text-blue-400 border-blue-500/20",
};

type Work = {
  id?: string;
  _id?: string;
  title: string;
  slug: string;
  category: string;
  shortDescription?: string;
  description?: string;
  location: string;
  status: string;
  featured: boolean;
  coverImage: string;
  galleryImages?: string[];
  displayOrder?: number;
  createdAt: string;
  updatedAt?: string;
};

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 animate-pulse">
          <div className="h-12 w-16 rounded-lg bg-white/[0.06]" />
          <div className="flex-1 space-y-2"><div className="h-4 w-48 rounded bg-white/[0.06]" /><div className="h-3 w-24 rounded bg-white/[0.04]" /></div>
          <div className="h-3 w-20 rounded bg-white/[0.04]" />
          <div className="h-3 w-16 rounded bg-white/[0.04]" />
          <div className="h-6 w-16 rounded-full bg-white/[0.04]" />
          <div className="h-5 w-12 rounded bg-white/[0.04]" />
          <div className="flex gap-1">{[1, 2, 3].map((j) => <div key={j} className="h-8 w-8 rounded-lg bg-white/[0.04]" />)}</div>
        </div>
      ))}
    </div>
  );
}

export function PortfolioManager({ projectSlug }: { projectSlug: string }) {
  const router = useRouter();
  const [works, setWorks] = React.useState<Work[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [featuredFilter, setFeaturedFilter] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("newest");
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [deleting, setDeleting] = React.useState<string | null>(null);
  const limit = 15;

  async function fetchWorks() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit), sort: sortOrder });
      if (search) params.set("search", search);
      if (categoryFilter) params.set("category", categoryFilter);
      if (statusFilter) params.set("status", statusFilter);
      if (featuredFilter) params.set("featured", featuredFilter);
      const res = await fetch(`/api/admin/our-works?${params}`);
      const result = await res.json();
      if (result.success) {
        setWorks(result.data);
        setTotalPages(result.pagination.totalPages);
        setTotal(result.pagination.total);
      } else {
        setError(result.message || "Failed to fetch works.");
      }
    } catch { setError("Failed to fetch works."); }
    finally { setLoading(false); }
  }

  React.useEffect(() => { fetchWorks(); }, [page, categoryFilter, statusFilter, featuredFilter, sortOrder]);

  async function toggleFeatured(work: Work) {
    const previous = works;
    setWorks((prev) => prev.map((w) => w.id === work.id ? { ...w, featured: !w.featured } : w));
    try {
      const res = await fetch(`/api/admin/our-works/${work.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...work, featured: !work.featured }),
      });
      const result = await res.json();
      if (!result.success) setWorks(previous);
    } catch { setWorks(previous); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this work? This will permanently remove it from all divisions.")) return;
    setDeleting(id);
    setWorks((prev) => prev.filter((w) => w.id !== id));
    setTotal((prev) => prev - 1);
    try {
      const res = await fetch(`/api/admin/our-works/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (!result.success) fetchWorks();
    } catch { fetchWorks(); }
    finally { setDeleting(null); }
  }

  const inputClass = "rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-[#555] focus:border-[#D4AF37]/30 w-full";
  const selectClass = "rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#D4AF37]/30 cursor-pointer appearance-none";

  return (
    <div className="space-y-6 px-3 py-4 sm:px-4 lg:p-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Portfolio Manager</h1>
          <p className="text-sm text-[#888]">Super Admin — full CRUD across all divisions</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-3 py-1.5 text-xs font-semibold text-[#D4AF37]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Super Admin
          </span>
          <button onClick={() => router.push(`/${projectSlug}/dashboard/our-works/new`)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-[#050505] transition-all hover:opacity-90 hover:shadow-lg hover:shadow-[#D4AF37]/20">
            <Plus className="h-4 w-4" /> Add Project
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#555]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { setPage(1); fetchWorks(); } }}
              placeholder="Search projects..." className={cn(inputClass, "pl-10")} />
          </div>
          <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className={cn(selectClass, "w-auto min-w-[150px]")}>
            <option value="">All Divisions</option>
            {CATEGORIES.filter(Boolean).map((c) => (
              <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className={cn(selectClass, "w-auto min-w-[140px]")}>
            <option value="">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Upcoming">Upcoming</option>
          </select>
          <select value={featuredFilter} onChange={(e) => { setFeaturedFilter(e.target.value); setPage(1); }}
            className={cn(selectClass, "w-auto min-w-[130px]")}>
            <option value="">All Projects</option>
            <option value="true">Featured Only</option>
            <option value="false">Non-Featured</option>
          </select>
          <select value={sortOrder} onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
            className={cn(selectClass, "w-auto min-w-[140px]")}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="order">Display Order</option>
          </select>
          <span className="text-xs text-[#555] whitespace-nowrap">{total} total</span>
        </div>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">{error}</motion.div>
      )}

      {loading ? <TableSkeleton /> : works.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03]">
            <FolderKanban className="h-8 w-8 text-[#444]" />
          </div>
          <p className="text-lg font-medium text-[#888]">No projects found</p>
          <p className="mt-1 text-sm text-[#555]">Adjust your filters or create a new project.</p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Cover", "Project", "Division", "Location", "Status", "Featured", "Updated", "Actions"].map((h) => (
                  <th key={h} className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#555]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              <AnimatePresence mode="popLayout">
                {works.map((work, idx) => (
                  <motion.tr key={work.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }} className="group transition-colors hover:bg-white/[0.02]">
                    <td className="px-3 py-3">
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.03]">
                        {work.coverImage ? (
                          <img src={work.coverImage} alt="" className="h-full w-full object-cover" loading="lazy" />
                        ) : (
                          <div className="flex h-full items-center justify-center"><ImageOff className="h-4 w-4 text-[#444]" /></div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-sm font-medium text-white truncate max-w-[200px]">{work.title}</p>
                      <p className="text-[11px] text-[#555]">/{work.slug}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-1.5 text-sm text-[#bbb]">
                        {(() => {
                          const Icon = CATEGORY_ICONS[work.category];
                          return Icon ? <Icon className="h-3.5 w-3.5 text-[#777]" /> : null;
                        })()}
                        {CATEGORY_LABELS[work.category] || work.category}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-[#888]">{work.location || "—"}</td>
                    <td className="px-3 py-3">
                      <span className={cn("inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider", STATUS_STYLES[work.status])}>{work.status}</span>
                    </td>
                    <td className="px-3 py-3">
                      <button onClick={() => toggleFeatured(work)}
                        className={cn("flex h-7 w-7 items-center justify-center rounded-lg transition-colors", work.featured ? "text-[#D4AF37]" : "text-[#444] hover:text-[#888]")}>
                        <Star className={cn("h-3.5 w-3.5", work.featured && "fill-current")} />
                      </button>
                    </td>
                    <td className="px-3 py-3 text-[12px] text-[#666] whitespace-nowrap">
                      {work.updatedAt ? new Date(work.updatedAt).toLocaleDateString() : work.createdAt ? new Date(work.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => router.push(`/${projectSlug}/dashboard/our-works/${work.id}`)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#555] transition-colors hover:bg-white/[0.06] hover:text-white" title="Edit">
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(work.id!)} disabled={deleting === work.id}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#555] transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30" title="Delete">
                          {deleting === work.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </motion.div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <span className="text-xs text-[#555]">Page {page} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] text-[#888] transition-colors hover:bg-white/[0.04] disabled:opacity-30">
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2).map((p, idx, arr) => (
              <span key={p} className="flex items-center">
                {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1 text-[#444]">...</span>}
                <button onClick={() => setPage(p)}
                  className={cn("flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-all", p === page ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "text-[#555] hover:bg-white/[0.04] hover:text-white")}>{p}</button>
              </span>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] text-[#888] transition-colors hover:bg-white/[0.04] disabled:opacity-30">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
