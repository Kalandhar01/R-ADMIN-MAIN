"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";

type Lead = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  selectedServices: string[];
  projectType: string | null;
  projectLocation: string | null;
  budgetRange: string | null;
  timeline: string | null;
  message: string | null;
  status: string;
  notes: string | null;
  source: string;
  createdAt: string;
  updatedAt: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
};

const statusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal_sent: "Proposal Sent",
  won: "Won",
  lost: "Lost",
};

const statusColors: Record<string, string> = {
  new: "#8B6B4A",
  contacted: "#2563EB",
  qualified: "#7C3AED",
  proposal_sent: "#D97706",
  won: "#059669",
  lost: "#DC2626",
};

const statusBgColors: Record<string, string> = {
  new: "#F5F0EB",
  contacted: "#EFF6FF",
  qualified: "#F5F3FF",
  proposal_sent: "#FFFBEB",
  won: "#ECFDF5",
  lost: "#FEF2F2",
};

function SortIcon({
  sortBy,
  sortOrder,
  field,
}: {
  sortBy: string;
  sortOrder: "asc" | "desc";
  field: string;
}) {
  if (sortBy !== field) return <ArrowUpDown className="h-3 w-3 text-neutral-300" />;
  return sortOrder === "asc" ? (
    <ChevronUp className="h-3 w-3" style={{ color: "#8B6B4A" }} />
  ) : (
    <ChevronDown className="h-3 w-3" style={{ color: "#8B6B4A" }} />
  );
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(pagination.page),
      limit: String(pagination.limit),
      sortBy,
      sortOrder,
    });
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (search) params.set("search", search);

    try {
      const res = await fetch(`/api/construction-lead?${params}`);
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, sortBy, sortOrder, statusFilter, search]);

  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchLeads();
  }, [pagination.page, pagination.limit, sortBy, sortOrder, statusFilter, search]);
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#1A1A1A" }}>
          Leads
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#6B6560" }}>
          Manage construction consultation requests
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none transition-all focus:ring-2"
            style={{ borderColor: "#E6E1D8", backgroundColor: "#FFFFFF", color: "#1A1A1A" }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => handleStatusFilter(e.target.value)}
          className="rounded-lg border px-3 py-2.5 text-sm outline-none"
          style={{ borderColor: "#E6E1D8", backgroundColor: "#FFFFFF", color: "#1A1A1A" }}
        >
          <option value="all">All Status</option>
          {Object.entries(statusLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <span className="text-xs" style={{ color: "#6B6560" }}>
          {pagination.total} lead{pagination.total !== 1 ? "s" : ""} total
        </span>
      </div>

      {/* Table */}
      <div
        className="mt-4 overflow-hidden rounded-xl border"
        style={{ borderColor: "#E6E1D8" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#F5F0EB" }}>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "#6B6560" }}
                  onClick={() => toggleSort("fullName")}
                >
                  <span className="inline-flex items-center gap-1">
                    Name <SortIcon sortBy={sortBy} sortOrder={sortOrder} field="fullName" />
                  </span>
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "#6B6560" }}
                  onClick={() => toggleSort("email")}
                >
                  <span className="inline-flex items-center gap-1">
                    Email <SortIcon sortBy={sortBy} sortOrder={sortOrder} field="email" />
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6560" }}>
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6560" }}>
                  Services
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "#6B6560" }}
                  onClick={() => toggleSort("projectType")}
                >
                  <span className="inline-flex items-center gap-1">
                    Project <SortIcon sortBy={sortBy} sortOrder={sortOrder} field="projectType" />
                  </span>
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "#6B6560" }}
                  onClick={() => toggleSort("status")}
                >
                  <span className="inline-flex items-center gap-1">
                    Status <SortIcon sortBy={sortBy} sortOrder={sortOrder} field="status" />
                  </span>
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "#6B6560" }}
                  onClick={() => toggleSort("createdAt")}
                >
                  <span className="inline-flex items-center gap-1">
                    Created <SortIcon sortBy={sortBy} sortOrder={sortOrder} field="createdAt" />
                  </span>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B6560" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-sm text-neutral-400">
                    Loading...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-sm" style={{ color: "#6B6560" }}>
                    No leads found.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="transition-colors hover:bg-neutral-50"
                    style={{ borderTop: "1px solid #E6E1D8" }}
                  >
                    <td className="px-4 py-3 font-medium" style={{ color: "#1A1A1A" }}>
                      {lead.fullName}
                    </td>
                    <td className="px-4 py-3" style={{ color: "#6B6560" }}>
                      {lead.email}
                    </td>
                    <td className="px-4 py-3" style={{ color: "#6B6560" }}>
                      {lead.phone || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(lead.selectedServices ?? []).slice(0, 2).map((s) => (
                          <span
                            key={s}
                            className="group relative inline-block"
                          >
                            <span
                              className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105 group-hover:shadow-md"
                              style={{ backgroundColor: "#F5F0EB", color: "#8B6B4A" }}
                            >
                              {s.length > 20 ? s.slice(0, 20) + "..." : s}
                            </span>
                            <span
                              className="pointer-events-none absolute -top-1 left-1/2 z-10 w-max max-w-[260px] -translate-x-1/2 -translate-y-full rounded-lg px-3 py-2 text-xs leading-relaxed opacity-0 shadow-lg transition-all duration-300 ease-out group-hover:-translate-y-[calc(100%+6px)] group-hover:opacity-100"
                              style={{ backgroundColor: "#1A1A1A", color: "#F8F6F2" }}
                            >
                              {s}
                            </span>
                          </span>
                        ))}
                        {(lead.selectedServices ?? []).length > 2 && (
                          <span className="text-[10px] text-neutral-400">
                            +{lead.selectedServices.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: "#6B6560" }}>
                      {lead.projectType || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                        style={{
                          color: statusColors[lead.status],
                          backgroundColor: statusBgColors[lead.status],
                        }}
                      >
                        {statusLabels[lead.status] || lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#6B6560" }}>
                      {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold transition-colors hover:underline"
                        style={{ color: "#8B6B4A" }}
                      >
                        View <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs" style={{ color: "#6B6560" }}>
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page <= 1}
              className="rounded-lg border px-3 py-1.5 text-sm transition-all disabled:opacity-40"
              style={{ borderColor: "#E6E1D8", backgroundColor: "#FFFFFF", color: "#1A1A1A" }}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-medium" style={{ color: "#4A4540" }}>
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              disabled={!pagination.hasMore}
              className="rounded-lg border px-3 py-1.5 text-sm transition-all disabled:opacity-40"
              style={{ borderColor: "#E6E1D8", backgroundColor: "#FFFFFF", color: "#1A1A1A" }}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
