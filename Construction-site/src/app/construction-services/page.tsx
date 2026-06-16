"use client";
export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, ShieldCheck } from "lucide-react";
import { toSlug } from "@/lib/construction-services-data";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ConstructionNavbar from "@/components/ConstructionNavbar";
import ConstructionFooter from "@/components/ConstructionFooter";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 25, suffix: "+", label: "Integrated Services" },
  { value: 500, suffix: "+", label: "Projects Delivered" },
  { value: 200, suffix: "+", label: "Certified Engineers" },
  { value: 10, suffix: "+", label: "Years Experience" },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { textContent: 0 },
        {
          textContent: target,
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [target]);

  return <><span ref={ref} />{suffix}</>;
}

type Service = {
  title: string;
  description: string;
  cta: string;
  image: string;
  highlights: string[];
  benefits: string[];
};

const services: Service[] = [
  {
    title: "Commercial Building Construction",
    description: "High-performance commercial construction for office towers, corporate headquarters, retail centres, and mixed-use developments.",
    cta: "Explore Service",
    image: "/images/construction/construction-service-command-center-construction-india-commercial-tower-01.webp",
    highlights: [
      "Office complexes & corporate campuses",
      "Retail centers & mixed-use developments",
      "Showrooms & commercial interiors",
      "Warehouse & logistics facilities",
    ],
    benefits: [
      "End-to-end commercial delivery",
      "Scalable construction solutions",
      "Sustainability-focused execution",
    ],
  },
  {
    title: "Residential Building Construction",
    description: "Premium residential construction across luxury villas, apartment complexes, gated communities, and custom-designed homes.",
    cta: "Explore Service",
    image: "/images/construction/our-work-finished-villa-08.webp",
    highlights: [
      "Luxury villas & bungalows",
      "Apartments & row houses",
      "Gated community developments",
      "Interior fit-outs & renovations",
    ],
    benefits: [
      "Premium quality finishes",
      "Custom design flexibility",
      "Timely project delivery",
    ],
  },
  {
    title: "Turnkey Construction Projects",
    description: "Single-point accountability from concept to handover — design, procurement, construction, commissioning, and documentation managed end-to-end.",
    cta: "Explore Service",
    image: "/images/construction/our-work-premium-site-command-07.webp",
    highlights: [
      "Design-build project delivery",
      "Procurement & vendor management",
      "Construction & quality assurance",
      "Testing, commissioning & handover",
    ],
    benefits: [
      "Single-point accountability",
      "Faster project delivery",
      "Cost & timeline certainty",
    ],
  },
  {
    title: "Civil Engineering Works & Consultation",
    description: "Licensed civil engineering for site analysis, structural design, foundation engineering, and execution planning across all development scales.",
    cta: "Explore Service",
    image: "/images/construction/construction-service-command-center-construction-india-infrastructure-viaduct-03.webp",
    highlights: [
      "Structural analysis & design",
      "Foundation & earthwork engineering",
      "Site development & grading plans",
      "Construction methodology reviews",
    ],
    benefits: [
      "Licensed civil engineering expertise",
      "Code-compliant structural designs",
      "Cost-optimized foundation solutions",
    ],
  },
  {
    title: "MEP Engineering Works",
    description: "Integrated mechanical, electrical, and plumbing systems — design, installation, commissioning, and BMS integration for energy-efficient buildings.",
    cta: "Explore Service",
    image: "/images/construction/service-plumbing-water-management.webp",
    highlights: [
      "HVAC system design & installation",
      "Electrical power distribution & lighting",
      "Plumbing & fire protection systems",
      "BMS & automation integration",
    ],
    benefits: [
      "Integrated MEP system design",
      "Energy-efficient solutions",
      "Code-compliant installations",
    ],
  },
  {
    title: "Pre-Engineered Building (PEB) Structures",
    description: "Design, fabrication, and erection of steel buildings for industrial sheds, warehouses, and large-span commercial structures.",
    cta: "Explore Service",
    image: "/images/construction/construction-service-command-center-construction-india-rebar-deck-02.webp",
    highlights: [
      "Industrial sheds & factories",
      "Warehouses & logistics hubs",
      "Showrooms & commercial buildings",
      "PEB structural design & fabrication",
    ],
    benefits: [
      "Fast project completion",
      "Cost-effective construction",
      "Design flexibility & scalability",
    ],
  },
  {
    title: "Project Management Consultancy (PMC)",
    description: "Independent owner-representative oversight — planning, budgeting, scheduling, risk management, vendor coordination, and quality assurance.",
    cta: "Explore Service",
    image: "/images/construction/our-work-premium-site-command-07.webp",
    highlights: [
      "Project planning & scheduling",
      "Budget & cost control",
      "Vendor & contractor management",
      "Quality & risk management",
    ],
    benefits: [
      "Owner-representative oversight",
      "Schedule & budget control",
      "Risk-managed execution",
    ],
  },
  {
    title: "Government Building Construction & Tender Projects",
    description: "Proven public-sector delivery — tender submission, statutory compliance, CPWD standards, and transparent reporting for government infrastructure.",
    cta: "Explore Service",
    image: "/images/construction/our-work-premium-tower-dawn-04.webp",
    highlights: [
      "Tender submission & bid management",
      "CPWD & public works compliance",
      "Statutory clearances & reporting",
      "Public-sector infrastructure delivery",
    ],
    benefits: [
      "Proven public-sector experience",
      "Transparent reporting",
      "Regulatory compliance expertise",
    ],
  },
  {
    title: "Mega Structure Projects & Infrastructure Development",
    description: "Large-scale delivery for industrial campuses, infrastructure corridors, and master-planned developments with advanced program management.",
    cta: "Explore Service",
    image: "/images/construction/our-work-finished-industrial-campus-13.webp",
    highlights: [
      "Industrial campus development",
      "Infrastructure corridor projects",
      "Master-planned communities",
      "Advanced program management",
    ],
    benefits: [
      "Large-scale project capability",
      "Advanced project controls",
      "Multi-stakeholder coordination",
    ],
  },
  {
    title: "Building Renovation & Modernization",
    description: "Structural retrofitting, façade upgrades, MEP modernisation, and interior remodelling — extending building life and meeting current standards.",
    cta: "Explore Service",
    image: "/images/construction/our-work-finished-commercial-office-10.webp",
    highlights: [
      "Structural strengthening & retrofitting",
      "Building façade & envelope upgrades",
      "Interior renovation & remodeling",
      "MEP system upgrades",
    ],
    benefits: [
      "Structural integrity improvement",
      "Code compliance upgrades",
      "Minimal disruption approach",
    ],
  },
  {
    title: "Interior Fit-Out & Execution Works",
    description: "Design-driven interiors for offices, retail, hospitality, and residences — blending aesthetics with functional space planning.",
    cta: "Explore Service",
    image: "/images/construction/our-work-finished-luxury-interior-11.webp",
    highlights: [
      "Office & corporate interiors",
      "Retail & hospitality fit-outs",
      "Residential interior design",
      "Custom joinery & furniture",
    ],
    benefits: [
      "Design-driven interiors",
      "Functional space planning",
      "Quality material sourcing",
    ],
  },
  {
    title: "Landscape Construction Works",
    description: "Hardscapes, softscapes, garden development, irrigation systems, outdoor lighting, and site furnishings for all project types.",
    cta: "Explore Service",
    image: "/images/construction/service-building-materials.webp",
    highlights: [
      "Hardscape & softscape development",
      "Garden & irrigation systems",
      "Outdoor lighting & site furnishings",
      "Landscape drainage solutions",
    ],
    benefits: [
      "Integrated landscape design",
      "Sustainable outdoor spaces",
      "Complete site furnishing",
    ],
  },
  {
    title: "Land & Building Survey Works",
    description: "Topographic surveys, boundary demarcation, GPS positioning, drone surveying, and as-built documentation for accurate baselines.",
    cta: "Explore Service",
    image: "/images/construction/our-work-premium-handover-lobby-06.webp",
    highlights: [
      "Topographic & boundary surveys",
      "GPS & drone surveying",
      "Construction layout & control",
      "As-built documentation",
    ],
    benefits: [
      "High-accuracy survey data",
      "Regulatory compliance",
      "Precision construction layout",
    ],
  },
  {
    title: "Soil Testing & Geotechnical Investigation",
    description: "Borehole drilling, soil sampling, laboratory testing, bearing capacity analysis, and foundation recommendations for site conditions.",
    cta: "Explore Service",
    image: "/images/construction/our-work-premium-infra-viaduct-05.webp",
    highlights: [
      "Borehole drilling & soil sampling",
      "Laboratory soil testing",
      "Foundation & bearing capacity analysis",
      "Slope stability & earth retention",
    ],
    benefits: [
      "Site-specific geotechnical data",
      "Risk mitigation",
      "Optimized foundation design",
    ],
  },
  {
    title: "Building Stability Testing & Structural Assessment",
    description: "Load capacity analysis, seismic vulnerability assessment, non-destructive testing, and condition surveys for existing structures.",
    cta: "Explore Service",
    image: "/images/construction/our-work-finished-commercial-office-10.webp",
    highlights: [
      "Structural load capacity analysis",
      "Seismic vulnerability assessment",
      "Non-destructive testing (NDT)",
      "Condition survey & repair recommendations",
    ],
    benefits: [
      "Structural safety assurance",
      "Risk-based recommendations",
      "Detailed assessment reports",
    ],
  },
  {
    title: "Labour Contract Services",
    description: "Skilled and semi-skilled workforce — masons, carpenters, steel fixers, plumbers, electricians, and supervisors with compliance management.",
    cta: "Explore Service",
    image: "/images/construction/our-work-finished-row-houses-12.webp",
    highlights: [
      "Skilled workforce supply",
      "Compliance & payroll management",
      "Safety training & supervision",
      "Project-based or ongoing staffing",
    ],
    benefits: [
      "Qualified & vetted workers",
      "Statutory compliance",
      "Flexible deployment models",
    ],
  },
  {
    title: "Turf Construction & Sports Infrastructure",
    description: "Synthetic and natural turf, courts, athletic tracks, playgrounds, and multi-sport facilities for educational and recreational use.",
    cta: "Explore Service",
    image: "/images/construction/service-turf-sports.webp",
    highlights: [
      "Synthetic & natural turf fields",
      "Basketball & tennis courts",
      "Athletic tracks & playgrounds",
      "Multi-sport facility design",
    ],
    benefits: [
      "Sports-grade construction",
      "Multi-sport functionality",
      "Durable, low-maintenance surfaces",
    ],
  },
  {
    title: "Electrical Engineering Works",
    description: "HT and LT power distribution, lighting design, earthing systems, backup power, and electrical safety systems for all building types.",
    cta: "Explore Service",
    image: "/images/construction/our-work-finished-apartment-09.webp",
    highlights: [
      "HT/LT power distribution",
      "Lighting design & controls",
      "Earthing & lightning protection",
      "Backup power & UPS systems",
    ],
    benefits: [
      "Comprehensive electrical design",
      "Energy-efficient systems",
      "Safety-compliant installations",
    ],
  },
  {
    title: "Plumbing & Water Management Systems",
    description: "Water supply, drainage networks, sewage treatment, rainwater harvesting, and fire-fighting plumbing for all project types.",
    cta: "Explore Service",
    image: "/images/construction/service-plumbing-water-management.webp",
    highlights: [
      "Water supply & distribution",
      "Drainage & sewage systems",
      "Rainwater harvesting solutions",
      "Fire-fighting plumbing systems",
    ],
    benefits: [
      "Complete water management",
      "Sustainable system design",
      "Code-compliant installations",
    ],
  },
  {
    title: "Swimming Pool Construction",
    description: "Structural design, waterproofing, filtration systems, tiling, decking, and safety features for residential, commercial, and hospitality pools.",
    cta: "Explore Service",
    image: "/images/construction/service-swimming-pool.webp",
    highlights: [
      "Structural pool design & construction",
      "Filtration & circulation systems",
      "Waterproofing & tiling",
      "Decking, lighting & safety features",
    ],
    benefits: [
      "Custom pool design",
      "Premium waterproofing",
      "Integrated safety systems",
    ],
  },
  {
    title: "Lift & Elevator Execution Services",
    description: "Design, procurement, installation, testing, and maintenance of passenger elevators, service lifts, and escalators.",
    cta: "Explore Service",
    image: "/images/construction/service-lift-elevator.webp",
    highlights: [
      "Passenger & service elevators",
      "Escalators & moving walkways",
      "Elevator modernization & upgrades",
      "Annual maintenance contracts (AMC)",
    ],
    benefits: [
      "Certified installation team",
      "Brand-agnostic solutions",
      "Comprehensive maintenance",
    ],
  },
  {
    title: "Painting & Finishing Works",
    description: "Interior and exterior painting, putty, texture finishes, waterproof coatings, and industrial-grade paint systems.",
    cta: "Explore Service",
    image: "/images/construction/service-painting-finishing.webp",
    highlights: [
      "Interior painting & textures",
      "Exterior & waterproof coatings",
      "Industrial paint systems",
      "Decorative & specialty finishes",
    ],
    benefits: [
      "High-quality finishes",
      "Durable coating systems",
      "Color-matched execution",
    ],
  },
  {
    title: "Tiles & Stone Installation Works",
    description: "Ceramic, porcelain, vitrified, granite, marble, and engineered stone installation for floors, walls, cladding, and features.",
    cta: "Explore Service",
    image: "/images/construction/service-tiles-stone.webp",
    highlights: [
      "Floor & wall tiling",
      "Natural stone & marble installation",
      "Cladding & feature walls",
      "Skirting, borders & patterns",
    ],
    benefits: [
      "Skilled installation team",
      "Premium material handling",
      "Precision alignment & finishing",
    ],
  },
  {
    title: "Building Material & Product Sourcing",
    description: "Cement, steel, aggregate, specialised finishes, MEP equipment, and fixtures — sourced with quality assurance and competitive pricing.",
    cta: "Explore Service",
    image: "/images/construction/service-building-materials.webp",
    highlights: [
      "Cement, steel & aggregate supply",
      "Finishing materials & specialties",
      "MEP equipment & fixtures",
      "Vendor evaluation & procurement",
    ],
    benefits: [
      "Quality-assured materials",
      "Competitive pricing",
      "Reliable supply chain",
    ],
  },
  {
    title: "Building Approval & Compliance Services",
    description: "Statutory permits, building plan sanctions, environmental clearances, fire approvals, and occupancy certificates — end-to-end managed.",
    cta: "Explore Service",
    image: "/images/construction/service-approval-compliance.webp",
    highlights: [
      "Building plan sanctions & permits",
      "Environmental & fire clearances",
      "Occupancy certificates",
      "Compliance audits & liaison",
    ],
    benefits: [
      "End-to-end approvals management",
      "Regulatory expertise",
      "Time-efficient processing",
    ],
  },
];

export default function ConstructionServicesPage() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll<HTMLElement>(".service-card");
      if (!cards?.length) return;

      gsap.fromTo(
        cards,
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        },
      );
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-white text-[#1A1A1A]">
      <ConstructionNavbar />

      {/* HERO */}
      <section className="relative h-[75vh] min-h-[460px] overflow-hidden">
        <div className="absolute inset-0 h-[110%] w-full">
          <Image
            src="/images/construction/construction-service-command-center-construction-india-commercial-tower-01.webp"
            alt="Ractysh Construction Services"
            fill
            className="object-cover"
            sizes="100vw"
            priority
            quality={90}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-white" />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-6 pb-16 sm:px-10">
          <div className="max-w-2xl">
            <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
              <Link
                href="/#services"
                className="inline-flex items-center gap-1.5 font-semibold text-white/60 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Services
              </Link>
              <span className="text-white/30" aria-hidden="true">/</span>
              <Link
                href={`/construction-services/${toSlug(services[services.length - 1].title)}`}
                className="font-semibold text-white/60 transition-colors hover:text-white"
              >
                {services[services.length - 1].title}
              </Link>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
              Construction & Engineering
            </p>
            <h1 className="mt-4 text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              25 services.<br />
              <span className="text-[#C4A87C]">One standard.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
              Every capability we offer, delivered with the same commitment to
              quality, schedule, and transparency.
            </p>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="border-y border-[#E8E5E0] bg-white px-6 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold tracking-tight text-[#C4A87C] sm:text-4xl lg:text-5xl">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1.5 text-sm font-medium text-[#6B6560] sm:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION HEADER */}
      <section className="px-6 pt-28 pb-4 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C4A87C]">
              Complete portfolio
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Construction &<br />Engineering Services
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#6B6560]">
              From foundation engineering to interior finishing, explore all 25
              services that make Ractysh a single-partner construction solution.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICE GRID */}
      <section className="px-6 py-14 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div ref={gridRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((svc) => (
              <ServiceCard key={svc.title} service={svc} />
            ))}
          </div>
        </div>
      </section>

      {/* BACK TO SERVICES — end of listing */}
      <section className="px-6 py-8 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/#services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8B6B4A] transition-colors hover:text-[#1A1A1A]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-2xl bg-[#1A1A1A] px-8 py-20 sm:px-16 sm:py-28">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(196,168,124,0.08),transparent_60%)]" />
            <div className="relative mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C4A87C]">
                Start your project
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Need a custom construction solution?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/60">
                Consult with our engineering and project delivery team.
              </p>
              <Link
                href="/#contact"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#C4A87C] px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                Request Consultation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-black">
        <ConstructionFooter />
      </div>
    </main>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const extraRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const enterTl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const extra = extraRef.current;
    const cta = ctaRef.current;
    const img = imgRef.current?.querySelector("img");

    const killEnter = () => {
      if (enterTl.current) {
        enterTl.current.progress(1);
        enterTl.current.kill();
        enterTl.current = null;
      }
    };

    const enter = () => {
      killEnter();

      const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power3.out", overwrite: "auto" } });

      // Step 1: Card lifts
      tl.to(card, { y: -8, boxShadow: "0 24px 64px -16px rgba(0,0,0,0.18)", borderColor: "#C4A87C", duration: 0.45 }, 0);

      // Step 2: Image zoom
      if (img) {
        tl.to(img, { scale: 1.08, duration: 0.6, ease: "power2.out" }, 0.05);
      }

      // Step 3: Overlay darken
      if (overlayRef.current) {
        tl.to(overlayRef.current, { opacity: 0.6, duration: 0.45 }, 0.08);
      }

      // Step 4: Extra content slides up
      if (extra) {
        tl.fromTo(
          extra,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.5 },
          0.12,
        );
      }

      // Step 5: CTA fades + slides in
      if (cta) {
        tl.fromTo(
          cta,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45 },
          0.18,
        );
      }

      enterTl.current = tl;
    };

    const leave = () => {
      if (enterTl.current) {
        enterTl.current.progress(1);
        enterTl.current.kill();
        enterTl.current = null;
      }

      const tl = gsap.timeline({ defaults: { duration: 0.4, ease: "power3.out", overwrite: "auto" } });

      // Reverse: CTA out first
      if (cta) {
        tl.to(cta, { y: 12, opacity: 0, duration: 0.3 }, 0);
      }

      // Extra content collapse
      if (extra) {
        tl.to(extra, { height: 0, opacity: 0, duration: 0.35 }, 0.03);
      }

      // Overlay lighten
      if (overlayRef.current) {
        tl.to(overlayRef.current, { opacity: 0.15, duration: 0.35 }, 0.06);
      }

      // Image zoom out
      if (img) {
        tl.to(img, { scale: 1, duration: 0.45, ease: "power2.out" }, 0.08);
      }

      // Card returns
      tl.to(card, { y: 0, boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)", borderColor: "#E8E5E0", duration: 0.4 }, 0.1);
    };

    card.addEventListener("mouseenter", enter);
    card.addEventListener("mouseleave", leave);

    return () => {
      card.removeEventListener("mouseenter", enter);
      card.removeEventListener("mouseleave", leave);
      killEnter();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="service-card flex flex-col overflow-hidden rounded-xl border border-[#E8E5E0] bg-white will-change-transform"
      style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)" }}
    >
      <div ref={imgRef} className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[16/9]">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover will-change-transform"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={80}
        />
        <div
          ref={overlayRef}
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
            opacity: 0.15,
          }}
        />
      </div>

      <div ref={contentRef} className="flex flex-1 flex-col justify-between px-5 py-5 sm:px-6">
        <div>
          <h3 className="text-base font-bold leading-snug sm:text-lg">
            {service.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#6B6560] line-clamp-3">
            {service.description}
          </p>
        </div>
      </div>

      {/* Extra details — revealed on hover */}
      <div ref={extraRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <div className="border-t border-[#E8E5E0] bg-[#FAF8F5] px-5 py-5 sm:px-6">
          {service.highlights && service.highlights.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#8B6B4A]">
                Key Highlights
              </p>
              <ul className="space-y-1.5">
                {service.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-[#1A1A1A]">
                    <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C4A87C]" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {service.benefits && service.benefits.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#8B6B4A]">
                Benefits
              </p>
              <ul className="space-y-1.5">
                {service.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-[#1A1A1A]">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C4A87C]" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* CTA — revealed on hover */}
      <div ref={ctaRef} className="overflow-hidden px-5 pb-5 sm:px-6" style={{ opacity: 0 }}>
        <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C4A87C]">
          {service.cta} <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
