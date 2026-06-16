import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";

const constructionDivision = "construction";
const apiEnvPath = resolve("apps/api/.env");
const publicDir = resolve("Construction-site/public");

function loadEnv(path) {
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;

    process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

function jsonValue(value) {
  return JSON.parse(JSON.stringify(value ?? {}));
}

function assertLocalImage(url) {
  if (!url.startsWith("/")) throw new Error(`Expected local image path, got ${url}`);

  const filePath = resolve(publicDir, url.slice(1));
  if (!existsSync(filePath)) throw new Error(`Image is missing from Construction-site/public: ${url}`);

  return url;
}

const works = [
  {
    slug: "finished-luxury-villa",
    title: "Villa Handover Control",
    category: "Residential Control",
    location: "Coimbatore",
    summary: "A villa delivery shaped around finish sequencing, client readiness, and proof-led handover control.",
    imageUrl: "/images/construction/our-work-finished-villa-08.webp",
  },
  {
    slug: "apartment-handover",
    title: "Apartment Readiness Block",
    category: "Handover Control",
    location: "Dindigul",
    summary: "An apartment closeout workflow with owner updates, snag tracking, and final documentation kept visible.",
    imageUrl: "/images/construction/our-work-finished-apartment-09.webp",
  },
  {
    slug: "commercial-office-facade",
    title: "Office Facade Completion",
    category: "Commercial Control",
    location: "Coimbatore",
    summary: "A commercial facade finish coordinated through vendor movement, site proof, and readiness checks.",
    imageUrl: "/images/construction/our-work-finished-commercial-office-10.webp",
  },
  {
    slug: "luxury-interior-finish",
    title: "Interior Finish Closure",
    category: "Interior Control",
    location: "Palani",
    summary: "A premium interior closeout controlled through material approvals, quality evidence, and walkthrough readiness.",
    imageUrl: "/images/construction/our-work-finished-luxury-interior-11.webp",
  },
  {
    slug: "row-house-community",
    title: "Row House Delivery Lane",
    category: "Community Control",
    location: "Tamil Nadu",
    summary: "A row house delivery path coordinated across external works, service readiness, and phased closeout.",
    imageUrl: "/images/construction/our-work-finished-row-houses-12.webp",
  },
  {
    slug: "industrial-campus",
    title: "Industrial Campus Readiness",
    category: "Industrial Control",
    location: "Coimbatore",
    summary: "An industrial campus execution record with structure, services, movement planning, and operations-ready handover.",
    imageUrl: "/images/construction/our-work-finished-industrial-campus-13.webp",
  },
  {
    slug: "premium-tower",
    title: "Premium Tower Control",
    category: "Schedule Control",
    location: "Chennai",
    summary: "A tower delivery reference focused on schedule clarity, facade quality, and visible execution control.",
    imageUrl: "/images/construction/our-work-premium-tower-dawn-04.webp",
  },
  {
    slug: "infrastructure-viaduct",
    title: "Infrastructure Viaduct Rhythm",
    category: "Infrastructure Control",
    location: "Tamil Nadu",
    summary: "An infrastructure execution reference with staging, safety proof, and milestone-driven site rhythm.",
    imageUrl: "/images/construction/our-work-premium-infra-viaduct-05.webp",
  },
  {
    slug: "handover-lobby",
    title: "Handover Lobby Evidence",
    category: "Closeout Control",
    location: "Dindigul",
    summary: "A lobby closeout example where documentation, quality proof, and snag closure stay aligned.",
    imageUrl: "/images/construction/our-work-premium-handover-lobby-06.webp",
  },
  {
    slug: "site-command",
    title: "Site Command Room",
    category: "Project Command",
    location: "Palani",
    summary: "A command-center view of drawing control, crew movement, procurement status, and quality evidence.",
    imageUrl: "/images/construction/our-work-premium-site-command-07.webp",
  },
];

const legacyImageUpdates = [
  {
    slug: "commercial-tower",
    imageUrl: "/images/construction/construction-service-command-center-construction-india-commercial-tower-01.webp",
  },
  {
    slug: "industrial-facility",
    imageUrl: "/images/construction/construction-service-command-center-construction-india-rebar-deck-02.webp",
  },
  {
    slug: "infrastructure-project",
    imageUrl: "/images/construction/construction-service-command-center-construction-india-infrastructure-viaduct-03.webp",
  },
  {
    slug: "enterprise-campus",
    imageUrl: "/images/construction/business-division-construction-site-01.webp",
  },
];

async function ensureCompany(prisma) {
  return prisma.companyDivision.upsert({
    where: { slug: constructionDivision },
    update: {
      name: "RACTYSH CONSTRUCTION",
      summary: "Project command, site execution, and handover control for construction work.",
      status: "active",
    },
    create: {
      slug: constructionDivision,
      name: "RACTYSH CONSTRUCTION",
      legalName: "Ractysh Construction Private Limited",
      summary: "Project command, site execution, and handover control for construction work.",
      description:
        "RACTYSH CONSTRUCTION coordinates projects through approval clarity, site execution, vendor movement, and handover readiness.",
      metric: "Project-control construction delivery",
      website: "https://ractysh.com/construction",
      brandColor: "#111111",
      accentColor: "#b8ceb9",
      status: "active",
      position: 3,
    },
  });
}

async function ensureProjectMedia(prisma, project, companyId, imageUrl, position = 0) {
  const existing = await prisma.mediaAsset.findFirst({
    where: {
      division: constructionDivision,
      projectId: project.id,
      url: imageUrl,
    },
    select: { id: true },
  });

  if (existing) return;

  await prisma.mediaAsset.create({
    data: {
      kind: "image",
      title: `${project.title} cover`,
      altText: `${project.title} construction work`,
      url: imageUrl,
      provider: "local",
      mimeType: "image/webp",
      division: constructionDivision,
      companyId,
      projectId: project.id,
      metadata: jsonValue({ usage: "cover", position }),
    },
  });
}

loadEnv(apiEnvPath);

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Expected it in apps/api/.env.");
}

const prisma = new PrismaClient();

try {
  const company = await ensureCompany(prisma);

  for (const [index, work] of works.entries()) {
    const imageUrl = assertLocalImage(work.imageUrl);
    const project = await prisma.project.upsert({
      where: { slug: work.slug },
      update: {
        companyId: company.id,
        division: constructionDivision,
        title: work.title,
        category: work.category,
        location: work.location,
        summary: work.summary,
        description: work.summary,
        year: "2026",
        status: "completed",
        imageUrl,
        featured: index < 6,
        position: index,
        metadata: jsonValue({
          source: "construction-site-current-works",
          statusLabel: "Delivered",
          galleryImages: [imageUrl],
        }),
      },
      create: {
        companyId: company.id,
        division: constructionDivision,
        slug: work.slug,
        title: work.title,
        category: work.category,
        location: work.location,
        summary: work.summary,
        description: work.summary,
        year: "2026",
        status: "completed",
        imageUrl,
        featured: index < 6,
        position: index,
        metadata: jsonValue({
          source: "construction-site-current-works",
          statusLabel: "Delivered",
          galleryImages: [imageUrl],
        }),
      },
    });

    await ensureProjectMedia(prisma, project, company.id, imageUrl, index);
  }

  for (const [index, item] of legacyImageUpdates.entries()) {
    const imageUrl = assertLocalImage(item.imageUrl);
    const project = await prisma.project.findUnique({ where: { slug: item.slug } });

    if (!project) continue;

    const updated = await prisma.project.update({
      where: { id: project.id },
      data: {
        imageUrl,
        position: 90 + index,
        metadata: jsonValue({
          ...(project.metadata && typeof project.metadata === "object" && !Array.isArray(project.metadata)
            ? project.metadata
            : {}),
          publicImageMigrated: true,
        }),
      },
    });

    await ensureProjectMedia(prisma, updated, company.id, imageUrl, 90 + index);
  }

  const count = await prisma.project.count({
    where: {
      division: constructionDivision,
      status: {
        not: "archived",
      },
    },
  });

  console.log(`Seeded construction works into Prisma. Public construction projects: ${count}`);
} finally {
  await prisma.$disconnect();
}
