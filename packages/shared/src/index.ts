export const RACTYSH_PORTS = {
  web: 3000,
  admin: 3001,
  api: 5000
} as const;

export function apiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || process.env.INTERNAL_API_URL || "http://localhost:5000";
}

export const RACTYSH_GROUP_DIVISION = "ractysh-group";

export const RACTYSH_DIVISIONS = [
  { key: RACTYSH_GROUP_DIVISION, label: "Ractysh Group", keywords: ["ractysh", "group", "enterprise"] },
  { key: "infrastructure", label: "Infrastructure", keywords: ["infrastructure", "infra", "road", "bridge", "industrial"] },
  { key: "architecture", label: "Architecture", keywords: ["architecture", "architect", "design", "interior", "planning", "industrial", "factory", "warehouse", "manufacturing", "logistics"] },
  { key: "construction", label: "Construction", keywords: ["construction", "build", "site", "turnkey", "structural", "civil"] },
  { key: "real-estate", label: "Real Estate", keywords: ["real-estate", "real estate", "realestate", "property", "development"] },
  { key: "import-export", label: "Import & Export", keywords: ["import-export", "import export", "import", "export", "trade", "logistics"] },
  { key: "otc-exchange", label: "OTC Exchange", keywords: ["otc-exchange", "otc exchange", "otc", "private desk", "liquidity", "mandate"] }
] as const;

export type RactyshDivisionKey = (typeof RACTYSH_DIVISIONS)[number]["key"] | (string & {});

export function normalizeDivisionKey(value?: string | null): RactyshDivisionKey {
  const slug = (value || RACTYSH_GROUP_DIVISION)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!slug || slug === "group" || slug === "ractysh") return RACTYSH_GROUP_DIVISION;
  if (slug === "import-and-export" || slug === "export-import") return "import-export";
  if (slug === "realestate") return "real-estate";

  const match = RACTYSH_DIVISIONS.find((division) => division.key === slug || (division.keywords as readonly string[]).includes(slug));
  return match?.key || slug;
}

export function inferDivisionFromText(...values: Array<string | null | undefined>): RactyshDivisionKey {
  const text = values.filter(Boolean).join(" ").toLowerCase();
  const match = RACTYSH_DIVISIONS.find(
    (division) => division.key !== RACTYSH_GROUP_DIVISION && division.keywords.some((keyword) => text.includes(keyword))
  );

  return match?.key || normalizeDivisionKey(values.find(Boolean));
}
