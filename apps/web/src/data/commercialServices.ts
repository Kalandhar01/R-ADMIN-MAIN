export interface CommercialServiceMetric {
  label: string;
  value: string;
}

export interface CommercialServiceSection {
  title: string;
  body: string;
}

export interface CommercialServicePageData {
  slug: string;
  href: string;
  eyebrow: string;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  relatedDivision: string;
  metrics: CommercialServiceMetric[];
  capabilities: CommercialServiceSection[];
  workflow: CommercialServiceSection[];
}

export const commercialServicePages: CommercialServicePageData[] = [
  {
    slug: "architecture-service",
    href: "/architecture-service",
    eyebrow: "Commercial Services / Architecture",
    title: "Architecture Service",
    summary:
      "Commercial architecture support for spatial planning, concept direction, design documentation and premium project decisions.",
    image: "/services/showcase-architecture.webp",
    imageAlt: "Premium architecture service for modern building planning",
    relatedDivision: "Architecture Division",
    metrics: [
      { label: "Service Type", value: "Design" },
      { label: "Output", value: "Plans" },
      { label: "Route", value: "Service" }
    ],
    capabilities: [
      {
        title: "Concept planning",
        body: "Shape site potential, spatial logic and architectural direction before delivery decisions are locked."
      },
      {
        title: "Design documentation",
        body: "Prepare clear drawings, references and review material for approvals, consultants and execution teams."
      },
      {
        title: "Premium presentation",
        body: "Convert design intent into client-ready visuals, narratives and decision material."
      }
    ],
    workflow: [
      { title: "Brief", body: "Requirement, site context, timeline and budget sensitivity are mapped." },
      { title: "Direction", body: "Planning logic, form language and service scope are aligned." },
      { title: "Handoff", body: "Documentation and next-step recommendations are prepared for delivery." }
    ]
  },
  {
    slug: "construction-service",
    href: "/construction-service",
    eyebrow: "Commercial Services / Construction",
    title: "Construction Service",
    summary:
      "Full-spectrum construction services including civil engineering, MEP, commercial & residential buildings, renovations, PEB, turnkey projects, interior works, landscape, swimming pools, lifts, mega structures, government tenders, project management, approvals, surveys, soil testing, and building stability testing.",
    image: "/services/showcase-construction.webp",
    imageAlt: "Premium construction service for site delivery coordination",
    relatedDivision: "Construction Division",
    metrics: [
      { label: "Service Type", value: "Full-Spectrum" },
      { label: "Output", value: "End-to-End" },
      { label: "Capabilities", value: "25+" }
    ],
    capabilities: [
      {
        title: "Civil & MEP Engineering",
        body: "Civil engineering works and consultations, MEP engineering works, electrical works, plumbing works coordinated under one execution umbrella."
      },
      {
        title: "Building Construction",
        body: "Commercial building construction, residential building construction, building renovation, PEB structures and turnkey project delivery."
      },
      {
        title: "Specialized Works",
        body: "Labour contracts, interior works, turf construction, painting works, tiles work, landscape work, swimming pool works and lift execution."
      },
      {
        title: "Mega & Government Projects",
        body: "Mega structure projects, government building construction and tender works, project management consultation, building approval works."
      },
      {
        title: "Material & Product Sourcing",
        body: "Building material and product sourcing with supply chain coordination for seamless site execution."
      },
      {
        title: "Testing & Survey",
        body: "Land and building survey works, soil testing, building stability testing for structural integrity and compliance."
      }
    ],
    workflow: [
      { title: "Enquiry", body: "Project requirements, site context, timeline and budget are reviewed." },
      { title: "Proposal", body: "Scope, estimates, milestones and delivery approach are presented." },
      { title: "Execution", body: "Site work, quality control, vendor coordination and progress tracking are managed." },
      { title: "Handover", body: "Completion, snag closure, documentation and client handover are completed." }
    ]
  },
  {
    slug: "real-estate-service",
    href: "/real-estate-service",
    eyebrow: "Commercial Services / Real Estate",
    title: "Real Estate Service",
    summary:
      "Land and building promotion, villa projects, plotted developments, residential and commercial buildings, row houses, gated communities and government-approved lands and plots.",
    image: "/services/showcase-real-estate.webp",
    imageAlt: "Premium real estate service for property development",
    relatedDivision: "Real Estate Division",
    metrics: [
      { label: "Service Type", value: "Development" },
      { label: "Properties", value: "Premium" },
      { label: "Coverage", value: "End-to-End" }
    ],
    capabilities: [
      {
        title: "Land & Building Promoters",
        body: "Strategic land identification, project feasibility, approvals coordination and end-to-end promotion for residential and commercial developments."
      },
      {
        title: "Villas",
        body: "Premium villa projects with modern architecture, private outdoor spaces and luxury finishes for discerning homeowners."
      },
      {
        title: "Plots",
        body: "Prime plotted developments with clear titles, legal documentation and infrastructure-ready land for residential and investment purposes."
      },
      {
        title: "Residential Buildings",
        body: "Apartments, flats and multi-story residential buildings designed for comfort, community living and long-term value."
      },
      {
        title: "Commercial Buildings",
        body: "Commercial spaces, office complexes and retail buildings positioned for business visibility, accessibility and income generation."
      },
      {
        title: "Row Houses",
        body: "Contemporary row house developments with shared amenities, individual identity and efficient land utilization."
      },
      {
        title: "Gated Community",
        body: "Secure gated community projects with clubhouse, landscaping, 24/7 security and premium shared amenities."
      },
      {
        title: "Government Approved Lands & Plots",
        body: "DTCP and CMDA approved lands and plots with clear documentation, legal compliance and ready-to-build status."
      }
    ],
    workflow: [
      { title: "Site Identification", body: "Location, accessibility, legal status and market potential are assessed." },
      { title: "Approvals & Compliance", body: "Regulatory approvals, title verification and documentation are completed." },
      { title: "Development & Promotion", body: "Design, construction and marketing are executed for the target audience." },
      { title: "Handover & Support", body: "Property handover, documentation and post-sale support are managed." }
    ]
  },
  {
    slug: "import-export-service",
    href: "/import-export-service",
    eyebrow: "Commercial Services / Import & Export",
    title: "Import & Export Service",
    summary:
      "Import and export service support for trade requirements, supplier networks, document readiness and cross-border movement.",
    image: "/services/showcase-import-export.webp",
    imageAlt: "Import and export service for international trade support",
    relatedDivision: "Import & Export Division",
    metrics: [
      { label: "Service Type", value: "Trade" },
      { label: "Output", value: "Movement" },
      { label: "Route", value: "Service" }
    ],
    capabilities: [
      {
        title: "Trade requirement mapping",
        body: "Clarify shipment profile, product category, origin, destination, timeline and commercial expectations."
      },
      {
        title: "Supplier coordination",
        body: "Align vendors, readiness signals and operational dependencies before movement."
      },
      {
        title: "Document readiness",
        body: "Organize the service-side document checklist and communication rhythm for cross-border work."
      }
    ],
    workflow: [
      { title: "Map", body: "Trade route, shipment profile and timing are defined." },
      { title: "Coordinate", body: "Supplier, transport and document dependencies are aligned." },
      { title: "Report", body: "Movement status and next actions are communicated clearly." }
    ]
  },
  {
    slug: "otc-exchange-service",
    href: "/otc-exchange-service",
    eyebrow: "Commercial Services / OTC Exchange",
    title: "OTC Exchange Service",
    summary:
      "Crypto based currency exchange service, USDT currency exchange service, FIU registered ISO certified partnerships and KYC verification for OTC transactions.",
    image: "/services/showcase-otc-exchange.webp",
    imageAlt: "OTC exchange service for digital currency and crypto transactions",
    relatedDivision: "OTC Exchange Division",
    metrics: [
      { label: "Service Type", value: "Digital Exchange" },
      { label: "Partnerships", value: "FIU Registered" },
      { label: "Compliance", value: "ISO Certified" }
    ],
    capabilities: [
      {
        title: "Crypto Based Currency Exchange",
        body: "Secure crypto-to-fiat and crypto-to-crypto exchange services with real-time pricing, deep liquidity and institutional-grade settlement."
      },
      {
        title: "USDT Currency Exchange",
        body: "USDT-to-fiat and USDT-to-crypto exchange services with competitive rates, fast settlement and transparent transaction tracking."
      },
      {
        title: "FIU Registered & ISO Certified Partnerships",
        body: "Our company is partnered with FIU registered and ISO certified institutions, ensuring regulatory compliance, operational standards and client trust."
      },
      {
        title: "KYC Verification for OTC",
        body: "Comprehensive KYC verification for OTC transactions — identity verification, document review and compliance screening for qualified counterparties."
      }
    ],
    workflow: [
      { title: "Enquiry", body: "Exchange requirement, currency pair, volume and settlement preferences are discussed." },
      { title: "Verification", body: "KYC documentation and compliance checks are completed before transaction processing." },
      { title: "Execution", body: "Exchange is executed at agreed rates with real-time tracking and confirmation." },
      { title: "Settlement", body: "Funds are settled through compliant channels with full transaction documentation." }
    ]
  }
];

export const commercialServiceRoutes = commercialServicePages.map((service) => service.href);

export function getCommercialServicePage(slug: string) {
  return commercialServicePages.find((service) => service.slug === slug);
}
