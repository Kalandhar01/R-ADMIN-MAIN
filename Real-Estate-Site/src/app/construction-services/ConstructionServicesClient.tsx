"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Building2, ChevronRight, HardHat, MapPin, Shield, Target, Trophy, Users } from "lucide-react";
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { GridScan } from "@/components/GridScan";

gsap.registerPlugin(ScrollTrigger);

const editorialEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const stats = [
  { value: 250, suffix: "+", label: "Projects Delivered" },
  { value: 25, suffix: "+", label: "Integrated Services" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: 10, suffix: "+", label: "Years Experience" }
];

const showcaseItems: Array<{
  title: string;
  description: string;
  size: "large" | "medium" | "small";
  image: string;
  features?: string[];
}> = [
  {
    title: "Commercial Construction",
    description: "High-rise towers, corporate campuses, retail destinations and mixed-use developments engineered for landmark performance.",
    size: "large",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    features: ["High-Rise Towers", "Corporate Campuses", "Retail Destinations", "Mixed-Use Developments"]
  },
  {
    title: "Residential Construction",
    description: "Luxury residences, premium apartments and gated communities crafted with architectural distinction.",
    size: "medium",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"
  },
  {
    title: "Turnkey Projects",
    description: "End-to-end project delivery from concept to handover, managing every discipline with single-point accountability.",
    size: "medium",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&q=80"
  },
  {
    title: "Civil Engineering",
    description: "Structural design, geotechnical solutions and infrastructure engineering for complex built environments.",
    size: "small",
    image: "https://images.unsplash.com/photo-1590674899484-d5640f8542e8?w=400&q=80"
  },
  {
    title: "MEP Engineering",
    description: "Mechanical, electrical and plumbing systems engineered for efficiency, sustainability and occupant comfort.",
    size: "small",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80"
  },
  {
    title: "Project Management",
    description: "Integrated PMC services ensuring cost, quality and schedule certainty across every project phase.",
    size: "small",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80"
  }
];

const capabilities: Array<{
  category: string;
  description: string;
  details: string[];
  image: string;
}> = [
  { category: "Architecture", description: "Design-led architectural solutions for landmark built environments.", details: ["Master Planning", "Concept Design", "Detailed Design", "VDC/BIM Integration", "Sustainability Consulting"], image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&q=80" },
  { category: "Engineering", description: "Structural, civil and MEP engineering for complex projects.", details: ["Structural Engineering", "Geotechnical Engineering", "MEP Engineering", "Civil Infrastructure", "Value Engineering"], image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80" },
  { category: "Construction", description: "End-to-end construction delivery with quality assurance.", details: ["General Contracting", "Design-Build", "Construction Management", "Quality Control", "Safety Management"], image: "https://images.unsplash.com/photo-1541888946425-d81bb56bcd6b?w=400&q=80" },
  { category: "PMC", description: "Professional management consulting for project excellence.", details: ["Project Planning", "Cost Management", "Schedule Control", "Risk Management", "Contract Administration"], image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80" },
  { category: "Infrastructure", description: "Large-scale infrastructure development and execution.", details: ["Transportation", "Utilities", "Public Realm", "Smart Infrastructure", "Sustainability"], image: "https://images.unsplash.com/photo-1590674899484-d5640f8542e8?w=400&q=80" },
  { category: "Government Projects", description: "Public sector infrastructure and institutional buildings.", details: ["Government Buildings", "Public Infrastructure", "Institutional", "Healthcare", "Education"], image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80" },
  { category: "Industrial Projects", description: "Industrial facilities engineered for operational excellence.", details: ["Manufacturing Plants", "Warehouses", "Industrial Parks", "Processing Facilities", "Logistics Hubs"], image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80" },
  { category: "Commercial Projects", description: "Commercial developments for business and enterprise.", details: ["Office Buildings", "Retail Centers", "Hotels", "Mixed-Use", "Commercial Complexes"], image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80" },
  { category: "Residential Projects", description: "Premium residential communities and luxury homes.", details: ["Luxury Homes", "Apartments", "Gated Communities", "Villa Developments", "Row Houses"], image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80" }
];

const featuredProjects = [
  { title: "Riverside Corporate Tower", category: "Commercial", scope: "Design & Build", location: "Chennai", value: "₹420 Cr", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" },
  { title: "Green Valley Residences", category: "Residential", scope: "General Contracting", location: "Coimbatore", value: "₹180 Cr", image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80" },
  { title: "Tech Park Campus", category: "Commercial", scope: "Design-Build", location: "Chennai", value: "₹650 Cr", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" },
  { title: "Lakefront Luxury Villas", category: "Residential", scope: "Turnkey", location: "Coimbatore", value: "₹95 Cr", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80" },
  { title: "Industrial Logistics Hub", category: "Industrial", scope: "PMC", location: "Dindigul", value: "₹280 Cr", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80" },
  { title: "Seaside Mixed-Use Development", category: "Mixed-Use", scope: "Design & Build", location: "Chennai", value: "₹510 Cr", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80" }
];

const servicesAccordion: Array<{
  title: string;
  description: string;
  image: string;
  details: string[];
}> = [
  { title: "Commercial Construction", description: "High-performance commercial environments engineered for business excellence, brand presence and operational efficiency.", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80", details: ["High-Rise Commercial Towers", "Corporate Headquarters", "Retail & Mixed-Use", "Hospitality & Leisure", "Data Centers"] },
  { title: "Residential Construction", description: "Premium living environments defined by architectural quality, spatial intelligence and enduring materiality.", image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80", details: ["Luxury Apartment Complexes", "Gated Communities", "Premium Villas", "Row House Developments", "Affordable Housing"] },
  { title: "Industrial & Infrastructure", description: "Large-scale industrial and infrastructure projects delivered with engineering precision and schedule certainty.", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80", details: ["Manufacturing Facilities", "Warehousing & Logistics", "Industrial Parks", "Transportation Infrastructure", "Utilities & Energy"] },
  { title: "Interior & Fit-Out", description: "Complete interior fit-out solutions for commercial, residential and hospitality spaces.", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80", details: ["Corporate Interiors", "Retail Fit-Out", "Hospitality Design", "Residential Interiors", "Turnkey Solutions"] },
  { title: "PMC & Advisory", description: "Integrated project management and construction advisory services for assured delivery outcomes.", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80", details: ["Project Management", "Cost Consulting", "Schedule Management", "Risk Advisory", "Due Diligence"] }
];

const whyChooseUs = [
  { title: "Engineering Excellence", description: "Our engineering team brings deep expertise across structural, civil, MEP and geotechnical disciplines, ensuring every project rests on a foundation of technical rigour.", icon: "Trophy", image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&q=80" },
  { title: "Construction Quality", description: "We enforce rigorous quality management systems across every phase, from material procurement to final handover, with zero compromise on standards.", icon: "Shield", image: "https://images.unsplash.com/photo-1541888946425-d81bb56bcd6b?w=600&q=80" },
  { title: "Technical Precision", description: "Advanced BIM, VDC and digital twin technologies enable us to simulate, validate and execute with millimetre-level accuracy.", icon: "Target", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80" },
  { title: "Timely Delivery", description: "Our integrated project control systems track every milestone, resource and dependency to deliver on schedule, every time.", icon: "HardHat", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80" },
  { title: "Safety Standards", description: "Industry-leading safety protocols, training and monitoring systems create a zero-incident culture across all our project sites.", icon: "Users", image: "https://images.unsplash.com/photo-1590674899484-d5640f8542e8?w=600&q=80" },
  { title: "Sustainability", description: "We integrate green building practices, energy-efficient systems and sustainable material selection into every project we undertake.", icon: "Building2", image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=80" }
];

const processSteps = [
  { step: "01", title: "Consultation", description: "Deep discovery of project vision, requirements, constraints and success criteria through structured stakeholder engagement." },
  { step: "02", title: "Site Survey", description: "Comprehensive site analysis including geotechnical investigation, topographical mapping and environmental assessment." },
  { step: "03", title: "Engineering", description: "Detailed structural, civil and MEP engineering with BIM integration for precise coordination and clash detection." },
  { step: "04", title: "Approvals", description: "Regulatory approvals, environmental clearances and statutory compliance managed through established government relationships." },
  { step: "05", title: "Construction", description: "Site execution with lean construction methodologies, quality control and safety management systems." },
  { step: "06", title: "Quality Control", description: "Multi-stage inspection, material testing and commissioning protocols ensuring every deliverable meets specification." },
  { step: "07", title: "Handover", description: "Structured handover process including documentation, training, warranties and post-occupancy support." }
];

const iconMap: Record<string, ReactNode> = {
  Trophy: <Trophy size={20} />,
  Shield: <Shield size={20} />,
  Target: <Target size={20} />,
  HardHat: <HardHat size={20} />,
  Users: <Users size={20} />,
  Building2: <Building2 size={20} />
};

function useScrollReveal(reduced: boolean) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { opacity: 0, y: 40, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: editorialEase as unknown as gsap.EaseString, scrollTrigger: { trigger: el, start: "top 82%", once: true } });
    }, el);
    return () => ctx.revert();
  }, [reduced]);
  return ref;
}

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.fromTo(el, { textContent: 0 }, {
            textContent: value,
            duration: 1.5,
            ease: "power3.out",
            snap: { textContent: 1 },
            onUpdate: () => { el.textContent = `${Math.round(Number(el.textContent))}${suffix}`; }
          });
        }
      });
    }, el);
    return () => ctx.revert();
  }, [value, suffix, reduced]);
  return <span ref={ref}>0{suffix}</span>;
}

function StatCard({ value, suffix, label, index }: { value: number; suffix: string; label: string; index: number }) {
  const ref = useScrollReveal(false);
  return (
    <div ref={ref} className="cs-stat-card" style={{ transitionDelay: `${index * 80}ms` } as CSSProperties}>
      <strong className="cs-stat-value"><AnimatedCounter value={value} suffix={suffix} /></strong>
      <span className="cs-stat-label">{label}</span>
    </div>
  );
}

function ServiceCard({ item, index }: { item: typeof showcaseItems[0]; index: number }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const ref = useScrollReveal(false);
  return (
    <article ref={ref} className={cn("cs-showcase-card", `cs-showcase-card--${item.size}`)} style={{ transitionDelay: `${index * 100}ms` } as CSSProperties}>
      <div className="cs-showcase-card-media">
        <img src={item.image} alt={item.title} loading="lazy" onLoad={() => setImgLoaded(true)} className={cn(imgLoaded ? "loaded" : "")} />
        <div className="cs-showcase-card-overlay" />
      </div>
      <div className="cs-showcase-card-content">
        <h3 className="cs-showcase-card-title">{item.title}</h3>
        <p className="cs-showcase-card-desc">{item.description}</p>
        {item.features ? (
          <div className="cs-showcase-card-features">
            {item.features.map((f) => <span key={f} className="cs-showcase-card-feature">{f}</span>)}
          </div>
        ) : null}
        <span className="cs-showcase-card-cta">Explore <ArrowRight size={14} /></span>
      </div>
    </article>
  );
}

function CapabilityCard({ item, index, active, onHover }: {
  item: typeof capabilities[0];
  index: number;
  active: boolean;
  onHover: () => void;
}) {
  return (
    <motion.div
      className={cn("cs-capability-card", active && "active")}
      onMouseEnter={onHover}
      layout
      transition={{ duration: 0.5, ease: editorialEase }}
    >
      <motion.div layout className="cs-capability-card-header">
        <span className="cs-capability-index">{String(index + 1).padStart(2, "0")}</span>
        <h3 className="cs-capability-title">{item.category}</h3>
        <ChevronRight size={16} className="cs-capability-arrow" />
      </motion.div>
      <AnimatePresence>
        {active ? (
          <motion.div
            className="cs-capability-card-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: editorialEase }}
          >
            <p className="cs-capability-desc">{item.description}</p>
            <div className="cs-capability-details">
              {item.details.map((d) => <span key={d} className="cs-capability-detail">{d}</span>)}
            </div>
            <div className="cs-capability-image">
              <img src={item.image} alt={item.category} loading="lazy" />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

function FeaturedProjectCard({ project, index }: { project: typeof featuredProjects[0]; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el.querySelector(".cs-featured-project-image img"), { scale: 1.12 }, { scale: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: el.closest(".cs-featured-track"), start: "left center", end: "right center", scrub: 0.5 } });
    }, el);
    return () => ctx.revert();
  }, [reduced]);
  return (
    <article ref={ref} className="cs-featured-project">
      <div className="cs-featured-project-image">
        <img src={project.image} alt={project.title} loading={index < 3 ? "eager" : "lazy"} />
      </div>
      <div className="cs-featured-project-content">
        <div className="cs-featured-project-meta">
          <span className="cs-featured-project-category">{project.category}</span>
          <span className="cs-featured-project-scope">{project.scope}</span>
        </div>
        <h3 className="cs-featured-project-title">{project.title}</h3>
        <div className="cs-featured-project-footer">
          <span className="cs-featured-project-location"><MapPin size={14} /> {project.location}</span>
          <span className="cs-featured-project-value">{project.value}</span>
        </div>
      </div>
    </article>
  );
}

function ServiceAccordionItem({ item, index, active, onToggle }: {
  item: typeof servicesAccordion[0];
  index: number;
  active: boolean;
  onToggle: () => void;
}) {
  const ref = useScrollReveal(false);
  return (
    <div ref={ref} className={cn("cs-accordion-item", active && "active")} style={{ transitionDelay: `${index * 80}ms` } as CSSProperties}>
      <button className="cs-accordion-trigger" onClick={onToggle} type="button">
        <span className="cs-accordion-index">{String(index + 1).padStart(2, "0")}</span>
        <h3 className="cs-accordion-title">{item.title}</h3>
        <motion.span
          className="cs-accordion-icon"
          animate={{ rotate: active ? 45 : 0 }}
          transition={{ duration: 0.3, ease: editorialEase }}
        >
          <ChevronRight size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {active ? (
          <motion.div
            className="cs-accordion-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: editorialEase }}
          >
            <div className="cs-accordion-body">
              <div className="cs-accordion-text">
                <p className="cs-accordion-desc">{item.description}</p>
                <ul className="cs-accordion-details">
                  {item.details.map((d) => <li key={d}>{d}</li>)}
                </ul>
              </div>
              <div className="cs-accordion-image">
                <img src={item.image} alt={item.title} loading="lazy" />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ProcessStepCard({ item, index }: { item: typeof processSteps[0]; index: number }) {
  const ref = useScrollReveal(false);
  return (
    <div ref={ref} className="cs-process-step" style={{ transitionDelay: `${index * 100}ms` } as CSSProperties}>
      <div className="cs-process-step-number">{item.step}</div>
      <div className="cs-process-step-content">
        <h3 className="cs-process-step-title">{item.title}</h3>
        <p className="cs-process-step-desc">{item.description}</p>
      </div>
      {index < processSteps.length - 1 ? <div className="cs-process-step-line" /> : null}
    </div>
  );
}

function WhyChooseUsCard({ item, index }: { item: typeof whyChooseUs[0]; index: number }) {
  const ref = useScrollReveal(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <article ref={ref} className="cs-why-card" style={{ transitionDelay: `${index * 100}ms` } as CSSProperties}>
      <div className="cs-why-card-media">
        <img src={item.image} alt={item.title} loading="lazy" onLoad={() => setImgLoaded(true)} className={cn(imgLoaded ? "loaded" : "")} />
      </div>
      <div className="cs-why-card-body">
        <span className="cs-why-card-icon">{iconMap[item.icon] || <Trophy size={20} />}</span>
        <h3 className="cs-why-card-title">{item.title}</h3>
        <p className="cs-why-card-desc">{item.description}</p>
      </div>
    </article>
  );
}

function useParallax(ref: React.RefObject<HTMLDivElement | null>, speed = 0.5) {
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      gsap.to(el, { yPercent: -10 * speed, ease: "none", scrollTrigger: { trigger: el.closest("[data-parallax-section]") || el.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 } });
    }, el);
    return () => ctx.revert();
  }, [ref, speed, reduced]);
}

export function ConstructionServicesClient() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroImageRef = useRef<HTMLDivElement | null>(null);
  const heroContentRef = useRef<HTMLDivElement | null>(null);
  const heroStatsRef = useRef<HTMLDivElement | null>(null);
  const featuredTrackRef = useRef<HTMLDivElement | null>(null);
  const featuredSectionRef = useRef<HTMLDivElement | null>(null);
  const processSectionRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const prefersReducedMotion = Boolean(reduced);
  const [activeCapability, setActiveCapability] = useState<number | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<number>(0);

  useParallax(heroImageRef, 0.4);

  useEffect(() => {
    if (prefersReducedMotion || !rootRef.current) return;
    const ctx = gsap.context(() => {
      const content = heroContentRef.current;
      if (content) {
        const lines = content.querySelectorAll("[data-hero-line]");
        gsap.fromTo(lines, { y: 60, opacity: 0, filter: "blur(10px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, stagger: 0.15, ease: "power4.out" });
        gsap.fromTo(content.querySelector("[data-hero-desc]"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.6, ease: "power3.out" });
        gsap.fromTo(content.querySelector("[data-hero-cta]"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.9, ease: "power3.out" });
      }

      gsap.utils.toArray<HTMLElement>(".cs-showcase-card").forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, delay: i * 0.1, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 85%", once: true } });
      });

      gsap.utils.toArray<HTMLElement>(".cs-process-step").forEach((step, i) => {
        gsap.fromTo(step, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.7, delay: i * 0.12, ease: "power3.out", scrollTrigger: { trigger: step, start: "top 80%", once: true } });
        if (i > 0) {
          gsap.fromTo(step.querySelector(".cs-process-step-line"), { scaleY: 0, transformOrigin: "top center" }, { scaleY: 1, duration: 0.6, delay: i * 0.12 + 0.3, ease: "power3.out", scrollTrigger: { trigger: step, start: "top 80%", once: true } });
        }
      });

      gsap.utils.toArray<HTMLElement>(".cs-why-card").forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, delay: i * 0.1, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 82%", once: true } });
        gsap.fromTo(card.querySelector("img"), { scale: 1.15 }, { scale: 1, duration: 0.6, delay: i * 0.1, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 82%", once: true } });
      });

      gsap.utils.toArray<HTMLElement>(".cs-capability-card").forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: i * 0.06, ease: "power3.out", scrollTrigger: { trigger: card.closest(".cs-capability-grid"), start: "top 75%", once: true } });
      });

      gsap.utils.toArray<HTMLElement>(".cs-accordion-item").forEach((item, i) => {
        gsap.fromTo(item, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: i * 0.08, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 82%", once: true } });
      });

      const processSection = processSectionRef.current;
      if (processSection) {
        gsap.fromTo(processSection.querySelector(".cs-section-header"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: processSection, start: "top 72%", once: true } });
      }

      gsap.utils.toArray<HTMLElement>(".cs-stat-card").forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: i * 0.12, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 85%", once: true } });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  useEffect(() => {
    const track = featuredTrackRef.current;
    const section = featuredSectionRef.current;
    if (prefersReducedMotion || !track || !section) return;
    const totalWidth = track.scrollWidth - section.clientWidth;
    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${totalWidth + section.clientHeight}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true
        }
      });
    }, featuredSectionRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  useEffect(() => {
    const heroStats = heroStatsRef.current;
    if (prefersReducedMotion || !heroStats) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(heroStats.querySelectorAll(".cs-stat-card"), { opacity: 0, y: 30, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, stagger: 0.12, delay: 1.4, ease: "power3.out" });
    }, heroStatsRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <main ref={rootRef} className="cs-page">
      <section className="cs-hero" data-parallax-section>
        <div className="cs-hero-bg">
          <GridScan
            lineThickness={0.5}
            linesColor="#c4b693"
            scanColor="#8d7542"
            scanOpacity={0.15}
            scanGlow={0.6}
            scanSoftness={4}
            gridScale={0.06}
            lineJitter={0.03}
            noiseIntensity={0.003}
            bloomIntensity={0.1}
            chromaticAberration={0.001}
            scanDuration={4}
            scanDelay={2}
            scanDirection="pingpong"
            sensitivity={0.7}
          />
        </div>
        <div className="cs-hero-overlay" />
        <div className="cs-hero-inner">
          <div ref={heroContentRef} className="cs-hero-content">
            <div className="cs-hero-badge">
              <span className="cs-hero-badge-dot" />
              Engineering the Future of Infrastructure
            </div>
            <h1 className="cs-hero-headline">
              <span className="cs-hero-headline-line" data-hero-line>Construction &</span>
              <span className="cs-hero-headline-line" data-hero-line>Engineering</span>
              <span className="cs-hero-headline-line cs-hero-headline-line--accent" data-hero-line>Excellence</span>
            </h1>
            <p className="cs-hero-desc" data-hero-desc>Integrated design, engineering and construction services delivering landmark projects across South India with world-class quality, safety and schedule certainty.</p>
            <div className="cs-hero-cta" data-hero-cta>
              <button type="button" className="cs-btn cs-btn-primary">Explore Our Capabilities <ArrowRight size={16} /></button>
              <button type="button" className="cs-btn cs-btn-secondary">View Projects</button>
            </div>
          </div>
          <div ref={heroStatsRef} className="cs-hero-stats">
            {stats.map((stat, i) => <StatCard key={stat.label} {...stat} index={i} />)}
          </div>
        </div>
      </section>

      <section className="cs-showcase" id="capabilities">
        <div className="cs-section-container">
          <div className="cs-section-header">
            <span className="cs-section-tag">Our Expertise</span>
            <h2 className="cs-section-title">Comprehensive Construction Capabilities</h2>
            <p className="cs-section-desc">From concept to completion, our integrated services span every discipline of the built environment.</p>
          </div>
          <div className="cs-showcase-grid">
            {showcaseItems.map((item, i) => <ServiceCard key={item.title} item={item} index={i} />)}
          </div>
        </div>
      </section>

      <section className="cs-capability" id="capability-matrix">
        <div className="cs-section-container">
          <div className="cs-section-header">
            <span className="cs-section-tag">Capability Matrix</span>
            <h2 className="cs-section-title">Integrated Delivery Capabilities</h2>
            <p className="cs-section-desc">A comprehensive spectrum of in-house expertise across every phase of project delivery.</p>
          </div>
          <div className="cs-capability-grid">
            {capabilities.map((item, i) => (
              <CapabilityCard key={item.category} item={item} index={i} active={activeCapability === i} onHover={() => setActiveCapability(i)} />
            ))}
          </div>
        </div>
      </section>

      <section className="cs-featured" ref={featuredSectionRef} id="projects">
        <div className="cs-featured-header">
          <div className="cs-section-container">
            <div className="cs-section-header">
              <span className="cs-section-tag">Featured Projects</span>
              <h2 className="cs-section-title">Landmark Developments</h2>
              <p className="cs-section-desc">Experience our portfolio of iconic projects delivered across South India.</p>
            </div>
          </div>
        </div>
        <div className="cs-featured-track-wrapper">
          <div ref={featuredTrackRef} className="cs-featured-track">
            {featuredProjects.map((project, i) => <FeaturedProjectCard key={project.title} project={project} index={i} />)}
            <div className="cs-featured-track-cta">
              <h3>View All Projects</h3>
              <span className="cs-featured-track-cta-icon"><ArrowRight size={24} /></span>
            </div>
          </div>
        </div>
      </section>

      <section className="cs-accordion-section" id="services">
        <div className="cs-section-container">
          <div className="cs-section-header">
            <span className="cs-section-tag">Our Services</span>
            <h2 className="cs-section-title">Integrated Service Categories</h2>
            <p className="cs-section-desc">Comprehensive construction and engineering services delivered through integrated project teams.</p>
          </div>
          <div className="cs-accordion">
            {servicesAccordion.map((item, i) => (
              <ServiceAccordionItem key={item.title} item={item} index={i} active={activeAccordion === i} onToggle={() => setActiveAccordion(activeAccordion === i ? -1 : i)} />
            ))}
          </div>
        </div>
      </section>

      <section className="cs-why" id="why-us">
        <div className="cs-section-container">
          <div className="cs-section-header" style={{ textAlign: "center" } as CSSProperties}>
            <span className="cs-section-tag">Why Ractysh</span>
            <h2 className="cs-section-title" style={{ maxWidth: "800px", margin: "12px auto 0" } as CSSProperties}>Engineering Excellence, Delivered</h2>
            <p className="cs-section-desc" style={{ maxWidth: "600px", margin: "16px auto 0" } as CSSProperties}>Six pillars that define our approach to every project we undertake.</p>
          </div>
          <div className="cs-why-grid">
            {whyChooseUs.map((item, i) => <WhyChooseUsCard key={item.title} item={item} index={i} />)}
          </div>
        </div>
      </section>

      <section className="cs-process" ref={processSectionRef} id="process">
        <div className="cs-section-container">
          <div className="cs-section-header">
            <span className="cs-section-tag">Our Process</span>
            <h2 className="cs-section-title">From Consultation to Handover</h2>
            <p className="cs-section-desc">A structured, transparent delivery methodology that ensures project certainty at every stage.</p>
          </div>
          <div className="cs-process-timeline">
            {processSteps.map((step, i) => <ProcessStepCard key={step.title} item={step} index={i} />)}
          </div>
        </div>
      </section>

      <section className="cs-cta-section">
        <div className="cs-section-container">
          <div className="cs-cta-inner">
            <h2 className="cs-cta-title">Ready to Build Your Vision?</h2>
            <p className="cs-cta-desc">From concept to completion, our team delivers construction excellence across every project.</p>
            <button type="button" className="cs-btn cs-btn-primary">Start Your Project <ArrowRight size={16} /></button>
          </div>
        </div>
      </section>

      <footer className="cs-footer">
        <div className="cs-section-container">
          <div className="cs-footer-inner">
            <div className="cs-footer-brand">
              <h3>Ractysh Construction</h3>
              <p>Engineering Excellence Since 1985</p>
            </div>
            <div className="cs-footer-links">
              <div>
                <h4>Services</h4>
                <a href="#capabilities">Commercial</a>
                <a href="#capabilities">Residential</a>
                <a href="#capabilities">Infrastructure</a>
                <a href="#capabilities">PMC</a>
              </div>
              <div>
                <h4>Company</h4>
                <a href="#projects">Projects</a>
                <a href="#why-us">Why Us</a>
                <a href="#process">Process</a>
              </div>
              <div>
                <h4>Contact</h4>
                <a href="mailto:construction@ractysh.com">construction@ractysh.com</a>
                <span>Coimbatore, Tamil Nadu</span>
              </div>
            </div>
            <div className="cs-footer-bottom">
              <p>Ractysh Construction & Engineering Division © 2026</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
