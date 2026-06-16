export type ServiceItem = {
  id: number;
  title: string;
  description: string;
  benefits: string[];
  highlights: string[];
  cta: string;
};

export type ServiceCategory = {
  name: string;
  description: string;
  services: ServiceItem[];
};

const categoryServiceIds: Record<string, number[]> = {
  "Engineering Services": [1, 2, 11, 12, 23, 24, 25],
  "Construction Services": [3, 4, 5, 7, 8, 9],
  "Infrastructure Services": [6, 10, 16, 17, 18, 19],
  "Project & Compliance Services": [13, 14, 15, 20, 21, 22],
};

export const services: ServiceItem[] = [
  {
    id: 1,
    title: "Civil Engineering Works & Consultation",
    description:
      "Comprehensive civil engineering solutions covering site analysis, structural design, foundation engineering, and execution planning. Our team of licensed civil engineers delivers technically sound, code-compliant solutions for residential, commercial, and industrial developments from concept through construction.",
    benefits: [
      "Licensed civil engineering expertise",
      "Code-compliant structural designs",
      "Cost-optimized foundation solutions",
    ],
    highlights: [
      "Structural analysis & design",
      "Foundation & earthwork engineering",
      "Site development & grading plans",
      "Construction methodology reviews",
    ],
    cta: "Consult Our Civil Engineers",
  },
  {
    id: 2,
    title: "MEP Engineering Works",
    description:
      "Comprehensive MEP engineering services covering mechanical, electrical, and plumbing systems design, installation, and commissioning for residential, commercial, and industrial projects.",
    benefits: [
      "Integrated MEP system design",
      "Energy-efficient solutions",
      "Code-compliant installations",
    ],
    highlights: [
      "HVAC system design & installation",
      "Electrical power distribution & lighting",
      "Plumbing & fire protection systems",
      "BMS & automation integration",
    ],
    cta: "Discuss MEP Requirements",
  },
  {
    id: 3,
    title: "Commercial Building Construction",
    description:
      "Full-service commercial construction for office complexes, retail centers, and corporate campuses. We deliver scalable, high-quality commercial spaces that meet modern business and sustainability standards.",
    benefits: [
      "End-to-end commercial delivery",
      "Scalable construction solutions",
      "Sustainability-focused execution",
    ],
    highlights: [
      "Office complexes & corporate campuses",
      "Retail centers & mixed-use developments",
      "Showrooms & commercial interiors",
      "Warehouse & logistics facilities",
    ],
    cta: "Explore Commercial Build",
  },
  {
    id: 4,
    title: "Residential Building Construction",
    description:
      "Premium residential construction delivering luxury villas, apartments, row houses, and custom homes with superior craftsmanship and meticulous attention to detail.",
    benefits: [
      "Premium quality finishes",
      "Custom design flexibility",
      "Timely project delivery",
    ],
    highlights: [
      "Luxury villas & bungalows",
      "Apartments & row houses",
      "Gated community developments",
      "Interior fit-outs & renovations",
    ],
    cta: "Design Your Residence",
  },
  {
    id: 5,
    title: "Industrial Construction",
    description:
      "Specialized industrial construction services for manufacturing plants, processing facilities, and industrial warehouses with emphasis on safety, durability, and operational efficiency.",
    benefits: [
      "Industrial-grade construction",
      "Safety-first approach",
      "Operational efficiency focus",
    ],
    highlights: [
      "Manufacturing plants & processing units",
      "Industrial warehouses & cold storage",
      "Heavy foundation & structural steel",
      "Utility & infrastructure integration",
    ],
    cta: "Build Industrial Facility",
  },
  {
    id: 6,
    title: "Infrastructure & Heavy Civil Works",
    description:
      "Large-scale infrastructure and heavy civil engineering works including roads, bridges, flyovers, water treatment facilities, and utility networks for public and private sector clients.",
    benefits: [
      "Large-scale project capability",
      "Public-sector compliance",
      "Advanced construction methods",
    ],
    highlights: [
      "Roads, highways & flyovers",
      "Bridges & elevated structures",
      "Water supply & treatment plants",
      "Utility networks & stormwater systems",
    ],
    cta: "Discuss Infrastructure Needs",
  },
  {
    id: 7,
    title: "Turnkey Construction Projects",
    description:
      "Comprehensive turnkey construction solutions offering single-point responsibility from concept through handover — including design, procurement, construction, testing, commissioning, and documentation.",
    benefits: [
      "Single-point accountability",
      "Faster project delivery",
      "Cost & timeline certainty",
    ],
    highlights: [
      "Design-build project delivery",
      "Procurement & vendor management",
      "Construction & quality assurance",
      "Testing, commissioning & handover",
    ],
    cta: "Inquire About Turnkey",
  },
  {
    id: 8,
    title: "Interior Design & Fit-Out Works",
    description:
      "Professional interior design and fit-out services for commercial offices, retail spaces, hospitality venues, and residential interiors — blending aesthetics with functionality.",
    benefits: [
      "Design-driven interiors",
      "Functional space planning",
      "Quality material sourcing",
    ],
    highlights: [
      "Office & corporate interiors",
      "Retail & hospitality fit-outs",
      "Residential interior design",
      "Custom joinery & furniture",
    ],
    cta: "Design Your Interior",
  },
  {
    id: 9,
    title: "Renovation & Retrofitting",
    description:
      "Expert renovation and structural retrofitting services for existing buildings — extending lifespan, improving safety, and upgrading performance to meet current codes and standards.",
    benefits: [
      "Structural integrity improvement",
      "Code compliance upgrades",
      "Minimal disruption approach",
    ],
    highlights: [
      "Structural strengthening & retrofitting",
      "Building façade & envelope upgrades",
      "Interior renovation & remodeling",
      "MEP system upgrades",
    ],
    cta: "Plan Your Renovation",
  },
  {
    id: 10,
    title: "Land Development & Site Preparation",
    description:
      "Complete land development and site preparation services including grading, earthwork, drainage, utility connections, and road access — preparing raw land for construction.",
    benefits: [
      "Comprehensive site development",
      "Regulatory compliance",
      "Infrastructure-ready land",
    ],
    highlights: [
      "Site clearing & grading",
      "Earthwork & compaction",
      "Stormwater drainage systems",
      "Utility connection & road access",
    ],
    cta: "Develop Your Land",
  },
  {
    id: 11,
    title: "Structural Engineering & Design",
    description:
      "Advanced structural engineering and design services for buildings, bridges, towers, and special structures using state-of-the-art analysis and design software.",
    benefits: [
      "Advanced structural analysis",
      "Optimized design solutions",
      "Regulatory code compliance",
    ],
    highlights: [
      "RCC & steel structure design",
      "Pre-engineered building design",
      "Foundation & deep excavation design",
      "Seismic & wind load analysis",
    ],
    cta: "Consult Structural Engineers",
  },
  {
    id: 12,
    title: "Geotechnical & Soil Investigation",
    description:
      "Professional geotechnical engineering and soil investigation services including borehole drilling, soil sampling, laboratory testing, and foundation recommendations.",
    benefits: [
      "Site-specific geotechnical data",
      "Risk mitigation",
      "Optimized foundation design",
    ],
    highlights: [
      "Borehole drilling & soil sampling",
      "Laboratory soil testing",
      "Foundation & bearing capacity analysis",
      "Slope stability & earth retention",
    ],
    cta: "Schedule Soil Investigation",
  },
  {
    id: 13,
    title: "Construction Material Testing",
    description:
      "Comprehensive construction material testing and quality assurance services for concrete, steel, soil, asphalt, and other construction materials used in your project.",
    benefits: [
      "Material quality assurance",
      "Compliance verification",
      "Defect prevention",
    ],
    highlights: [
      "Concrete mix design & testing",
      "Steel & reinforcement testing",
      "Soil compaction & density tests",
      "Non-destructive testing (NDT)",
    ],
    cta: "Schedule Material Testing",
  },
  {
    id: 14,
    title: "Safety Audits & Compliance",
    description:
      "Thorough safety audits and compliance assessments covering construction site safety, statutory compliance, risk assessment, and safety management systems.",
    benefits: [
      "Regulatory compliance",
      "Risk identification",
      "Safety culture development",
    ],
    highlights: [
      "Construction site safety audits",
      "Statutory compliance review",
      "Risk assessment & hazard analysis",
      "Safety management system setup",
    ],
    cta: "Book a Safety Audit",
  },
  {
    id: 15,
    title: "Environmental Impact Assessment",
    description:
      "Comprehensive environmental impact assessment and management services for construction projects — ensuring regulatory compliance and sustainable project execution.",
    benefits: [
      "Regulatory approval support",
      "Environmental risk management",
      "Sustainable project delivery",
    ],
    highlights: [
      "Environmental impact assessment (EIA)",
      "Environmental management plans",
      "Green building compliance (IGBC/LEED)",
      "Waste management & remediation",
    ],
    cta: "Discuss Environmental Compliance",
  },
  {
    id: 16,
    title: "Sports Infrastructure & Landscaping",
    description:
      "Design and construction of sports infrastructure including courts, turf fields, athletic tracks, and associated landscape developments for educational and recreational facilities.",
    benefits: [
      "Sports-grade construction",
      "Integrated landscape design",
      "Multi-sport functionality",
    ],
    highlights: [
      "Synthetic & natural turf fields",
      "Basketball & tennis courts",
      "Athletic tracks & playgrounds",
      "Hardscape & softscape landscaping",
    ],
    cta: "Build Sports Facilities",
  },
  {
    id: 17,
    title: "Pre-Engineered Building (PEB) Structures",
    description:
      "Design, fabrication, and erection of pre-engineered building (PEB) structures for industrial sheds, warehouses, showrooms, and commercial buildings with fast turnaround and cost efficiency.",
    benefits: [
      "Fast project completion",
      "Cost-effective construction",
      "Design flexibility & scalability",
    ],
    highlights: [
      "Industrial sheds & factories",
      "Warehouses & logistics hubs",
      "Showrooms & commercial buildings",
      "PEB structural design & fabrication",
    ],
    cta: "Explore PEB Solutions",
  },
  {
    id: 18,
    title: "Elevator & Escalator Installation",
    description:
      "End-to-end elevator and escalator installation services for commercial, residential, and mixed-use buildings — including design, procurement, installation, testing, and maintenance.",
    benefits: [
      "Certified installation team",
      "Brand-agnostic solutions",
      "Comprehensive maintenance",
    ],
    highlights: [
      "Passenger & service elevators",
      "Escalators & moving walkways",
      "Elevator modernization & upgrades",
      "Annual maintenance contracts (AMC)",
    ],
    cta: "Discuss Vertical Transport",
  },
  {
    id: 19,
    title: "Roads & Highways Construction",
    description:
      "Professional roads and highways construction services for urban roads, rural connectivity, highway stretches, and internal campus roads with durable pavement solutions.",
    benefits: [
      "Durable pavement solutions",
      "Traffic management expertise",
      "Timely project delivery",
    ],
    highlights: [
      "Flexible & rigid pavements",
      "Highway & expressway construction",
      "Urban road & junction improvements",
      "Pavement rehabilitation & overlays",
    ],
    cta: "Start Road Project",
  },
  {
    id: 20,
    title: "Construction Claims & Dispute Resolution",
    description:
      "Expert construction claims management and dispute resolution services including delay analysis, cost quantification, contract review, and expert witness support.",
    benefits: [
      "Minimized financial exposure",
      "Expert contract analysis",
      "Effective dispute resolution",
    ],
    highlights: [
      "Delay & disruption analysis",
      "Cost overrun quantification",
      "Contract review & entitlement analysis",
      "Mediation & arbitration support",
    ],
    cta: "Resolve a Claim",
  },
  {
    id: 21,
    title: "Project Management Consultancy (PMC)",
    description:
      "Independent project management consultancy representing owner interests — covering planning, budgeting, scheduling, risk management, quality assurance, and vendor coordination.",
    benefits: [
      "Owner-representative oversight",
      "Schedule & budget control",
      "Risk-managed execution",
    ],
    highlights: [
      "Project planning & scheduling",
      "Budget & cost control",
      "Vendor & contractor management",
      "Quality & risk management",
    ],
    cta: "Engage PMC Services",
  },
  {
    id: 22,
    title: "Construction Material Sourcing & Supply",
    description:
      "Reliable construction material sourcing and supply services — from cement, steel, and aggregate to specialized finishes and MEP equipment — with quality assurance and competitive pricing.",
    benefits: [
      "Quality-assured materials",
      "Competitive pricing",
      "Reliable supply chain",
    ],
    highlights: [
      "Cement, steel & aggregate supply",
      "Finishing materials & specialties",
      "MEP equipment & fixtures",
      "Vendor evaluation & procurement",
    ],
    cta: "Source Building Materials",
  },
  {
    id: 23,
    title: "Surveying & Site Layout",
    description:
      "Professional land surveying and construction layout services including topographic surveys, boundary demarcation, GPS positioning, and as-built documentation.",
    benefits: [
      "Accurate site data",
      "Regulatory compliance",
      "Precision construction layout",
    ],
    highlights: [
      "Topographic & boundary surveys",
      "GPS & total station surveying",
      "Construction layout & control",
      "As-built documentation",
    ],
    cta: "Schedule Surveying Work",
  },
  {
    id: 24,
    title: "Building Information Modeling (BIM)",
    description:
      "Advanced Building Information Modeling (BIM) services for clash detection, quantity takeoffs, construction sequencing, and integrated project delivery across all disciplines.",
    benefits: [
      "Design conflict detection",
      "Accurate quantity takeoffs",
      "Improved project coordination",
    ],
    highlights: [
      "3D modeling & visualization",
      "Clash detection & resolution",
      "4D construction sequencing",
      "BIM-enabled quantity takeoffs",
    ],
    cta: "Integrate BIM Services",
  },
  {
    id: 25,
    title: "Structural Load & Vulnerability Assessment",
    description:
      "Professional structural load capacity analysis, seismic vulnerability assessment, and condition surveys for existing buildings and infrastructure assets.",
    benefits: [
      "Structural safety assurance",
      "Risk-based recommendations",
      "Detailed assessment reports",
    ],
    highlights: [
      "Structural load capacity analysis",
      "Seismic vulnerability assessment",
      "Condition survey & repair recommendations",
    ],
    cta: "Assess Structure",
  },
];

export const serviceCategories: ServiceCategory[] = [
  {
    name: "Engineering Services",
    description:
      "Technical engineering expertise covering structural, geotechnical, and MEP disciplines for informed, code-compliant project execution.",
    services: [],
  },
  {
    name: "Construction Services",
    description:
      "End-to-end construction delivery across commercial, residential, and industrial segments with quality, schedule, and budget certainty.",
    services: [],
  },
  {
    name: "Infrastructure Services",
    description:
      "Specialised infrastructure solutions for sports, landscapes, PEB structures, and vertical transportation systems.",
    services: [],
  },
  {
    name: "Project & Compliance Services",
    description:
      "Project management, regulatory compliance, material sourcing, and advisory services for streamlined project governance.",
    services: [],
  },
].map((cat) => ({
  ...cat,
  services: (categoryServiceIds[cat.name] ?? [])
    .map((id) => services.find((s) => s.id === id))
    .filter(Boolean) as ServiceItem[],
}));

export const whyChooseUs = [
  {
    title: "Certified Engineers & Specialists",
    description:
      "Our team comprises licensed civil engineers, structural designers, MEP specialists, and certified project managers with decades of combined industry experience.",
    icon: "Users",
  },
  {
    title: "End-to-End Project Delivery",
    description:
      "From site survey and design through procurement, construction, and handover, we manage every phase without gaps or coordination lapses.",
    icon: "ClipboardCheck",
  },
  {
    title: "Quality Assurance Systems",
    description:
      "Project work follows documented QA/QC protocols with stage-wise inspections, material testing, and compliance verification at every milestone.",
    icon: "ShieldCheck",
  },
  {
    title: "Transparent Project Management",
    description:
      "Clients receive structured progress reports, budget trackers, photographic logs, and scheduled review meetings throughout the project lifecycle.",
    icon: "LineChart",
  },
  {
    title: "Regulatory Compliance",
    description:
      "Every project is executed in full compliance with local building codes, statutory regulations, environmental standards, and safety mandates.",
    icon: "FileCheck",
  },
  {
    title: "Modern Construction Technology",
    description:
      "We deploy BIM coordination, drone surveying, laser leveling, and digital project management tools for precision and efficiency.",
    icon: "Cpu",
  },
  {
    title: "Safety-First Approach",
    description:
      "Site safety is non-negotiable. We implement comprehensive safety plans, regular training, PPE enforcement, and incident reporting protocols.",
    icon: "HardHat",
  },
  {
    title: "Sustainable Building Practices",
    description:
      "Green construction methods, waste minimization, energy-efficient systems, and sustainable material selection are integrated into every project.",
    icon: "Leaf",
  },
];

export const deliveryProcess = [
  {
    step: 1,
    title: "Consultation & Feasibility Study",
    description:
      "Initial discussion to understand project scope, client requirements, site constraints, and budget parameters. We conduct feasibility analysis to establish project viability.",
  },
  {
    step: 2,
    title: "Site Survey & Investigation",
    description:
      "Detailed site assessment including topographic surveys, soil investigation, utility mapping, and existing condition documentation for informed decision-making.",
  },
  {
    step: 3,
    title: "Planning & Engineering Design",
    description:
      "Comprehensive engineering design development including architectural layouts, structural calculations, MEP schematics, and construction drawings with BIM coordination.",
  },
  {
    step: 4,
    title: "Approval & Documentation",
    description:
      "Preparation and submission of statutory approvals, building permits, environmental clearances, and detailed construction documentation as per regulatory requirements.",
  },
  {
    step: 5,
    title: "Construction Execution",
    description:
      "Systematic site mobilization, material procurement, foundation work, structural erection, MEP installation, and finishing works executed as per approved schedules.",
  },
  {
    step: 6,
    title: "Quality Monitoring & Reporting",
    description:
      "Continuous quality inspection, material testing, progress documentation, and client reporting to ensure adherence to specifications, timelines, and budgets.",
  },
  {
    step: 7,
    title: "Final Inspection & Handover",
    description:
      "Comprehensive final inspection, snag rectification, systems commissioning, documentation handover, and structured project close-out with client satisfaction sign-off.",
  },
];

export const trustPoints = [
  {
    title: "Engineering Excellence",
    description:
      "Designs and calculations are reviewed by senior engineers with experience across complex structural systems and international codes.",
  },
  {
    title: "Construction Quality",
    description:
      "Material traceability, workmanship standards, and testing protocols are enforced at every stage for consistent, defect-free delivery.",
  },
  {
    title: "Timely Delivery",
    description:
      "Realistic scheduling, resource planning, and critical-path management ensure projects reach completion on committed timelines.",
  },
  {
    title: "Cost Efficiency",
    description:
      "Value-engineered design, competitive procurement, and waste-reduction practices keep project economics in favour of the client.",
  },
  {
    title: "Technical Precision",
    description:
      "BIM-enabled coordination, laser-guided layout, and precision surveying eliminate errors and rework during execution.",
  },
  {
    title: "Client Transparency",
    description:
      "Open reporting, accessible project data, and scheduled reviews give clients complete visibility into progress and decisions.",
  },
  {
    title: "Sustainable Solutions",
    description:
      "Energy-efficient systems, recycled materials, and low-impact construction methods reduce environmental footprint without compromising quality.",
  },
  {
    title: "Long-Term Reliability",
    description:
      "Buildings and infrastructure delivered by Ractysh are designed for durability, low maintenance, and decades of dependable service.",
  },
];

export const dedicatedContent = [
  {
    id: "commercial",
    title: "Commercial Construction",
    subtitle: "Built for business growth",
    description:
      "Commercial construction at Ractysh is engineered for scalability and operational efficiency. We deliver office complexes, retail centers, mixed-use developments, and corporate campuses designed to accelerate business growth. Our commercial projects integrate future-ready infrastructure, flexible floor plates, advanced MEP systems, and smart building technologies that adapt to evolving enterprise needs. Every commercial structure we build is a long-term asset positioned for maximum return.",
    points: [
      "Scalable infrastructure designed for business expansion",
      "Operational efficiency through smart building integration",
      "Future-ready MEP & technology systems",
      "Flexible layouts for evolving workspace needs",
    ],
  },
  {
    id: "residential",
    title: "Residential Construction",
    subtitle: "Crafted for comfortable living",
    description:
      "Residential construction at Ractysh is defined by comfort, quality craftsmanship, and enduring durability. From luxury villas to premium apartment complexes, every home is designed as a personalized living space that reflects the owner's vision. We combine structural integrity with architectural finesse, using premium materials and precision construction methods to create homes that stand the test of time. Our residential portfolio is built on a foundation of trust and attention to detail.",
    points: [
      "Personalized design tailored to homeowner vision",
      "Superior craftsmanship with premium materials",
      "Structural durability for long-term safety",
      "Comfort-driven spatial planning & finishes",
    ],
  },
  {
    id: "peb",
    title: "Pre-Engineered Building (PEB) Structures",
    subtitle: "Speed meets structural intelligence",
    description:
      "PEB structures by Ractysh deliver unmatched speed, flexibility, and cost efficiency for industrial and commercial applications. Our pre-engineered steel buildings are designed and fabricated in controlled environments ensuring precision, then rapidly assembled on site. Ideal for warehouses, factories, hangars, and large-span facilities, PEB solutions reduce construction timelines by up to 50 per cent while maintaining structural performance that meets or exceeds conventional building standards.",
    points: [
      "Up to 50 per cent faster project delivery",
      "Cost-effective steel construction",
      "Flexible spans up to 90 metres",
      "Industrial-grade durability & performance",
    ],
  },
  {
    id: "government",
    title: "Government Projects",
    subtitle: "Trusted public-sector execution",
    description:
      "Ractysh brings proven capability in government building construction and tender-driven projects. We understand the rigour of public-sector procurement, compliance frameworks, and quality standards demanded by government infrastructure programs. Our team manages the entire lifecycle from tender submission through statutory approvals to final handover. We deliver administrative buildings, institutional facilities, and public infrastructure with transparency, accountability, and adherence to prescribed specifications.",
    points: [
      "Expertise in government tender processes",
      "Full compliance with DSR & CPWD standards",
      "Timely execution within prescribed budgets",
      "Transparent reporting & quality documentation",
    ],
  },
  {
    id: "pmc",
    title: "Project Management Consultancy (PMC)",
    subtitle: "Owner-representative project control",
    description:
      "Ractysh PMC services provide independent, owner-focused project oversight across planning, budgeting, risk management, coordination, and quality control. Our project managers act as the client's representative on site, ensuring that contractors, vendors, and consultants align with project objectives. With structured reporting, milestone tracking, and proactive issue resolution, we transform complex construction programs into predictable, well-managed delivery outcomes.",
    points: [
      "Independent owner-representative oversight",
      "Comprehensive budget & schedule management",
      "Proactive risk identification & mitigation",
      "Vendor coordination & quality assurance",
    ],
  },
  {
    id: "survey",
    title: "Survey, Soil Testing & Stability Assessment",
    subtitle: "Data-driven foundation decisions",
    description:
      "Before construction begins, informed decisions rest on accurate data. Ractysh provides integrated survey, soil investigation, and structural assessment services that deliver measurable technical insight. Our team uses GPS-enabled total stations, drone surveying, borehole sampling, and laboratory testing to generate reliable geotechnical and topographical data. Stability assessments and non-destructive testing further ensure that existing structures and new foundations are engineered for safety and compliance.",
    points: [
      "High-accuracy topographic & boundary surveys",
      "Comprehensive geotechnical investigation",
      "Non-destructive structural testing (NDT)",
      "Actionable foundation & retrofit recommendations",
    ],
  },
];

export type DedicatedContent = (typeof dedicatedContent)[number];
export type WhyChooseItem = (typeof whyChooseUs)[number];
export type ProcessStep = (typeof deliveryProcess)[number];
export type TrustPoint = (typeof trustPoints)[number];

export function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getServiceBySlug(slug: string) {
  return services.find((s) => toSlug(s.title) === slug) ?? null;
}

export function getRelatedServices(slug: string, count = 3) {
  const index = services.findIndex((s) => toSlug(s.title) === slug);
  if (index === -1) return [];

  const related: typeof services = [];
  const candidates = [
    ...services.slice(0, index).reverse(),
    ...services.slice(index + 1),
  ];

  for (const s of candidates) {
    if (related.length >= count) break;
    related.push(s);
  }

  return related;
}
