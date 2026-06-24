"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search, Loader2, Mail, Phone, Building2, Globe,
  Calendar, Trash2, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardShell } from "@/components/admin/dashboard-shell";

const STATUS_OPTIONS = ["", "new", "contacted", "completed", "archived"] as const;
const STATUS_LABELS: Record<string, string> = {
  new: "New", contacted: "Contacted", completed: "Completed", archived: "Archived",
};
const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400",
  contacted: "bg-amber-500/20 text-amber-400",
  completed: "bg-emerald-500/20 text-emerald-400",
  archived: "bg-white/10 text-[#666]",
};

type Lead = {
  id: string; name: string; email: string; phone: string; company: string;
  service: string; message: string; source?: string; sourceService?: string;
  status: string; createdAt: string;
};

function formatDate(dateStr: string) {
  try { return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
  catch { return dateStr; }
}

export default function LeadsPage() {
  const params = useParams();
  const slug = typeof params?.project === "string" ? params.project : "";

  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);
  const limit = 50;

  async function fetchLeads() {
    setLoading(true); setError(null);
    try {
      const p = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) p.set("search", search);
      if (statusFilter) p.set("status", statusFilter);
      const res = await fetch(`/api/admin/leads?${p}`);
      const result = await res.json();
      if (result.success) { setLeads(result.data); setTotalPages(result.pagination.totalPages); setTotal(result.pagination.total); }
      else setError(result.message || "Failed to fetch leads.");
    } catch { setError("Failed to fetch leads."); }
    finally { setLoading(false); }
  }

  React.useEffect(() => { fetchLeads(); }, [page, statusFilter]);

  function handleSearch() { setPage(1); fetchLeads(); }

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/leads", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
      const result = await res.json();
      if (result.success) { setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l)); if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, status }); }
    } catch { /* ignore */ } finally { setUpdatingId(null); }
  }

  async function deleteLead(id: string) {
    if (!confirm("Delete this lead permanently?")) return;
    try {
      const res = await fetch("/api/admin/leads", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      const result = await res.json();
      if (result.success) { setLeads((prev) => prev.filter((l) => l.id !== id)); if (selectedLead?.id === id) setSelectedLead(null); }
    } catch { /* ignore */ }
  }

  const inputClass = "rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-[#555] focus:border-[#D4AF37]/30";

  return (
    <DashboardShell activeView="leads">
      <div className="space-y-6 px-3 py-4 sm:px-4 lg:p-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-semibold text-white">Contact Leads</h1>
          <p className="text-sm text-[#888]">Manage inquiries from all websites</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#555]" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search leads..." className={cn(inputClass, "pl-10")} />
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
            ) : leads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg font-medium text-[#888]">No leads found</p>
                <p className="mt-1 text-sm text-[#555]">Leads will appear here when visitors submit contact forms.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {leads.map((lead) => (
                  <motion.div key={lead.id} layout initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSelectedLead(lead)}
                    className={cn("cursor-pointer rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-[#D4AF37]/20", selectedLead?.id === lead.id && "border-[#D4AF37]/30")}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-white truncate">{lead.name}</h3>
                          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider shrink-0", STATUS_COLORS[lead.status])}>{STATUS_LABELS[lead.status] || lead.status}</span>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#555]">
                          {lead.email && <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{lead.email}</span>}
                          {lead.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</span>}
                          {lead.company && <span className="inline-flex items-center gap-1"><Building2 className="h-3 w-3" />{lead.company}</span>}
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-[10px] text-[#444]">
                          <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(lead.createdAt)}</span>
                          {lead.source && <span className="inline-flex items-center gap-1"><Globe className="h-3 w-3" />{lead.source}</span>}
                          {lead.service && <span>{lead.service}</span>}
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
            {selectedLead ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-5 sticky top-20">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Lead Details</h3>
                  <button onClick={() => setSelectedLead(null)} className="text-[#555] hover:text-white"><X className="h-4 w-4" /></button>
                </div>
                <div className="space-y-3">
                  <div><p className="text-[10px] font-semibold uppercase tracking-wider text-[#555]">Name</p><p className="text-sm text-white">{selectedLead.name}</p></div>
                  {selectedLead.email && <div><p className="text-[10px] font-semibold uppercase tracking-wider text-[#555]">Email</p><p className="text-sm text-white">{selectedLead.email}</p></div>}
                  {selectedLead.phone && <div><p className="text-[10px] font-semibold uppercase tracking-wider text-[#555]">Phone</p><p className="text-sm text-white">{selectedLead.phone}</p></div>}
                  {selectedLead.company && <div><p className="text-[10px] font-semibold uppercase tracking-wider text-[#555]">Company</p><p className="text-sm text-white">{selectedLead.company}</p></div>}
                  {selectedLead.service && <div><p className="text-[10px] font-semibold uppercase tracking-wider text-[#555]">Service</p><p className="text-sm text-white">{selectedLead.service}</p></div>}
                  {selectedLead.source && <div><p className="text-[10px] font-semibold uppercase tracking-wider text-[#555]">Source Website</p><p className="text-sm text-white">{selectedLead.source}</p></div>}
                  {selectedLead.sourceService && <div><p className="text-[10px] font-semibold uppercase tracking-wider text-[#555]">Source Service</p><p className="text-sm text-white">{selectedLead.sourceService}</p></div>}
                  <div><p className="text-[10px] font-semibold uppercase tracking-wider text-[#555]">Submitted</p><p className="text-sm text-white">{formatDate(selectedLead.createdAt)}</p></div>
                </div>
                {selectedLead.message && (<div><p className="text-[10px] font-semibold uppercase tracking-wider text-[#555]">Message</p><p className="mt-1 text-sm text-[#aaa] leading-relaxed">{selectedLead.message}</p></div>)}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#555] mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.filter(Boolean).map((s) => (
                      <button key={s} onClick={() => updateStatus(selectedLead.id, s)} disabled={updatingId === selectedLead.id}
                        className={cn("rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                          selectedLead.status === s ? `${STATUS_COLORS[s]} border-current` : "border-white/[0.06] text-[#666] hover:bg-white/[0.04]")}>
                        {updatingId === selectedLead.id ? <Loader2 className="h-3 w-3 animate-spin" /> : STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => deleteLead(selectedLead.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10">
                  <Trash2 className="h-3.5 w-3.5" /> Delete Lead
                </button>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-40 rounded-xl border border-dashed border-white/[0.06] text-sm text-[#555]">Select a lead to view details</div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
