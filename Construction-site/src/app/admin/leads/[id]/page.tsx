"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
} from "lucide-react";

type StatusHistoryEntry = {
  id: string;
  fromStatus: string | null;
  toStatus: string;
  note: string | null;
  changedBy: string | null;
  createdAt: string;
};

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
  statusHistory: StatusHistoryEntry[];
};

const statuses = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal_sent", label: "Proposal Sent" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
] as const;

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

export default function LeadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const fetchLead = () => {
    setLoading(true);
    fetch(`/api/construction-lead/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setLead(data);
        }
      })
      .catch(() => setError("Failed to load lead"))
      .finally(() => setLoading(false));
  };

  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchLead();
  }, [params.id]);
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */

  const updateStatus = async (newStatus: string) => {
    if (!lead) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/construction-lead/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, note }),
      });
      const data = await res.json();
      if (data.error) {
        setError(typeof data.error === "string" ? data.error : "Update failed");
      } else {
        setLead(data);
        setNote("");
        setError("");
      }
    } catch {
      setError("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#8B6B4A] border-t-transparent" />
      </div>
    );
  }

  if (error && !lead) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-red-500">{error}</p>
        <Link
          href="/admin/leads"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold"
          style={{ color: "#8B6B4A" }}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Leads
        </Link>
      </div>
    );
  }

  if (!lead) return null;

  const currentStatusIndex = statuses.findIndex((s) => s.value === lead.status);
  const statusLabel =
    statuses.find((s) => s.value === lead.status)?.label ?? lead.status;

  return (
    <div>
      {/* Back */}
      <Link
        href="/admin/leads"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:underline"
        style={{ color: "#6B6560" }}
      >
        <ArrowLeft className="h-4 w-4" /> Back to Leads
      </Link>

      {/* Header */}
      <div
        className="mb-8 rounded-xl border p-6"
        style={{ borderColor: "#E6E1D8", backgroundColor: "#FFFFFF" }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#1A1A1A" }}>
              {lead.fullName}
            </h1>
            <p className="mt-1 text-sm" style={{ color: "#6B6560" }}>
              Lead from {lead.source}
            </p>
          </div>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium"
            style={{
              color: statusColors[lead.status],
              backgroundColor: statusBgColors[lead.status],
            }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: statusColors[lead.status] }}
            />
            {statusLabel}
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem icon={Mail} label="Email" value={lead.email} />
          <InfoItem icon={Phone} label="Phone" value={lead.phone || "Not provided"} />
          <InfoItem icon={MapPin} label="Location" value={lead.projectLocation || "Not specified"} />
          <InfoItem
            icon={Calendar}
            label="Submitted"
            value={new Date(lead.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Project Details */}
          <div
            className="rounded-xl border p-6"
            style={{ borderColor: "#E6E1D8", backgroundColor: "#FFFFFF" }}
          >
            <h2 className="text-base font-bold" style={{ color: "#1A1A1A" }}>
              Project Information
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "#6B6560" }}>
                  Project Type
                </p>
                <p className="mt-1 text-sm font-medium" style={{ color: "#1A1A1A" }}>
                  {lead.projectType || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "#6B6560" }}>
                  Budget Range
                </p>
                <p className="mt-1 text-sm font-medium" style={{ color: "#1A1A1A" }}>
                  {lead.budgetRange || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "#6B6560" }}>
                  Timeline
                </p>
                <p className="mt-1 text-sm font-medium" style={{ color: "#1A1A1A" }}>
                  {lead.timeline || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "#6B6560" }}>
                  Last Updated
                </p>
                <p className="mt-1 text-sm font-medium" style={{ color: "#1A1A1A" }}>
                  {new Date(lead.updatedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Selected Services */}
          <div
            className="rounded-xl border p-6"
            style={{ borderColor: "#E6E1D8", backgroundColor: "#FFFFFF" }}
          >
            <h2 className="text-base font-bold" style={{ color: "#1A1A1A" }}>
              Selected Services
            </h2>
            {lead.selectedServices.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {lead.selectedServices.map((s) => (
                  <span
                    key={s}
                    className="rounded-full px-3 py-1 text-sm font-medium"
                    style={{ backgroundColor: "#F5F0EB", color: "#8B6B4A" }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm" style={{ color: "#6B6560" }}>
                No specific services selected
              </p>
            )}
          </div>

          {/* Message */}
          {lead.message && (
            <div
              className="rounded-xl border p-6"
              style={{ borderColor: "#E6E1D8", backgroundColor: "#FFFFFF" }}
            >
              <h2 className="text-base font-bold" style={{ color: "#1A1A1A" }}>
                Project Details
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "#4A4540" }}>
                {lead.message}
              </p>
            </div>
          )}

          {/* Status History */}
          <div
            className="rounded-xl border p-6"
            style={{ borderColor: "#E6E1D8", backgroundColor: "#FFFFFF" }}
          >
            <h2 className="text-base font-bold" style={{ color: "#1A1A1A" }}>
              Status History
            </h2>
            {lead.statusHistory.length === 0 ? (
              <p className="mt-3 text-sm" style={{ color: "#6B6560" }}>
                No status changes yet.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {lead.statusHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="relative flex gap-3 rounded-lg p-3"
                    style={{ backgroundColor: "#F8F6F2" }}
                  >
                    <div className="mt-0.5">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor: statusColors[entry.toStatus] || "#8B6B4A",
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium">
                        {entry.fromStatus
                          ? `${statuses.find((s) => s.value === entry.fromStatus)?.label || entry.fromStatus} → ${statuses.find((s) => s.value === entry.toStatus)?.label || entry.toStatus}`
                          : `Set to ${statuses.find((s) => s.value === entry.toStatus)?.label || entry.toStatus}`}
                      </p>
                      {entry.note && (
                        <p className="mt-1 text-xs" style={{ color: "#6B6560" }}>
                          {entry.note}
                        </p>
                      )}
                      <p className="mt-1 text-[10px]" style={{ color: "#9CA3AF" }}>
                        {new Date(entry.createdAt).toLocaleString("en-IN")}
                        {entry.changedBy ? ` by ${entry.changedBy}` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Status Management */}
        <div className="space-y-6">
          <div
            className="rounded-xl border p-6"
            style={{ borderColor: "#E6E1D8", backgroundColor: "#FFFFFF" }}
          >
            <h2 className="text-base font-bold" style={{ color: "#1A1A1A" }}>
              Update Status
            </h2>

            {/* Status progress */}
            <div className="mt-5 space-y-2">
              {statuses.map((s, i) => {
                const isCurrent = s.value === lead.status;
                const isPast = i < currentStatusIndex;
                return (
                  <button
                    key={s.value}
                    disabled={updating || isCurrent}
                    onClick={() => updateStatus(s.value)}
                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-all ${
                      isCurrent
                        ? "ring-2"
                        : "hover:bg-neutral-50"
                    }`}
                    style={{
                      backgroundColor: isCurrent
                        ? statusBgColors[s.value]
                        : "transparent",
                      borderColor: isCurrent ? statusColors[s.value] : "transparent",
                      color: isCurrent ? statusColors[s.value] : "#4A4540",
                    }}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                        isPast
                          ? "text-white"
                          : isCurrent
                          ? "text-white"
                          : "border-2"
                      }`}
                      style={{
                        backgroundColor: isPast || isCurrent ? statusColors[s.value] : "transparent",
                        borderColor: isCurrent ? statusColors[s.value] : "#D1D5DB",
                        color: isPast || isCurrent ? "#FFFFFF" : "#6B6560",
                      }}
                    >
                      {isPast ? (
                        <CheckCircle className="h-3.5 w-3.5" />
                      ) : (
                        i + 1
                      )}
                    </span>
                    <span className="flex-1">{s.label}</span>
                    {isCurrent && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider">
                        Current
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Note input */}
            <div className="mt-5">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide" style={{ color: "#6B6560" }}>
                Add Note (optional)
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Reason for this status change..."
                className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none transition-all focus:ring-2"
                style={{ borderColor: "#E6E1D8", backgroundColor: "#F8F6F2", color: "#1A1A1A" }}
              />
            </div>

            {error && (
              <p className="mt-3 text-xs text-red-500">{error}</p>
            )}
          </div>

          {/* Quick actions */}
          <div
            className="rounded-xl border p-6"
            style={{ borderColor: "#E6E1D8", backgroundColor: "#FFFFFF" }}
          >
            <h2 className="text-base font-bold" style={{ color: "#1A1A1A" }}>
              Quick Actions
            </h2>
            <div className="mt-3 space-y-2">
              <a
                href={`mailto:${lead.email}`}
                className="flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-neutral-50"
                style={{ color: "#4A4540" }}
              >
                <Mail className="h-4 w-4" style={{ color: "#8B6B4A" }} />
                Send Email
              </a>
              {lead.phone && (
                <a
                  href={`tel:${lead.phone}`}
                  className="flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-neutral-50"
                  style={{ color: "#4A4540" }}
                >
                  <Phone className="h-4 w-4" style={{ color: "#8B6B4A" }} />
                  Call Client
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#8B6B4A" }} />
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: "#6B6560" }}>
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium" style={{ color: "#1A1A1A" }}>
          {value}
        </p>
      </div>
    </div>
  );
}
