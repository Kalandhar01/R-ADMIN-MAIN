import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import type { ArchitectureLeadStatus, ArchitectureMediaKind, ArchitectureProjectStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { projects as staticArchitectureProjects } from "./architectureContent";
import { heroSupportingContent } from "./architecturePremiumContent";

export type ArchitectureHeroView = {
  heading: string;
  description: string;
  videoUrl: string;
  posterUrl: string | null;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
};

export type ArchitectureProjectView = {
  id: string;
  slug: string;
  number: string;
  kicker: string;
  title: string;
  description: string;
  location: string;
  projectType: string;
  place: string;
  image: string;
  alt: string;
  scale: string;
  detail: string;
  year: string;
  area: string | null;
  status: ArchitectureProjectStatus;
  galleryImages: string[];
  featured: boolean;
};

export type ArchitectureAdminLead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  projectType: string;
  location: string | null;
  budget: string | null;
  message: string;
  status: ArchitectureLeadStatus;
  createdAt: string;
  updatedAt: string;
  contactedAt: string | null;
  convertedAt: string | null;
  archivedAt: string | null;
};

export type ArchitectureAdminProject = {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  projectType: string;
  year: string;
  area: string | null;
  status: ArchitectureProjectStatus;
  coverImage: string | null;
  coverImageAlt: string | null;
  galleryImages: string[];
  featured: boolean;
  published: boolean;
  position: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
};

export type ArchitectureAdminMedia = {
  id: string;
  kind: ArchitectureMediaKind;
  title: string;
  altText: string | null;
  url: string;
  provider: string;
  mimeType: string | null;
  size: number | null;
  usage: string;
  projectId: string | null;
  createdAt: string;
};

export type ArchitectureAdminNotification = {
  id: string;
  title: string;
  message: string;
  priority: string;
  status: string;
  actionUrl: string | null;
  createdAt: string;
};

export type ArchitectureAdminData = {
  dashboard: {
    totalInquiries: number;
    todayInquiries: number;
    monthInquiries: number;
    totalProjects: number;
    publishedProjects: number;
    draftProjects: number;
  };
  hero: ArchitectureHeroView;
  leads: ArchitectureAdminLead[];
  projects: ArchitectureAdminProject[];
  media: ArchitectureAdminMedia[];
  notifications: ArchitectureAdminNotification[];
  analytics: {
    pageViews: number;
    consultationRequests: number;
    projectViews: number;
    mostViewedProject: { title: string; slug: string; views: number } | null;
  };
};

const preferredArchitectureHero = {
  heading: heroSupportingContent.heading.join("\n"),
  description: heroSupportingContent.description
};

const preferredHeroVideoUrl = "/videos/architecture/ractysh-architecture-hero.mp4";

const defaultHero: ArchitectureHeroView = {
  heading: preferredArchitectureHero.heading,
  description: preferredArchitectureHero.description,
  videoUrl: preferredHeroVideoUrl,
  posterUrl: "/images/architecture/ractysh-built-beyond-blueprints-poster.avif",
  primaryCtaText: heroSupportingContent.primaryCta.label,
  primaryCtaHref: heroSupportingContent.primaryCta.href,
  secondaryCtaText: heroSupportingContent.secondaryCta.label,
  secondaryCtaHref: heroSupportingContent.secondaryCta.href
};

function toIso(value: Date | null | undefined) {
  return value ? value.toISOString() : null;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function projectNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

function isLegacyDesignHeading(value: string) {
  return [
    "Let's Design Something Extraordinary.",
    "Crafting Timeless Architecture.",
    "Architecture Built Beyond Blueprints."
  ].includes(value.replace(/\u2019/g, "'").replace(/\s+/g, " ").trim());
}

function toProjectView(project: {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  projectType: string;
  year: string;
  area: string | null;
  status: ArchitectureProjectStatus;
  coverImage: string | null;
  coverImageAlt: string | null;
  galleryImages: string[];
  featured: boolean;
}, index: number): ArchitectureProjectView {
  const image = project.coverImage || "/images/architecture/ractysh-laterite-court-residence.avif";
  const galleryImages = Array.from(new Set([image, ...project.galleryImages].filter(Boolean)));

  return {
    id: project.id,
    slug: project.slug,
    number: projectNumber(index),
    kicker: project.projectType,
    title: project.title,
    description: project.description,
    location: project.location,
    projectType: project.projectType,
    place: project.location,
    image,
    alt: project.coverImageAlt || `${project.title} architecture project`,
    scale: project.area || project.status || project.projectType,
    detail: project.description,
    year: project.year,
    area: project.area,
    status: project.status,
    galleryImages,
    featured: project.featured
  };
}

function fallbackProjectViews(): ArchitectureProjectView[] {
  return staticArchitectureProjects.map((project, index) => {
    const slug = slugify(project.title);

    return {
      id: `static-${slug}`,
      slug,
      number: project.number || projectNumber(index),
      kicker: project.kicker,
      title: project.title,
      description: project.detail,
      location: project.place,
      projectType: project.kicker,
      place: project.place,
      image: project.image,
      alt: project.alt,
      scale: project.scale,
      detail: project.detail,
      year: "Concept",
      area: null,
      status: "concept" as ArchitectureProjectStatus,
      galleryImages: [project.image],
      featured: index < 3
    };
  });
}

function toHeroView(hero: {
  heading: string;
  description: string;
  videoUrl: string;
  posterUrl: string | null;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
}): ArchitectureHeroView {
  const usePreferredCopy = isLegacyDesignHeading(hero.heading);

  return {
    heading: usePreferredCopy ? preferredArchitectureHero.heading : hero.heading,
    description: usePreferredCopy ? preferredArchitectureHero.description : hero.description,
    videoUrl: hero.videoUrl === "/landingpage_bg-video.mp4" ? preferredHeroVideoUrl : hero.videoUrl,
    posterUrl: hero.posterUrl,
    primaryCtaText: hero.primaryCtaText,
    primaryCtaHref: hero.primaryCtaHref,
    secondaryCtaText: hero.secondaryCtaText,
    secondaryCtaHref: hero.secondaryCtaHref
  };
}

export async function ensureArchitectureDefaults() {
  await prisma.architectureHero.upsert({
    where: { key: "architecture-home" },
    update: {},
    create: {
      key: "architecture-home",
      ...defaultHero
    }
  });
}

export async function getArchitecturePageData() {
  if (!process.env.DATABASE_URL?.trim()) {
    return {
      hero: defaultHero,
      projects: fallbackProjectViews()
    };
  }

  try {
    const [hero, publishedProjects] = await Promise.all([
      prisma.architectureHero.findUnique({
        where: { key: "architecture-home" },
        select: {
          heading: true,
          description: true,
          videoUrl: true,
          posterUrl: true,
          primaryCtaText: true,
          primaryCtaHref: true,
          secondaryCtaText: true,
          secondaryCtaHref: true
        }
      }),
      prisma.architectureProject.findMany({
        where: { published: true },
        orderBy: [{ featured: "desc" }, { position: "asc" }, { createdAt: "asc" }],
        take: 24,
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          location: true,
          projectType: true,
          year: true,
          area: true,
          status: true,
          coverImage: true,
          coverImageAlt: true,
          galleryImages: true,
          featured: true
        }
      })
    ]);

    return {
      hero: hero ? toHeroView(hero) : defaultHero,
      projects: publishedProjects.length ? publishedProjects.map(toProjectView) : fallbackProjectViews()
    };
  } catch (error) {
    console.warn("[architecture-cms] Falling back to static homepage content.", error);

    return {
      hero: defaultHero,
      projects: fallbackProjectViews()
    };
  }
}

export async function getArchitectureAdminData(): Promise<ArchitectureAdminData> {
  await ensureArchitectureDefaults();

  const now = new Date();
  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    hero,
    totalInquiries,
    todayInquiries,
    monthInquiries,
    totalProjects,
    publishedProjects,
    draftProjects,
    leads,
    projects,
    media,
    notifications,
    pageViews,
    projectViews,
    mostViewedProject
  ] = await Promise.all([
    prisma.architectureHero.findUnique({
      where: { key: "architecture-home" },
      select: {
        heading: true,
        description: true,
        videoUrl: true,
        posterUrl: true,
        primaryCtaText: true,
        primaryCtaHref: true,
        secondaryCtaText: true,
        secondaryCtaHref: true
      }
    }),
    prisma.architectureLead.count(),
    prisma.architectureLead.count({ where: { createdAt: { gte: startToday } } }),
    prisma.architectureLead.count({ where: { createdAt: { gte: startMonth } } }),
    prisma.architectureProject.count(),
    prisma.architectureProject.count({ where: { published: true } }),
    prisma.architectureProject.count({ where: { status: "draft" } }),
    prisma.architectureLead.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        projectType: true,
        location: true,
        budget: true,
        message: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        contactedAt: true,
        convertedAt: true,
        archivedAt: true
      }
    }),
    prisma.architectureProject.findMany({
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
      take: 200,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        location: true,
        projectType: true,
        year: true,
        area: true,
        status: true,
        coverImage: true,
        coverImageAlt: true,
        galleryImages: true,
        featured: true,
        published: true,
        position: true,
        viewCount: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    prisma.architectureMedia.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        kind: true,
        title: true,
        altText: true,
        url: true,
        provider: true,
        mimeType: true,
        size: true,
        usage: true,
        projectId: true,
        createdAt: true
      }
    }),
    prisma.notification.findMany({
      where: { division: "architecture" },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        message: true,
        priority: true,
        status: true,
        actionUrl: true,
        createdAt: true
      }
    }),
    prisma.architecturePageView.count(),
    prisma.architecturePageView.count({ where: { projectId: { not: null } } }),
    prisma.architectureProject.findFirst({
      where: { viewCount: { gt: 0 } },
      orderBy: { viewCount: "desc" },
      select: { title: true, slug: true, viewCount: true }
    })
  ]);

  return {
    dashboard: {
      totalInquiries,
      todayInquiries,
      monthInquiries,
      totalProjects,
      publishedProjects,
      draftProjects
    },
    hero: hero ? toHeroView(hero) : defaultHero,
    leads: leads.map((lead) => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      projectType: lead.projectType,
      location: lead.location,
      budget: lead.budget,
      message: lead.message,
      status: lead.status,
      createdAt: lead.createdAt.toISOString(),
      updatedAt: lead.updatedAt.toISOString(),
      contactedAt: toIso(lead.contactedAt),
      convertedAt: toIso(lead.convertedAt),
      archivedAt: toIso(lead.archivedAt)
    })),
    projects: projects.map((project) => ({
      id: project.id,
      title: project.title,
      slug: project.slug,
      description: project.description,
      location: project.location,
      projectType: project.projectType,
      year: project.year,
      area: project.area,
      status: project.status,
      coverImage: project.coverImage,
      coverImageAlt: project.coverImageAlt,
      galleryImages: project.galleryImages,
      featured: project.featured,
      published: project.published,
      position: project.position,
      viewCount: project.viewCount,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString()
    })),
    media: media.map((asset) => ({
      id: asset.id,
      kind: asset.kind,
      title: asset.title,
      altText: asset.altText,
      url: asset.url,
      provider: asset.provider,
      mimeType: asset.mimeType,
      size: asset.size,
      usage: asset.usage,
      projectId: asset.projectId,
      createdAt: asset.createdAt.toISOString()
    })),
    notifications: notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      priority: notification.priority,
      status: notification.status,
      actionUrl: notification.actionUrl,
      createdAt: notification.createdAt.toISOString()
    })),
    analytics: {
      pageViews,
      consultationRequests: totalInquiries,
      projectViews,
      mostViewedProject: mostViewedProject
        ? {
            title: mostViewedProject.title,
            slug: mostViewedProject.slug,
            views: mostViewedProject.viewCount
          }
        : null
    }
  };
}

export async function recordArchitecturePageView(input: {
  path: string;
  projectId?: string | null;
  projectSlug?: string | null;
  request?: NextRequest;
}) {
  const userAgent = input.request?.headers.get("user-agent") || null;
  const referrer = input.request?.headers.get("referer") || null;
  const forwardedFor = input.request?.headers.get("x-forwarded-for") || "";
  const ip = forwardedFor.split(",")[0]?.trim() || input.request?.headers.get("x-real-ip") || "";
  const ipHash = ip ? createHash("sha256").update(`${ip}:${process.env.ADMIN_SESSION_SECRET || "architecture"}`).digest("hex") : null;

  let projectId = input.projectId || null;
  if (!projectId && input.projectSlug) {
    const project = await prisma.architectureProject.findUnique({
      where: { slug: input.projectSlug },
      select: { id: true }
    });
    projectId = project?.id || null;
  }

  const view = await prisma.architecturePageView.create({
    data: {
      path: input.path || "/",
      projectId,
      projectSlug: input.projectSlug || null,
      referrer,
      userAgent,
      ipHash
    }
  });

  if (projectId) {
    await prisma.architectureProject.update({
      where: { id: projectId },
      data: { viewCount: { increment: 1 } }
    });
  }

  return view;
}
