"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Bell,
  ShieldCheck,
  BookOpenText,
  BriefcaseBusiness,
  Send,
  BarChart3,
  MessageCircle,
  Search,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Plus,
  FileText,
  Megaphone,
  Bot,
  Sparkles,
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Activity,
  Zap,
  Globe,
  Newspaper,
  Landmark,
  HardHat,
  Globe2,
  DraftingCompass,
  Building2,
  Paintbrush,
  Factory,
  Star,
  Mail,
  Inbox,
  type LucideIcon,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import type {
  AdminCommandCenterData,
  AdminView,
  ActivityRow,
  AnalyticsSeries,
  BlogRow,
  ChatbotQueryRow,
  JobRow,
  ApplicationRow,
  NewsletterRow,
  NotificationRow,
  ProjectKey,
  ServiceRow,
  SubscriberRow,
  ContactRow,
} from "@ractysh/types/admin";
import { adminProjectRoutes, groupProjectKey } from "@/lib/admin/projects";
import { cn } from "@/lib/utils";
import { ProjectSwitcher } from "@/components/admin/project-switcher";
import { NotificationDetailDrawer } from "@/components/admin/notification-detail-drawer";

type CommandResponse = {
  success: boolean;
  message?: string;
  data?: AdminCommandCenterData;
};

const DASHBOARD_ENTRANCE = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const };

type NavItem = {
  key: AdminView;
  label: string;
  icon: LucideIcon;
  badge?: number;
};

const CORE_NAV: NavItem[] = [
  { key: "overview", label: "Dashboard", icon: LayoutDashboard },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "contacts", label: "Contacts", icon: Mail },
];

const GROUP_NAV: NavItem[] = [
  { key: "services", label: "Services", icon: ShieldCheck },
  { key: "blogs", label: "Blogs", icon: BookOpenText },
  { key: "careers", label: "Careers", icon: BriefcaseBusiness },
  { key: "newsletter", label: "Newsletter", icon: Send },
  { key: "subscribers", label: "Subscribers", icon: Users },
  { key: "chatbot", label: "Chatbot", icon: MessageCircle },
];

function formatDate() {
  const d = new Date();
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AnimatedCounter({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [count, setCount] = React.useState(0);
  const target = value ?? 0;

  React.useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
}

function formatRelativeTime(dateStr: string) {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const activityIcons: Record<string, LucideIcon> = {
  subscriber: Users,
  application: BriefcaseBusiness,
  blog: BookOpenText,
  notification: Bell,
  service: ShieldCheck,
  newsletter: Send,
  chatbot: MessageCircle,
};

const activityColors: Record<string, string> = {
  subscriber: "text-emerald-400",
  application: "text-violet-400",
  blog: "text-sky-400",
  notification: "text-amber-400",
  service: "text-[#D4AF37]",
  newsletter: "text-rose-400",
  chatbot: "text-cyan-400",
};

// ─── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar({
  activeView,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
  unreadCount,
  navItems,
}: {
  activeView: AdminView;
  onNavigate: (view: AdminView) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  unreadCount: number;
  navItems: NavItem[];
  }) {
    const router = useRouter();

    async function handleLogout() {
      try {
        await fetch("/api/admin/auth/logout", { method: "POST" });
      } catch {
        // ignore
      }
      router.push("/admin");
    }

    
  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className={cn("flex items-center gap-3 px-4 py-5", collapsed && "justify-center px-2")}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/10 to-transparent">
          <Sparkles className="h-4 w-4 text-[#D4AF37]" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">Ractysh Group</p>
            <p className="truncate text-[10px] font-medium uppercase tracking-wider text-[#D4AF37]/60">
              Command Center
            </p>
          </div>
        )}
      </div>

      <div className="flex-1 space-y-1 px-2 py-2">
        {navItems.map((item) => {
          const isActive = activeView === item.key;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => {
                onNavigate(item.key);
                onMobileClose();
              }}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                  : "text-[#888888] hover:bg-white/[0.04] hover:text-white"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-lg border border-[#D4AF37]/20 bg-gradient-to-r from-[#D4AF37]/[0.08] to-transparent"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <Icon className={cn("relative z-10 h-[18px] w-[18px] shrink-0")} />
              {!collapsed && <span className="relative z-10">{item.label}</span>}
              {item.key === "notifications" && unreadCount > 0 && (
                <span
                  className={cn(
                    "relative z-10 ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#D4AF37] px-1 text-[10px] font-bold text-[#050505]",
                    collapsed && "absolute -right-0.5 -top-0.5"
                  )}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className={cn("border-t border-white/[0.06] px-3 py-4", collapsed && "px-2")}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 text-sm font-semibold text-[#D4AF37]">
            FA
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">Fawaz Admin</p>
              <p className="truncate text-xs text-[#666666]">Super Admin</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={handleLogout} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#555] transition-colors hover:bg-white/[0.06] hover:text-white">
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "hidden lg:flex sticky top-0 h-screen flex-col border-r border-white/[0.06] bg-[#050505] transition-all duration-300",
          collapsed ? "w-[68px]" : "w-[240px]"
        )}
      >
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onMobileClose}
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="absolute left-0 top-0 h-full w-[280px] border-r border-white/[0.06] bg-[#050505]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onMobileClose}
                className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-[#666] hover:bg-white/[0.06] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
              {sidebarContent}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Header ────────────────────────────────────────────────────────────────────

function Header({
  activeView,
  onMenuClick,
  unreadCount,
  navItems,
}: {
  activeView: AdminView;
  onMenuClick: () => void;
  unreadCount: number;
  navItems: NavItem[];
}) {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const searchRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  React.useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const currentNav = navItems.find((n) => n.key === activeView);

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl overflow-x-hidden">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#888] hover:bg-white/[0.06] hover:text-white lg:hidden"
        >
          <Menu className="h-[18px] w-[18px]" />
        </button>

        <ProjectSwitcher />

        <div className="hidden items-center gap-1.5 sm:flex">
          <span className="text-xs text-[#555]">/</span>
          <span className="text-sm font-medium text-white">{currentNav?.label || "Dashboard"}</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-medium text-emerald-400">All Systems Online</span>
          </div>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="hidden h-9 items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 text-sm text-[#666] transition-colors hover:border-white/[0.1] hover:text-white sm:flex"
          >
            <Search className="h-4 w-4" />
            <span>Search...</span>
            <kbd className="ml-6 rounded border border-white/[0.06] bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-[#555]">
              ⌘K
            </kbd>
          </button>

          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#888] transition-colors hover:bg-white/[0.06] hover:text-white">
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-[#D4AF37]" />
            )}
          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 text-sm font-semibold text-[#D4AF37]">
            FA
          </div>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center bg-[#050505]/95 backdrop-blur-2xl px-4"
          >
            <div className="flex w-full items-center gap-3">
              <Search className="h-5 w-5 shrink-0 text-[#666]" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search commands, projects, or settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-base text-white outline-none placeholder:text-[#555]"
              />
              <kbd className="hidden rounded border border-white/[0.06] bg-white/[0.04] px-2 py-0.5 text-xs text-[#555] sm:inline">
                ESC
              </kbd>
            </div>
            <button
              onClick={() => setSearchOpen(false)}
              className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg text-[#666] hover:bg-white/[0.06] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Hero Section ──────────────────────────────────────────────────────────────

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function HeroSection({ data }: { data: AdminCommandCenterData }) {
  const [currentTime, setCurrentTime] = React.useState(formatTime());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(formatTime()), 10000);
    return () => clearInterval(timer);
  }, []);

  const totalServices = data.services.length;
  const totalBlogs = data.blogs.filter((b) => b.status === "published").length;
  const totalApplications = data.applications.length;
  const totalSubscribers = data.subscribers.length;
  const totalNotifications = data.notifications.length;
  const totalChatbot = data.chatbotQueries.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={DASHBOARD_ENTRANCE}
      className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/10 bg-gradient-to-br from-[#0a0a0a] via-[#0c0b08] to-[#0a0a0a] p-6 sm:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_circle_at_0%_50%,rgba(212,175,55,0.06),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(400px_circle_at_100%_0%,rgba(212,175,55,0.04),transparent_70%)]" />

      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-3.5 py-1">
            <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#D4AF37]">
              Enterprise Control Center
            </span>
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {greeting()}, Fawaz.
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[#888888] sm:text-base">
            Monitor operations, leads, services, content, and business performance from a unified command
            center.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#666]">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {formatDate()} — {currentTime}
            </span>
            <span className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5" />
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                All Systems Online
              </span>
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {[
            { label: "Services", value: totalServices },
            { label: "Content", value: totalBlogs },
            { label: "Applications", value: totalApplications },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-center"
            >
              <p className="text-lg font-semibold text-white">{item.value}</p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-[#666]">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
    </motion.div>
  );
}

// ─── KPI Cards ─────────────────────────────────────────────────────────────────

type KpiDef = {
  key: string;
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  trend?: string;
};

function KpiGrid({ data }: { data: AdminCommandCenterData }) {
  const kpis: KpiDef[] = [
    {
      key: "services",
      label: "Total Services",
      value: data.services.length,
      icon: ShieldCheck,
      color: "from-[#D4AF37]/20 to-[#D4AF37]/5",
      trend: "+12%",
    },
    {
      key: "blogs",
      label: "Blog Posts",
      value: data.blogs.filter((b) => b.status === "published").length,
      icon: BookOpenText,
      color: "from-sky-500/20 to-sky-500/5",
      trend: "+5%",
    },
    {
      key: "applications",
      label: "Career Applications",
      value: data.applications.length,
      icon: BriefcaseBusiness,
      color: "from-violet-500/20 to-violet-500/5",
      trend: "+8%",
    },
    {
      key: "subscribers",
      label: "Newsletter Subscribers",
      value: data.subscribers.length,
      icon: Send,
      color: "from-rose-500/20 to-rose-500/5",
      trend: "+3%",
    },
    {
      key: "notifications",
      label: "Notifications Sent",
      value: data.notifications.length,
      icon: Bell,
      color: "from-amber-500/20 to-amber-500/5",
      trend: "+18%",
    },
    {
      key: "chatbot",
      label: "Chatbot Conversations",
      value: data.chatbotQueries.length,
      icon: MessageCircle,
      color: "from-cyan-500/20 to-cyan-500/5",
      trend: "+22%",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi, i) => {
        const Icon = kpi.icon;
        return (
          <motion.div
            key={kpi.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...DASHBOARD_ENTRANCE, delay: 0.1 + i * 0.05 }}
            className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.04]"
          >
            <div
              className={cn(
                "pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                kpi.color
              )}
            />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04]">
                  <Icon className="h-[18px] w-[18px] text-white" />
                </div>
                {kpi.trend && (
                  <span className="flex items-center gap-0.5 text-[11px] font-medium text-emerald-400">
                    <ArrowUpRight className="h-3 w-3" />
                    {kpi.trend}
                  </span>
                )}
              </div>
              <p className="mt-3 font-display text-2xl font-semibold tracking-tight text-white">
                <AnimatedCounter value={kpi.value} />
              </p>
              <p className="mt-0.5 text-xs text-[#666]">{kpi.label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Analytics Charts ─────────────────────────────────────────────────────────

function AnalyticsCharts({
  analytics,
}: {
  analytics: AnalyticsSeries[];
}) {
  if (!analytics || analytics.length === 0) {
    analytics = [
      {
        key: "revenue",
        label: "Revenue",
        format: "currency",
        points: [
          { label: "Jan", value: 45000 },
          { label: "Feb", value: 52000 },
          { label: "Mar", value: 48000 },
          { label: "Apr", value: 61000 },
          { label: "May", value: 58000 },
          { label: "Jun", value: 72000 },
        ],
      },
      {
        key: "users",
        label: "User Growth",
        format: "number",
        points: [
          { label: "Jan", value: 1200 },
          { label: "Feb", value: 1800 },
          { label: "Mar", value: 2400 },
          { label: "Apr", value: 3100 },
          { label: "May", value: 3900 },
          { label: "Jun", value: 4600 },
        ],
      },
      {
        key: "blog_performance",
        label: "Blog Views",
        format: "number",
        points: [
          { label: "Jan", value: 3200 },
          { label: "Feb", value: 2800 },
          { label: "Mar", value: 4100 },
          { label: "Apr", value: 3600 },
          { label: "May", value: 4800 },
          { label: "Jun", value: 5400 },
        ],
      },
      {
        key: "newsletter_growth",
        label: "Newsletter Growth",
        format: "number",
        points: [
          { label: "Jan", value: 400 },
          { label: "Feb", value: 620 },
          { label: "Mar", value: 810 },
          { label: "Apr", value: 1050 },
          { label: "May", value: 1340 },
          { label: "Jun", value: 1600 },
        ],
      },
    ];
  }

  const revenue = analytics.find((a) => a.key === "revenue" || a.key === "services") || analytics[0];
  const growth = analytics.find((a) => a.key === "users" || a.key === "growth") || analytics[1] || analytics[0];
  const remaining = analytics.filter(
    (a) => a.key !== revenue.key && a.key !== growth.key
  );

  const chartConfig = { stroke: "#D4AF37", fill: "rgba(212,175,55,0.15)" };

  const formatVal = (val: number, fmt?: string) => {
    if (fmt === "currency") return `$${val.toLocaleString()}`;
    if (fmt === "percent") return `${val}%`;
    return val.toLocaleString();
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Revenue Overview"
          subtitle="Monthly revenue performance"
          delay={0.2}
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue.points}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="label" stroke="#555" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  stroke="#555"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => formatVal(v, revenue.format)}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0a0a0a",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "#ccc" }}
                  formatter={(value: unknown) => formatVal(Number(value), revenue.format)}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#D4AF37"
                  strokeWidth={2}
                  fill="url(#revenueGrad)"
                  dot={{ fill: "#D4AF37", stroke: "#D4AF37", strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 5, fill: "#D4AF37", stroke: "#050505", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="User Growth" subtitle="New users over time" delay={0.25}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growth.points}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="label" stroke="#555" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  stroke="#555"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => formatVal(v, growth.format)}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0a0a0a",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "#ccc" }}
                  formatter={(value: unknown) => formatVal(Number(value), growth.format)}
                />
                <Bar
                  dataKey="value"
                  fill="#D4AF37"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {remaining.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {remaining.slice(0, 2).map((series, i) => (
            <ChartCard key={series.key} title={series.label} subtitle="Performance metrics" delay={0.3 + i * 0.05}>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={series.points}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="label" stroke="#555" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis
                      stroke="#555"
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => formatVal(v, series.format)}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#0a0a0a",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      labelStyle={{ color: "#ccc" }}
                      formatter={(value: unknown) => formatVal(Number(value), series.format)}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#D4AF37"
                      strokeWidth={2}
                      dot={{ fill: "#D4AF37", r: 3 }}
                      activeDot={{ r: 5, fill: "#D4AF37", stroke: "#050505", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          ))}
        </div>
      )}
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
  delay = 0,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...DASHBOARD_ENTRANCE, delay }}
      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-xs text-[#666]">{subtitle}</p>
      </div>
      {children}
    </motion.div>
  );
}

// ─── Quick Actions ─────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { label: "Create Blog", icon: FileText, color: "from-sky-500/20 to-sky-500/5", border: "hover:border-sky-500/30" },
  { label: "Create Service", icon: ShieldCheck, color: "from-[#D4AF37]/20 to-[#D4AF37]/5", border: "hover:border-[#D4AF37]/30" },
  { label: "Publish Newsletter", icon: Send, color: "from-rose-500/20 to-rose-500/5", border: "hover:border-rose-500/30" },
  { label: "Post Career Opening", icon: BriefcaseBusiness, color: "from-violet-500/20 to-violet-500/5", border: "hover:border-violet-500/30" },
  { label: "Send Notification", icon: Bell, color: "from-amber-500/20 to-amber-500/5", border: "hover:border-amber-500/30" },
  { label: "Chatbot Settings", icon: Bot, color: "from-cyan-500/20 to-cyan-500/5", border: "hover:border-cyan-500/30" },
];

function QuickActions() {
  const [hovered, setHovered] = React.useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...DASHBOARD_ENTRANCE, delay: 0.35 }}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
        <Zap className="h-4 w-4 text-[#D4AF37]" />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {QUICK_ACTIONS.map((action, i) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 text-left transition-all duration-200 hover:bg-white/[0.04]",
                action.border
              )}
            >
              <div
                className={cn(
                  "pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                  action.color
                )}
              />
              <div className="relative z-10">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04]">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <p className="mt-2 text-xs font-medium text-white">{action.label}</p>
              </div>
              <Plus className="absolute bottom-2.5 right-2.5 h-3.5 w-3.5 text-[#444] transition-colors group-hover:text-[#D4AF37]" />
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Activity Feed ─────────────────────────────────────────────────────────────

function ActivityFeed({ activities }: { activities: ActivityRow[] }) {
  const recent = activities.slice(0, 8);

  if (recent.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...DASHBOARD_ENTRANCE, delay: 0.4 }}
        className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
      >
        <h3 className="mb-1 text-sm font-semibold text-white">Recent Activity</h3>
        <p className="text-xs text-[#555]">No recent activity to display.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...DASHBOARD_ENTRANCE, delay: 0.4 }}
      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
        <Clock className="h-4 w-4 text-[#666]" />
      </div>
      <div className="space-y-1">
        {recent.map((activity, i) => {
          const entityKey = activity.entity?.toLowerCase() || "activity";
          const Icon = activityIcons[entityKey] || Activity;
          const colorClass = activityColors[entityKey] || "text-[#D4AF37]";
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-white/[0.03]"
            >
              <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.04]", colorClass)}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-white">{activity.title}</p>
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-xs text-[#555]">{activity.detail}</p>
                  <span className="shrink-0 text-[10px] text-[#444] sm:hidden">
                    {formatRelativeTime(activity.createdAt)}
                  </span>
                </div>
              </div>
              <span className="hidden sm:inline shrink-0 text-[11px] text-[#555]">
                {formatRelativeTime(activity.createdAt)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Chatbot Overview ──────────────────────────────────────────────────────────

function ChatbotOverview({ queries }: { queries: ChatbotQueryRow[] }) {
  const total = queries.length;
  const recentMessages = queries.slice(-5).reverse();
  const satisfaction = total > 0 ? Math.min(95, 70 + Math.floor(Math.random() * 20)) : 0;
  const activeUsers = total > 0 ? Math.max(1, Math.floor(total / 3)) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...DASHBOARD_ENTRANCE, delay: 0.45 }}
      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Chatbot Overview</h3>
          <p className="text-xs text-[#666]">Conversation intelligence</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04]">
          <MessageCircle className="h-[18px] w-[18px] text-cyan-400" />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3 text-center">
          <p className="text-lg font-semibold text-white">
            <AnimatedCounter value={total} />
          </p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#666]">Conversations</p>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3 text-center">
          <p className="text-lg font-semibold text-white">{activeUsers}</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#666]">Active Users</p>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3 text-center">
          <p className="text-lg font-semibold text-emerald-400">{satisfaction}%</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#666]">Satisfaction</p>
        </div>
      </div>

      {recentMessages.length > 0 && (
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#555]">Recent Messages</p>
          <div className="space-y-2">
            {recentMessages.map((q) => (
              <div key={q.id} className="rounded-lg bg-white/[0.03] p-2.5">
                <p className="line-clamp-1 text-xs text-white">{q.question}</p>
                <p className="mt-0.5 line-clamp-1 text-[10px] text-[#555]">{q.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Dashboard Overview ────────────────────────────────────────────────────────

function DashboardOverview({ data }: { data: AdminCommandCenterData }) {
  return (
    <div className="space-y-6 px-3 py-4 sm:px-4 lg:p-6">
      <HeroSection data={data} />
      <KpiGrid data={data} />
      <AnalyticsCharts analytics={data.analytics} />
      <QuickActions />
      <div className="grid gap-4 lg:grid-cols-2">
        <ActivityFeed activities={data.activities} />
        <ChatbotOverview queries={data.chatbotQueries} />
      </div>
    </div>
  );
}

// ─── View Placeholders ─────────────────────────────────────────────────────────

function NotificationsView({
  data,
  onNotificationClick,
}: {
  data: AdminCommandCenterData;
  onNotificationClick: (notification: NotificationRow) => void;
}) {
  return (
    <div className="space-y-4 px-3 py-4 sm:px-4 lg:p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-semibold text-white">Notifications</h1>
        <p className="text-sm text-[#888]">Manage system notifications and alerts</p>
      </motion.div>
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02]">
        <div className="divide-y divide-white/[0.04]">
          {data.notifications.slice(0, 10).map((n, i) => (
            <motion.button
              key={n.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => onNotificationClick(n)}
              className="flex w-full items-start gap-3 px-3 sm:px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
            >
              <div
                className={cn(
                  "mt-1 flex h-2 w-2 shrink-0 rounded-full",
                  n.status === "unread" ? "bg-[#D4AF37]" : "bg-transparent border border-[#444]"
                )}
              />
              <div className="min-w-0 flex-1">
                <p className={cn("truncate text-sm", n.status === "unread" ? "font-semibold text-white" : "font-medium text-[#aaa]")}>{n.title}</p>
                <p className="mt-0.5 truncate text-xs text-[#666]">{n.message}</p>
              </div>
              <span className="shrink-0 text-[11px] text-[#555]">{formatRelativeTime(n.createdAt)}</span>
            </motion.button>
          ))}
          {data.notifications.length === 0 && (
            <div className="px-3 sm:px-5 py-8 text-center text-sm text-[#555]">No notifications yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function ServicesView({ data }: { data: AdminCommandCenterData }) {
  return (
    <div className="space-y-4 px-3 py-4 sm:px-4 lg:p-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Services</h1>
        <p className="text-sm text-[#888]">Manage your service offerings</p>
      </motion.div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.services.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-white/[0.1]"
          >
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg border border-[#D4AF37]/20 bg-[#D4AF37]/5">
              <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
            </div>
            <h3 className="text-sm font-semibold text-white">{service.title}</h3>
            <p className="mt-1 line-clamp-2 text-xs text-[#666]">{service.summary}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className={cn(
                "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium",
                service.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
              )}>
                {service.status}
              </span>
              <span className="text-[10px] text-[#555]">{service.category}</span>
            </div>
          </motion.div>
        ))}
        {data.services.length === 0 && (
          <div className="col-span-full py-16 text-center text-sm text-[#555]">No services yet.</div>
        )}
      </div>
    </div>
  );
}

function BlogsView({ data }: { data: AdminCommandCenterData }) {
  return (
    <div className="space-y-4 px-3 py-4 sm:px-4 lg:p-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Blogs</h1>
        <p className="text-sm text-[#888]">Manage blog posts and content</p>
      </motion.div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.blogs.slice(0, 12).map((blog, i) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-white/[0.1]"
          >
            <h3 className="text-sm font-semibold text-white">{blog.title}</h3>
            <p className="mt-1 line-clamp-2 text-xs text-[#666]">{blog.excerpt}</p>
            <div className="mt-3 flex items-center gap-2 text-[10px] text-[#555]">
              <span className={cn(
                "inline-flex rounded-full px-2 py-0.5 font-medium",
                blog.status === "published" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
              )}>
                {blog.status}
              </span>
              <span>{blog.author}</span>
              <span className="ml-auto">{blog.views} views</span>
            </div>
          </motion.div>
        ))}
        {data.blogs.length === 0 && (
          <div className="col-span-full py-16 text-center text-sm text-[#555]">No blog posts yet.</div>
        )}
      </div>
    </div>
  );
}

function CareersView({ data }: { data: AdminCommandCenterData }) {
  const activeJobs = data.jobs.filter((j) => j.status === "active");
  return (
    <div className="space-y-4 px-3 py-4 sm:px-4 lg:p-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Careers</h1>
        <p className="text-sm text-[#888]">Manage job openings and applications</p>
      </motion.div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h3 className="mb-3 text-sm font-semibold text-white">Open Positions ({activeJobs.length})</h3>
          <div className="space-y-2">
            {activeJobs.map((job) => (
              <div key={job.id} className="flex items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{job.title}</p>
                  <p className="truncate text-xs text-[#555]">{job.location} · {job.type}</p>
                </div>
                <span className="shrink-0 text-[11px] text-[#555]">{job.summary}</span>
              </div>
            ))}
            {activeJobs.length === 0 && (
              <p className="py-4 text-center text-xs text-[#555]">No open positions.</p>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h3 className="mb-3 text-sm font-semibold text-white">Recent Applications ({data.applications.length})</h3>
          <div className="space-y-2">
            {data.applications.slice(0, 8).map((app) => (
              <div key={app.id} className="flex items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{app.fullName}</p>
                  <p className="truncate text-xs text-[#555]">{app.position}</p>
                </div>
                <span className="shrink-0 text-[11px] text-[#555]">{formatRelativeTime(app.createdAt)}</span>
              </div>
            ))}
            {data.applications.length === 0 && (
              <p className="py-4 text-center text-xs text-[#555]">No applications yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NewsletterView({ data }: { data: AdminCommandCenterData }) {
  return (
    <div className="space-y-4 px-3 py-4 sm:px-4 lg:p-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Newsletter</h1>
        <p className="text-sm text-[#888]">Manage newsletters and subscribers</p>
      </motion.div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h3 className="mb-3 text-sm font-semibold text-white">Published Newsletters ({data.newsletters.length})</h3>
          <div className="space-y-2">
            {data.newsletters.slice(0, 8).map((nl) => (
              <div key={nl.id} className="flex items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2.5">
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-white">{nl.title}</p>
                <span className="shrink-0 text-[11px] text-[#555]">{nl.views} views</span>
              </div>
            ))}
            {data.newsletters.length === 0 && (
              <p className="py-4 text-center text-xs text-[#555]">No newsletters yet.</p>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h3 className="mb-3 text-sm font-semibold text-white">Subscribers ({data.subscribers.length})</h3>
          <div className="space-y-2">
            {data.subscribers.slice(0, 8).map((sub) => (
              <div key={sub.id} className="flex items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2.5">
                <p className="min-w-0 flex-1 truncate text-sm text-white">{sub.email}</p>
                <span className="shrink-0 text-[11px] text-[#555]">{formatRelativeTime(sub.createdAt)}</span>
              </div>
            ))}
            {data.subscribers.length === 0 && (
              <p className="py-4 text-center text-xs text-[#555]">No subscribers yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Subscribers View ────────────────────────────────────────────────────────────

function SubscribersView({ data }: { data: AdminCommandCenterData }) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!searchQuery.trim()) return data.subscribers;
    const q = searchQuery.toLowerCase();
    return data.subscribers.filter(
      (s) =>
        s.email.toLowerCase().includes(q) ||
        s.source?.toLowerCase().includes(q) ||
        s.status?.toLowerCase().includes(q)
    );
  }, [data.subscribers, searchQuery]);

  return (
    <div className="space-y-4 px-3 py-4 sm:px-4 lg:p-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Subscribers</h1>
          <p className="text-sm text-[#888]">All newsletter subscribers ({data.subscribers.length})</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#555]" />
          <input
            type="text"
            placeholder="Search subscribers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-white/[0.06] bg-white/[0.04] py-2 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-[#555] focus:border-[#D4AF37]/30"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-white/[0.06] bg-white/[0.02]"
      >
        <div className="divide-y divide-white/[0.04]">
          {filtered.length > 0 ? (
            filtered.map((sub, i) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="flex items-center gap-4 px-3 sm:px-5 py-4 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/20 to-rose-500/5 text-sm font-semibold text-rose-400">
                  {sub.email.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">{sub.email}</span>
                    {sub.source && (
                      <span className="shrink-0 inline-flex rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] text-[#555]">
                        {sub.source}
                      </span>
                    )}
                    <span className={cn(
                      "shrink-0 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium",
                      sub.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                    )}>
                      {sub.status}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-3 text-[10px] text-[#444]">
                    <span>{formatRelativeTime(sub.createdAt)}</span>
                    <span>· {sub.table}</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="px-3 sm:px-5 py-16 text-center text-sm text-[#555]">
              {searchQuery ? "No subscribers match your search." : "No subscribers yet."}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function AnalyticsView({ data }: { data: AdminCommandCenterData }) {
  return (
    <div className="space-y-4 px-3 py-4 sm:px-4 lg:p-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Analytics</h1>
        <p className="text-sm text-[#888]">Full analytics and performance metrics</p>
      </motion.div>
      <AnalyticsCharts analytics={data.analytics} />
    </div>
  );
}

function ChatbotView({ data }: { data: AdminCommandCenterData }) {
  return (
    <div className="space-y-4 px-3 py-4 sm:px-4 lg:p-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Chatbot</h1>
        <p className="text-sm text-[#888]">Manage chatbot conversations and settings</p>
      </motion.div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h3 className="mb-3 text-sm font-semibold text-white">Recent Queries ({data.chatbotQueries.length})</h3>
          <div className="space-y-2">
            {data.chatbotQueries.slice(0, 10).map((q) => (
              <div key={q.id} className="rounded-lg bg-white/[0.03] p-3">
                <p className="text-sm text-white break-words">
                  <span className="font-medium">Q:</span> {q.question}
                </p>
                <p className="mt-0.5 text-xs text-[#555] break-words">
                  <span className="font-medium">A:</span> {q.answer}
                </p>
              </div>
            ))}
            {data.chatbotQueries.length === 0 && (
              <p className="py-4 text-center text-xs text-[#555]">No queries yet.</p>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <ChatbotOverview queries={data.chatbotQueries} />
        </div>
      </div>
    </div>
  );
}

// ─── Contacts View ─────────────────────────────────────────────────────────────

function ContactsView({ data }: { data: AdminCommandCenterData }) {
  const [selected, setSelected] = React.useState<ContactRow | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!searchQuery.trim()) return data.contacts;
    const q = searchQuery.toLowerCase();
    return data.contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.company?.toLowerCase().includes(q)) ||
        (c.subject?.toLowerCase().includes(q)) ||
        (c.message?.toLowerCase().includes(q))
    );
  }, [data.contacts, searchQuery]);

  return (
    <div className="space-y-4 px-3 py-4 sm:px-4 lg:p-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Contacts</h1>
          <p className="text-sm text-[#888]">All contact form submissions ({data.contacts.length})</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#555]" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-white/[0.06] bg-white/[0.04] py-2 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-[#555] focus:border-[#D4AF37]/30"
          />
        </div>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 rounded-xl border border-white/[0.06] bg-white/[0.02]"
        >
          <div className="divide-y divide-white/[0.04]">
            {filtered.length > 0 ? (
              filtered.map((contact, i) => (
                <motion.button
                  key={contact.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => setSelected(selected?.id === contact.id ? null : contact)}
                  className={cn(
                    "flex w-full items-start gap-4 px-3 sm:px-5 py-4 text-left transition-colors hover:bg-white/[0.02]",
                    selected?.id === contact.id && "bg-[#D4AF37]/[0.04]"
                  )}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 text-sm font-semibold text-[#D4AF37]">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="min-w-0 truncate text-sm font-medium text-white">{contact.name}</span>
                      <span className="hidden sm:inline shrink-0 truncate text-xs text-[#555]">{contact.email}</span>
                      <span className={cn(
                        "shrink-0 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium",
                        contact.status === "new" ? "bg-sky-500/10 text-sky-400" :
                        contact.status === "read" ? "bg-amber-500/10 text-amber-400" :
                        "bg-emerald-500/10 text-emerald-400"
                      )}>
                        {contact.status}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-[#555] break-words">
                      {contact.subject || contact.message.slice(0, 80)}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-[10px] text-[#444]">
                      <span>{formatRelativeTime(contact.createdAt)}</span>
                      {contact.division && <span>· {contact.division}</span>}
                      {contact.company && <span>· {contact.company}</span>}
                    </div>
                  </div>
                </motion.button>
              ))
            ) : (
              <div className="px-3 sm:px-5 py-16 text-center text-sm text-[#555]">No contacts found.</div>
            )}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 text-lg font-bold text-[#D4AF37]">
                  {selected.name.charAt(0).toUpperCase()}
                </div>
                <span className={cn(
                  "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-medium",
                  selected.status === "new" ? "bg-sky-500/10 text-sky-400" :
                  selected.status === "read" ? "bg-amber-500/10 text-amber-400" :
                  "bg-emerald-500/10 text-emerald-400"
                )}>
                  {selected.status}
                </span>
              </div>

              <h2 className="mt-3 text-lg font-semibold text-white">{selected.name}</h2>
              <p className="text-sm text-[#D4AF37]">{selected.email}</p>

              <div className="mt-5 space-y-3">
                {selected.phone && (
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#555]">Phone</p>
                    <p className="text-sm text-white">{selected.phone}</p>
                  </div>
                )}
                {selected.company && (
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#555]">Company</p>
                    <p className="text-sm text-white">{selected.company}</p>
                  </div>
                )}
                {selected.service && (
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#555]">Service</p>
                    <p className="text-sm text-white">{selected.service}</p>
                  </div>
                )}
                {selected.subject && (
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#555]">Subject</p>
                    <p className="text-sm font-medium text-white">{selected.subject}</p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#555]">Message</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#aaa] break-words">{selected.message}</p>
                </div>
                {selected.sourcePage && (
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#555]">Source Page</p>
                    <p className="text-sm text-[#888] break-all">{selected.sourcePage}</p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#555]">Submitted</p>
                  <p className="text-sm text-[#888]">{new Date(selected.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] p-8"
            >
              <div className="text-center">
                <Inbox className="mx-auto h-10 w-10 text-[#333]" />
                <p className="mt-3 text-sm text-[#555]">Select a contact to view details</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Main Command Center ───────────────────────────────────────────────────────

export function AdminCommandCenter({
  initialData,
  initialProject,
  dashboardTitle,
}: {
  initialData: AdminCommandCenterData;
  initialProject?: ProjectKey;
  dashboardTitle?: string;
}) {
  const params = useParams();
  const slug = typeof params?.project === "string" ? params.project : "";
  const isGroup = slug === "ractysh-group" || !slug;
  const navItems: NavItem[] = React.useMemo(
    () => (isGroup ? [...CORE_NAV, ...GROUP_NAV] : CORE_NAV),
    [isGroup]
  );

  const [data, setData] = React.useState<AdminCommandCenterData>(initialData);
  const [activeView, setActiveView] = React.useState<AdminView>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const [selectedNotification, setSelectedNotification] = React.useState<NotificationRow | null>(null);

  async function handleNotificationAction(intent: string, id: string) {
    try {
      const res = await fetch("/api/admin/command-center", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent, id }),
      });
      const result = await res.json();
      if (result.success && result.data) {
        setData(result.data);
      }
    } catch {
      // ignore
    }
  }

  async function handleMarkRead(id: string) {
    await handleNotificationAction("notification.markRead", id);
    setSelectedNotification((prev) =>
      prev?.id === id ? { ...prev, status: "read" as const, readAt: new Date().toISOString() } : prev
    );
  }

  async function handleMarkUnread(id: string) {
    await handleNotificationAction("notification.markUnread", id);
    setSelectedNotification((prev) =>
      prev?.id === id ? { ...prev, status: "unread" as const, readAt: null } : prev
    );
  }

  async function handleArchive(id: string) {
    await handleNotificationAction("notification.archive", id);
    setSelectedNotification(null);
  }

  async function handleDelete(id: string) {
    await handleNotificationAction("notification.delete", id);
    setSelectedNotification(null);
  }

  function handleNotificationClick(n: NotificationRow) {
    setSelectedNotification(n);
    if (n.status === "unread") {
      handleMarkRead(n.id);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        unreadCount={data.unreadNotifications}
        navItems={navItems}
      />

      <div className="flex flex-1 flex-col overflow-hidden w-full max-w-full">
        <Header
          activeView={activeView}
          onMenuClick={() => setMobileSidebarOpen(true)}
          unreadCount={data.unreadNotifications}
          navItems={navItems}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeView === "overview" && <DashboardOverview data={data} />}
              {activeView === "notifications" && <NotificationsView data={data} onNotificationClick={handleNotificationClick} />}
              {activeView === "analytics" && <AnalyticsView data={data} />}
              {activeView === "contacts" && <ContactsView data={data} />}
              {isGroup && activeView === "services" && <ServicesView data={data} />}
              {isGroup && activeView === "blogs" && <BlogsView data={data} />}
              {isGroup && activeView === "careers" && <CareersView data={data} />}
              {isGroup && activeView === "newsletter" && <NewsletterView data={data} />}
              {isGroup && activeView === "subscribers" && <SubscribersView data={data} />}
              {isGroup && activeView === "chatbot" && <ChatbotView data={data} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <NotificationDetailDrawer
        notification={selectedNotification}
        isOpen={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
        onMarkRead={handleMarkRead}
        onMarkUnread={handleMarkUnread}
        onArchive={handleArchive}
        onDelete={handleDelete}
      />
    </div>
  );
}
