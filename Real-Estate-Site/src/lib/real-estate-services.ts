export type ServiceSlug =
  | "land-building-promoters"
  | "luxury-villas"
  | "premium-residential-plots"
  | "residential-building-developments"
  | "commercial-building-developments"
  | "modern-row-house-communities"
  | "gated-community-projects"
  | "government-approved-lands";

export interface RealEstateService {
  slug: ServiceSlug;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  shortDescription: string;
  featured: boolean;
  heroImage: string;
  benefits: string[];
  investmentValue: string[];
  relatedSlugs: ServiceSlug[];
}

const services: RealEstateService[] = [
  {
    slug: "land-building-promoters",
    title: "Land & Building Promoters",
    shortTitle: "Land & Building Promoters",
    tagline: "Strategic land development and project promotion",
    description:
      "We identify, acquire, and develop prime land parcels into high-value real estate projects. Our team manages everything from feasibility studies and regulatory approvals to project marketing and execution, ensuring maximum returns for landowners and investors.",
    shortDescription:
      "Strategic land acquisition, regulatory approvals, and project development management for premium real estate opportunities.",
    featured: false,
    heroImage:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80",
    benefits: [
      "Comprehensive feasibility studies and market analysis",
      "End-to-end regulatory approval management",
      "Strategic project positioning and branding",
      "Maximum value extraction from land assets",
      "Transparent investor and landowner partnerships",
    ],
    investmentValue: [
      "High appreciation potential in growth corridors",
      "Multiple exit options through development or sale",
      "Professional project management reduces risk",
      "Institutional-grade due diligence on all acquisitions",
    ],
    relatedSlugs: [
      "premium-residential-plots",
      "government-approved-lands",
      "gated-community-projects",
    ],
  },
  {
    slug: "luxury-villas",
    title: "Luxury Villas",
    shortTitle: "Luxury Villas",
    tagline: "Architectural residences for discerning homeowners",
    description:
      "Bespoke luxury villas designed by award-winning architects, featuring premium finishes, smart home technology, and private landscapes. Each residence is a statement of refined living, crafted for those who demand the extraordinary.",
    shortDescription:
      "Bespoke architectural residences with premium finishes, smart home technology, and private landscapes.",
    featured: true,
    heroImage:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    benefits: [
      "Award-winning architectural design",
      "Premium European finishes and fittings",
      "Smart home automation systems",
      "Private pool and landscape gardens",
      "Secure gated community environment",
      "Personalized interior design consultation",
    ],
    investmentValue: [
      "Consistent appreciation in luxury segment",
      "High rental yield potential",
      "Limited inventory ensures scarcity value",
      "World-class amenities enhance lifestyle equity",
    ],
    relatedSlugs: [
      "gated-community-projects",
      "premium-residential-plots",
      "residential-building-developments",
    ],
  },
  {
    slug: "premium-residential-plots",
    title: "Premium Residential Plots",
    shortTitle: "Residential Plots",
    tagline: "Master-planned developments for your dream home",
    description:
      "Carefully curated residential plots in master-planned communities with approved layouts, underground utilities, and wide tree-lined avenues. Build your vision on land that meets the highest standards of planning and infrastructure.",
    shortDescription:
      "Approved residential plots in master-planned communities with premium infrastructure and wide avenues.",
    featured: true,
    heroImage:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
    benefits: [
      "Government-approved layouts and titles",
      "Underground power and water infrastructure",
      "Wide roads with tree-lined avenues",
      "Parks and recreational open spaces",
      "Bank-approved documentation",
      "Flexible plot sizes for varied requirements",
    ],
    investmentValue: [
      "Land appreciation in developing corridors",
      "Low holding costs with high growth trajectory",
      "Clear titles and encumbrance-free property",
      "Ideal for long-term wealth creation",
    ],
    relatedSlugs: [
      "government-approved-lands",
      "land-building-promoters",
      "gated-community-projects",
    ],
  },
  {
    slug: "residential-building-developments",
    title: "Residential Building Developments",
    shortTitle: "Residential Developments",
    tagline: "Premium apartments and residences for modern living",
    description:
      "Contemporary residential developments featuring thoughtfully designed apartments, penthouses, and duplex residences. Each project emphasizes spatial efficiency, natural light, and community living with world-class amenities.",
    shortDescription:
      "Thoughtfully designed apartments and residences with world-class amenities and contemporary architecture.",
    featured: true,
    heroImage:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
    benefits: [
      "Contemporary architectural design",
      "Premium clubhouse and amenity spaces",
      "Landscaped gardens and children's play areas",
      "24/7 security and maintenance",
      "Sustainable building practices",
      "Prime locations with excellent connectivity",
    ],
    investmentValue: [
      "Strong rental demand in premium locations",
      "Capital appreciation with project completion",
      "Professional property management available",
      "Proven track record of timely delivery",
    ],
    relatedSlugs: [
      "luxury-villas",
      "gated-community-projects",
      "commercial-building-developments",
    ],
  },
  {
    slug: "commercial-building-developments",
    title: "Commercial Building Developments",
    shortTitle: "Commercial Developments",
    tagline: "Iconic commercial spaces for business excellence",
    description:
      "Grade-A commercial developments including office towers, retail destinations, and mixed-use complexes designed to attract leading businesses and create vibrant commercial ecosystems.",
    shortDescription:
      "Grade-A office towers, retail destinations, and mixed-use commercial complexes for business excellence.",
    featured: true,
    heroImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    benefits: [
      "Strategic business district locations",
      "World-class office infrastructure",
      "Retail and F&B destination curation",
      "Ample parking and transport connectivity",
      "LEED-certified sustainable design",
      "Professional facility management",
    ],
    investmentValue: [
      "Stable rental income from quality tenants",
      "Long-term lease structures ensure predictability",
      "Capital appreciation in growth corridors",
      "Institutional-grade asset with high liquidity",
    ],
    relatedSlugs: [
      "residential-building-developments",
      "land-building-promoters",
      "gated-community-projects",
    ],
  },
  {
    slug: "modern-row-house-communities",
    title: "Modern Row House Communities",
    shortTitle: "Row House Communities",
    tagline: "Contemporary community living with individual identity",
    description:
      "Modern row house developments that combine the privacy of individual homes with the security and amenities of a community. Each unit features contemporary design, private garden spaces, and access to shared recreational facilities.",
    shortDescription:
      "Contemporary row houses with private gardens, modern design, and community amenities in secure developments.",
    featured: false,
    heroImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    benefits: [
      "Individual home ownership in community setting",
      "Private garden and outdoor spaces",
      "Modern architectural design",
      "Community clubhouse and recreation",
      "Dedicated parking and visitor spaces",
      "Low maintenance costs",
    ],
    investmentValue: [
      "Affordable entry point into premium real estate",
      "Strong demand from nuclear families",
      "Better rental yields compared to apartments",
      "Land component ensures long-term value",
    ],
    relatedSlugs: [
      "gated-community-projects",
      "residential-building-developments",
      "premium-residential-plots",
    ],
  },
  {
    slug: "gated-community-projects",
    title: "Gated Community Projects",
    shortTitle: "Gated Communities",
    tagline: "Premium neighborhood developments with unparalleled amenities",
    description:
      "Exclusive gated communities that redefine premium living. Each development features comprehensive security, world-class amenities, landscaped environments, and a strong sense of community. From clubhouses to sports facilities, every detail is designed for an elevated lifestyle.",
    shortDescription:
      "Exclusive gated communities with comprehensive security, world-class amenities, and landscaped environments.",
    featured: true,
    heroImage:
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&q=80",
    benefits: [
      "24/7 multi-layer security system",
      "Clubhouse with swimming pool and gym",
      "Sports courts and jogging tracks",
      "Landscaped parks and children's play areas",
      "Community events and social spaces",
      "Professional maintenance and management",
    ],
    investmentValue: [
      "Premium pricing power over standalone properties",
      "Higher demand from quality-conscious buyers",
      "Better capital preservation during market cycles",
      "Superior rental and resale value",
    ],
    relatedSlugs: [
      "luxury-villas",
      "residential-building-developments",
      "modern-row-house-communities",
    ],
  },
  {
    slug: "government-approved-lands",
    title: "Government Approved Lands & Plots",
    shortTitle: "Approved Lands",
    tagline: "Legal, approved and ready for development",
    description:
      "Fully approved land parcels with clear titles, government sanctions, and development-ready status. We ensure complete legal due diligence, transparent documentation, and hassle-free transfer processes for peace of mind.",
    shortDescription:
      "Fully approved land parcels with clear titles, government sanctions, and complete legal due diligence.",
    featured: true,
    heroImage:
      "/images/real-estate/government-approved-lands.webp",
    benefits: [
      "Complete legal due diligence and title verification",
      "Government-approved layout and building plans",
      "Clear encumbrance-free documentation",
      "Bank-approved property valuation",
      "Transparent pricing and payment structure",
      "Hassle-free registration and transfer",
    ],
    investmentValue: [
      "Secure investment with clear legal title",
      "High growth potential in developing areas",
      "Multiple development or resale options",
      "Ideal for NRIs seeking Indian real estate",
    ],
    relatedSlugs: [
      "premium-residential-plots",
      "land-building-promoters",
      "gated-community-projects",
    ],
  },
];

export function getAllServices(): RealEstateService[] {
  return services;
}

export function getFeaturedServices(): RealEstateService[] {
  return services.filter((s) => s.featured);
}

export function getServiceBySlug(
  slug: string,
): RealEstateService | undefined {
  return services.find((s) => s.slug === slug);
}

export function getRelatedServices(
  slugs: ServiceSlug[],
): RealEstateService[] {
  return slugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is RealEstateService => s !== undefined);
}
