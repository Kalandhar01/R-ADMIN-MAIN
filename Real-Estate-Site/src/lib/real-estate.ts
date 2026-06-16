import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ensureRealEstateDefaults, realEstatePropertySeeds } from "@/lib/real-estate-defaults";

const publicStatuses = ["available", "private_review", "reserved", "sold"] as const;

const propertySelect = {
  id: true,
  title: true,
  slug: true,
  summary: true,
  description: true,
  propertyType: true,
  status: true,
  investmentValue: true,
  priceLabel: true,
  roiIndicator: true,
  appreciation: true,
  ticketSize: true,
  area: true,
  bedrooms: true,
  handover: true,
  coverImage: true,
  heroVideo: true,
  brochureUrl: true,
  floorPlanUrl: true,
  amenities: true,
  highlights: true,
  featured: true,
  position: true,
  metrics: true,
  category: { select: { name: true, slug: true } },
  location: {
    select: {
      city: true,
      slug: true,
      microMarket: true,
      address: true,
      landmarks: true,
      latitude: true,
      longitude: true
    }
  },
  media: {
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    take: 16,
    select: {
      id: true,
      kind: true,
      title: true,
      altText: true,
      url: true
    }
  }
} satisfies Prisma.PropertySelect;

type PropertyRecord = Prisma.PropertyGetPayload<{ select: typeof propertySelect }>;

export type PropertyView = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  propertyType: string;
  status: string;
  categoryName: string;
  locationName: string;
  city: string;
  microMarket: string;
  address: string;
  investmentValue: string;
  priceLabel: string;
  roiIndicator: string;
  appreciation: string;
  ticketSize: string;
  area: string;
  bedrooms: string;
  handover: string;
  coverImage: string;
  heroVideo: string | null;
  brochureUrl: string | null;
  floorPlanUrl: string | null;
  gallery: Array<{ id: string; kind: string; title: string; alt: string; url: string }>;
  amenities: string[];
  highlights: string[];
  landmarks: string[];
  featured: boolean;
  metrics: Array<{ label: string; value: string }>;
};

export type TestimonialView = {
  id: string;
  quote: string;
  name: string;
  role: string;
  companyName: string | null;
  rating: number | null;
  image: string;
};

export type TrustMetricView = {
  label: string;
  value: number;
  suffix: string;
};

export type LandingData = {
  properties: PropertyView[];
  featured: PropertyView[];
  testimonials: TestimonialView[];
  trustMetrics: TrustMetricView[];
  locations: Array<{ city: string; microMarket: string; propertyCount: number }>;
};

export type PropertyDetailData = {
  property: PropertyView;
  related: PropertyView[];
  testimonials: TestimonialView[];
  trustMetrics: TrustMetricView[];
};

function normalizeImage(value: string | null | undefined) {
  return value || "/real-estate/projects/palm-grove-villa.webp";
}

function croreValue(value: string) {
  const match = value.replace(/,/g, "").match(/(\d+(?:\.\d+)?)\s*(?:cr|crore)/i);
  return match ? Number(match[1]) : 0;
}

function metricsFromJson(value: Prisma.JsonValue | null, fallback: PropertyRecord) {
  const json = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  const floors = typeof json.floors === "number" ? String(json.floors) : fallback.handover || "Private";
  const space = typeof json.space === "number" ? `${json.space}` : fallback.area || "On request";
  const bedrooms = typeof json.bedrooms === "number" ? `${json.bedrooms}` : fallback.bedrooms || "By format";
  const bathrooms = typeof json.bathrooms === "number" ? `${json.bathrooms}` : "By plan";

  return [
    { label: "Floors", value: floors },
    { label: "Space", value: space },
    { label: "Bedrooms", value: bedrooms },
    { label: "Bathrooms", value: bathrooms }
  ];
}

function propertyToView(property: PropertyRecord): PropertyView {
  const gallery = property.media
    .filter((media) => media.kind === "image" || media.kind === "gallery_asset" || media.kind === "floor_plan" || media.kind === "video")
    .map((media) => ({
      id: media.id,
      kind: media.kind,
      title: media.title,
      alt: media.altText || media.title,
      url: media.url
    }));
  const coverImage = normalizeImage(property.coverImage || gallery[0]?.url);
  const heroVideo = property.heroVideo || gallery.find((media) => media.kind === "video")?.url || null;

  return {
    id: property.id,
    title: property.title,
    slug: property.slug,
    summary: property.summary,
    description: property.description,
    propertyType: property.propertyType,
    status: property.status,
    categoryName: property.category?.name || property.propertyType,
    locationName: [property.location?.microMarket, property.location?.city].filter(Boolean).join(", ") || "South India",
    city: property.location?.city || "South India",
    microMarket: property.location?.microMarket || "Private corridor",
    address: property.location?.address || "South India",
    investmentValue: property.investmentValue || property.priceLabel || "Price on request",
    priceLabel: property.priceLabel || "Private note",
    roiIndicator: property.roiIndicator || "Reviewed by acquisition desk",
    appreciation: property.appreciation || "Long-term value thesis",
    ticketSize: property.ticketSize || "On request",
    area: property.area || "Shared privately",
    bedrooms: property.bedrooms || "By asset type",
    handover: property.handover || "Subject to diligence",
    coverImage,
    heroVideo,
    brochureUrl: property.brochureUrl,
    floorPlanUrl: property.floorPlanUrl,
    gallery: gallery.length ? gallery : [{ id: property.id, kind: "image", title: property.title, alt: property.title, url: coverImage }],
    amenities: property.amenities,
    highlights: property.highlights,
    landmarks: property.location?.landmarks || [],
    featured: property.featured,
    metrics: metricsFromJson(property.metrics, property)
  };
}

function testimonialImage(index: number, properties: PropertyView[]) {
  return properties[index % Math.max(properties.length, 1)]?.coverImage || "/images/la-perla/quote-balcony.webp";
}

async function ensureStarterContent() {
  const publishedCount = await prisma.property.count({ where: { published: true } });
  if (publishedCount < 4) {
    await ensureRealEstateDefaults(prisma);
  }

  const storyCount = await prisma.testimonial.count({ where: { division: "real-estate", approved: true } });
  if (storyCount > 0) return;

  await prisma.testimonial.createMany({
    data: [
      {
        division: "real-estate",
        quote: "Ractysh evaluated the property through location logic, appreciation potential and acquisition clarity before we ever discussed a site visit.",
        name: "Private Investor",
        role: "Villa Buyer",
        companyName: "Coimbatore",
        rating: 5,
        approved: true,
        position: 0
      },
      {
        division: "real-estate",
        quote: "The conversation felt like an investment desk. We saw the property, the market thesis and the long-term ownership profile together.",
        name: "Family Office",
        role: "Portfolio Representative",
        companyName: "South India",
        rating: 5,
        approved: true,
        position: 1
      },
      {
        division: "real-estate",
        quote: "Their team helped us compare lifestyle value and capital discipline without the pressure of a conventional sales process.",
        name: "Residential Investor",
        role: "Premium Apartment Client",
        companyName: "Chennai",
        rating: 5,
        approved: true,
        position: 2
      }
    ],
    skipDuplicates: true
  });
}

function trustMetrics(properties: PropertyView[], leadCount: number, testimonials: Array<{ rating: number | null }>) {
  const projectValue = Math.round(properties.reduce((total, property) => total + croreValue(property.investmentValue), 0));
  const ratings = testimonials.map((story) => story.rating).filter((rating): rating is number => typeof rating === "number" && rating > 0);
  const satisfaction = ratings.length ? Math.round((ratings.reduce((total, rating) => total + rating, 0) / ratings.length / 5) * 100) : 96;

  return [
    { label: "Properties Delivered", value: Math.max(properties.filter((property) => property.status === "sold").length, properties.length), suffix: "+" },
    { label: "Investors Served", value: Math.max(leadCount + testimonials.length, testimonials.length), suffix: "+" },
    { label: "Project Value", value: projectValue || properties.length * 10, suffix: " Cr+" },
    { label: "Client Satisfaction", value: satisfaction, suffix: "%" }
  ];
}

function labelFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function seedToPropertyView(seed: (typeof realEstatePropertySeeds)[number]): PropertyView {
  const city = labelFromSlug(seed.locationSlug);
  const categoryName = labelFromSlug(seed.categorySlug);

  return {
    id: `seed-${seed.slug}`,
    title: seed.title,
    slug: seed.slug,
    summary: seed.summary,
    description: seed.description,
    propertyType: seed.propertyType,
    status: seed.status,
    categoryName,
    locationName: city,
    city,
    microMarket: "South India",
    address: `${city}, South India`,
    investmentValue: seed.investmentValue,
    priceLabel: seed.priceLabel,
    roiIndicator: seed.roiIndicator,
    appreciation: seed.appreciation,
    ticketSize: seed.ticketSize,
    area: seed.area,
    bedrooms: seed.bedrooms,
    handover: seed.handover,
    coverImage: seed.coverImage,
    heroVideo: null,
    brochureUrl: null,
    floorPlanUrl: null,
    gallery: seed.media.map((url, index) => ({
      id: `${seed.slug}-${index}`,
      kind: index === 0 ? "image" : "gallery_asset",
      title: `${seed.title} ${index + 1}`,
      alt: `${seed.title} property image ${index + 1}`,
      url
    })),
    amenities: seed.amenities,
    highlights: seed.highlights,
    landmarks: ["Premium corridor", "Private access", "Lifestyle infrastructure", "Ractysh acquisition desk"],
    featured: seed.featured,
    metrics: [
      { label: "Floors", value: String(seed.metrics.floors) },
      { label: "Space", value: String(seed.metrics.space) },
      { label: "Bedrooms", value: String(seed.metrics.bedrooms) },
      { label: "Bathrooms", value: String(seed.metrics.bathrooms) }
    ]
  };
}

function fallbackTestimonials(properties: PropertyView[]): TestimonialView[] {
  return [
    {
      id: "fallback-investor-story-1",
      quote: "Ractysh evaluated the property through location logic, appreciation potential and acquisition clarity before we ever discussed a site visit.",
      name: "Private Investor",
      role: "Villa Buyer",
      companyName: "Coimbatore",
      rating: 5,
      image: testimonialImage(1, properties)
    },
    {
      id: "fallback-investor-story-2",
      quote: "The conversation felt like an investment desk. We saw the property, the market thesis and the long-term ownership profile together.",
      name: "Family Office",
      role: "Portfolio Representative",
      companyName: "South India",
      rating: 5,
      image: testimonialImage(2, properties)
    },
    {
      id: "fallback-investor-story-3",
      quote: "Their team helped us compare lifestyle value and capital discipline without the pressure of a conventional sales process.",
      name: "Residential Investor",
      role: "Premium Apartment Client",
      companyName: "Chennai",
      rating: 5,
      image: testimonialImage(3, properties)
    }
  ];
}

function fallbackLandingData(): LandingData {
  const properties = [...realEstatePropertySeeds].sort((a, b) => a.position - b.position).map(seedToPropertyView);
  const testimonials = fallbackTestimonials(properties);
  const locationCounts = new Map<string, number>();
  properties.forEach((property) => locationCounts.set(property.city, (locationCounts.get(property.city) || 0) + 1));

  return {
    properties,
    featured: properties.filter((property) => property.featured).concat(properties.filter((property) => !property.featured)).slice(0, 8),
    testimonials,
    trustMetrics: trustMetrics(properties, 0, testimonials),
    locations: Array.from(locationCounts.entries()).map(([city, propertyCount]) => ({
      city,
      microMarket: "South India",
      propertyCount
    }))
  };
}

function fallbackPropertyDetail(slug: string): PropertyDetailData | null {
  const landing = fallbackLandingData();
  const property = landing.properties.find((item) => item.slug === slug);
  if (!property) return null;

  const related = landing.properties.filter((item) => item.slug !== slug).slice(0, 4);
  return {
    property,
    related,
    testimonials: landing.testimonials,
    trustMetrics: trustMetrics([property, ...related], 0, landing.testimonials)
  };
}

export async function getLandingData(): Promise<LandingData> {
  try {
    await ensureStarterContent();

    const [properties, testimonials, leadCount, locations] = await Promise.all([
      prisma.property.findMany({
        where: { published: true, status: { in: [...publicStatuses] } },
        orderBy: [{ featured: "desc" }, { position: "asc" }, { createdAt: "desc" }],
        take: 24,
        select: propertySelect
      }),
      prisma.testimonial.findMany({
        where: { division: "real-estate", approved: true },
        orderBy: [{ position: "asc" }, { createdAt: "desc" }],
        take: 6,
        select: { id: true, quote: true, name: true, role: true, companyName: true, rating: true }
      }),
      prisma.propertyLead.count(),
      prisma.propertyLocation.findMany({
        where: { active: true },
        orderBy: [{ position: "asc" }, { city: "asc" }],
        take: 8,
        select: { city: true, microMarket: true, _count: { select: { properties: true } } }
      })
    ]);

    const propertyViews = properties.map(propertyToView);
    if (!propertyViews.length) return fallbackLandingData();

    const storyViews = testimonials.map((story, index) => ({ ...story, image: testimonialImage(index + 1, propertyViews) }));

    return {
      properties: propertyViews,
      featured: propertyViews.filter((property) => property.featured).concat(propertyViews.filter((property) => !property.featured)).slice(0, 8),
      testimonials: storyViews.length ? storyViews : fallbackTestimonials(propertyViews),
      trustMetrics: trustMetrics(propertyViews, leadCount, testimonials),
      locations: locations.map((location) => ({
        city: location.city,
        microMarket: location.microMarket || "Private corridor",
        propertyCount: location._count.properties
      }))
    };
  } catch (error) {
    console.error("[real-estate-landing] database unavailable, using shared seed fallback", error);
    return fallbackLandingData();
  }
}

export async function getPropertyDetail(slug: string): Promise<PropertyDetailData | null> {
  try {
    await ensureStarterContent();

    const property = await prisma.property.findFirst({
      where: { slug, published: true, status: { in: [...publicStatuses] } },
      select: propertySelect
    });
    if (!property) return fallbackPropertyDetail(slug);

    const [related, testimonials, leadCount] = await Promise.all([
      prisma.property.findMany({
        where: { published: true, id: { not: property.id }, status: { in: [...publicStatuses] } },
        orderBy: [{ featured: "desc" }, { position: "asc" }, { createdAt: "desc" }],
        take: 4,
        select: propertySelect
      }),
      prisma.testimonial.findMany({
        where: { division: "real-estate", approved: true },
        orderBy: [{ position: "asc" }, { createdAt: "desc" }],
        take: 4,
        select: { id: true, quote: true, name: true, role: true, companyName: true, rating: true }
      }),
      prisma.propertyLead.count()
    ]);

    const propertyView = propertyToView(property);
    const relatedViews = related.map(propertyToView);
    const storyViews = testimonials.map((story, index) => ({ ...story, image: testimonialImage(index, [propertyView, ...relatedViews]) }));

    return {
      property: propertyView,
      related: relatedViews,
      testimonials: storyViews.length ? storyViews : fallbackTestimonials([propertyView, ...relatedViews]),
      trustMetrics: trustMetrics([propertyView, ...relatedViews], leadCount, testimonials)
    };
  } catch (error) {
    console.error("[real-estate-detail] database unavailable, using shared seed fallback", error);
    return fallbackPropertyDetail(slug);
  }
}
