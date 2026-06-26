"use client";

import * as React from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard, Bell, BarChart3, Mail, ShieldCheck, BookOpenText,
  BriefcaseBusiness, Send, Users, MessageCircle, Search, ChevronDown,
  LogOut, Menu, X, Sparkles, Activity, Clock, FolderKanban, Building2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectSwitcher, iconMap as projIconMapDS } from "@/components/admin/project-switcher";
import { adminProjectRoutes, groupProjectKey, projectSwitcherItems as projItemsDS } from "@/lib/admin/projects";

export type DashboardView = "overview" | "notifications" | "analytics" | "contacts" | "services" | "blogs" | "our-works" | "all-works" | "portfolio-manager" | "careers" | "newsletter" | "subscribers" | "chatbot" | "settings" | "audit" | "leads" | "projects" | "media" | "businesses" | "domains" | "command" | "home";

export type NavItemDef = {
  key: DashboardView;
  label: string;
  icon: LucideIcon;
  badge?: number;
  href?: string;
};

const CORE_NAV: NavItemDef[] = [
  { key: "overview", label: "Dashboard", icon: LayoutDashboard },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "our-works", label: "Our Works", icon: FolderKanban, href: "" },
  { key: "contacts", label: "Contacts", icon: Building2 },
];

const GROUP_NAV: NavItemDef[] = [
  { key: "services", label: "Services", icon: ShieldCheck },
  { key: "blogs", label: "Blogs", icon: BookOpenText, href: "" },
  { key: "careers", label: "Careers", icon: BriefcaseBusiness, href: "" },
  { key: "newsletter", label: "Newsletter", icon: Send },
  { key: "subscribers", label: "Subscribers", icon: Users },
  { key: "chatbot", label: "Chatbot", icon: MessageCircle },
];

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

function formatTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit",
  });
}

export function formatRelativeTime(dateStr: string) {
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

export function DashboardShell({
  children,
  activeView,
  unreadCount = 0,
  entityUnreadCounts = {},
  projectUnreadCounts = {},
}: {
  children: React.ReactNode;
  activeView?: DashboardView;
  unreadCount?: number;
  entityUnreadCounts?: Record<string, number>;
  projectUnreadCounts?: Record<string, number>;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const slug = typeof params?.project === "string" ? params.project : "";
  const isGroup = slug === "ractysh-group" || !slug;

  const entityNavMapDS: Record<string, DashboardView> = {
    blog: "blogs",
    career: "careers",
    application: "careers",
    contact: "contacts",
    subscriber: "subscribers",
    newsletter: "newsletter",
    chat: "chatbot",
    message: "chatbot",
    notification: "notifications",
    service: "services",
  };

  const navItems = React.useMemo(() => {
    const withHref = (item: NavItemDef) => ({
      ...item,
      href: item.key === "overview" ? `/${slug}/dashboard` :
            item.key === "notifications" ? `/${slug}/dashboard/notifications` :
            item.key === "our-works" ? `/${slug}/dashboard/our-works` :
            item.key === "blogs" ? `/${slug}/dashboard/blogs` :
            item.key === "careers" ? `/${slug}/dashboard/careers` :
            undefined,
    });
    const items = isGroup ? [...CORE_NAV, ...GROUP_NAV.map(withHref)] : CORE_NAV.map(withHref);
    return items.map((item) => {
      let count = 0;
      for (const [entity, navKey] of Object.entries(entityNavMapDS)) {
        if (navKey === item.key) {
          count += entityUnreadCounts[entity] || 0;
        }
      }
      if (item.key === "notifications") {
        count = unreadCount;
      }
      return { ...item, badge: count > 0 ? count : undefined };
    });
  }, [isGroup, slug, entityUnreadCounts, unreadCount]);

  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const searchRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileSidebarOpen]);

  React.useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") setSearchOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  React.useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  async function handleLogout() {
    try { await fetch("/api/admin/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    router.push("/admin");
  }

  function handleNavigate(view: DashboardView) {
    const item = navItems.find((n) => n.key === view);
    if (item?.href) router.push(item.href);
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className={cn("flex items-center gap-3 px-4 py-5", sidebarCollapsed && "justify-center px-2")}>
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/10 to-transparent hover:border-[#D4AF37]/40 transition-colors">
          <Sparkles className="h-4 w-4 text-[#D4AF37]" />
        </button>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">Ractysh Group</p>
            <p className="truncate text-[10px] font-medium uppercase tracking-wider text-[#D4AF37]/60">Command Center</p>
          </div>
        )}
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto px-2 py-2">
        {navItems.map((item) => {
          const isActive = activeView === item.key || pathname.startsWith(item.href || `/${slug}/dashboard/${item.key}`);
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => handleNavigate(item.key)}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                sidebarCollapsed && "justify-center px-2",
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
              <Icon className="relative z-10 h-[18px] w-[18px] shrink-0" />
              {!sidebarCollapsed && <span className="relative z-10">{item.label}</span>}
              {item.badge && item.badge > 0 && (
                <span className={cn(
                  "relative z-10 ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#D4AF37] px-1 text-[10px] font-bold text-[#050505]",
                  sidebarCollapsed && "absolute -right-0.5 -top-0.5"
                )}>
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className={cn("border-t border-white/[0.06] mx-3 my-1")} />

      {!sidebarCollapsed && (
        <div className="px-4 pt-3 pb-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#555]">Projects</p>
        </div>
      )}
      <div className="px-2 pb-3 space-y-0.5">
        {projItemsDS.map((project) => {
          const Icon = projIconMapDS[project.icon] || Building2;
          const isCurrent = project.slug === slug;
          const projectCount = projectUnreadCounts[project.key] || 0;
          return (
            <a
              key={project.slug}
              href={project.href}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                sidebarCollapsed && "justify-center px-2",
                isCurrent
                  ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                  : "text-[#777] hover:bg-white/[0.04] hover:text-white"
              )}
            >
              <div className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border",
                isCurrent
                  ? "border-[#D4AF37]/30 bg-[#D4AF37]/10"
                  : "border-white/[0.06] bg-white/[0.04]"
              )}>
                <Icon className={cn("h-3.5 w-3.5", isCurrent ? "text-[#D4AF37]" : "text-white/50")} />
              </div>
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 truncate">{project.label}</span>
                  {projectCount > 0 && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#D4AF37] px-1.5 text-[10px] font-bold text-[#050505]">
                      {projectCount > 99 ? "99+" : projectCount}
                    </span>
                  )}
                </>
              )}
            </a>
          );
        })}
      </div>

      <div className={cn("border-t border-white/[0.06] px-3 py-4", sidebarCollapsed && "px-2")}>
        <div className={cn("flex items-center gap-3", sidebarCollapsed && "justify-center")}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 text-sm font-semibold text-[#D4AF37]">FA</div>
          {!sidebarCollapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">Fawaz Admin</p>
                <p className="truncate text-xs text-[#666666]">Super Admin</p>
              </div>
              <button onClick={handleLogout} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#555] transition-colors hover:bg-white/[0.06] hover:text-white">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      <aside className={cn(
        "hidden lg:flex sticky top-0 h-screen flex-col border-r border-white/[0.06] bg-[#050505] transition-all duration-300",
        sidebarCollapsed ? "w-[68px]" : "w-[240px]"
      )}>
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="absolute left-0 top-0 h-full w-[280px] border-r border-white/[0.06] bg-[#050505]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-[#666] hover:bg-white/[0.06] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
              {sidebarContent}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 flex-col w-full max-w-full">
        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl overflow-x-hidden">
          <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#888] hover:bg-white/[0.06] hover:text-white lg:hidden"
            >
              <Menu className="h-[18px] w-[18px]" />
            </button>
            <ProjectSwitcher />
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
                <kbd className="ml-6 rounded border border-white/[0.06] bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-[#555]">⌘K</kbd>
              </button>
              <button onClick={() => router.push(`/${slug}/dashboard/notifications`)} className={cn("relative flex h-9 w-9 items-center justify-center rounded-lg transition-all",
                  unreadCount > 0
                    ? "text-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_12px_rgba(212,175,55,0.3)]"
                    : "text-[#888] hover:bg-white/[0.06] hover:text-white"
                )}>
                <Bell className={cn("h-[18px] w-[18px]", unreadCount > 0 && "animate-[bellPulse_2s_ease-in-out_infinite]")} />
                {unreadCount > 0 && (
                  <>
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#D4AF37]" />
                    <span className="absolute -inset-1 rounded-lg bg-[#D4AF37]/5 animate-[bellGlow_2s_ease-in-out_infinite]" />
                    <span className="absolute -right-1 -top-1 flex min-w-[18px] items-center justify-center rounded-full bg-[#D4AF37] px-1 text-[9px] font-bold text-[#050505] leading-none"
                      style={{ height: "16px" }}>
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  </>
                )}
              </button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 text-sm font-semibold text-[#D4AF37]">FA</div>
            </div>
          </div>

          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
                  <kbd className="hidden rounded border border-white/[0.06] bg-white/[0.04] px-2 py-0.5 text-xs text-[#555] sm:inline">ESC</kbd>
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

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
      <style>{`
        @keyframes bellPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes bellGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
