"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search, Loader2, Download, FileText,
  Calendar, Trash2, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardShell } from "@/components/admin/dashboard-shell";

const STATUS_OPTIONS = ["", "pending", "reviewed", "shortlisted", "rejected", "hired"] as const;
const STATUS_LABELS: Record<string, string> = {
  pending: "Pending", reviewed: "Reviewed", shortlisted: "Shortlisted", rejected: "Rejected", hired: "Hired",
};
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-blue-500/20 text-blue-400", reviewed: "bg-amber-500/20 text-amber-400",
  shortlisted: "bg-purple-500/20 text-purple-400", rejected: "bg-red-500/20 text-red-400",
  hired: "bg-emerald-500/20 text-emerald-400",
};

type Application = {
  id: string; fullName?: string; name?: string; email: string; phone: string;
  position: string; resumeUrl?: string; coverLetter?: string; status: string; createdAt: string;
};

function formatDate(dateStr: string) {
  try { return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
  catch { return dateStr; }
}

export default function CareersPage() {
  const params = useParams();
  const slug = typeof params?.project === "string" ? params.project : "";

  const [apps, setApps] = React.useState<Application[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [selectedApp, setSelectedApp] = React.useState<Application | null>(null);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);
  const limit = 20;

  async function fetchApplications() {
    setLoading(true); setError(null);
    try {
      const p = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) p.set("search", search);
      if (statusFilter) p.set("status", statusFilter);
      const res = await fetch(`/api/admin/careers?${p}`);
      const result = await res.json();
      if (result.success) { setApps(result.data); setTotalPages(result.pagination.totalPages); setTotal(result.pagination.total); }
      else setError(result.message || "Failed to fetch applications.");
    } catch { setError("Failed to fetch applications."); }
    finally { setLoading(false); }
  }

  React.useEffect(() => { fetchApplications(); }, [page, statusFilter]);

  function handleSearch() { setPage(1); fetchApplications(); }

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/careers", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
      const result = await res.json();
      if (result.success) { setApps((prev) => prev.map((a) => a.id === id ? { ...a, status } : a)); if (selectedApp?.id === id) setSelectedApp({ ...selectedApp, status }); }
    } catch { /* ignore */ } finally { setUpdatingId(null); }
  }

  async function deleteApplication(id: string) {
    if (!confirm("Delete this application permanently?")) return;
    try {
      const res = await fetch("/api/admin/careers", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      const result = await res.json();
      if (result.success) { setApps((prev) => prev.filter((a) => a.id !== id)); if (selectedApp?.id === id) setSelectedApp(null); }
    } catch { /* ignore */ }
  }

  const inputClass = "rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-[#555] focus:border-[#D4AF37]/30";

  return (
    <DashboardShell activeView="careers">
      <div className="space-y-6 px-3 py-4 sm:px-4 lg:p-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-semibold text-white">Career Applications</h1>
          <p className="text-sm text-[#888]">Manage job applications and candidate status</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#555]" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search applications..." className={cn(inputClass, "pl-10")} />
            </div>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className={cn(inputClass, "w-auto min-w-[140px] cursor-pointer")}>
              <option value="">All Status</option>
              {STATUS_OPTIONS.filter(Boolean).map((s) => (<option key={s} value={s}>{STATUS_LABELS[s]}</option>))}
            </select>
            <span className="text-xs text-[#555]">{total} total</span>
          </div>
        </motion.div>

        {error && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">{error}</motion.div>)}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" /></div>
            ) : apps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg font-medium text-[#888]">No applications found</p>
                <p className="mt-1 text-sm text-[#555]">Applications will appear here when candidates apply.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {apps.map((app) => (
                  <motion.div key={app.id} layout initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSelectedApp(app)}
                    className={cn("cursor-pointer rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-[#D4AF37]/20", selectedApp?.id === app.id && "border-[#D4AF37]/30")}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-white truncate">{app.fullName || app.name || "Unknown"}</h3>
                          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider shrink-0", STATUS_COLORS[app.status])}>{STATUS_LABELS[app.status] || app.status}</span>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#555]">
                          <span className="inline-flex items-center gap-1"><FileText className="h-3 w-3" />{app.position}</span>
                          {app.email && <span>{app.email}</span>}
                          <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(app.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="rounded-lg border border-white/[0.06] px-3 py-1.5 text-sm text-[#888] disabled:opacity-30 hover:bg-white/[0.04]">Previous</button>
                <span className="text-sm text-[#555]">Page {page} of {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="rounded-lg border border-white/[0.06] px-3 py-1.5 text-sm text-[#888] disabled:opacity-30 hover:bg-white/[0.04]">Next</button>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            {selectedApp ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-5 sticky top-20">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Application Details</h3>
                  <button onClick={() => setSelectedApp(null)} className="text-[#555] hover:text-white"><X className="h-4 w-4" /></button>
                </div>
                <div className="space-y-3">
                  <div><p className="text-[10px] font-semibold uppercase tracking-wider text-[#555]">Name</p><p className="text-sm text-white">{selectedApp.fullName || selectedApp.name || "Unknown"}</p></div>
                  {selectedApp.email && <div><p className="text-[10px] font-semibold uppercase tracking-wider text-[#555]">Email</p><p className="text-sm text-white">{selectedApp.email}</p></div>}
                  {selectedApp.phone && <div><p className="text-[10px] font-semibold uppercase tracking-wider text-[#555]">Phone</p><p className="text-sm text-white">{selectedApp.phone}</p></div>}
                  <div><p className="text-[10px] font-semibold uppercase tracking-wider text-[#555]">Position</p><p className="text-sm text-white">{selectedApp.position}</p></div>
                  <div><p className="text-[10px] font-semibold uppercase tracking-wider text-[#555]">Applied</p><p className="text-sm text-white">{formatDate(selectedApp.createdAt)}</p></div>
                </div>
                {selectedApp.coverLetter && (<div><p className="text-[10px] font-semibold uppercase tracking-wider text-[#555]">Cover Letter</p><p className="mt-1 text-sm text-[#aaa] leading-relaxed">{selectedApp.coverLetter}</p></div>)}
                {selectedApp.resumeUrl && (
                  <a href={selectedApp.resumeUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-2 text-xs font-medium text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors">
                    <Download className="h-3.5 w-3.5" /> Download Resume
                  </a>
                )}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#555] mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.filter(Boolean).map((s) => (
                      <button key={s} onClick={() => updateStatus(selectedApp.id, s)} disabled={updatingId === selectedApp.id}
                        className={cn("rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                          selectedApp.status === s ? `${STATUS_COLORS[s]} border-current` : "border-white/[0.06] text-[#666] hover:bg-white/[0.04]")}>
                        {updatingId === selectedApp.id ? <Loader2 className="h-3 w-3 animate-spin" /> : STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => deleteApplication(selectedApp.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10">
                  <Trash2 className="h-3.5 w-3.5" /> Delete Application
                </button>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-40 rounded-xl border border-dashed border-white/[0.06] text-sm text-[#555]">Select an application to view details</div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
