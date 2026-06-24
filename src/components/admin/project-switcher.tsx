"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Landmark,
  HardHat,
  Globe2,
  DraftingCompass,
  Building2,
  Paintbrush,
  Factory,
  ShieldCheck,
  Megaphone,
  BriefcaseBusiness,
  ChevronDown,
  Search,
  Star,
  Clock,
  Check,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { projectSwitcherItems, adminProjectRouteBySlug, fallbackProjectRoute, type ProjectSwitcherItem } from "@/lib/admin/projects";

export const iconMap: Record<string, LucideIcon> = {
  Landmark,
  HardHat,
  Globe2,
  DraftingCompass,
  Building2,
  Paintbrush,
  Factory,
  ShieldCheck,
  Megaphone,
  BriefcaseBusiness,
};

const PROJECT_STORAGE_KEY = "ractysh-selected-project";
const FAVORITES_STORAGE_KEY = "ractysh-project-favorites";
const RECENT_STORAGE_KEY = "ractysh-recent-projects";

function getStoredValue<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const val = localStorage.getItem(key);
    return val ? (JSON.parse(val) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setStoredValue<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function useProjectState() {
  const params = useParams();
  const slug = typeof params?.project === "string" ? params.project : "";
  const currentRoute = adminProjectRouteBySlug(slug) ?? fallbackProjectRoute(slug);
  const stored = getStoredValue<string>(PROJECT_STORAGE_KEY, slug);

  const currentProject = React.useMemo(() => {
    if (slug) return projectSwitcherItems.find((p) => p.slug === slug) || null;
    return projectSwitcherItems.find((p) => p.slug === stored) || projectSwitcherItems[0];
  }, [slug, stored]);

  return currentProject;
}

export const statusColors: Record<string, string> = {
  active: "bg-emerald-400",
  maintenance: "bg-amber-400",
  inactive: "bg-red-400",
};

export const statusLabels: Record<string, string> = {
  active: "Active",
  maintenance: "Maintenance",
  inactive: "Inactive",
};

export function ProjectSwitcher() {
  const router = useRouter();
  const params = useParams();
  const slug = typeof params?.project === "string" ? params.project : "";
  const currentRoute = adminProjectRouteBySlug(slug) ?? fallbackProjectRoute(slug);

  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [favorites, setFavorites] = React.useState<string[]>(() => getStoredValue<string[]>(FAVORITES_STORAGE_KEY, []));
  const [recent, setRecent] = React.useState<string[]>(() => getStoredValue<string[]>(RECENT_STORAGE_KEY, []));
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0, width: 340 });

  const isMobile = React.useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(max-width: 1023px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(max-width: 1023px)").matches,
    () => false
  );

  const currentProject = React.useMemo(() => {
    return projectSwitcherItems.find((p) => p.slug === slug) || projectSwitcherItems[0];
  }, [slug]);

  const filtered = React.useMemo(() => {
    if (!search.trim()) return projectSwitcherItems;
    const q = search.toLowerCase();
    return projectSwitcherItems.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.key.toLowerCase().includes(q)
    );
  }, [search]);

  React.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
    setHighlightedIndex(0);
  }, [open]);

  React.useEffect(() => {
    if (open && !isMobile && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 6,
        left: rect.left,
        width: Math.max(340, rect.width),
      });
    }
  }, [open, isMobile]);

  React.useEffect(() => {
    if (!open || isMobile) return;
    function handleScroll() {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 6,
          left: rect.left,
          width: Math.max(340, rect.width),
        });
      }
    }
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [open, isMobile]);

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  React.useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "j") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (!open) return;
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
      }
      if (e.key === "Enter" && filtered[highlightedIndex]) {
        selectProject(filtered[highlightedIndex]);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, filtered, highlightedIndex]);

  function selectProject(project: ProjectSwitcherItem) {
    setStoredValue(PROJECT_STORAGE_KEY, project.slug);

    const updatedRecent = [project.slug, ...recent.filter((s) => s !== project.slug)].slice(0, 5);
    setRecent(updatedRecent);
    setStoredValue(RECENT_STORAGE_KEY, updatedRecent);

    setOpen(false);
    setSearch("");

    if (project.href !== window.location.pathname) {
      router.push(project.href);
    }
  }

  function toggleFavorite(e: React.MouseEvent, slug: string) {
    e.stopPropagation();
    const updated = favorites.includes(slug)
      ? favorites.filter((s) => s !== slug)
      : [slug, ...favorites];
    setFavorites(updated);
    setStoredValue(FAVORITES_STORAGE_KEY, updated);
  }

  const recentProjects = recent
    .map((s) => projectSwitcherItems.find((p) => p.slug === s))
    .filter((p): p is ProjectSwitcherItem => p !== undefined);
  const favoriteProjects = projectSwitcherItems.filter((p) => favorites.includes(p.slug));
  const otherProjects = filtered.filter((p) => !favorites.includes(p.slug) && !recent.includes(p.slug));

  const CurrentIcon = currentProject ? iconMap[currentProject.icon] || Landmark : Landmark;

  const trigger = (
    <button
      ref={triggerRef}
      onClick={() => setOpen(!open)}
      className={cn(
        "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-all duration-200",
        "hover:bg-white/[0.06] group"
      )}
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.04]">
        <CurrentIcon className="h-3.5 w-3.5 text-[#D4AF37]" />
      </div>
      <span className="font-semibold text-white max-w-[140px] truncate lg:max-w-[180px]">
        {currentProject?.label || "Select Project"}
      </span>
      <ChevronDown className={cn(
        "h-3.5 w-3.5 text-[#555] transition-transform duration-200",
        open && "rotate-180"
      )} />
    </button>
  );

  function renderProjectList(items: ProjectSwitcherItem[], startIndex: number) {
    return items.map((project, i) => {
      const idx = startIndex + i;
      const Icon = iconMap[project.icon] || Landmark;
      const isActive = project.slug === slug;
      const isFav = favorites.includes(project.slug);
      const isHighlighted = idx === highlightedIndex;

      return (
        <button
          key={project.slug}
          onClick={() => selectProject(project)}
          onMouseEnter={() => setHighlightedIndex(idx)}
          className={cn(
            "group relative flex w-full items-center gap-3 rounded-lg px-3 py-3 lg:py-2.5 text-left transition-all duration-150",
            isHighlighted && !isActive && "bg-white/[0.04]",
            isActive ? "bg-[#D4AF37]/10" : "hover:bg-white/[0.04]"
          )}
        >
          <div className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border",
            isActive
              ? "border-[#D4AF37]/30 bg-[#D4AF37]/10"
              : "border-white/[0.06] bg-white/[0.04]"
          )}>
            <Icon className={cn(
              "h-4 w-4",
              isActive ? "text-[#D4AF37]" : "text-white/70"
            )} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-sm font-medium truncate",
                isActive ? "text-[#D4AF37]" : "text-white"
              )}>
                {project.label}
              </span>
            </div>
            <p className="truncate text-xs text-[#555]">{project.description}</p>
          </div>

          <AnimatePresence>
            {isHighlighted && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={(e) => toggleFavorite(e, project.slug)}
                className="flex h-8 w-8 lg:h-7 lg:w-7 shrink-0 items-center justify-center rounded-md text-[#555] hover:bg-white/[0.06] hover:text-[#D4AF37]"
              >
                <Star className={cn("h-3.5 w-3.5", isFav && "fill-[#D4AF37] text-[#D4AF37]")} />
              </motion.button>
            )}
          </AnimatePresence>

          {isActive && (
            <div className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[#D4AF37]" />
          )}
        </button>
      );
    });
  }

  const dropdown = (
    <div className="w-full max-w-sm">
      <div className="relative mb-2">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#555]" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-white/[0.06] bg-white/[0.04] py-2.5 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-[#555] focus:border-[#D4AF37]/30 focus:bg-white/[0.06]"
        />
        <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-white/[0.06] bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-[#555] sm:inline">
          ⌘J
        </kbd>
      </div>

      <div className="max-h-[70vh] overflow-y-auto space-y-0.5 pr-1">
        {search.trim() ? (
          filtered.length > 0 ? (
            renderProjectList(filtered, 0)
          ) : (
            <div className="py-8 text-center text-sm text-[#555]">No projects found.</div>
          )
        ) : (
          <>
            {favoriteProjects.length > 0 && (
              <div>
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#555]">
                  Favorites
                </p>
                {renderProjectList(favoriteProjects, 0)}
              </div>
            )}

            {recentProjects.length > 0 && (
              <div className="mt-1">
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#555]">
                  Recent
                </p>
                {renderProjectList(recentProjects, favoriteProjects.length)}
              </div>
            )}

            <div className={cn("mt-1", (favoriteProjects.length > 0 || recentProjects.length > 0) && "border-t border-white/[0.04] pt-1")}>
              {(favoriteProjects.length > 0 || recentProjects.length > 0) && (
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#555]">
                  All Projects
                </p>
              )}
              {renderProjectList(otherProjects, favoriteProjects.length + recentProjects.length)}
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.04]">
          <CurrentIcon className="h-3.5 w-3.5 text-[#D4AF37]" />
        </div>
        <span className="font-semibold text-white max-w-[140px] truncate lg:max-w-[180px] text-sm">
          {currentProject?.label || "Select Project"}
        </span>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      {trigger}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: 'fixed',
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              zIndex: 9999,
            }}
            className="origin-top-left rounded-xl border border-white/[0.06] bg-[#0a0a0a]/95 backdrop-blur-2xl p-3 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          >
            {dropdown}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
