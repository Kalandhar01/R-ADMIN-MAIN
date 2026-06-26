"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Edit3, Trash2, Star, Eye, Copy, Loader2,
  FolderKanban, Building2, HardHat, Home, Globe, Landmark,
  ChevronLeft, ChevronRight, X, ImageOff,
  SlidersHorizontal,
} from "lucide-react";
import { Select, type SelectOption } from "@/components/ui/select";
import { cn } from "@/lib/utils";
const CATEGORY_LABELS: Record<string, string> = {
  architecture: "Architecture",
  construction: "Construction",
  "real-estate": "Real Estate",
  "import-export": "Import Export",
  otc: "OTC",
};
const DIVISION_CATEGORIES: Record<string, string> = {
  architecture: "architecture",
  construction: "construction",
  "real-estate": "real-estate",
  "import-export": "import-export",
  otc: "otc",
};
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  architecture: Building2, construction: HardHat, "real-estate": Home,
  "import-export": Globe, otc: Landmark,
};
const STATUS_STYLES: Record<string, string> = {
  Completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Ongoing: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Upcoming: "bg-blue-500/15 text-blue-400 border-blue-500/20",
};

type Work = {
  id?: string; _id?: string;
  title: string; slug: string; category: string;
  shortDescription?: string; description?: string;
  location: string; status: string;
  featured: boolean; coverImage: string;
  galleryImages?: string[];
  displayOrder?: number; seoTitle?: string; seoDescription?: string;
  createdAt: string; updatedAt?: string;
  _apiBase?: string;
};

type Stats = {
  total: number; featured: number; completed: number;
  architecture: number; construction: number;
  "real-estate": number; otc: number; "import-export": number;
};

function ProjectCard({ work, onEdit, onDelete, onDuplicate, onToggleFeatured, onPreview, deleting, duplicating }: {
  work: Work;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleFeatured: () => void;
  onPreview: () => void;
  deleting: boolean;
  duplicating: boolean;
}) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <div className="flex gap-3 p-3">
        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.03]">
          {work.coverImage ? (
            <img src={work.coverImage} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full items-center justify-center"><ImageOff className="h-5 w-5 text-[#444]" /></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-medium text-white truncate">{work.title}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                {(() => {
                  const CatIcon = CATEGORY_ICONS[work.category];
                  return CatIcon ? <CatIcon className="h-3 w-3 text-[#888]" /> : null;
                })()}
                <span className="text-[11px] text-[#666]">
                  {CATEGORY_LABELS[work.category] || work.category}
                  {work.location ? ` · ${work.location}` : ""}
                </span>
              </div>
            </div>
            <span className={cn("shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider", STATUS_STYLES[work.status])}>
              {work.status}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button onClick={onToggleFeatured}
              className={cn("flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
                work.featured ? "text-[#D4AF37]" : "text-[#444] hover:text-[#666]"
              )}>
              <Star className={cn("h-3.5 w-3.5", work.featured && "fill-current")} />
            </button>
            <button onClick={onPreview}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#555] hover:bg-white/[0.06] hover:text-white">
              <Eye className="h-3.5 w-3.5" />
            </button>
            <button onClick={onEdit}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#555] hover:bg-white/[0.06] hover:text-white">
              <Edit3 className="h-3.5 w-3.5" />
            </button>
            <button onClick={onDuplicate} disabled={duplicating}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#555] hover:bg-white/[0.06] hover:text-white disabled:opacity-30">
              {duplicating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            <button onClick={onDelete} disabled={deleting}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#555] hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30 ml-auto">
              {deleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const categoryOptions: SelectOption[] = [
  { value: "", label: "All Categories" },
  { value: "architecture", label: "Architecture", icon: Building2 },
  { value: "construction", label: "Construction", icon: HardHat },
  { value: "real-estate", label: "Real Estate", icon: Home },
  { value: "import-export", label: "Import Export", icon: Globe },
  { value: "otc", label: "OTC", icon: Landmark },
];

const statusOptions: SelectOption[] = [
  { value: "", label: "All Status" },
  { value: "Completed", label: "Completed" },
  { value: "Ongoing", label: "Ongoing" },
  { value: "Upcoming", label: "Upcoming" },
];

const featuredOptions: SelectOption[] = [
  { value: "", label: "All Projects" },
  { value: "true", label: "Featured" },
  { value: "false", label: "Non-Featured" },
];

const sortOptions: SelectOption[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "order", label: "Display Order" },
];

function FilterBar({ search, onSearchChange, onSearch, categoryFilter, onCategoryChange, statusFilter, onStatusChange, featuredFilter, onFeaturedChange, sortOrder, onSortChange, total, hideCategory }: {
  search: string; onSearchChange: (v: string) => void; onSearch: () => void;
  categoryFilter: string; onCategoryChange: (v: string) => void;
  statusFilter: string; onStatusChange: (v: string) => void;
  featuredFilter: string; onFeaturedChange: (v: string) => void;
  sortOrder: string; onSortChange: (v: string) => void;
  total: number;
  hideCategory?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const inputClass = "rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-[#555] focus:border-[#D4AF37]/30 w-full";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#555]" />
          <input type="text" value={search} onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Search projects..." className={cn(inputClass, "pl-10")} />
        </div>
        <button onClick={() => setOpen(!open)}
          className={cn("flex h-10 w-10 items-center justify-center rounded-xl border transition-colors",
            open ? "border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]" : "border-white/[0.06] text-[#666] hover:bg-white/[0.04]"
          )}>
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden">
            <div className="flex flex-col gap-2 pt-1 pb-2">
              {!hideCategory && <Select options={categoryOptions} value={categoryFilter} onChange={onCategoryChange}
                placeholder="All Categories" />}
              <Select options={statusOptions} value={statusFilter} onChange={onStatusChange}
                placeholder="All Status" />
              <Select options={featuredOptions} value={featuredFilter} onChange={onFeaturedChange}
                placeholder="All Projects" />
              <Select options={sortOptions} value={sortOrder} onChange={onSortChange}
                placeholder="Sort" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-[#555]">{total} project{total !== 1 ? "s" : ""}</span>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3 px-1">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 animate-pulse">
          <div className="h-16 w-20 rounded-lg bg-white/[0.06]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-36 rounded bg-white/[0.06]" />
            <div className="h-3 w-20 rounded bg-white/[0.04]" />
            <div className="flex gap-2 mt-2">
              {[1, 2, 3].map((j) => <div key={j} className="h-7 w-7 rounded-lg bg-white/[0.04]" />)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function OurWorksAdminClient({ projectSlug }: { projectSlug: string }) {
  const router = useRouter();
  const isDivision = projectSlug in DIVISION_CATEGORIES;
  const forcedCategory = isDivision ? DIVISION_CATEGORIES[projectSlug] : "";
  const forcedDivision = isDivision ? CATEGORY_LABELS[forcedCategory] || forcedCategory : "";
  const [works, setWorks] = React.useState<Work[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState(forcedCategory);
  const [statusFilter, setStatusFilter] = React.useState("");
  const [featuredFilter, setFeaturedFilter] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("newest");
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [deleting, setDeleting] = React.useState<string | null>(null);
  const [duplicating, setDuplicating] = React.useState<string | null>(null);
  const limit = 20;

  async function fetchWorks() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit), sort: sortOrder });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (featuredFilter) params.set("featured", featuredFilter);

      const endpoints: string[] = [];
      if (isDivision) {
        endpoints.push("/api/admin/portfolio-projects");
        if (categoryFilter) params.set("division", forcedDivision);
      } else {
        endpoints.push("/api/admin/our-works");
        endpoints.push("/api/admin/portfolio-projects");
        if (categoryFilter) {
          params.set("category", categoryFilter);
        }
      }

      const allData: Work[] = [];
      let mergedTotal = 0;

      for (const ep of endpoints) {
        const epParams = new URLSearchParams(params.toString());
        if (ep === "/api/admin/portfolio-projects" && !isDivision) {
          const catLabel = CATEGORY_LABELS[categoryFilter] || "";
          if (catLabel) epParams.set("division", catLabel);
          else { epParams.delete("category"); epParams.delete("division"); }
        }
        const res = await fetch(`${ep}?${epParams}`);
        const result = await res.json();
        if (result.success && result.data) {
          const mapped = result.data.map((item: Record<string, unknown>) => ({
            ...item,
            category: item.category || (item.division as string) || "",
            _apiBase: ep,
          })) as Work[];
          allData.push(...mapped);
          mergedTotal += result.pagination?.total || result.data.length;
        }
      }

      setWorks(allData);
      setTotalPages(Math.ceil(mergedTotal / limit));
      setTotal(mergedTotal);
    } catch { setError("Failed to fetch works."); }
    finally { setLoading(false); }
  }

  React.useEffect(() => { fetchWorks(); }, [page, categoryFilter, statusFilter, featuredFilter, sortOrder]);

  function handleSearch() { setPage(1); fetchWorks(); }

  function apiFor(id: string): string {
    const found = works.find((w) => w.id === id);
    return found?._apiBase || (isDivision ? "/api/admin/portfolio-projects" : "/api/admin/our-works");
  }

  async function toggleFeatured(work: Work) {
    const prev = works;
    setWorks((w) => w.map((x) => x.id === work.id ? { ...x, featured: !x.featured } : x));
    try {
      const res = await fetch(`${apiFor(work.id || "")}/${work.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...work, featured: !work.featured }),
      });
      if (!(await res.json()).success) setWorks(prev);
    } catch { setWorks(prev); }
  }

  async function handleDuplicate(id: string) {
    setDuplicating(id);
    try {
      const res = await fetch(`${apiFor(id)}/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _action: "duplicate" }),
      });
      if ((await res.json()).success) fetchWorks();
    } catch { /* */ }
    finally { setDuplicating(null); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    setDeleting(id);
    setWorks((w) => w.filter((x) => x.id !== id));
    setTotal((p) => p - 1);
    try {
      const res = await fetch(`${apiFor(id)}/${id}`, { method: "DELETE" });
      if (!(await res.json()).success) fetchWorks();
    } catch { fetchWorks(); }
    finally { setDeleting(null); }
  }

  return (
    <div className="px-3 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-white">Our Works</h1>
            {isDivision && (
              <span className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-0.5 text-[11px] font-semibold text-[#D4AF37]">
                {CATEGORY_LABELS[forcedCategory] || forcedCategory}
              </span>
            )}
          </div>
          <p className="text-xs text-[#888]">Portfolio projects</p>
        </div>
        <div className="flex items-center gap-2">
          <a href={isDivision ? `http://localhost:3000/works` : `${process.env.NEXT_PUBLIC_SITE_URL || ""}/our-projects`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] px-3 py-2.5 text-xs font-medium text-[#888] hover:border-white/[0.15] hover:text-white">
            View Site
          </a>
          <button onClick={() => router.push(`/${projectSlug}/dashboard/our-works/new`)}
            className="flex items-center gap-1.5 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-[#050505] shadow-lg shadow-[#D4AF37]/20">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>

      <FilterBar
        search={search} onSearchChange={setSearch} onSearch={handleSearch}
        categoryFilter={categoryFilter} onCategoryChange={(v) => { setCategoryFilter(v); setPage(1); }}
        statusFilter={statusFilter} onStatusChange={(v) => { setStatusFilter(v); setPage(1); }}
        featuredFilter={featuredFilter} onFeaturedChange={(v) => { setFeaturedFilter(v); setPage(1); }}
        sortOrder={sortOrder} onSortChange={(v) => { setSortOrder(v); setPage(1); }}
        total={total}
        hideCategory={isDivision}
      />

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">{error}</div>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : works.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03]">
            <FolderKanban className="h-7 w-7 text-[#444]" />
          </div>
          <p className="text-base font-medium text-[#888]">No projects found</p>
          <p className="text-sm text-[#555] mt-1">Adjust filters or add a new project.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {works.map((work) => (
              <ProjectCard
                key={work.id}
                work={work}
                onEdit={() => router.push(`/${projectSlug}/dashboard/our-works/${work.id}`)}
                onDelete={() => handleDelete(work.id!)}
                onDuplicate={() => handleDuplicate(work.id!)}
                onToggleFeatured={() => toggleFeatured(work)}
                onPreview={() => {}}
                deleting={deleting === work.id}
                duplicating={duplicating === work.id}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[#555]">Page {page} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] text-[#888] disabled:opacity-30">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-[#888] min-w-[24px] text-center">{page}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] text-[#888] disabled:opacity-30">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
