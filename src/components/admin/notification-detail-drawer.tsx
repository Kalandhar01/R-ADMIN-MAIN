"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  Circle,
  Archive,
  Trash2,
  ExternalLink,
  Download,
  Loader2,
  Mail,
  Phone,
  Building2,
  BriefcaseBusiness,
  GraduationCap,
  Calendar,
  User,
  MessageSquare,
  Tag,
  Globe,
  FileText,
  LucideIcon,
} from "lucide-react";
import type { NotificationRow } from "@ractysh/types/admin";
import { cn } from "@/lib/utils";

type EntityDetail = Record<string, unknown>;

type DetailField = {
  label: string;
  value: unknown;
  icon?: LucideIcon;
  format?: "date" | "url" | "download";
};

export function NotificationDetailDrawer({
  notification,
  isOpen,
  onClose,
  onMarkRead,
  onMarkUnread,
  onArchive,
  onDelete,
}: {
  notification: NotificationRow | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkUnread: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [entityData, setEntityData] = React.useState<EntityDetail | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen || !notification?.entityType || !notification?.entityId) {
      setEntityData(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(
      `/api/admin/entity-detail?entityType=${encodeURIComponent(notification.entityType)}&entityId=${encodeURIComponent(notification.entityId)}`
    )
      .then((res) => res.json())
      .then((result) => {
        if (cancelled) return;
        if (result.success && result.data) {
          setEntityData(result.data);
        } else {
          setError(result.message || "Failed to load details.");
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to load details.");
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [isOpen, notification?.entityType, notification?.entityId]);

  const fields = React.useMemo((): DetailField[] => {
    if (!entityData) return [];
    const entityType = notification?.entityType || "";
    const data = entityData;

    if (entityType === "ContactInquiry") {
      return [
        { label: "Full Name", value: data.name, icon: User },
        { label: "Email", value: data.email, icon: Mail },
        { label: "Phone", value: data.phone, icon: Phone },
        { label: "Service", value: data.service, icon: Tag },
        { label: "Subject", value: data.subject, icon: FileText },
        { label: "Message", value: data.message, icon: MessageSquare },
        { label: "Submitted Date", value: data.createdAt, icon: Calendar, format: "date" },
        { label: "Status", value: data.status },
      ];
    }

    if (entityType === "Consultation") {
      return [
        { label: "Full Name", value: data.fullName, icon: User },
        { label: "Email", value: data.emailAddress, icon: Mail },
        { label: "Phone", value: data.phoneNumber, icon: Phone },
        { label: "Company", value: data.companyName, icon: Building2 },
        { label: "Service Requested", value: data.serviceType, icon: Tag },
        { label: "Budget", value: data.budgetRange, icon: Tag },
        { label: "Project Description", value: data.projectDescription, icon: MessageSquare },
        { label: "Timeline", value: data.projectTimeline, icon: Calendar },
        { label: "Consultation Type", value: data.preferredConsultationType },
        { label: "Submitted Date", value: data.createdAt, icon: Calendar, format: "date" },
        { label: "Status", value: data.status },
      ];
    }

    if (entityType === "CareerApplication") {
      return [
        { label: "Full Name", value: data.fullName, icon: User },
        { label: "Email", value: data.email, icon: Mail },
        { label: "Phone", value: data.phone, icon: Phone },
        { label: "Position Applied", value: data.position, icon: BriefcaseBusiness },
        { label: "Experience", value: data.experience, icon: BriefcaseBusiness },
        { label: "College", value: data.college, icon: GraduationCap },
        { label: "Graduation Year", value: data.graduationYear, icon: Calendar },
        { label: "Skills", value: Array.isArray(data.skills) ? data.skills.join(", ") : data.skills, icon: Tag },
        { label: "Cover Letter", value: data.coverLetter, icon: FileText },
        { label: "Message", value: data.message, icon: MessageSquare },
        { label: "Applied Date", value: data.createdAt, icon: Calendar, format: "date" },
        { label: "Status", value: data.status },
      ];
    }

    if (entityType === "NewsletterSubscriber" || entityType === "Subscriber") {
      return [
        { label: "Email", value: data.email, icon: Mail },
        { label: "Source", value: data.source || data.division, icon: Globe },
        { label: "Subscription Date", value: data.createdAt, icon: Calendar, format: "date" },
      ];
    }

    if (entityType === "DemoInquiry") {
      return [
        { label: "Full Name", value: data.fullName, icon: User },
        { label: "Email", value: data.email, icon: Mail },
        { label: "Phone", value: data.phone, icon: Phone },
        { label: "Company", value: data.companyName, icon: Building2 },
        { label: "Discussion Topic", value: data.discussionTopic, icon: Tag },
        { label: "Message", value: data.message, icon: MessageSquare },
        { label: "Submitted Date", value: data.createdAt, icon: Calendar, format: "date" },
      ];
    }

    if (entityType === "ServiceRequest") {
      return [
        { label: "Name", value: data.name, icon: User },
        { label: "Email", value: data.email, icon: Mail },
        { label: "Division", value: data.division, icon: Building2 },
        { label: "Service", value: data.service, icon: Tag },
        { label: "Route", value: data.route, icon: Globe },
        { label: "Submitted Date", value: data.createdAt, icon: Calendar, format: "date" },
      ];
    }

    return Object.entries(data).map(([key, value]) => ({
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
      value: value as string,
    }));
  }, [entityData, notification?.entityType]);

  const adminRecordUrl = React.useMemo(() => {
    if (!notification) return null;
    const entityType = notification.entityType || "";
    const id = notification.entityId || "";

    if (entityType === "ContactInquiry" || entityType === "contactInquiry") return `/admin/contacts/${id}`;
    if (entityType === "CareerApplication" || entityType === "careerApplication") return `/admin/careers/${id}`;
    if (entityType === "Consultation" || entityType === "consultation") return `/admin/consultations/${id}`;
    if (entityType === "NewsletterSubscriber" || entityType === "Subscriber") return `/admin/subscribers/${id}`;
    return null;
  }, [notification]);

  function formatValue(value: unknown, format?: string): string {
    if (value === null || value === undefined || value === "") return "";
    if (format === "date") {
      const d = new Date(value as string);
      return isNaN(d.getTime()) ? String(value) : d.toLocaleString();
    }
    return String(value);
  }

  function hasValue(value: unknown): boolean {
    return value !== null && value !== undefined && value !== "";
  }

  const entityType = notification?.entityType || "";
  const resumeUrl = entityType === "CareerApplication" && entityData?.resumeUrl ? String(entityData.resumeUrl) : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="fixed bottom-0 right-0 z-50 h-full w-full border-l border-white/[0.06] bg-[#0a0a0a] sm:max-w-lg lg:max-w-xl overflow-hidden"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 sm:px-6">
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-lg font-semibold text-white">
                    {notification?.title || "Notification Details"}
                  </h2>
                  <p className="truncate text-xs text-[#888]">
                    {entityType === "ContactInquiry" && "Contact Inquiry"}
                    {entityType === "Consultation" && "Consultation Request"}
                    {entityType === "CareerApplication" && "Career Application"}
                    {entityType === "NewsletterSubscriber" && "Newsletter Subscriber"}
                    {entityType === "Subscriber" && "Newsletter Subscriber"}
                    {entityType === "DemoInquiry" && "Demo Inquiry"}
                    {entityType === "ServiceRequest" && "Service Request"}
                    {!["ContactInquiry", "Consultation", "CareerApplication", "NewsletterSubscriber", "Subscriber", "DemoInquiry", "ServiceRequest"].includes(entityType) && entityType}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#666] transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
                {loading && (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" />
                    <span className="ml-3 text-sm text-[#888]">Loading details...</span>
                  </div>
                )}

                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                    {error}
                  </div>
                )}

                {!loading && !error && fields.length > 0 && (
                  <div className="space-y-3">
                    {fields.map((field, i) => {
                      if (!hasValue(field.value)) return null;
                      const Icon = field.icon;
                      return (
                        <motion.div
                          key={field.label}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className={cn(
                            "rounded-xl border border-white/[0.06] bg-white/[0.02] p-4",
                            field.label === "Message" || field.label === "Project Description" || field.label === "Cover Letter"
                              ? "sm:col-span-2"
                              : ""
                          )}
                        >
                          <div className="flex items-start gap-3">
                            {Icon && (
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04]">
                                <Icon className="h-4 w-4 text-[#D4AF37]" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-medium uppercase tracking-wider text-[#555]">
                                {field.label}
                              </p>
                              <p className="mt-1 text-sm text-white break-words">
                                {formatValue(field.value, field.format)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                    {resumeUrl && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <Download className="h-5 w-5 text-[#D4AF37]" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white">Resume</p>
                            <p className="text-xs text-[#888]">Download the submitted resume</p>
                          </div>
                          <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#D4AF37] px-3 py-1.5 text-xs font-semibold text-[#050505] transition-opacity hover:opacity-90"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {!loading && !error && fields.length === 0 && entityData && (
                  <div className="py-16 text-center text-sm text-[#555]">No details available.</div>
                )}
              </div>

              <div className="border-t border-white/[0.06] px-4 py-3 sm:px-6">
                <div className="flex flex-wrap items-center gap-2">
                  {notification?.status === "unread" && (
                    <button
                      onClick={() => notification && onMarkRead(notification.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Mark as Read
                    </button>
                  )}
                  {notification?.status === "read" && (
                    <button
                      onClick={() => notification && onMarkUnread(notification.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400 transition-colors hover:bg-amber-500/20"
                    >
                      <Circle className="h-3.5 w-3.5" />
                      Mark as Unread
                    </button>
                  )}
                  {notification?.status !== "archived" && (
                    <button
                      onClick={() => notification && onArchive(notification.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-[#888] transition-colors hover:bg-white/[0.06] hover:text-white"
                    >
                      <Archive className="h-3.5 w-3.5" />
                      Archive
                    </button>
                  )}
                  <button
                    onClick={() => notification && onDelete(notification.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                  {adminRecordUrl && (
                    <a
                      href={adminRecordUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-1.5 text-xs font-medium text-[#D4AF37] transition-colors hover:bg-[#D4AF37]/20"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open Record
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
