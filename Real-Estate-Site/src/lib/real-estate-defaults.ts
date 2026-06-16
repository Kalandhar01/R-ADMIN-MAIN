import type { Prisma, PrismaClient, RealEstatePropertyStatus } from "@prisma/client";

type RealEstateSeederClient = Pick<PrismaClient, "propertyCategory" | "propertyLocation" | "property" | "propertyMedia">;

type PropertySeed = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  propertyType: string;
  categorySlug: string;
  locationSlug: string;
  status: RealEstatePropertyStatus;
  investmentValue: string;
  priceLabel: string;
  roiIndicator: string;
  appreciation: string;
  ticketSize: string;
  area: string;
  bedrooms: string;
  handover: string;
  coverImage: string;
  metrics: Record<string, number>;
  amenities: string[];
  highlights: string[];
  featured: boolean;
  position: number;
  media: string[];
};

const defaultCategories = [
  {
    name: "Premium Residences",
    slug: "premium-residences",
    description: "Private residences, villas and lifestyle-led ownership assets.",
    position: 0
  },
  {
    name: "Luxury Apartments",
    slug: "luxury-apartments",
    description: "Apartment residences, sky homes and serviced urban living assets.",
    position: 1
  },
  {
    name: "Commercial Assets",
    slug: "commercial-assets",
    description: "Commercial frontage, office floors and income-oriented properties.",
    position: 2
  }
];

const defaultLocations = [
  {
    city: "Coimbatore",
    slug: "coimbatore",
    microMarket: "Western Bypass",
    address: "Coimbatore, Tamil Nadu",
    landmarks: ["Western Bypass", "Avinashi Road", "Airport connectivity", "Premium schools"],
    position: 0
  },
  {
    city: "Chennai",
    slug: "chennai",
    microMarket: "ECR Urban Edge",
    address: "Chennai, Tamil Nadu",
    landmarks: ["ECR corridor", "Marina access", "IT expressway", "Lifestyle retail"],
    position: 1
  },
  {
    city: "Kochi",
    slug: "kochi",
    microMarket: "Waterfront Quarter",
    address: "Kochi, Kerala",
    landmarks: ["Marine Drive", "Metro access", "Waterfront clubs", "Airport corridor"],
    position: 2
  },
  {
    city: "Palani",
    slug: "palani",
    microMarket: "Hill Approach",
    address: "Palani, Tamil Nadu",
    landmarks: ["Palani Hills", "Temple corridor", "Railway access", "Dindigul highway"],
    position: 3
  },
  {
    city: "Dindigul",
    slug: "dindigul",
    microMarket: "Collectorate Corridor",
    address: "Dindigul, Tamil Nadu",
    landmarks: ["Collectorate", "NH corridor", "Railway station", "Retail catchment"],
    position: 4
  },
  {
    city: "Bengaluru",
    slug: "bengaluru",
    microMarket: "North Business District",
    address: "Bengaluru, Karnataka",
    landmarks: ["Airport expressway", "Business parks", "Premium hospitality", "Metro expansion"],
    position: 5
  }
];

export const realEstatePropertySeeds: PropertySeed[] = [
  {
    title: "Gardenia Apartments",
    slug: "gardenia-apartment",
    summary: "A composed apartment residence with warm interiors, coastal ease and a refined daily living rhythm.",
    description:
      "Gardenia Apartment is planned for buyers who want a calm, design-led apartment experience with efficient floor plates, generous light and a boutique urban address.",
    propertyType: "Luxury Apartment",
    categorySlug: "luxury-apartments",
    locationSlug: "chennai",
    status: "available",
    investmentValue: "From INR 2.4 Cr",
    priceLabel: "Apartment release",
    roiIndicator: "Urban rental depth",
    appreciation: "Boutique apartment scarcity",
    ticketSize: "INR 2.4 Cr - 3.2 Cr",
    area: "150 Sqm",
    bedrooms: "2",
    handover: "Q2 2027",
    coverImage: "/real-estate/projects/gardenia-apartments.webp",
    metrics: { floors: 2, space: 150, bedrooms: 2, bathrooms: 2 },
    amenities: ["Concierge arrival", "Residents club", "Smart home readiness", "Private parking", "Wellness lounge"],
    highlights: ["Efficient luxury planning", "Warm interior palette", "Prime apartment release"],
    featured: true,
    position: 7,
    media: [
      "/real-estate/projects/gardenia-apartments.webp",
      "/real-estate/projects/gardenia-apartments-bath.webp",
      "/real-estate/projects/skyline-residence.webp",
      "/real-estate/projects/lakefront-residences-living.webp",
      "/real-estate/projects/emerald-heights-lobby.webp"
    ]
  },
  {
    title: "Skyline Residence",
    slug: "skyline-residence",
    summary: "A high-floor residence designed around skyline views, terrace living and privacy above the city.",
    description:
      "Skyline Residence brings together elevated views, hospitality-grade amenity access and a larger-format apartment plan for owners who want urban living with villa-like calm.",
    propertyType: "Sky Residence",
    categorySlug: "luxury-apartments",
    locationSlug: "chennai",
    status: "available",
    investmentValue: "From INR 4.1 Cr",
    priceLabel: "Sky home release",
    roiIndicator: "Premium vertical inventory",
    appreciation: "High-floor scarcity premium",
    ticketSize: "INR 4.1 Cr - 5.6 Cr",
    area: "220 Sqm",
    bedrooms: "4",
    handover: "Q4 2027",
    coverImage: "/real-estate/projects/skyline-residence.webp",
    metrics: { floors: 18, space: 220, bedrooms: 4, bathrooms: 3 },
    amenities: ["Sky terrace", "Infinity pool", "Concierge desk", "Private fitness", "Co-working lounge"],
    highlights: ["High-floor views", "Large format residence", "Amenity-rich lifestyle"],
    featured: true,
    position: 1,
    media: [
      "/real-estate/projects/skyline-residence.webp",
      "/real-estate/projects/skyline-residence-terrace.webp",
      "/real-estate/projects/gardenia-apartments.webp",
      "/real-estate/projects/lakefront-residences.webp",
      "/real-estate/projects/urban-signature-tower.webp"
    ]
  },
  {
    title: "Palm Grove Villa",
    slug: "palm-grove-villa",
    summary: "A tropical villa asset shaped around garden courts, stone textures and private family living.",
    description:
      "Palm Grove Villa is a premium South India residence with generous outdoor rooms, natural materials and a private ownership profile suited for long-term family use.",
    propertyType: "Premium Villa",
    categorySlug: "premium-residences",
    locationSlug: "coimbatore",
    status: "available",
    investmentValue: "From INR 5.8 Cr",
    priceLabel: "Private villa note",
    roiIndicator: "Villa corridor demand",
    appreciation: "Low-density land premium",
    ticketSize: "INR 5.8 Cr - 7.9 Cr",
    area: "420 Sqm",
    bedrooms: "4",
    handover: "Q1 2028",
    coverImage: "/real-estate/projects/palm-grove-villa.webp",
    metrics: { floors: 2, space: 420, bedrooms: 4, bathrooms: 5 },
    amenities: ["Private garden", "Pool court", "Club access", "EV garage", "Staff suite"],
    highlights: ["Garden-led villa planning", "Natural stone palette", "Private family ownership"],
    featured: true,
    position: 2,
    media: [
      "/real-estate/projects/palm-grove-villa.webp",
      "/real-estate/projects/palm-grove-villa-pool.webp",
      "/real-estate/projects/hillcrest-villas.webp",
      "/real-estate/projects/verdant-villa-estate.webp",
      "/real-estate/projects/gardenia-apartments.webp"
    ]
  },
  {
    title: "Emerald Heights",
    slug: "emerald-heights",
    summary: "A commercial tower opportunity with strong frontage, office flexibility and long-horizon income potential.",
    description:
      "Emerald Heights is structured for investors seeking an income-led commercial asset with premium visibility, adaptable floor plates and enterprise-grade leasing potential.",
    propertyType: "Commercial Property",
    categorySlug: "commercial-assets",
    locationSlug: "bengaluru",
    status: "available",
    investmentValue: "From INR 18 Cr",
    priceLabel: "Structured acquisition",
    roiIndicator: "Lease-led income model",
    appreciation: "Business district expansion",
    ticketSize: "INR 18 Cr - 32 Cr",
    area: "28,000 Sqft",
    bedrooms: "Office floors",
    handover: "Ready for diligence",
    coverImage: "/real-estate/projects/emerald-heights.webp",
    metrics: { floors: 14, space: 28000, bedrooms: 0, bathrooms: 8 },
    amenities: ["Frontage signage", "Tenant fit-out", "Parking stack", "Security desk", "Asset diligence"],
    highlights: ["Commercial visibility", "Flexible office plates", "Income-focused structure"],
    featured: true,
    position: 3,
    media: [
      "/real-estate/projects/emerald-heights.webp",
      "/real-estate/projects/emerald-heights-lobby.webp",
      "/real-estate/projects/urban-signature-tower.webp",
      "/real-estate/projects/urban-signature-tower-frontage.webp",
      "/real-estate/projects/skyline-residence-terrace.webp"
    ]
  },
  {
    title: "Verdant Villa Estate",
    slug: "verdant-villa-estate-coimbatore",
    summary: "A low-density villa enclave positioned for private ownership and long-horizon appreciation.",
    description:
      "Curated as an ownership-grade residence, Verdant Villa Estate combines premium frontage, composed interiors and investment discipline across a growing Coimbatore corridor.",
    propertyType: "Private Villa",
    categorySlug: "premium-residences",
    locationSlug: "coimbatore",
    status: "available",
    investmentValue: "From INR 4.8 Cr",
    priceLabel: "Private price note",
    roiIndicator: "Projected 9-11% YoY corridor appreciation",
    appreciation: "High scarcity villa inventory",
    ticketSize: "INR 4.8 Cr - 7.2 Cr",
    area: "390 Sqm",
    bedrooms: "4 and 5 bedroom villas",
    handover: "Q4 2027",
    coverImage: "/real-estate/projects/verdant-villa-estate.webp",
    metrics: { floors: 2, space: 390, bedrooms: 5, bathrooms: 5 },
    amenities: ["Private garden courts", "Arrival lounge", "Club pavilion", "EV-ready parking", "Concierge support"],
    highlights: ["Low-density masterplan", "Family office review lane", "Premium villa demand corridor"],
    featured: true,
    position: 0,
    media: [
      "/real-estate/projects/verdant-villa-estate.webp",
      "/real-estate/projects/verdant-villa-estate-facade.webp",
      "/real-estate/projects/palm-grove-villa.webp",
      "/real-estate/projects/hillcrest-villas-approach.webp",
      "/real-estate/projects/palm-grove-villa-pool.webp"
    ]
  },
  {
    title: "Lakefront Residences",
    slug: "lakefront-residences",
    summary: "A quiet lakefront residential address composed for breeze, leisure and long-term private ownership.",
    description:
      "A rare waterfront residential collection that balances resort-like calm with practical family planning, using generous terraces and framed water views as the core investment narrative.",
    propertyType: "Lakefront Residences",
    categorySlug: "luxury-apartments",
    locationSlug: "kochi",
    status: "available",
    investmentValue: "From INR 3.9 Cr",
    priceLabel: "Lakefront release",
    roiIndicator: "Waterfront scarcity premium",
    appreciation: "Limited lifestyle inventory",
    ticketSize: "INR 3.9 Cr - 6.8 Cr",
    area: "260 Sqm",
    bedrooms: "3 and 4 bedroom residences",
    handover: "Q3 2028",
    coverImage: "/real-estate/projects/lakefront-residences.webp",
    metrics: { floors: 12, space: 260, bedrooms: 4, bathrooms: 4 },
    amenities: ["Waterfront deck", "Private pool", "Landscape courts", "Concierge arrival", "Guest suite"],
    highlights: ["Water-facing residences", "Lifestyle-led ownership", "Scarcity asset"],
    featured: true,
    position: 4,
    media: [
      "/real-estate/projects/lakefront-residences.webp",
      "/real-estate/projects/lakefront-residences-living.webp",
      "/real-estate/projects/skyline-residence-terrace.webp",
      "/real-estate/projects/palm-grove-villa-pool.webp",
      "/real-estate/projects/gardenia-apartments.webp"
    ]
  },
  {
    title: "Hillcrest Villas",
    slug: "hillcrest-villas",
    summary: "A South Indian hill-edge villa collection with material warmth, shaded verandahs and layered privacy.",
    description:
      "Designed for owners who value climate-aware planning, material character and family gathering spaces, Hillcrest Villas uses courts and terraces to create light, air and privacy.",
    propertyType: "Premium Villa",
    categorySlug: "premium-residences",
    locationSlug: "palani",
    status: "private_review",
    investmentValue: "From INR 3.2 Cr",
    priceLabel: "Private review",
    roiIndicator: "Land-led appreciation thesis",
    appreciation: "Emerging villa demand",
    ticketSize: "INR 3.2 Cr - 4.6 Cr",
    area: "340 Sqm",
    bedrooms: "4",
    handover: "Phased release",
    coverImage: "/real-estate/projects/hillcrest-villas.webp",
    metrics: { floors: 2, space: 340, bedrooms: 4, bathrooms: 4 },
    amenities: ["Courtyard planning", "Hill-view deck", "Private streets", "Security layer", "Landscape spine"],
    highlights: ["South Indian materiality", "Climate-responsive layout", "Early-buyer release"],
    featured: true,
    position: 5,
    media: [
      "/real-estate/projects/hillcrest-villas.webp",
      "/real-estate/projects/hillcrest-villas-approach.webp",
      "/real-estate/projects/verdant-villa-estate.webp",
      "/real-estate/projects/palm-grove-villa.webp"
    ]
  },
  {
    title: "Urban Signature Tower",
    slug: "urban-signature-tower",
    summary: "A signature urban tower evaluated for visibility, lease depth and future city expansion.",
    description:
      "A premium tower asset for buyers who want location intelligence, tenant suitability and enterprise acquisition support before commitment.",
    propertyType: "Signature Tower",
    categorySlug: "commercial-assets",
    locationSlug: "dindigul",
    status: "available",
    investmentValue: "From INR 12.5 Cr",
    priceLabel: "Structured acquisition",
    roiIndicator: "Income plus appreciation model",
    appreciation: "Visibility-led commercial demand",
    ticketSize: "INR 12.5 Cr - 24 Cr",
    area: "24,000 Sqft",
    bedrooms: "Commercial floors",
    handover: "Ready for due diligence",
    coverImage: "/real-estate/projects/urban-signature-tower.webp",
    metrics: { floors: 11, space: 24000, bedrooms: 0, bathrooms: 8 },
    amenities: ["Frontage planning", "Parking strategy", "Tenant fit-out support", "Signage visibility", "Due diligence desk"],
    highlights: ["High-visibility axis", "Income-focused positioning", "Commercial acquisition support"],
    featured: true,
    position: 6,
    media: [
      "/real-estate/projects/urban-signature-tower.webp",
      "/real-estate/projects/urban-signature-tower-frontage.webp",
      "/real-estate/projects/emerald-heights.webp",
      "/real-estate/projects/emerald-heights-lobby.webp"
    ]
  }
];

export async function ensureRealEstateDefaults(db: RealEstateSeederClient) {
  const categories = await Promise.all(
    defaultCategories.map((category) =>
      db.propertyCategory.upsert({
        where: { slug: category.slug },
        update: category,
        create: category
      })
    )
  );
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category.id]));

  const locations = await Promise.all(
    defaultLocations.map((location) =>
      db.propertyLocation.upsert({
        where: { slug: location.slug },
        update: location,
        create: location
      })
    )
  );
  const locationBySlug = new Map(locations.map((location) => [location.slug, location.id]));

  for (const seed of realEstatePropertySeeds) {
    const { categorySlug, locationSlug, media, metrics, ...propertyInput } = seed;
    const propertyData = {
      ...propertyInput,
      categoryId: categoryBySlug.get(categorySlug) || null,
      locationId: locationBySlug.get(locationSlug) || null,
      coverImageAlt: `${seed.title} property image`,
      metrics: metrics as Prisma.InputJsonValue,
      published: true
    };

    const existingProperty = await db.property.findUnique({
      where: { slug: seed.slug },
      select: { id: true }
    });
    const property = existingProperty || (await db.property.create({ data: propertyData }));

    const mediaCount = await db.propertyMedia.count({ where: { propertyId: property.id } });
    if (mediaCount === 0) {
      await db.propertyMedia.createMany({
        data: media.map((url, index) => ({
          propertyId: property.id,
          kind: index === 0 ? "image" : "gallery_asset",
          title: `${seed.title} gallery ${index + 1}`,
          altText: `${seed.title} gallery image ${index + 1}`,
          url,
          provider: "local",
          position: index,
          metadata: { seeded: true, propertySlug: seed.slug } as Prisma.InputJsonValue
        }))
      });
    }
  }
}
