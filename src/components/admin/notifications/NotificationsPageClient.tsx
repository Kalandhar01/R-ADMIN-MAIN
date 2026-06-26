"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Loader2, CheckCheck, Trash2, ChevronLeft, ChevronRight,
  MailOpen, Mail, AlertCircle, ArrowUp, AlertTriangle,
  MessageCircle, BriefcaseBusiness, Users, BookOpenText, Send, ShieldCheck,
  Building2, HardHat, Home, Globe, Landmark,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NotificationRow = {
  id: string;
  title: string;
  message: string;
  project: string;
  division: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "unread" | "read" | "archived";
  entity: string | null;
  entityId: string | null;
  actionUrl: string | null;
  createdAt: string;
  readAt: string | null;
  archivedAt: string | null;
};

const PRIORITY_STYLES: Record<string, string> = {
  critical: "bg-red-500/15 text-red-400 border-red-500/20",
  high: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  medium: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  low: "bg-[#555]/15 text-[#888] border-[#555]/20",
};

const PRIORITY_ICONS: Record<string, React.ElementType> = {
  critical: AlertCircle,
  high: ArrowUp,
  medium: AlertTriangle,
  low: Bell,
};

const MODULE_ICONS: Record<string, React.ElementType> = {
  ContactInquiry: MessageCircle,
  Consultation: MessageCircle,
  CareerApplication: BriefcaseBusiness,
  NewsletterSubscriber: Send,
  Subscriber: Users,
  Blog: BookOpenText,
  ServiceOffer: ShieldCheck,
  DemoInquiry: MessageCircle,
};

const DIVISION_ICONS: Record<string, React.ElementType> = {
  architecture: Building2,
  construction: HardHat,
  "real-estate": Home,
  "import-export": Globe,
  otc: Landmark,
};

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const now = Date.now();
  const diff = now - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDivision(division: string): string {
  return division.charAt(0).toUpperCase() + division.slice(1).replace("-", " ");
}

function formatModule(entity: string | null): string {
  if (!entity) return "General";
  return entity.replace(/([A-Z])/g, " $1").trim();
}

export function NotificationsPageClient({ projectSlug }: { projectSlug: string }) {
  const [notifications, setNotifications] = React.useState<NotificationRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const [unreadCount, setUnreadCount] = React.useState(0);

  async function fetchNotifications() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount || 0);
      } else {
        setError("Failed to load notifications");
      }
    } catch {
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { fetchNotifications(); }, []);

  const unreadIds = notifications.filter((n) => n.status === "unread").map((n) => n.id);

  async function handleMarkRead(ids: string[]) {
    setActionLoading("markRead");
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markRead", ids }),
      });
      if ((await res.json()).success) {
        setNotifications((prev) => prev.map((n) => ids.includes(n.id) ? { ...n, status: "read" as const, readAt: new Date().toISOString() } : n));
        setUnreadCount((prev) => Math.max(0, prev - ids.length));
        setSelectedIds(new Set());
      }
    } catch { /* */ }
    finally { setActionLoading(null); }
  }

  async function handleMarkAllRead() {
    setActionLoading("markAllRead");
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markAllRead" }),
      });
      if ((await res.json()).success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, status: "read" as const, readAt: n.readAt || new Date().toISOString() })));
        setUnreadCount(0);
        setSelectedIds(new Set());
      }
    } catch { /* */ }
    finally { setActionLoading(null); }
  }

  async function handleDelete(ids: string[]) {
    setActionLoading("delete");
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", ids }),
      });
      if ((await res.json()).success) {
        setNotifications((prev) => prev.filter((n) => !ids.includes(n.id)));
        setUnreadCount((prev) => Math.max(0, prev - notifications.filter((n) => ids.includes(n.id) && n.status === "unread").length));
        setSelectedIds(new Set());
      }
    } catch { /* */ }
    finally { setActionLoading(null); }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const [page, setPage] = React.useState(1);
  const perPage = 20;
  const totalPages = Math.ceil(notifications.length / perPage);
  const paginated = notifications.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="px-3 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Notifications</h1>
          <p className="text-xs text-[#888]">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} disabled={actionLoading === "markAllRead"}
              className="flex items-center gap-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] px-3 py-2 text-xs font-medium text-[#888] hover:bg-white/[0.08] hover:text-white disabled:opacity-40">
              {actionLoading === "markAllRead" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCheck className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">Mark All Read</span>
            </button>
          )}
          {selectedIds.size > 0 && (
            <>
              <button onClick={() => handleMarkRead(Array.from(selectedIds))} disabled={actionLoading === "markRead"}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#888] hover:bg-white/[0.06] hover:text-white disabled:opacity-40">
                {actionLoading === "markRead" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MailOpen className="h-3.5 w-3.5" />}
              </button>
              <button onClick={() => handleDelete(Array.from(selectedIds))} disabled={actionLoading === "delete"}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#888] hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40">
                {actionLoading === "delete" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">{error}</div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-white/[0.04] bg-white/[0.02] p-4">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/[0.06]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 rounded bg-white/[0.06]" />
                  <div className="h-3 w-64 rounded bg-white/[0.04]" />
                  <div className="flex gap-2">
                    <div className="h-5 w-16 rounded-full bg-white/[0.04]" />
                    <div className="h-5 w-16 rounded-full bg-white/[0.04]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03]">
            <Bell className="h-8 w-8 text-[#444]" />
          </div>
          <p className="text-base font-medium text-[#888]">No notifications</p>
          <p className="text-sm text-[#555] mt-1">You&apos;re all caught up.</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {paginated.map((notification) => {
                const PriorityIcon = PRIORITY_ICONS[notification.priority] || Bell;
                const ModuleIcon = MODULE_ICONS[notification.entity || ""] || Bell;
                const DivIcon = DIVISION_ICONS[notification.division] || Building2;
                const isUnread = notification.status === "unread";
                const isSelected = selectedIds.has(notification.id);

                return (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => toggleSelect(notification.id)}
                    className={cn(
                      "relative cursor-pointer rounded-xl border transition-all overflow-hidden",
                      isSelected
                        ? "border-[#D4AF37]/30 bg-[#D4AF37]/5"
                        : isUnread
                          ? "border-white/[0.08] bg-white/[0.03]"
                          : "border-white/[0.04] bg-white/[0.01]"
                    )}
                  >
                    <div className="flex items-start gap-3 p-3">
                      <div className="relative mt-0.5 shrink-0">
                        {isUnread && (
                          <span className="absolute -left-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#D4AF37]" />
                        )}
                        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg",
                          isUnread ? "bg-[#D4AF37]/10 text-[#D4AF37]" : "bg-white/[0.04] text-[#555]"
                        )}>
                          <ModuleIcon className="h-4 w-4" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h3 className={cn("text-sm truncate", isUnread ? "font-semibold text-white" : "font-medium text-[#aaa]")}>
                              {notification.title}
                            </h3>
                            <p className={cn("text-xs mt-0.5 line-clamp-2", isUnread ? "text-[#888]" : "text-[#666]")}>
                              {notification.message}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-[10px] text-[#555] whitespace-nowrap">{formatTime(notification.createdAt)}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider", PRIORITY_STYLES[notification.priority])}>
                            <PriorityIcon className="h-2.5 w-2.5" />
                            {notification.priority}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[9px] font-medium text-[#666]">
                            <DivIcon className="h-2.5 w-2.5" />
                            {formatDivision(notification.division)}
                          </span>
                          {notification.entity && (
                            <span className="rounded-full border border-white/[0.04] bg-white/[0.02] px-2 py-0.5 text-[9px] text-[#555]">
                              {formatModule(notification.entity)}
                            </span>
                          )}
                          {isUnread && (
                            <span className="text-[9px] font-medium text-[#D4AF37]">● Unread</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="flex gap-1 px-3 pb-2 border-t border-white/[0.04] pt-2">
                        {isUnread && (
                          <button onClick={(e) => { e.stopPropagation(); handleMarkRead([notification.id]); }}
                            className="flex items-center gap-1 rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-medium text-[#888] hover:bg-white/[0.08] hover:text-white">
                            <MailOpen className="h-3 w-3" /> Mark Read
                          </button>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); handleDelete([notification.id]); }}
                          className="flex items-center gap-1 rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-medium text-[#888] hover:bg-red-500/10 hover:text-red-400">
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

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
        </>
      )}
    </div>
  );
}
