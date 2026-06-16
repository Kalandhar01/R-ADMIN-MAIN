import "server-only";

import { prisma } from "@/lib/prisma";
import { existsSync } from "node:fs";
import { join } from "node:path";

const constructionDivision = "construction";
const defaultTake = 6;
const maxTake = 12;

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  summary: string;
  year: string;
  status: string;
  imageUrl: string | null;
  featured: boolean;
  mediaAssets: Array<{ url: string }>;
};

export type ConstructionWorkItem = {
  id: string;
  slug: string;
  title: string;
  type: string;
  location: string;
  summary: string;
  year: string;
  status: string;
  image: string;
  featured: boolean;
};

export type ConstructionWorksResult = {
  items: ConstructionWorkItem[];
  total: number;
  nextSkip: number;
  hasMore: boolean;
};

const fallbackWorks: ConstructionWorkItem[] = [
  {
    id: "static-commercial-complex-site",
    slug: "commercial-complex-site",
    title: "Commercial Complex Site",
    type: "Commercial construction",
    location: "Tamil Nadu",
    summary: "Coordinated site execution with structure, safety, logistics, and daily progress control.",
    year: "2026",
    status: "active",
    image: "/images/construction/our-work-commercial-complex-site-01.webp",
    featured: true,
  },
  {
    id: "static-commercial-complex-structure",
    slug: "commercial-complex-structure",
    title: "Commercial Complex Structure",
    type: "Structural work",
    location: "Coimbatore",
    summary: "Concrete frame progress managed through sequence planning and quality inspection rhythm.",
    year: "2026",
    status: "active",
    image: "/images/construction/our-work-commercial-complex-structure-02.webp",
    featured: true,
  },
  {
    id: "static-commercial-complex-handover",
    slug: "commercial-complex-handover",
    title: "Commercial Complex Handover",
    type: "Project handover",
    location: "Tamil Nadu",
    summary: "Final finishing, services coordination, and handover readiness for commercial operations.",
    year: "2025",
    status: "completed",
    image: "/images/construction/our-work-commercial-complex-handover-03.webp",
    featured: true,
  },
  {
    id: "static-premium-tower-dawn",
    slug: "premium-tower-dawn",
    title: "Premium Tower Dawn",
    type: "High-rise execution",
    location: "South India",
    summary: "Tower construction shaped by procurement clarity, floor-cycle control, and site reporting.",
    year: "2025",
    status: "completed",
    image: "/images/construction/our-work-premium-tower-dawn-04.webp",
    featured: false,
  },
  {
    id: "static-infra-viaduct",
    slug: "infra-viaduct",
    title: "Infrastructure Viaduct",
    type: "Infrastructure",
    location: "Kerala",
    summary: "Civil infrastructure package governed through safety planning and milestone-led delivery.",
    year: "2025",
    status: "completed",
    image: "/images/construction/our-work-premium-infra-viaduct-05.webp",
    featured: false,
  },
  {
    id: "static-handover-lobby",
    slug: "handover-lobby",
    title: "Handover Lobby",
    type: "Interior completion",
    location: "Chennai",
    summary: "Premium interior handover with fit-out checks, finishing control, and closure documentation.",
    year: "2025",
    status: "completed",
    image: "/images/construction/our-work-premium-handover-lobby-06.webp",
    featured: false,
  },
  {
    id: "static-site-command",
    slug: "site-command",
    title: "Site Command",
    type: "Project control",
    location: "Tamil Nadu",
    summary: "Command-led site execution with workforce alignment, reporting cadence, and issue closure.",
    year: "2025",
    status: "active",
    image: "/images/construction/our-work-premium-site-command-07.webp",
    featured: false,
  },
  {
    id: "static-finished-villa",
    slug: "finished-villa",
    title: "Finished Villa",
    type: "Residential construction",
    location: "Kerala",
    summary: "Private villa completion with exterior detail, landscape coordination, and finish guardianship.",
    year: "2024",
    status: "completed",
    image: "/images/construction/our-work-finished-villa-08.webp",
    featured: false,
  },
  {
    id: "static-finished-apartment",
    slug: "finished-apartment",
    title: "Finished Apartment",
    type: "Residential delivery",
    location: "Coimbatore",
    summary: "Apartment delivery with site sequencing, services checks, and staged client handover.",
    year: "2024",
    status: "completed",
    image: "/images/construction/our-work-finished-apartment-09.webp",
    featured: false,
  },
  {
    id: "static-industrial-campus",
    slug: "industrial-campus",
    title: "Industrial Campus",
    type: "Industrial construction",
    location: "Tamil Nadu",
    summary: "Industrial campus execution with logistics planning, utility coordination, and expansion readiness.",
    year: "2024",
    status: "completed",
    image: "/images/construction/our-work-finished-industrial-campus-13.webp",
    featured: false,
  },
];

function localAssetExists(url: string) {
  if (!url.startsWith("/")) return false;

  return existsSync(join(/* turbopackIgnore: true */ process.cwd(), "public", url));
}

function imageFor(row: ProjectRow) {
  const image = row.imageUrl || row.mediaAssets[0]?.url || "";

  return image && localAssetExists(image) ? image : "";
}

function mapWork(row: ProjectRow): ConstructionWorkItem | null {
  const image = imageFor(row);
  if (!image) return null;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    type: row.category,
    location: row.location,
    summary: row.summary,
    year: row.year,
    status: row.status,
    image,
    featured: row.featured,
  };
}

async function allPublicWorks() {
  if (!process.env.DATABASE_URL?.trim()) {
    return fallbackWorks;
  }

  const rows = await prisma.project.findMany({
    where: {
      division: constructionDivision,
      status: {
        not: "archived",
      },
      OR: [
        {
          imageUrl: {
            not: null,
          },
        },
        {
          mediaAssets: {
            some: {
              kind: "image",
            },
          },
        },
      ],
    },
    orderBy: [{ position: "asc" }, { createdAt: "desc" }],
    include: {
      mediaAssets: {
        where: {
          kind: "image",
        },
        orderBy: { createdAt: "asc" },
        select: { url: true },
      },
    },
  });

  return rows
    .map(mapWork)
    .filter((item: ConstructionWorkItem | null): item is ConstructionWorkItem => Boolean(item));
}

export async function getConstructionWorks({
  skip = 0,
  take = defaultTake,
}: {
  skip?: number;
  take?: number;
} = {}): Promise<ConstructionWorksResult> {
  const safeSkip = Number.isFinite(skip) ? Math.max(0, Math.floor(skip)) : 0;
  const safeTake = Number.isFinite(take)
    ? Math.min(maxTake, Math.max(1, Math.floor(take)))
    : defaultTake;
  const works = await allPublicWorks().catch((error) => {
    console.warn("[construction-works] Falling back to static project work.", error);
    return fallbackWorks;
  });
  const items = works.slice(safeSkip, safeSkip + safeTake);
  const nextSkip = safeSkip + items.length;

  return {
    items,
    total: works.length,
    nextSkip,
    hasMore: nextSkip < works.length,
  };
}
