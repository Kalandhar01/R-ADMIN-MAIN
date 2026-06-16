import type { SiteContent } from "../types/content.js";

export const seedContent: SiteContent = {
  seo: {
    title: "Ractysh Group | Infrastructure, Design and Enterprise Operations",
    description:
      "Ractysh Group unifies infrastructure, architecture, design and global import export operations across one enterprise ecosystem."
  },
  theme: {
    mode: "dark",
    accent: "#ffffff"
  },
  nav: {
    logoText: "Ractysh",
    items: [
      { label: "Ecosystem", href: "/business" },
      { label: "Services", href: "/services" },
      { label: "Our Work", href: "/our-projects" },
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Book Consultation", href: "/book-consultation" },
      { label: "Contact", href: "/contact" },
      { label: "Founder", href: "/founder" }
    ]
  },
  hero: {
    eyebrow: "Ractysh Group Enterprise Ecosystem",
    headline: "Build, design and coordinate global enterprise operations through one ecosystem",
    subheadline:
      "Infrastructure, architecture, interiors, turnkey delivery and import export operations delivered through one premium operating layer.",
    primaryCta: "Book Consultation",
    secondaryCta: "Know More",
    trustLine: "Built for premium clients who need clarity, discretion and accountable delivery."
  },
  divisions: [
    {
      id: "infra",
      name: "Infra",
      legalName: "Ractysh Infra Pvt Ltd",
      summary:
        "Execution-first infrastructure company delivering premium construction, renovation and turnkey projects.",
      services: [
        "Construction",
        "Interior Works",
        "Renovation",
        "PEB Structural Work",
        "Electrical & Plumbing",
        "Painting Work",
        "Material Sourcing",
        "Landscape Work",
        "Turnkey Projects"
      ],
      metric: "Project delivery"
    },
    {
      id: "design",
      name: "Design",
      legalName: "Ractysh Design Pvt Ltd",
      summary:
        "Architecture and design studio creating refined spatial experiences from master planning to brand identity.",
      services: [
        "Architecture",
        "Interior Design",
        "Landscape Design",
        "3D Visualization",
        "Urban Planning",
        "Structural Design",
        "MEP Design",
        "Logo Design"
      ],
      metric: "Design intelligence"
    },
    {
      id: "import-export",
      name: "Import & Export",
      legalName: "Ractysh Import & Export Pvt Ltd",
      summary:
        "Global import, export and enterprise trade coordination systems designed for modern commercial operations.",
      services: ["Import & Export Operations", "Global Trade Coordination", "Supplier Network Management", "Cross-Border Commerce"],
      metric: "Global trade"
    }
  ],
  services: [
    {
      title: "Import & Export",
      description: "Enterprise-grade import, export and international trade coordination for modern business ecosystems.",
      company: "Ractysh Import & Export",
      tags: ["Global Trade", "Trade Documentation", "Supplier Network"]
    },
    {
      title: "Signature Architecture",
      description: "Premium residential, commercial and mixed-use design systems with enterprise documentation.",
      company: "Ractysh Design",
      tags: ["Architecture", "Planning"]
    },
    {
      title: "Turnkey Delivery",
      description: "Construction, interiors, MEP, sourcing and finishing handled through one accountable channel.",
      company: "Ractysh Infra",
      tags: ["Infra", "Execution"]
    },
    {
      title: "Design Visualization",
      description: "Photorealistic 3D renders, walkthrough-ready concepts and decision-grade presentation outputs.",
      company: "Ractysh Design",
      tags: ["3D", "Rendering"]
    },
    {
      title: "Premium Renovation",
      description: "High-control renovation and interiors for clients who expect speed, finish and discretion.",
      company: "Ractysh Infra",
      tags: ["Renovation", "Interiors"]
    },
    {
      title: "Global Trade Coordination",
      description: "Cross-border commerce, trade planning and supplier coordination handled through one enterprise layer.",
      company: "Ractysh Import & Export",
      tags: ["Cross-Border Commerce", "Supplier Network"]
    }
  ],
  projects: [
    {
      title: "Global Trade Coordination Suite",
      category: "Import & Export Operations",
      location: "Global",
      summary: "A structured operating environment for supplier networks, cross-border commerce and trade documentation.",
      year: "2026"
    },
    {
      title: "Luxury Villa Design System",
      category: "Architecture",
      location: "Coimbatore • Palani • Dindigul",
      summary: "Architecture, interiors, landscape and visualization unified into one premium design language.",
      year: "2026"
    },
    {
      title: "Turnkey Commercial Interior",
      category: "Infrastructure",
      location: "India",
      summary: "End-to-end construction, MEP, furnishing and premium finish delivery.",
      year: "2025"
    }
  ],
  stats: [
    { label: "Business verticals", value: 3, suffix: "" },
    { label: "Service capabilities", value: 21, suffix: "+" },
    { label: "Enterprise workflows", value: 12, suffix: "+" },
    { label: "Unified delivery model", value: 1, suffix: "" }
  ],
  testimonials: [
    {
      quote:
        "Ractysh brings the rare combination of discretion, design taste and operational seriousness.",
      name: "Private Client",
      role: "Real estate investor"
    },
    {
      quote:
        "The group structure makes it easier to move from concept to execution without losing accountability.",
      name: "Development Partner",
      role: "Commercial project owner"
    },
    {
      quote:
        "The experience feels premium because the process is controlled, clear and fast.",
      name: "Institutional Associate",
      role: "Strategic client"
    }
  ],
  blogs: [],
  sections: [
    { id: "hero", label: "Hero", visible: true, order: 1 },
    { id: "frameworks", label: "Frameworks We Support", visible: false, order: 2 },
    { id: "journey", label: "Journey Cards", visible: false, order: 3 },
    { id: "divisions", label: "Divisions", visible: false, order: 4 },
    { id: "services", label: "Services Bento", visible: false, order: 5 },
    { id: "stats", label: "Statistics", visible: false, order: 6 },
    { id: "solutions", label: "Solution Tabs", visible: false, order: 7 },
    { id: "projects", label: "Projects", visible: false, order: 8 },
    { id: "security", label: "Security", visible: false, order: 9 },
    { id: "faq", label: "FAQ", visible: false, order: 10 },
    { id: "cta", label: "CTA", visible: false, order: 11 }
  ],
  footer: {
    headline: "Ractysh",
    description:
      "Infrastructure, design and global import export operations for premium enterprise clients.",
    links: [
      { label: "Company Stage", href: "#frameworks" },
      { label: "Solutions", href: "#solutions" },
      { label: "Resources", href: "#faq" }
    ]
  },
  updatedAt: new Date().toISOString()
};
