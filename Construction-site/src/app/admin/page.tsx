"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  TrendingUp,
  Award,
  ArrowRight,
  BarChart3,
  Activity,
} from "lucide-react";

type Analytics = {
  total: number;
  byStatus: {
    new: number;
    contacted: number;
    qualified: number;
    proposal_sent: number;
    won: number;
    lost: number;
  };
  serviceAnalytics: { name: string; count: number; percentage: number }[];
  leadsThisWeek: number;
};

const statusColors: Record<string, string> = {
  new: "#8B6B4A",
  contacted: "#2563EB",
  qualified: "#7C3AED",
  proposal_sent: "#D97706",
  won: "#059669",
  lost: "#DC2626",
};

const statusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal_sent: "Proposal Sent",
  won: "Won",
  lost: "Lost",
};

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/construction-lead/analytics")
      .then((r) => r.json())
      .then(setAnalytics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#8B6B4A] border-t-transparent" />
      </div>
    );
  }

  const stats = [
    {
      label: "Total Leads",
      value: analytics?.total ?? 0,
      icon: Users,
      color: "#8B6B4A",
      bg: "#F5F0EB",
    },
    {
      label: "New This Week",
      value: analytics?.leadsThisWeek ?? 0,
      icon: Activity,
      color: "#2563EB",
      bg: "#EFF6FF",
    },
    {
      label: "Qualified",
      value: analytics?.byStatus.qualified ?? 0,
      icon: TrendingUp,
      color: "#7C3AED",
      bg: "#F5F3FF",
    },
    {
      label: "Won Projects",
      value: analytics?.byStatus.won ?? 0,
      icon: Award,
      color: "#059669",
      bg: "#ECFDF5",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "#1A1A1A" }}>
          Dashboard
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#6B6560" }}>
          Construction lead management overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border p-5"
            style={{ borderColor: "#E6E1D8", backgroundColor: "#FFFFFF" }}
          >
            <div className="flex items-center justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: stat.bg }}
              >
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold" style={{ color: "#1A1A1A" }}>
              {stat.value}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide" style={{ color: "#6B6560" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Status breakdown */}
      <div
        className="mt-8 rounded-xl border p-6"
        style={{ borderColor: "#E6E1D8", backgroundColor: "#FFFFFF" }}
      >
        <h2 className="text-base font-bold" style={{ color: "#1A1A1A" }}>
          Leads by Status
        </h2>
        <div className="mt-5 space-y-3">
          {Object.entries(analytics?.byStatus ?? {}).map(([key, count]) => (
            <div key={key} className="flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: statusColors[key] }}
              />
              <span className="flex-1 text-sm" style={{ color: "#4A4540" }}>
                {statusLabels[key]}
              </span>
              <span className="text-sm font-semibold" style={{ color: "#1A1A1A" }}>
                {count}
              </span>
              <div className="h-2 w-32 overflow-hidden rounded-full bg-neutral-100 sm:w-48">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${analytics && analytics.total > 0 ? (count / analytics.total) * 100 : 0}%`,
                    backgroundColor: statusColors[key],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Analytics */}
      {analytics?.serviceAnalytics && analytics.serviceAnalytics.length > 0 && (
        <div
          className="mt-8 rounded-xl border p-6"
          style={{ borderColor: "#E6E1D8", backgroundColor: "#FFFFFF" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold" style={{ color: "#1A1A1A" }}>
              Most Requested Services
            </h2>
            <BarChart3 className="h-4 w-4" style={{ color: "#8B6B4A" }} />
          </div>
          <div className="mt-5 space-y-3">
            {analytics.serviceAnalytics.slice(0, 8).map((svc) => (
              <div key={svc.name} className="flex items-center gap-3">
                <span className="flex-1 text-sm truncate" style={{ color: "#4A4540" }}>
                  {svc.name}
                </span>
                <span className="text-xs font-medium" style={{ color: "#6B6560" }}>
                  {svc.count} ({svc.percentage}%)
                </span>
                <div className="h-2 w-24 overflow-hidden rounded-full bg-neutral-100 sm:w-32">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${svc.percentage}%`,
                      backgroundColor: "#8B6B4A",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-8">
        <Link
          href="/admin/leads"
          className="group inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition-all"
          style={{ backgroundColor: "#8B6B4A" }}
        >
          View All Leads
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
