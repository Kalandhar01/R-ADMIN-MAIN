import type { ProjectKey } from "@ractysh/types/admin";

export type AdminProjectRoute = {
  key: ProjectKey;
  slug: string;
  label: string;
  title: string;
  description: string;
  href: string;
  keywords: string[];
};

export const groupProjectKey = "ractysh-group";

export const adminProjectRoutes: AdminProjectRoute[] = [
  {
    key: groupProjectKey,
    slug: "ractysh-group",
    label: "Ractysh Group",
    title: "Ractysh Group Dashboard",
    description: "Enterprise overview across every Ractysh division, lead source and content system.",
    href: "/ractysh-group/dashboard",
    keywords: ["ractysh", "group", "enterprise", "ecosystem", "holding"]
  },
  {
    key: "architecture",
    slug: "architecture",
    label: "Architecture",
    title: "Architecture Command Center",
    description: "Design operations, studio pipeline, service content and project visibility.",
    href: "/architecture/dashboard",
    keywords: ["architecture", "architect", "design", "interior", "landscape", "planning"]
  },
  {
    key: "construction",
    slug: "construction",
    label: "Construction",
    title: "Construction Command Center",
    description: "Construction delivery, lead flow, active work and execution reporting.",
    href: "/construction/dashboard",
    keywords: ["construction", "build", "site", "turnkey", "structural", "civil"]
  },
  {
    key: "real-estate",
    slug: "real-estate",
    label: "Real Estate",
    title: "Real Estate Command Center",
    description: "Asset opportunities, property intelligence and real estate operations.",
    href: "/real-estate/dashboard",
    keywords: ["real estate", "real-estate", "property", "development", "residential", "commercial"]
  },
  {
    key: "otc-exchange",
    slug: "otc",
    label: "OTC Exchange",
    title: "OTC Exchange Command Center",
    description: "Private transaction readiness, counterparty flow and exchange governance.",
    href: "/otc/dashboard",
    keywords: ["otc", "exchange", "crypto", "private desk", "liquidity"]
  },
  {
    key: "import-export",
    slug: "import-export",
    label: "Import & Export",
    title: "Import & Export Command Center",
    description: "Trade coordination, documentation, media and market activity.",
    href: "/import-export/dashboard",
    keywords: ["import", "export", "trade", "logistics", "sourcing"]
  }
];

export type ProjectSwitcherItem = {
  key: string;
  slug: string;
  label: string;
  description: string;
  href: string;
  icon: string;
  status: "active" | "maintenance" | "inactive";
  favorite?: boolean;
};

export const projectSwitcherItems: ProjectSwitcherItem[] = [
  { key: "ractysh-group", slug: "ractysh-group", label: "Ractysh Group", description: "Enterprise overview across all divisions", href: "/ractysh-group/dashboard", icon: "Landmark", status: "active" },
  { key: "architecture", slug: "architecture", label: "Architecture", description: "Design operations and studio pipeline", href: "/architecture/dashboard", icon: "DraftingCompass", status: "active" },
  { key: "construction", slug: "construction", label: "Construction", description: "Construction delivery and project execution", href: "/construction/dashboard", icon: "HardHat", status: "active" },
  { key: "real-estate", slug: "real-estate", label: "Real Estate", description: "Asset and property intelligence", href: "/real-estate/dashboard", icon: "Building2", status: "active" },
  { key: "otc-exchange", slug: "otc", label: "OTC Exchange", description: "Private transaction and exchange governance", href: "/otc/dashboard", icon: "ShieldCheck", status: "active" },
  { key: "import-export", slug: "import-export", label: "Import & Export", description: "Trade coordination and logistics", href: "/import-export/dashboard", icon: "Globe2", status: "active" },
];

export function adminProjectRouteBySlug(slug: string): AdminProjectRoute | undefined {
  return adminProjectRoutes.find((route) => route.slug === slug);
}

export function fallbackProjectRoute(slug: string): AdminProjectRoute {
  const label = slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return {
    key: slug,
    slug,
    label,
    title: `${label} Command Center`,
    description: `${label} enterprise command center.`,
    href: `/${slug}/dashboard`,
    keywords: [slug, label.toLowerCase()]
  };
}
