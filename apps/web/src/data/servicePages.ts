export type ServiceVisualKey =
  | "architecture"
  | "interior"
  | "landscape"
  | "visualization"
  | "turnkey"
  | "structural"
  | "management"
  | "demo"
  | "trade"
  | "mep"
  | "urban"
  | "rendering"
  | "furniture"
  | "lighting"
  | "elevation"
  | "commercial"
  | "logo";

export interface ServiceCapability {
  title: string;
  body: string;
}

export interface ServiceWorkflowStep {
  label: string;
  title: string;
  body: string;
}

export interface ServiceMetric {
  label: string;
  value: string;
}

export interface PremiumServicePageData {
  slug: string;
  href: string;
  category: "Design Studio" | "Build Delivery" | "Enterprise";
  eyebrow: string;
  title: string;
  titleLines: string[];
  summary: string;
  heroStatement: string;
  visualKey: ServiceVisualKey;
  visualTitle: string;
  visualSubtitle: string;
  visualNodes: string[];
  metrics: ServiceMetric[];
  capabilities: ServiceCapability[];
  workflow: ServiceWorkflowStep[];
  ctaTitle: string;
  ctaBody: string;
}

export const servicePages: PremiumServicePageData[] = [
  {
    slug: "architectural-design",
    href: "/architectural-design",
    category: "Design Studio",
    eyebrow: "Architectural Design",
    title: "Architectural intelligence for premium enterprise spaces.",
    titleLines: ["Architectural", "intelligence for", "enterprise spaces."],
    summary: "Concept architecture, spatial planning and decision-grade documentation for premium residential, commercial and mixed-use projects.",
    heroStatement: "Spatial strategy, facade language and planning logic unified into one premium design operating layer.",
    visualKey: "architecture",
    visualTitle: "Spatial Core",
    visualSubtitle: "Blueprint, massing and facade logic synchronized",
    visualNodes: ["Blueprint grid", "Massing model", "Facade system", "Site logic"],
    metrics: [
      { label: "Design Layers", value: "18+" },
      { label: "Planning Mode", value: "BIM-ready" },
      { label: "Review Cycle", value: "Guided" }
    ],
    capabilities: [
      { title: "Concept architecture", body: "Premium concept systems that align site context, client ambition, utility and buildability from the first review." },
      { title: "Master planning", body: "Controlled spatial zoning, circulation, massing and phase logic for residential, commercial and mixed-use programs." },
      { title: "Facade direction", body: "Architectural identity, proportion systems and exterior language designed for lasting enterprise-grade presence." },
      { title: "Execution documentation", body: "Clear drawing packs, consultant coordination and approval-ready visual information for downstream delivery." }
    ],
    workflow: [
      { label: "01", title: "Brief intelligence", body: "Business goals, site constraints, lifestyle needs and approval priorities are mapped into a design mandate." },
      { label: "02", title: "Spatial strategy", body: "Planning grids, circulation and zoning are converted into a premium architectural direction." },
      { label: "03", title: "Design development", body: "Form, material, facade and documentation layers are refined with technical clarity." },
      { label: "04", title: "Execution handoff", body: "Drawing packages and review systems prepare the project for confident construction coordination." }
    ],
    ctaTitle: "Start Your Architectural Workflow",
    ctaBody: "Move from requirement brief to premium spatial strategy with Ractysh Design."
  },
  {
    slug: "interior-design",
    href: "/interior-design",
    category: "Design Studio",
    eyebrow: "Interior Design",
    title: "Luxury interiors engineered for daily performance.",
    titleLines: ["Luxury interiors", "engineered for", "daily performance."],
    summary:
      "Interior systems that combine material intelligence, lighting logic, furniture planning and execution documentation.",
    heroStatement: "A premium interior operating system for spaces that need atmosphere, clarity and exacting finish control.",
    visualKey: "interior",
    visualTitle: "Material Flow",
    visualSubtitle: "Lighting, finishes and spatial moodboards aligned",
    visualNodes: ["Lighting", "Materials", "Furniture", "Finish control"],
    metrics: [
      { label: "Finish System", value: "Luxury" },
      { label: "Zone Logic", value: "Custom" },
      { label: "Handoff", value: "Detailed" }
    ],
    capabilities: [
      {
        title: "Material direction",
        body: "Curated palettes, finishes, textures and surface systems designed for premium visual continuity."
      },
      {
        title: "Lighting strategy",
        body: "Layered lighting plans that shape atmosphere, function, display and evening experience."
      },
      {
        title: "Furniture systems",
        body: "Spatially coordinated furniture, joinery and object placement for comfort, flow and precision."
      },
      {
        title: "Execution drawings",
        body: "Interior documentation and finish schedules that reduce ambiguity during procurement and site delivery."
      }
    ],
    workflow: [
      { label: "01", title: "Lifestyle and use mapping", body: "Rooms, routines, brand cues and finish expectations are translated into a clear interior brief." },
      { label: "02", title: "Mood and material system", body: "Lighting, texture, color and surface strategy establish the cinematic interior direction." },
      { label: "03", title: "Detail coordination", body: "Furniture, joinery, electrical points, ceiling and finish details are synchronized." },
      { label: "04", title: "Premium finish control", body: "Execution packs, procurement notes and review rhythm keep the final space controlled." }
    ],
    ctaTitle: "Start Your Interior Workflow",
    ctaBody: "Create a refined interior experience with material, lighting and execution clarity."
  },

  {
    slug: "structural-design",
    href: "/structural-design",
    category: "Design Studio",
    eyebrow: "Structural Design",
    title: "Engineering structure with architectural discipline.",
    titleLines: ["Engineering", "structure with", "architectural discipline."],
    summary: "Structural design, civil coordination, load path analysis and technical delivery for premium construction programs.",
    heroStatement: "A structural execution layer that connects engineering intent with site realities and premium finish goals.",
    visualKey: "structural",
    visualTitle: "Structural Grid",
    visualSubtitle: "Beams, grids and site logic in coordinated motion",
    visualNodes: ["Grid", "Beam", "Load path", "QA layer"],
    metrics: [
      { label: "Structure", value: "Mapped" },
      { label: "QA Points", value: "Multi" },
      { label: "Coordination", value: "Live" }
    ],
    capabilities: [
      { title: "Structural analysis", body: "Load calculations, structural behavior and material performance assessed for safety and efficiency." },
      { title: "Foundation design", body: "Soil conditions, foundation types and structural support systems designed for site-specific requirements." },
      { title: "Frame and superstructure", body: "Steel, concrete and composite framing systems coordinated with architectural and MEP requirements." },
      { title: "Quality checkpoints", body: "Inspection, reporting and correction loops structured around clear technical accountability." }
    ],
    workflow: [
      { label: "01", title: "Technical mapping", body: "Drawings, site constraints and structural dependencies are reviewed before mobilization." },
      { label: "02", title: "Sequence planning", body: "Structural activities, materials and specialist teams are organized into a delivery plan." },
      { label: "03", title: "Execution control", body: "Site activity is monitored through quality checks, engineering alignment and issue routing." },
      { label: "04", title: "Documentation close", body: "Completion notes, corrections and handover information are organized for client clarity." }
    ],
    ctaTitle: "Start Your Structural Workflow",
    ctaBody: "Coordinate structural delivery with technical discipline and premium execution control."
  },
  {
    slug: "mep-design",
    href: "/mep-design",
    category: "Design Studio",
    eyebrow: "MEP Design",
    title: "Integrated MEP systems for modern buildings.",
    titleLines: ["Integrated MEP", "systems for", "modern buildings."],
    summary: "Mechanical, electrical and plumbing design for residential, commercial and mixed-use developments.",
    heroStatement: "Building services engineered for comfort, efficiency, compliance and seamless architectural integration.",
    visualKey: "mep",
    visualTitle: "Services Core",
    visualSubtitle: "HVAC, electrical, plumbing and fire safety coordinated",
    visualNodes: ["HVAC", "Electrical", "Plumbing", "Fire safety"],
    metrics: [
      { label: "System Layers", value: "4+" },
      { label: "Compliance", value: "Code-ready" },
      { label: "Coordination", value: "BIM-integrated" }
    ],
    capabilities: [
      { title: "HVAC design", body: "Heating, ventilation and air conditioning systems designed for thermal comfort, air quality and energy performance." },
      { title: "Electrical systems", body: "Power distribution, lighting, backup systems and low-current infrastructure planned for operational reliability." },
      { title: "Plumbing and drainage", body: "Water supply, drainage, stormwater and sanitary systems engineered for efficiency and code compliance." },
      { title: "Fire protection", body: "Fire detection, sprinkler systems and life safety design coordinated with architectural and structural plans." }
    ],
    workflow: [
      { label: "01", title: "Load analysis", body: "Building use, occupancy and system demands are calculated as the engineering foundation." },
      { label: "02", title: "System routing", body: "MEP networks are coordinated within structural and architectural constraints." },
      { label: "03", title: "Documentation", body: "Drawings, schedules and specifications are prepared for procurement and installation." },
      { label: "04", title: "Coordination and review", body: "Systems are reviewed for clash detection, compliance and integration before site execution." }
    ],
    ctaTitle: "Start Your MEP Workflow",
    ctaBody: "Engineer building services with coordinated MEP design and technical precision."
  },
  {
    slug: "landscape-design",
    href: "/landscape-design",
    category: "Design Studio",
    eyebrow: "Landscape Design",
    title: "Environmental terrain planning for premium developments.",
    titleLines: ["Environmental", "terrain planning for", "premium developments."],
    summary: "Outdoor planning, terrain logic and ecosystem layering for villas, campuses, hospitality and mixed-use environments.",
    heroStatement: "Site ecology, movement and premium outdoor experience designed as one coordinated landscape system.",
    visualKey: "landscape",
    visualTitle: "Terrain System",
    visualSubtitle: "Ecology, circulation and outdoor layers coordinated",
    visualNodes: ["Terrain", "Canopy", "Pathways", "Water logic"],
    metrics: [
      { label: "Outdoor Layers", value: "12+" },
      { label: "Site Flow", value: "Mapped" },
      { label: "Ecosystem", value: "Active" }
    ],
    capabilities: [
      { title: "Site planning", body: "Movement, entry, service access, landscape hierarchy and outdoor program zones planned together." },
      { title: "Terrain logic", body: "Levels, drainage intent, view corridors and outdoor comfort translated into spatial terrain systems." },
      { title: "Planting direction", body: "Premium landscape palettes built around climate, maintenance, privacy, identity and long-term experience." },
      { title: "Outdoor experience", body: "Pathways, lighting, seating, water features and landscape focal points shaped into a memorable sequence." }
    ],
    workflow: [
      { label: "01", title: "Site reading", body: "Topography, views, access, utilities and climate behavior are studied as the base layer." },
      { label: "02", title: "Experience zoning", body: "Arrival, leisure, service, privacy and circulation zones are arranged with architectural logic." },
      { label: "03", title: "Landscape layering", body: "Planting, hardscape, lighting, water and furniture systems are coordinated." },
      { label: "04", title: "Implementation map", body: "The landscape vision becomes a practical plan for sourcing, sequencing and site execution." }
    ],
    ctaTitle: "Start Your Landscape Workflow",
    ctaBody: "Turn site potential into a premium outdoor experience with structured planning."
  },
  {
    slug: "urban-planning",
    href: "/urban-planning",
    category: "Design Studio",
    eyebrow: "Urban Planning",
    title: "Strategic urban and precinct planning for growth.",
    titleLines: ["Strategic urban", "and precinct", "planning for growth."],
    summary: "Master planning, zoning strategy, circulation networks and precinct design for residential, commercial and mixed-use developments.",
    heroStatement: "Site logic, movement systems and development phasing designed as one coordinated urban framework.",
    visualKey: "urban",
    visualTitle: "Urban Framework",
    visualSubtitle: "Zoning, circulation and phasing coordinated",
    visualNodes: ["Zoning", "Circulation", "Phasing", "Land use"],
    metrics: [
      { label: "Planning Scale", value: "Precinct" },
      { label: "Zones", value: "Multi-use" },
      { label: "Phasing", value: "Structured" }
    ],
    capabilities: [
      { title: "Master planning", body: "Site-wide spatial frameworks that organize land use, density, movement and infrastructure logically." },
      { title: "Zoning strategy", body: "Regulatory analysis, zone planning and development controls aligned with project vision and compliance." },
      { title: "Circulation networks", body: "Vehicular, pedestrian and service access routes planned for efficiency, safety and experience." },
      { title: "Precinct design", body: "Neighborhoods, blocks and public realm systems designed as coherent urban environments." }
    ],
    workflow: [
      { label: "01", title: "Site analysis", body: "Context, topography, infrastructure, regulations and market conditions are assessed." },
      { label: "02", title: "Framework planning", body: "Land use, density, movement and open space networks are established." },
      { label: "03", title: "Design development", body: "Block layouts, building envelopes and streetscape systems are refined." },
      { label: "04", title: "Implementation strategy", body: "Phasing, infrastructure sequencing and delivery recommendations are prepared." }
    ],
    ctaTitle: "Start Your Urban Planning Workflow",
    ctaBody: "Shape precincts and communities with strategic urban planning and design intelligence."
  },
  {
    slug: "3d-model-visualisation",
    href: "/3d-model-visualisation",
    category: "Design Studio",
    eyebrow: "3D Model & Visualisation",
    title: "Cinematic 3D models for confident decisions.",
    titleLines: ["Cinematic 3D", "models for", "confident decisions."],
    summary: "Photorealistic 3D modeling, walkthrough-ready presentation systems and visual decision tools for architecture and interiors.",
    heroStatement: "A visual presentation layer that helps clients see, approve and align before execution begins.",
    visualKey: "visualization",
    visualTitle: "3D Pipeline",
    visualSubtitle: "Model, texture, light and render in live review",
    visualNodes: ["Scene model", "Texturing", "Lighting pass", "Client review"],
    metrics: [
      { label: "Model Detail", value: "Photoreal" },
      { label: "Review Layer", value: "Live" },
      { label: "Visual Output", value: "4K-ready" }
    ],
    capabilities: [
      { title: "3D modeling", body: "High-fidelity digital models that communicate form, scale, material and spatial intent clearly." },
      { title: "Walkthrough planning", body: "Camera paths, sequence logic and visual storytelling for client presentations and approvals." },
      { title: "Material studies", body: "Finish options and lighting conditions visualized before procurement or execution commitment." },
      { title: "Presentation systems", body: "Decision-grade visuals packaged for founders, investors, families, boards and project stakeholders." }
    ],
    workflow: [
      { label: "01", title: "Model intake", body: "Plans, references, mood direction and design priorities are converted into a visual brief." },
      { label: "02", title: "Scene assembly", body: "Geometry, materials, lighting and camera language are built into a cinematic visual system." },
      { label: "03", title: "Review cycles", body: "Key views and details are refined through controlled feedback rounds." },
      { label: "04", title: "Final presentation", body: "Approved visuals are prepared for stakeholder presentation and execution alignment." }
    ],
    ctaTitle: "Start Your 3D Workflow",
    ctaBody: "Bring your design into focus with cinematic 3D modeling and decision-grade presentation."
  },
  {
    slug: "rendering",
    href: "/rendering",
    category: "Design Studio",
    eyebrow: "Rendering",
    title: "Premium architectural rendering for every stage.",
    titleLines: ["Premium architectural", "rendering for", "every stage."],
    summary: "Cinematic still renders, atmospheric studies and high-resolution visual output for architecture, interiors and landscape projects.",
    heroStatement: "Still imagery that captures atmosphere, scale and materiality with photographic precision.",
    visualKey: "rendering",
    visualTitle: "Render Suite",
    visualSubtitle: "Composition, lighting and atmosphere refined",
    visualNodes: ["Composition", "Lighting", "Materials", "Post-production"],
    metrics: [
      { label: "Resolution", value: "8K-ready" },
      { label: "Style", value: "Cinematic" },
      { label: "Turnaround", value: "Scheduled" }
    ],
    capabilities: [
      { title: "Exterior renders", body: "Building elevation, landscape context and environmental lighting rendered at premium quality." },
      { title: "Interior renders", body: "Spatial atmosphere, material finish and furniture composition captured with photographic realism." },
      { title: "Aerial and context", body: "Site context, neighborhood integration and bird's-eye views for master plan and urban presentations." },
      { title: "Post-production", body: "Color grading, atmosphere enhancement and compositing for presentation-ready final output." }
    ],
    workflow: [
      { label: "01", title: "Brief and references", body: "Project scope, views, mood references and output specifications are established." },
      { label: "02", title: "Scene setup", body: "Geometry, lighting, materials and camera positions are built into the render scene." },
      { label: "03", title: "Render passes", body: "Beauty, shadow, reflection and atmospheric passes are rendered and composited." },
      { label: "04", title: "Final delivery", body: "Approved renders are color-graded, formatted and delivered for presentation." }
    ],
    ctaTitle: "Start Your Rendering Workflow",
    ctaBody: "Produce premium architectural renders with cinematic quality and precision."
  },
  {
    slug: "furniture-design",
    href: "/furniture-design",
    category: "Design Studio",
    eyebrow: "Furniture Design",
    title: "Custom furniture designed for spatial character.",
    titleLines: ["Custom furniture", "designed for", "spatial character."],
    summary: "Custom furniture, joinery and object design for residential, hospitality and commercial interior environments.",
    heroStatement: "Furniture as architecture — pieces designed to define space, support function and express identity.",
    visualKey: "furniture",
    visualTitle: "Object Studio",
    visualSubtitle: "Form, material and joinery synchronized",
    visualNodes: ["Form", "Material", "Joinery", "Ergonomics"],
    metrics: [
      { label: "Product Range", value: "Custom" },
      { label: "Material", value: "Curated" },
      { label: "Production", value: "Artisan-ready" }
    ],
    capabilities: [
      { title: "Custom furniture", body: "Sofas, tables, seating, shelving and storage systems designed for specific spatial contexts." },
      { title: "Joinery design", body: "Built-in cabinetry, paneling and millwork designed as integrated architectural elements." },
      { title: "Material selection", body: "Timber, metal, stone, fabric and finish systems curated for durability, tactility and visual warmth." },
      { title: "Prototyping", body: "Scale models, material samples and production drawings prepared for artisan and manufacturing partners." }
    ],
    workflow: [
      { label: "01", title: "Brief and context", body: "Room function, user behavior, spatial proportions and design references are gathered." },
      { label: "02", title: "Concept design", body: "Form, proportion, material palette and construction approach are developed." },
      { label: "03", title: "Detail development", body: "Joinery, connections, finishes and production specifications are refined." },
      { label: "04", title: "Production handoff", body: "Shop drawings, material schedules and fabrication instructions are prepared for making." }
    ],
    ctaTitle: "Start Your Furniture Workflow",
    ctaBody: "Design custom furniture that defines space and elevates interior experience."
  },
  {
    slug: "architectural-lighting-design",
    href: "/architectural-lighting-design",
    category: "Design Studio",
    eyebrow: "Architectural Lighting Design",
    title: "Lighting as architecture. Atmosphere as function.",
    titleLines: ["Lighting as", "architecture.", "Atmosphere as function."],
    summary: "Layered lighting strategies for interior and exterior spaces — ambient, task, accent and decorative systems.",
    heroStatement: "Light planned as a material — shaping perception, mood, function and visual comfort across every space.",
    visualKey: "lighting",
    visualTitle: "Light Plan",
    visualSubtitle: "Layers, control and atmosphere coordinated",
    visualNodes: ["Ambient", "Task", "Accent", "Control"],
    metrics: [
      { label: "Light Layers", value: "4+" },
      { label: "Control", value: "Smart-ready" },
      { label: "Compliance", value: "Code-compliant" }
    ],
    capabilities: [
      { title: "Ambient lighting", body: "Base illumination systems designed for uniform brightness, visual comfort and spatial clarity." },
      { title: "Task and accent", body: "Focused lighting for work surfaces, art, displays and architectural features." },
      { title: "Decorative lighting", body: "Chandeliers, pendants, wall lights and custom fixtures as sculptural interior elements." },
      { title: "Lighting control", body: "Dimming, zoning, scene-setting and automation systems for flexible and efficient operation." }
    ],
    workflow: [
      { label: "01", title: "Brief and intent", body: "Spatial function, atmosphere goals, architectural features and budget are established." },
      { label: "02", title: "Concept design", body: "Light layers, fixture types and preliminary layouts are developed with mood imagery." },
      { label: "03", title: "Technical design", body: "Photometric calculations, fixture specifications and control system design are completed." },
      { label: "04", title: "Documentation", body: "Lighting plans, schedules, details and specifications are prepared for procurement and installation." }
    ],
    ctaTitle: "Start Your Lighting Workflow",
    ctaBody: "Architectural lighting design that shapes atmosphere and elevates spatial experience."
  },
  {
    slug: "elevation-design",
    href: "/elevation-design",
    category: "Design Studio",
    eyebrow: "Elevation Design",
    title: "Facade identity. Architectural presence.",
    titleLines: ["Facade identity.", "Architectural", "presence."],
    summary: "Building elevation design, facade language, exterior proportion systems and material composition for premium architecture.",
    heroStatement: "First impressions designed through facade composition, material rhythm and architectural detailing.",
    visualKey: "elevation",
    visualTitle: "Facade System",
    visualSubtitle: "Proportion, material and detail synchronized",
    visualNodes: ["Proportion", "Material", "Detail", "Composition"],
    metrics: [
      { label: "Facade Layers", value: "Multi" },
      { label: "Material", value: "Curated" },
      { label: "Style", value: "Bespoke" }
    ],
    capabilities: [
      { title: "Facade composition", body: "Elevation proportion, window rhythm, material balance and entry language composed as architectural identity." },
      { title: "Material systems", body: "Stone, metal, glass, timber and composite systems selected for durability, aesthetics and climate response." },
      { title: "Detail development", body: "Cornice, sill, joint, balustrade and parapet details designed with precision and construction logic." },
      { title: "Visual studies", body: "Elevation renderings, material mockups and shadow studies to validate design decisions." }
    ],
    workflow: [
      { label: "01", title: "Design brief", body: "Architectural character, client preferences, site context and functional requirements are established." },
      { label: "02", title: "Concept studies", body: "Elevation options, material palettes and facade strategies are explored." },
      { label: "03", title: "Detail development", body: "Facade components, junctions and material transitions are refined." },
      { label: "04", title: "Documentation", body: "Elevation drawings, material schedules and detail specifications are prepared for construction." }
    ],
    ctaTitle: "Start Your Elevation Workflow",
    ctaBody: "Design facades that define architectural presence with clarity and premium materiality."
  },
  {
    slug: "commercial-building-design",
    href: "/commercial-building-design",
    category: "Design Studio",
    eyebrow: "Commercial Building Design",
    title: "Commercial architecture for enterprise presence.",
    titleLines: ["Commercial", "architecture for", "enterprise presence."],
    summary: "Office buildings, retail spaces, mixed-use complexes and commercial environments designed for brand and performance.",
    heroStatement: "Commercial spaces engineered for brand identity, operational efficiency and user experience.",
    visualKey: "commercial",
    visualTitle: "Commercial Core",
    visualSubtitle: "Brand, function and experience coordinated",
    visualNodes: ["Brand", "Function", "Experience", "Efficiency"],
    metrics: [
      { label: "Building Type", value: "Commercial" },
      { label: "Scale", value: "Enterprise" },
      { label: "Delivery", value: "Integrated" }
    ],
    capabilities: [
      { title: "Office design", body: "Workplace environments planned for productivity, collaboration, brand expression and employee well-being." },
      { title: "Retail and hospitality", body: "Customer-facing spaces designed for experience, circulation, brand immersion and operational flow." },
      { title: "Mixed-use planning", body: "Integrated developments combining commercial, residential and leisure functions in cohesive precincts." },
      { title: "Façade and identity", body: "Exterior language, signage integration and brand architecture for visible commercial presence." }
    ],
    workflow: [
      { label: "01", title: "Brief and analysis", body: "Business goals, brand values, operational needs and site constraints are mapped." },
      { label: "02", title: "Concept design", body: "Spatial strategy, massing, circulation and brand integration are developed." },
      { label: "03", title: "Design development", body: "Plans, elevations, materials and systems are refined with technical coordination." },
      { label: "04", title: "Documentation", body: "Construction drawings, specifications and approval packages are prepared for delivery." }
    ],
    ctaTitle: "Start Your Commercial Workflow",
    ctaBody: "Design commercial environments that project enterprise presence and operational clarity."
  },
  {
    slug: "project-management-consultation",
    href: "/project-management-consultation",
    category: "Design Studio",
    eyebrow: "Project Management Consultation",
    title: "Live workflow control for complex delivery.",
    titleLines: ["Live workflow", "control for complex", "delivery."],
    summary: "Project governance, milestone tracking, reporting rhythm and stakeholder coordination for premium execution.",
    heroStatement: "Operational sync for teams, vendors and clients who need every moving part visible and accountable.",
    visualKey: "management",
    visualTitle: "Project Console",
    visualSubtitle: "Milestones, vendors and reporting lanes synchronized",
    visualNodes: ["Milestones", "Vendors", "Reports", "Risks"],
    metrics: [
      { label: "Workflow", value: "Live" },
      { label: "Reporting", value: "Weekly" },
      { label: "Risk Layer", value: "Active" }
    ],
    capabilities: [
      { title: "Milestone tracking", body: "Program stages, dependencies and delivery checkpoints tracked through a clear operating rhythm." },
      { title: "Stakeholder updates", body: "Client, vendor and internal communication handled through premium reporting and review systems." },
      { title: "Issue routing", body: "Risks, blockers and decisions routed quickly to preserve momentum and accountability." },
      { title: "Execution governance", body: "Quality, schedule, budget and scope monitored as one coordinated workflow." }
    ],
    workflow: [
      { label: "01", title: "Program setup", body: "Scope, teams, milestones and communication protocol are structured before execution begins." },
      { label: "02", title: "Control rhythm", body: "Reviews, approvals, reporting and dependency checks are scheduled into a repeatable cadence." },
      { label: "03", title: "Live coordination", body: "Tasks, vendors, risks and decisions are monitored through active workflow control." },
      { label: "04", title: "Executive reporting", body: "Progress, next actions and completion status are communicated with premium clarity." }
    ],
    ctaTitle: "Start Your PMC Workflow",
    ctaBody: "Bring premium control and reporting discipline to complex project delivery."
  },
  {
    slug: "logo-design",
    href: "/logo-design",
    category: "Design Studio",
    eyebrow: "Logo Design",
    title: "Brand identity distilled into a single mark.",
    titleLines: ["Brand identity", "distilled into", "a single mark."],
    summary: "Logo design, brand identity systems and visual language for enterprises, studios, products and commercial ventures.",
    heroStatement: "A mark that carries meaning — designed for recognition, memorability and lasting brand equity.",
    visualKey: "logo",
    visualTitle: "Identity System",
    visualSubtitle: "Mark, type, color and application synchronized",
    visualNodes: ["Mark", "Typography", "Color", "Application"],
    metrics: [
      { label: "Concepts", value: "Curated" },
      { label: "Formats", value: "Full suite" },
      { label: "Delivery", value: "Brand-ready" }
    ],
    capabilities: [
      { title: "Logo design", body: "Custom wordmarks, symbols, combination marks and emblem designs for distinctive brand identity." },
      { title: "Brand identity", body: "Color palettes, typography systems, texture and visual language extended from the core logo." },
      { title: "Application design", body: "Stationery, signage, digital assets and brand collateral designed for consistent application." },
      { title: "Brand guidelines", body: "Usage rules, specification documents and identity standards for long-term brand consistency." }
    ],
    workflow: [
      { label: "01", title: "Discovery", body: "Brand values, market position, audience and competitive context are researched and defined." },
      { label: "02", title: "Concept development", body: "Logo directions, typography explorations and visual concepts are created and refined." },
      { label: "03", title: "Design refinement", body: "Selected concepts are detailed, tested and polished across applications." },
      { label: "04", title: "Delivery and guidelines", body: "Final assets, file formats and brand guidelines are prepared for rollout." }
    ],
    ctaTitle: "Start Your Logo Workflow",
    ctaBody: "Create a distinctive brand mark with strategic logo design and identity systems."
  },
  {
    slug: "turnkey-projects",
    href: "/turnkey-projects",
    category: "Build Delivery",
    eyebrow: "Turnkey Projects",
    title: "End-to-end project execution with one accountable system.",
    titleLines: ["End-to-end", "execution with one", "accountable system."],
    summary:
      "Turnkey delivery from brief, design and sourcing through construction, finishing, handover and documentation.",
    heroStatement: "A single accountable execution layer for premium clients who need control, speed and finish quality.",
    visualKey: "turnkey",
    visualTitle: "Delivery Console",
    visualSubtitle: "Milestones, sourcing and handover synchronized",
    visualNodes: ["Brief", "Procure", "Build", "Handover"],
    metrics: [
      { label: "Owner Model", value: "Single" },
      { label: "Milestones", value: "Tracked" },
      { label: "Delivery", value: "End-to-end" }
    ],
    capabilities: [
      {
        title: "Single accountability",
        body: "One coordinated responsibility layer across design, procurement, execution, finishing and handover."
      },
      {
        title: "Budget visibility",
        body: "Cost lanes, scope decisions and vendor dependencies presented with operational clarity."
      },
      {
        title: "Vendor coordination",
        body: "Procurement, specialist teams and site execution synchronized through a controlled delivery rhythm."
      },
      {
        title: "Handover systems",
        body: "Final delivery, snag tracking, documentation and client transition handled with premium discipline."
      }
    ],
    workflow: [
      { label: "01", title: "Scope lock", body: "Brief, deliverables, finish expectations and budget boundaries are established upfront." },
      { label: "02", title: "Execution planning", body: "Milestones, vendors, procurement dependencies and approval windows are sequenced." },
      { label: "03", title: "Site delivery", body: "Workstreams are monitored with quality checks, issue tracking and progress visibility." },
      { label: "04", title: "Premium handover", body: "Final finish, documentation and transition are completed through one accountable process." }
    ],
    ctaTitle: "Start Your Turnkey Workflow",
    ctaBody: "Move from brief to handover with one premium delivery system."
  },
  {
    slug: "structural-work",
    href: "/structural-work",
    category: "Build Delivery",
    eyebrow: "Structural Work",
    title: "Engineering structure with architectural discipline.",
    titleLines: ["Engineering", "structure with", "architectural discipline."],
    summary:
      "Structural work, civil coordination, PEB alignment and technical delivery for premium construction programs.",
    heroStatement: "A structural execution layer that connects engineering intent with site realities and premium finish goals.",
    visualKey: "structural",
    visualTitle: "Structural Grid",
    visualSubtitle: "Beams, grids and site logic in coordinated motion",
    visualNodes: ["Grid", "Beam", "Load path", "QA layer"],
    metrics: [
      { label: "Structure", value: "Mapped" },
      { label: "QA Points", value: "Multi" },
      { label: "Coordination", value: "Live" }
    ],
    capabilities: [
      {
        title: "Civil coordination",
        body: "Site execution, structural sequencing and technical workstreams handled with practical discipline."
      },
      {
        title: "PEB and framing",
        body: "Pre-engineered building, framing and support systems coordinated with delivery priorities."
      },
      {
        title: "MEP integration",
        body: "Structural and service interfaces reviewed early to reduce clashes and site rework."
      },
      {
        title: "Quality checkpoints",
        body: "Inspection, reporting and correction loops structured around clear technical accountability."
      }
    ],
    workflow: [
      { label: "01", title: "Technical mapping", body: "Drawings, site constraints and structural dependencies are reviewed before mobilization." },
      { label: "02", title: "Sequence planning", body: "Structural activities, materials and specialist teams are organized into a delivery plan." },
      { label: "03", title: "Execution control", body: "Site activity is monitored through quality checks, engineering alignment and issue routing." },
      { label: "04", title: "Documentation close", body: "Completion notes, corrections and handover information are organized for client clarity." }
    ],
    ctaTitle: "Start Your Structural Workflow",
    ctaBody: "Coordinate structural delivery with technical discipline and premium execution control."
  },
  {
    slug: "project-management",
    href: "/project-management",
    category: "Build Delivery",
    eyebrow: "Project Management",
    title: "Live workflow control for complex delivery.",
    titleLines: ["Live workflow", "control for complex", "delivery."],
    summary:
      "Project governance, milestone tracking, reporting rhythm and stakeholder coordination for premium enterprise execution.",
    heroStatement: "Operational sync for teams, vendors and clients who need every moving part visible and accountable.",
    visualKey: "management",
    visualTitle: "Workflow Control",
    visualSubtitle: "Approvals, dependencies and delivery lanes synchronized",
    visualNodes: ["Approvals", "Milestones", "Vendors", "Reports"],
    metrics: [
      { label: "Workflow", value: "Live" },
      { label: "Reporting", value: "Weekly" },
      { label: "Risk Layer", value: "Active" }
    ],
    capabilities: [
      {
        title: "Milestone tracking",
        body: "Program stages, dependencies and delivery checkpoints tracked through a clear operating rhythm."
      },
      {
        title: "Stakeholder updates",
        body: "Client, vendor and internal communication handled through premium reporting and review systems."
      },
      {
        title: "Issue routing",
        body: "Risks, blockers and decisions routed quickly to preserve momentum and accountability."
      },
      {
        title: "Execution governance",
        body: "Quality, schedule, budget and scope monitored as one coordinated enterprise workflow."
      }
    ],
    workflow: [
      { label: "01", title: "Program setup", body: "Scope, teams, milestones and communication protocol are structured before execution begins." },
      { label: "02", title: "Control rhythm", body: "Reviews, approvals, reporting and dependency checks are scheduled into a repeatable cadence." },
      { label: "03", title: "Live coordination", body: "Tasks, vendors, risks and decisions are monitored through active workflow control." },
      { label: "04", title: "Executive reporting", body: "Progress, next actions and completion status are communicated with premium clarity." }
    ],
    ctaTitle: "Start Your Management Workflow",
    ctaBody: "Bring premium control and reporting discipline to complex enterprise delivery."
  },
  {
    slug: "book-demo",
    href: "/book-demo",
    category: "Enterprise",
    eyebrow: "Book Demo",
    title: "Enterprise onboarding designed like a premium intake system.",
    titleLines: ["Enterprise", "onboarding designed", "for clarity."],
    summary:
      "A structured demo and consultation intake experience for clients exploring Architecture, Construction, Real Estate, Export-Import, OTC Exchange or enterprise planning.",
    heroStatement: "Turn early interest into a guided enterprise workflow with clear priorities, routing and next steps.",
    visualKey: "demo",
    visualTitle: "Intake System",
    visualSubtitle: "Requirement capture, routing and onboarding signals",
    visualNodes: ["Intake", "Classify", "Route", "Demo"],
    metrics: [
      { label: "Routing", value: "Guided" },
      { label: "Priority", value: "Mapped" },
      { label: "Next Step", value: "Clear" }
    ],
    capabilities: [
      {
        title: "Guided requirement capture",
        body: "Service interest, timeline, scope and decision context are structured before the first meeting."
      },
      {
        title: "Enterprise routing",
        body: "Requests are mapped to the right Ractysh operating layer across Architecture, Construction, Real Estate, Trade, OTC Exchange and enterprise services."
      },
      {
        title: "Consultation preparation",
        body: "The demo conversation begins with context, priorities and practical next steps already clear."
      },
      {
        title: "Follow-up clarity",
        body: "Clients leave with a structured direction instead of a generic inquiry response."
      }
    ],
    workflow: [
      { label: "01", title: "Request submitted", body: "The client shares service interest, timeline, location and primary objective." },
      { label: "02", title: "Internal review", body: "The requirement is classified across Architecture, Construction, Real Estate, Export-Import, OTC Exchange or enterprise coordination." },
      { label: "03", title: "Demo prepared", body: "Relevant context and meeting direction are prepared for a useful premium conversation." },
      { label: "04", title: "Next action issued", body: "The workflow moves into proposal, discovery, advisory or project planning." }
    ],
    ctaTitle: "Start Your Enterprise Workflow",
    ctaBody: "Book a premium intake and let Ractysh route your requirement intelligently."
  },
  {
    slug: "import-export-service",
    href: "/import-export-service",
    category: "Enterprise",
    eyebrow: "Import & Export Service",
    title: "Enterprise-grade import, export and international business support.",
    titleLines: ["Import, export", "and trade support", "for modern business."],
    summary:
      "Enterprise-grade import, export and international business support for modern commercial ecosystems.",
    heroStatement: "Import, export and enterprise trade support systems designed for modern commercial operations.",
    visualKey: "trade",
    visualTitle: "Global Route Map",
    visualSubtitle: "Supplier lanes, documentation and cross-border commerce paths connected",
    visualNodes: ["Supplier lanes", "Ports", "Freight lanes", "Documents"],
    metrics: [
      { label: "Trade Network", value: "Global" },
      { label: "Trade Support", value: "Coordinated" },
      { label: "Commerce Layer", value: "Cross-border" }
    ],
    capabilities: [
      {
        title: "International Business Support",
        body: "Commercial teams, vendors and supplier networks aligned around cross-border commerce requirements."
      },
      {
        title: "International Trade Support",
        body: "Supplier lanes, dispatch windows and movement updates structured for enterprise visibility."
      },
      {
        title: "Enterprise Supply Network",
        body: "Supplier readiness, documentation and delivery dependencies mapped into one operating layer."
      },
      {
        title: "Cross-Border Commerce",
        body: "Import and export workflows organized for modern commercial operations across regions."
      }
    ],
    workflow: [
      { label: "01", title: "Trade requirement mapping", body: "Commodity, shipment profile, destination, timing and commercial priorities are defined clearly." },
      { label: "02", title: "Partner and supplier alignment", body: "Suppliers, transport lanes and trade expectations are reviewed with disciplined coordination." },
      { label: "03", title: "Documentation control", body: "Trade documents, certificates and operational checkpoints are prepared before critical movement windows." },
      { label: "04", title: "Trade support", body: "Shipment movement, status reporting and handover dependencies are managed through one enterprise trade layer." }
    ],
    ctaTitle: "Start Your Trade Workflow",
    ctaBody: "Coordinate import, export and international trade requirements through one premium enterprise layer."
  }
];

export const servicePageRoutes = servicePages.map((service) => service.href);

export function getServicePage(slug: string) {
  return servicePages.find((service) => service.slug === slug);
}
