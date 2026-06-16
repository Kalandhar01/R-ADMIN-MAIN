/**
 * Premium copy & content catalog for Ractysh Architecture.
 * Tone: luxury, modern, minimal, international. Influenced by the editorial voice of
 * Foster + Partners, Zaha Hadid Architects, Gensler, BIG and SOM.
 *
 * This file is the single source of truth for the premium narrative used across the
 * site. Components should import from here so the copy stays consistent, considered
 * and easy to evolve.
 */

export const heroSupportingContent = {
  eyebrow: "Ractysh Architecture",
  heading: [
    "Architecture",
    "Built beyond",
    "blueprints."
  ],
  description:
    "An interdisciplinary architecture and design practice creating private residences, work environments and urban gestures where innovation, environmental intelligence and timeless form are resolved as one. We design for longevity, sustainability and enduring emotional value.",
  mobileDescription:
    "Private residences and considered environments, composed with light, proportion and human experience.",
  primaryCta: { label: "Begin a Commission", href: "#architecture-consultation-desk" },
  secondaryCta: { label: "Explore the Studio", href: "#works" },
  caption:
    "A studio for spaces that feel inevitable. From the first sketch to the final reveal, every project is composed, not decorated."
} as const;

export const servicesContent = {
  kicker: "Services",
  title: "Fourteen disciplines, one studio.",
  body: "Each service is delivered by a senior designer, not delegated to a junior team. The studio is intentionally small, the work deliberately considered.",
  items: [
    {
      slug: "architectural-design",
      title: "Architectural Design",
      shortDescription: "Bespoke architecture for private and institutional clients.",
      image: "/images/architecture/ractysh-laterite-court-residence.avif",
      imageAlt: "Luxury residence exterior showing refined architectural composition and proportional clarity.",
      description:
        "A full architectural service — from site analysis and massing studies to construction documentation. We design buildings that respond to climate, programme and the rituals of those who will inhabit them, drawing on the proportional discipline of international practice.",
      features: [
        "Site analysis, climate response and contextual studies",
        "Concept, schematic and detailed design documentation",
        "International proportional and drafting standards",
        "Coordination with consultants and contractors"
      ],
      cta: "Commission a Building",
      icon: "compass"
    },
    {
      slug: "interior-design",
      title: "Interior Design",
      shortDescription: "Interior environments composed with architectural intent.",
      image: "/images/architecture/architecture-content-gallery-lobby-07.webp",
      imageAlt: "Refined interior lobby with warm lighting, layered materials and premium detailing.",
      description:
        "Interior design treated as continuation of the building, not decoration of it. We compose material, light, proportion and joinery into rooms that feel calm, considered and personal — designed alongside the architecture they inhabit.",
      features: [
        "Material, finish and joinery specifications",
        "Custom furniture and millwork design",
        "Lighting and atmosphere choreography",
        "Procurement, styling and handover"
      ],
      cta: "Design a Space",
      icon: "sofa"
    },
    {
      slug: "structural-design",
      title: "Structural Design",
      shortDescription: "Engineering that liberates architectural ambition.",
      image: "/images/architecture/ractysh-executive-work-pavilion.avif",
      imageAlt: "Contemporary structural frame for a commercial building with strong geometry and clean spans.",
      description:
        "Structural engineering integrated into the design conversation from day one. Long spans, cantilevers, skylights and open plans are enabled through rigorous analysis, allowing the architecture to be expressive without becoming fragile.",
      features: [
        "RCC, steel and hybrid structural systems",
        "Seismic and wind analysis",
        "Long-span and cantilever detailing",
        "On-site engineering supervision"
      ],
      cta: "Engineer the Frame",
      icon: "structure"
    },
    {
      slug: "mep-design",
      title: "MEP Design",
      shortDescription: "Mechanical, electrical and plumbing — silent and precise.",
      image: "/images/architecture/architecture-content-gallery-systems-09.webp",
      imageAlt: "Architectural systems environment expressing technical precision and integrated services planning.",
      description:
        "Mechanical, electrical, plumbing and fire systems integrated discreetly into the architecture. We design services that protect the spatial experience — quiet air, ambient light, hidden infrastructure and resilient engineering.",
      features: [
        "HVAC, electrical, plumbing and fire systems",
        "Smart-home and building automation integration",
        "Energy modelling and performance design",
        "Coordination with statutory requirements"
      ],
      cta: "Engineer the Systems",
      icon: "systems"
    },
    {
      slug: "landscape-design",
      title: "Landscape Design",
      shortDescription: "Outdoor rooms composed with the same restraint as the building.",
      image: "/images/architecture/architecture-content-waterfront-home-05.webp",
      imageAlt: "Waterfront landscape with planted edges, open-air living and a seamless indoor-outdoor transition.",
      description:
        "Landscape treated as architecture without a roof. We compose planting, water, terrain, paving and lighting into outdoor rooms that extend the building's atmosphere into the climate it sits within.",
      features: [
        "Planting design and species selection",
        "Water features, pools and reflective surfaces",
        "Paving, edges and outdoor lighting",
        "Irrigation and long-term maintenance strategy"
      ],
      cta: "Shape the Ground",
      icon: "leaf"
    },
    {
      slug: "urban-planning",
      title: "Urban Planning",
      shortDescription: "Masterplans for campuses, townships and considered density.",
      image: "/images/architecture/industrial-design/industrial-campus-architecture-site-01.webp",
      imageAlt: "Large-scale campus planning study showing organized built form, movement and civic structure.",
      description:
        "Strategic masterplanning for campuses, mixed-use districts and residential communities. We work at the scale of city block and street section, designing public space, movement networks and built form as a single composition.",
      features: [
        "Masterplan and zoning strategy",
        "Street, block and section design",
        "Public realm and open space strategy",
        "Infrastructure and movement planning"
      ],
      cta: "Plan at Scale",
      icon: "grid"
    },
    {
      slug: "3d-modelling-visualization",
      title: "3D Modelling & Visualisation",
      shortDescription: "Decision-grade 3D models and atmospheric studies.",
      image: "/images/architecture/architecture-content-gallery-presentation-10.webp",
      imageAlt: "Architectural presentation visual expressing massing, depth and design intent through digital modelling.",
      description:
        "Building Information Modelling and 3D visualisation as a design instrument, not a sales tool. We use precise models to coordinate consultants, study proportion, test light and present intent with the fidelity a private commission deserves.",
      features: [
        "BIM-based design coordination",
        "Proportional and material studies",
        "Atmospheric and lighting studies",
        "Stakeholder presentation models"
      ],
      cta: "Visualise the Project",
      icon: "cube"
    },
    {
      slug: "architectural-rendering",
      title: "Architectural Rendering",
      shortDescription: "Photoreal imagery that reads as memory, not marketing.",
      image: "/images/architecture/architecture-cinematic-experience-ractysh-architecture-golden-villa-01.webp",
      imageAlt: "Photoreal architectural rendering of a premium villa at golden hour.",
      description:
        "Photoreal architectural renderings, animations and editorial imagery that document intent and persuade with quiet authority. Our images are calibrated to the project — honest in scale, faithful in material, considered in light.",
      features: [
        "Interior and exterior stills",
        "Cinematic walkthrough animations",
        "Editorial and award-grade imagery",
        "Marketing and investor decks"
      ],
      cta: "Render the Vision",
      icon: "frame"
    },
    {
      slug: "furniture-design",
      title: "Furniture Design",
      shortDescription: "Bespoke pieces designed in the studio, made for the room.",
      image: "/images/architecture/ractysh-who-we-are-editorial-villa.webp",
      imageAlt: "Curated luxury interior environment suggesting bespoke furniture and joinery design.",
      description:
        "Bespoke furniture designed alongside the architecture it sits within. Tables, joinery, lighting and accessories composed in proportion to the room, in material aligned with the building, and crafted to be used every day for decades.",
      features: [
        "Custom furniture and joinery",
        "Material and finish curation",
        "Workshop coordination and prototyping",
        "Installation and aftercare"
      ],
      cta: "Commission a Piece",
      icon: "chair"
    },
    {
      slug: "architectural-lighting-design",
      title: "Architectural Lighting Design",
      shortDescription: "Light composed like structure, designed like material.",
      image: "/images/architecture/ractysh-madurai-quiet-court.avif",
      imageAlt: "Evening courtyard illuminated with warm architectural lighting and carefully controlled atmosphere.",
      description:
        "Architectural lighting treated as a primary material. We design lighting schemes that shape the experience of a building after dark, integrate with the architecture by day and protect the visual comfort of those who live and work within it.",
      features: [
        "Interior, exterior and façade lighting",
        "Circadian and task-tuned schemes",
        "Fixture specification and detailing",
        "On-site aiming and commissioning"
      ],
      cta: "Light the Architecture",
      icon: "lamp"
    },
    {
      slug: "elevation-design",
      title: "Elevation Design",
      shortDescription: "Façades that hold the street, the climate and the brief.",
      image: "/images/architecture/architecture-content-commercial-architecture-studio-03.webp",
      imageAlt: "Contemporary building elevation showing façade rhythm, materiality and controlled depth.",
      description:
        "Elevation and façade design for new buildings and adaptive reuse. We compose proportion, depth, material and opening to give a building a composed presence on its street, response to its climate and identity for its occupant.",
      features: [
        "Façade proportion and rhythm",
        "Material, depth and shadow studies",
        "Window and opening composition",
        "Integration with structural and MEP grids"
      ],
      cta: "Compose the Façade",
      icon: "facade"
    },
    {
      slug: "commercial-building-design",
      title: "Commercial Building Design",
      shortDescription: "Office, retail and hospitality architecture with intent.",
      image: "/images/architecture/architecture-content-premium-enterprise-building-04.webp",
      imageAlt: "Premium commercial building exterior with strong urban presence and modern architectural lines.",
      description:
        "Commercial architecture for offices, retail, hospitality and mixed-use environments. We design buildings that perform commercially while holding the proportional and material discipline of a private commission — places people choose to be in.",
      features: [
        "Workplace, retail and hospitality design",
        "Brand-driven spatial identity",
        "Performance and wellness-driven environments",
        "Stakeholder and operator coordination"
      ],
      cta: "Design for Business",
      icon: "tower"
    },
    {
      slug: "project-management-consultancy",
      title: "Project Management Consultancy (PMC)",
      shortDescription: "Discreet oversight from brief to handover.",
      image: "/images/architecture/architecture-content-gallery-site-governance-11.webp",
      imageAlt: "Construction and coordination context reflecting project oversight, governance and delivery management.",
      description:
        "Project Management Consultancy that protects design intent through the construction process. We coordinate consultants, manage procurement, supervise site quality and steward handover, so the building delivered is the building designed.",
      features: [
        "Programme, budget and procurement strategy",
        "Consultant and contractor coordination",
        "Site quality supervision",
        "Snagging, handover and aftercare"
      ],
      cta: "Steward the Build",
      icon: "clipboard"
    },
    {
      slug: "logo-design",
      title: "Logo Design",
      shortDescription: "Identity systems aligned with the architecture they represent.",
      image: "/images/architecture/architecture-content-gallery-design-system-12.webp",
      imageAlt: "Curated brand and design system materials aligned with a premium architectural identity.",
      description:
        "Brand identity for architecture practices, real-estate brands, hospitality operators and developers. We design marks, type systems and editorial templates that read with the same proportional discipline as the buildings they represent.",
      features: [
        "Logo, mark and wordmark design",
        "Typography and editorial systems",
        "Brand guidelines and applications",
        "Digital and print collateral"
      ],
      cta: "Shape the Brand",
      icon: "mark"
    }
  ]
} as const;

export const processContent = {
  kicker: "The Process",
  title: "A six-step editorial workflow.",
  body: "Our process is structured but not rigid — six phases that move a project from first conversation to final reveal, with the same team throughout.",
  steps: [
    {
      number: "01",
      name: "Discovery",
      summary: "Listening, site reading, brief formation.",
      body: "We begin on the site, in conversation and in study. Climate, terrain, ritual, family, business and ambition are mapped into a brief that becomes the project’s compass."
    },
    {
      number: "02",
      name: "Concept Development",
      summary: "Architectural proposition and proportional language.",
      body: "Massing, plan logic and the first architectural language are drawn, tested and refined. Concepts are presented in sketch, model and atmospheric study until the direction is owned by client and studio together."
    },
    {
      number: "03",
      name: "Design Planning",
      summary: "Spatial, structural and service coordination.",
      body: "The chosen concept is developed into a coordinated design package. Plans, sections, structure, services and lighting are resolved together so the building performs as a single composition."
    },
    {
      number: "04",
      name: "Visualization",
      summary: "Material, light and atmosphere studies.",
      body: "Photoreal visualisations, walkthrough animations and material samples are produced at the scale the decision requires — calibrated to the project, not to the marketing need."
    },
    {
      number: "05",
      name: "Documentation",
      summary: "Construction-grade drawings and specifications.",
      body: "The design is drawn to a level a contractor can build from and a client can trust. Drawings, specifications and consultant packages are coordinated, reviewed and issued for tender."
    },
    {
      number: "06",
      name: "Project Delivery",
      summary: "Site supervision, commissioning and handover.",
      body: "We stay with the project through construction, visiting site at critical stages, coordinating consultants and protecting design intent through to handover and aftercare."
    }
  ]
} as const;

export const statisticsContent = {
  kicker: "Studio in Numbers",
  title: ["Built on", "Precision,", "Measured by", "Results."],
  metrics: [
    { value: "147", suffix: "+", label: "Projects Completed", body: "Across residential, commercial and civic developments." },
    { value: "98", suffix: "%", label: "Client Satisfaction", body: "Long-term partnerships built on trust." },
    { value: "21", suffix: "", label: "Cities Served", body: "Bringing our design philosophy to a global context." },
    { value: "12", suffix: "+", label: "Years Experience", body: "A decade of architectural discipline and refinement." },
    { value: "14", suffix: "", label: "Design Awards", body: "Recognized internationally for design excellence." }
  ]
} as const;

export const testimonialsContent = {
  kicker: "In Their Words",
  title: "What our clients say about the studio.",
  body: "A studio is measured by the buildings it leaves behind and the trust of the people it designs them with. The following are reflections from across our practice.",
  items: [
    {
      quote:
        "Ractysh did not design us a house. They studied how we live, the climate we live in, and the way we wanted to age inside a building. The result is a home that feels composed in every season.",
      author: "Anjali Menon",
      role: "Private Client, Laterite Court Residence",
      location: "Kochi, Kerala"
    },
    {
      quote:
        "What separates the studio is restraint. The drawings are considered, the detailing is engineered, the process is calm — and the building we received is exactly the one we discussed in the first meeting.",
      author: "Arjun Krishnan",
      role: "Founder, Executive Work Pavilion",
      location: "Chennai, Tamil Nadu"
    },
    {
      quote:
        "They treated a commercial project with the same proportional care as a private commission. Our workplace has changed how the company hires, meets and shows up for clients.",
      author: "Priya Subramanian",
      role: "Director, Graphite Corporate House",
      location: "Bengaluru, India"
    },
    {
      quote:
        "The team became a long-term partner. They supervised the build with the same rigour they brought to the concept, and the handover was a quiet, considered event — exactly as the project deserved.",
      author: "Rahul Iyer",
      role: "Owner, Backwater Edge Villa",
      location: "Alappuzha, Kerala"
    },
    {
      quote:
        "We commissioned a courtyard home during a difficult site and an even more difficult brief. The studio delivered a building that turned every constraint into a piece of architecture.",
      author: "Lakshmi Raman",
      role: "Principal, Madurai Quiet Court",
      location: "Madurai, Tamil Nadu"
    },
    {
      quote:
        "Their visualisation work is not marketing imagery — it is decision-grade. The renders we received were so precise that the actual building felt like a familiar place on the day we moved in.",
      author: "Vikram Shah",
      role: "Developer, Coimbatore Linear House",
      location: "Coimbatore, Tamil Nadu"
    }
  ]
} as const;

export const ctaSectionContent = {
  kicker: "The Next Step",
  title: "The right project begins with the right conversation.",
  body: "Whether you are planning a private residence, a commercial environment, an interior transformation or a brand-led spatial identity, the studio will review your brief with discretion, precision and senior attention from the first exchange.",
  primary: { label: "Request Consultation", href: "#architecture-consultation-desk" },
  reassurance:
    "Every brief is reviewed by a senior architect before any proposal is issued."
} as const;

export const seoContent = {
  metaTitle: "Ractysh Architecture | International Architecture & Design Studio",
  metaDescription:
    "An independent architecture, interior design and engineering studio creating sustainable private residences, commercial environments and considered urban gestures across India and internationally. Built beyond blueprints.",
  ogTitle: "Ractysh Architecture — Composed. Considered. Enduring.",
  ogDescription:
    "An international architecture and design practice working in private residences, interiors, structure, lighting and brand — for clients who consider space a long-term instrument.",
  twitterTitle: "Ractysh Architecture | Built Beyond Blueprints",
  twitterDescription:
    "Independent architecture, interior and engineering studio. Private residences, commercial environments and considered urban gestures across India.",
  keywords: [
    "architecture firm India",
    "international architecture studio",
    "sustainable architecture firm",
    "private villa architect",
    "luxury residential architecture",
    "interior design studio India",
    "structural design consultancy",
    "MEP design services",
    "landscape architecture",
    "urban planning consultancy",
    "3D architectural visualisation",
    "photoreal architectural rendering",
    "bespoke furniture design",
    "architectural lighting design",
    "elevation design",
    "commercial building design",
    "project management consultancy",
    "architecture brand identity",
    "Kerala villa architect",
    "Tamil Nadu architecture firm",
    "Coimbatore architecture studio"
  ]
} as const;

export const footerContent = {
  brandStatement:
    "Ractysh Architecture is an independent architecture, interior and engineering practice composing considered buildings for private and institutional clients across India and internationally. Built beyond blueprints, with light, proportion and intent.",
  studio: {
    title: "Studio",
    items: [
      { label: "Works", href: "#works" },
      { label: "Editorial Position", href: "#editorial" },
      { label: "Consultation", href: "#architecture-consultation-desk" }
    ]
  },
  services: {
    title: "Services",
    items: [
      { label: "Architectural Design", href: "#services" },
      { label: "Interior Design", href: "#services" },
      { label: "Structural Design", href: "#services" },
      { label: "MEP Design", href: "#services" },
      { label: "Visualisation", href: "#services" }
    ]
  },
  locations: {
    title: "Locations",
    items: [
      { label: "Coimbatore" },
      { label: "Kochi" },
      { label: "Chennai" },
      { label: "Bengaluru" },
      { label: "International Commissions" }
    ]
  },
  contact: {
    title: "Contact",
    items: [
      { label: "hello@ractysh.com", href: "mailto:hello@ractysh.com" },
      { label: "Architecture Desk", href: "#architecture-consultation-desk" },
      { label: "Press & Editorial", href: "mailto:press@ractysh.com" },
      { label: "Join our Journal", href: "#subscribe" }
    ]
  },
  legal: {
    copyright: `© ${new Date().getFullYear()} Ractysh Architecture. All rights reserved.`,
    notes: "Part of the Ractysh Group enterprise ecosystem."
  }
} as const;

export const allServiceSlugs = servicesContent.items.map((s) => s.slug);
