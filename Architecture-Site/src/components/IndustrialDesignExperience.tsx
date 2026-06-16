"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, CalendarCheck, Factory, Map, Ruler, Send, ShieldCheck, Sparkles } from "lucide-react";
import { IndustrialFacilityScene } from "@/components/IndustrialFacilityScene";
import { OptimizedImage } from "@/components/OptimizedImage";

gsap.registerPlugin(ScrollTrigger);

const architectureTypologies = [
  {
    title: "Industrial campuses.",
    body: "Multi-building production environments organized around arrival, logistics, utility access and phased expansion."
  },
  {
    title: "Factories.",
    body: "Manufacturing spaces shaped through structural clarity, workflow intelligence and controlled service movement."
  },
  {
    title: "Warehouses.",
    body: "Large-span storage and fulfillment architecture designed for throughput, durability and operational rhythm."
  },
  {
    title: "Manufacturing facilities.",
    body: "Production floors, support blocks, quality zones and staff systems planned as one architectural organism."
  },
  {
    title: "Distribution centers.",
    body: "Logistics hubs with dock discipline, fleet movement, safety hierarchy and future capacity built into the plan."
  }
] as const;

const processSteps = ["Discovery", "Planning", "Operational Mapping", "3D Visualization", "Engineering Coordination", "Execution"] as const;

const works = [
  {
    label: "Industrial logistics centers",
    title: "Graphite Logistics Campus",
    scale: "Dock-led distribution architecture",
    body: "A full-width logistics environment planned around goods movement, queuing, service yards and long-term fleet expansion."
  },
  {
    label: "Manufacturing campuses",
    title: "Precision Works District",
    scale: "Production and support ecosystem",
    body: "A manufacturing campus where workflow mapping, staff movement, utilities and structural grids are coordinated before form is finalized."
  },
  {
    label: "Technology facilities",
    title: "Applied Technology Park",
    scale: "Research, assembly and enterprise frontage",
    body: "A facility language that combines industrial performance with a premium front-of-house identity for technical organizations."
  },
  {
    label: "Warehouses",
    title: "Long-Span Warehouse Hall",
    scale: "High-clearance industrial shell",
    body: "A durable warehouse model built around span efficiency, safety planning, material handling and expansion-ready planning."
  }
] as const;

const reasons = [
  { title: "Operational Efficiency", Icon: Factory },
  { title: "Future Expansion Planning", Icon: Map },
  { title: "Workflow Intelligence", Icon: Sparkles },
  { title: "Industrial Safety Planning", Icon: ShieldCheck },
  { title: "Enterprise Scale Design", Icon: Ruler }
] as const;

interface IndustrialDesignExperienceProps {
  consultationHref?: string;
  showLocalNav?: boolean;
}

export function IndustrialDesignExperience({ consultationHref = "#consultation-desk", showLocalNav = true }: IndustrialDesignExperienceProps) {
  const rootRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [deskSent, setDeskSent] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const shouldReduce = Boolean(reduceMotion) || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const revealItems = gsap.utils.toArray<HTMLElement>("[data-industrial-reveal]", root);
      const processItems = gsap.utils.toArray<HTMLElement>("[data-industrial-process-step]", root);
      const projectItems = gsap.utils.toArray<HTMLElement>("[data-industrial-project]", root);
      const processLine = root.querySelector<HTMLElement>("[data-industrial-process-line]");

      if (shouldReduce) {
        gsap.set([...revealItems, ...processItems, ...projectItems, processLine].filter(Boolean), { clearProps: "all" });
        return;
      }

      gsap.fromTo(
        "[data-industrial-hero-line]",
        { autoAlpha: 0, yPercent: 112, rotateX: -10, transformOrigin: "50% 100%" },
        { autoAlpha: 1, yPercent: 0, rotateX: 0, duration: 1.08, stagger: 0.1, ease: "power4.out" }
      );

      revealItems.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 58 },
          {
            opacity: 1,
            y: 0,
            duration: 1.05,
            ease: "power4.out",
            scrollTrigger: {
              trigger: item,
              start: "top 84%"
            }
          }
        );
      });

      if (processLine) {
        gsap.fromTo(
          processLine,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: processRef.current,
              start: "top 62%",
              end: "bottom 58%",
              scrub: 0.8
            }
          }
        );
      }

      processItems.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0.28, x: -24 },
          {
            opacity: 1,
            x: 0,
            duration: 0.74,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 72%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      projectItems.forEach((item) => {
        const visual = item.querySelector<HTMLElement>("[data-industrial-project-visual]");
        const copy = item.querySelector<HTMLElement>("[data-industrial-project-copy]");

        if (visual) {
          gsap.fromTo(
            visual,
            { scale: 1.08, xPercent: 3 },
            {
              scale: 1,
              xPercent: -3,
              ease: "none",
              scrollTrigger: {
                trigger: item,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.1
              }
            }
          );
        }

        if (copy) {
          gsap.fromTo(
            copy,
            { opacity: 0, y: 72 },
            {
              opacity: 1,
              y: 0,
              duration: 1.05,
              ease: "power4.out",
              scrollTrigger: {
                trigger: item,
                start: "top 62%"
              }
            }
          );
        }
      });
    }, root);

    return () => context.revert();
  }, [reduceMotion]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDeskSent(true);
  }

  return (
    <main ref={rootRef} className="industrial-design-page bg-[#050505] text-[#fbf8f2]">
      {showLocalNav ? (
        <nav className="industrial-nav fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-5 py-4 text-[#fbf8f2] sm:px-8 lg:px-12">
          <Link href="/" className="text-[0.72rem] font-semibold uppercase tracking-normal text-[#fbf8f2]/82">
            Ractysh Architecture
          </Link>
          <Link href={consultationHref} className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-normal text-[#c4a15b]">
            Industrial Desk
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </nav>
      ) : null}

      <section className="industrial-hero relative flex min-h-screen items-end overflow-hidden bg-[#050505]">
        <div className="absolute inset-0">
          <IndustrialFacilityScene reduceMotion={Boolean(reduceMotion)} />
        </div>
        <div className="industrial-hero-grid absolute inset-0" />
        <div className="industrial-hero-vignette absolute inset-0" />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px] flex-col justify-end px-5 pb-12 pt-28 sm:px-8 md:pb-16 lg:px-12">
          <div className="max-w-5xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-normal text-[#c4a15b]">Industrial Architecture</p>
            <h1
              aria-label="Industrial Design. Built For Scale, Precision And Performance."
              className="font-display text-[clamp(4.2rem,9vw,9.8rem)] font-semibold leading-[0.86] tracking-normal text-[#fbf8f2]"
            >
              <span data-industrial-hero-line className="block">
                Industrial Design.
              </span>
              <span data-industrial-hero-line className="block">
                Built For
              </span>
              <span data-industrial-hero-line className="block text-[#c4a15b]">
                Scale,
              </span>
              <span data-industrial-hero-line className="block">
                Precision
              </span>
              <span data-industrial-hero-line className="block">
                And Performance.
              </span>
            </h1>
          </div>

          <div className="mt-8 grid gap-6 border-t border-[#fbf8f2]/16 pt-6 md:grid-cols-[minmax(0,0.62fr)_auto] md:items-end">
            <p className="max-w-3xl text-base leading-8 text-[#ded2bf]/82 md:text-lg">
              Industrial facilities engineered through architectural intelligence, operational efficiency and long-term growth planning.
            </p>
            <Link href="#industrial-architecture" className="inline-flex w-fit items-center gap-3 border border-[#c4a15b]/54 px-5 py-3 text-sm font-semibold uppercase tracking-normal text-[#fbf8f2]">
              Explore
              <ArrowDown className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="industrial-architecture" className="industrial-editorial-section bg-[#fbf8f2] py-24 text-[#111214] sm:py-28 md:py-36">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.74fr_1.26fr] lg:px-12">
          <div className="lg:sticky lg:top-28 lg:h-fit" data-industrial-reveal>
            <p className="mb-4 text-xs font-semibold uppercase tracking-normal text-[#8a6c32]">Industrial Architecture</p>
            <h2 className="font-display text-5xl font-semibold leading-none tracking-normal sm:text-6xl md:text-8xl">
              Large systems designed with architectural intelligence.
            </h2>
          </div>
          <div className="divide-y divide-[#111214]/12">
            {architectureTypologies.map((item) => (
              <article key={item.title} className="grid gap-5 py-9 first:pt-0 md:grid-cols-[0.72fr_1fr] md:py-12" data-industrial-reveal>
                <h3 className="font-display text-4xl font-semibold leading-none tracking-normal text-[#111214] sm:text-5xl">{item.title}</h3>
                <p className="max-w-2xl text-base leading-8 text-[#5d5a54] md:text-lg">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="industrial-model-section relative min-h-screen overflow-hidden bg-[#111214] py-20 text-[#fbf8f2] sm:py-24 md:py-32">
        <div className="mx-auto grid min-h-[82vh] max-w-[1500px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.38fr_0.62fr] lg:px-12">
          <div className="flex flex-col justify-between gap-8" data-industrial-reveal>
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-normal text-[#c4a15b]">3D Visualization Experience</p>
              <h2 className="font-display text-5xl font-semibold leading-none tracking-normal sm:text-6xl md:text-8xl">
                Interactive industrial model.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-8 text-[#ded2bf]/76">
              A full industrial complex appears in sequence: the ground plane, structural frame, steel roof system, facade envelope, glass panels, active lighting and final campus reveal.
            </p>
          </div>

          <div className="industrial-model-frame relative min-h-[34rem] overflow-hidden border border-[#fbf8f2]/12 bg-[#050505] shadow-[0_44px_140px_rgba(0,0,0,0.45)] md:min-h-[46rem]" data-industrial-reveal>
            <IndustrialFacilityScene reduceMotion={Boolean(reduceMotion)} loop />
            <div className="pointer-events-none absolute left-5 top-5 z-10 text-xs font-semibold uppercase tracking-normal text-[#c4a15b]">Live Model</div>
            <div className="pointer-events-none absolute bottom-5 left-5 right-5 z-10 h-px bg-[linear-gradient(90deg,rgba(196,161,91,0.8),rgba(251,248,242,0.18),transparent)]" />
          </div>
        </div>
      </section>

      <section ref={processRef} className="industrial-process-section bg-[#f1eadf] py-24 text-[#111214] sm:py-28 md:py-36">
        <div className="mx-auto grid max-w-[1320px] gap-14 px-5 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:px-12">
          <div className="lg:sticky lg:top-28 lg:h-fit" data-industrial-reveal>
            <p className="mb-4 text-xs font-semibold uppercase tracking-normal text-[#8a6c32]">Design Process</p>
            <h2 className="font-display text-5xl font-semibold leading-none tracking-normal sm:text-6xl md:text-8xl">
              From operational brief to execution intelligence.
            </h2>
          </div>

          <div className="relative pl-10 md:pl-14">
            <div className="absolute bottom-0 left-3 top-2 w-px bg-[#111214]/14 md:left-5" />
            <div className="absolute left-3 top-2 h-full w-px bg-[#c4a15b] md:left-5" data-industrial-process-line />
            <div className="space-y-10 md:space-y-14">
              {processSteps.map((step, index) => (
                <article key={step} className="relative" data-industrial-process-step>
                  <span className="absolute -left-[2.42rem] top-2 grid h-7 w-7 place-items-center border border-[#c4a15b]/70 bg-[#f1eadf] text-[10px] font-bold text-[#8a6c32] md:-left-[3.23rem]">
                    {index + 1}
                  </span>
                  <h3 className="font-display text-4xl font-semibold leading-none tracking-normal sm:text-5xl">{step}</h3>
                  {index < processSteps.length - 1 ? <ArrowDown className="mt-4 h-5 w-5 text-[#c4a15b]" aria-hidden="true" /> : null}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="industrial-works-section bg-[#050505] text-[#fbf8f2]" aria-label="Our industrial works">
        <div className="px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1440px]" data-industrial-reveal>
            <p className="mb-4 text-xs font-semibold uppercase tracking-normal text-[#c4a15b]">Our Industrial Works</p>
            <h2 className="max-w-5xl font-display text-5xl font-semibold leading-none tracking-normal sm:text-6xl md:text-8xl">
              Full-width project presentations for serious industrial programs.
            </h2>
          </div>
        </div>

        {works.map((project, index) => (
          <article key={project.title} className="industrial-work-presentation relative min-h-screen overflow-hidden" data-industrial-project>
            <div className="absolute inset-0" data-industrial-project-visual>
              <OptimizedImage
                src="/images/architecture/industrial-design/industrial-campus-architecture-site-01.webp"
                alt={`${project.title} industrial architecture campus presentation`}
                fill
                sizes="100vw"
                className="object-cover opacity-[0.72]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.9),rgba(5,5,5,0.52)_45%,rgba(5,5,5,0.18)),linear-gradient(180deg,rgba(5,5,5,0.12),rgba(5,5,5,0.78))]" />
            </div>
            <div className="relative z-10 mx-auto flex min-h-screen max-w-[1440px] items-end px-5 pb-16 pt-28 sm:px-8 md:pb-24 lg:px-12">
              <div className="max-w-3xl" data-industrial-project-copy>
                <p className="mb-5 text-xs font-bold uppercase tracking-normal text-[#c4a15b]">{project.label}</p>
                <h3 className="font-display text-5xl font-semibold leading-none tracking-normal sm:text-6xl md:text-8xl">{project.title}</h3>
                <div className="mt-8 grid gap-5 border-t border-[#fbf8f2]/16 pt-6 text-sm leading-6 text-[#ded2bf]/78 sm:grid-cols-3">
                  <p>0{index + 1}</p>
                  <p>{project.scale}</p>
                  <p>{project.body}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="industrial-why-section bg-[#fbf8f2] py-24 text-[#111214] sm:py-28 md:py-36">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="max-w-4xl" data-industrial-reveal>
            <p className="mb-4 text-xs font-semibold uppercase tracking-normal text-[#8a6c32]">Why Ractysh</p>
            <h2 className="font-display text-5xl font-semibold leading-none tracking-normal sm:text-6xl md:text-8xl">
              Enterprise-grade industrial design discipline.
            </h2>
          </div>
          <div className="mt-14 divide-y divide-[#111214]/12">
            {reasons.map(({ title, Icon }) => (
              <div key={title} className="grid items-center gap-6 py-8 md:grid-cols-[auto_1fr_auto]" data-industrial-reveal>
                <Icon className="h-6 w-6 text-[#8a6c32]" aria-hidden="true" />
                <h3 className="font-display text-4xl font-semibold leading-none tracking-normal sm:text-5xl">{title}</h3>
                <ArrowRight className="hidden h-5 w-5 text-[#c4a15b] md:block" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="consultation-desk" className="industrial-consultation-section bg-[#111214] py-24 text-[#fbf8f2] sm:py-28 md:py-36">
        <div className="mx-auto grid max-w-[1320px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:px-12">
          <div data-industrial-reveal>
            <p className="mb-4 text-xs font-semibold uppercase tracking-normal text-[#c4a15b]">Consultation Desk</p>
            <h2 className="font-display text-5xl font-semibold leading-none tracking-normal sm:text-6xl md:text-8xl">
              Premium industrial consultation section.
            </h2>
            <p className="mt-7 max-w-xl text-base leading-8 text-[#ded2bf]/72">
              Share the facility type, site scale, operational ambition and growth plan. Ractysh will frame the industrial design path from discovery to coordinated execution.
            </p>
          </div>

          <form className="industrial-consultation-desk" onSubmit={handleSubmit} data-industrial-reveal>
            <div className="industrial-desk-strip">
              <span>Industrial Brief</span>
              <span>Operational Review</span>
              <span>Director Desk</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span>Name</span>
                <input name="name" autoComplete="name" required placeholder="Principal contact" />
              </label>
              <label>
                <span>Facility Type</span>
                <select name="facilityType" defaultValue="Manufacturing campus">
                  <option>Manufacturing campus</option>
                  <option>Modern factory</option>
                  <option>Industrial warehouse</option>
                  <option>Logistics hub</option>
                  <option>Technology park</option>
                  <option>Production facility</option>
                </select>
              </label>
              <label>
                <span>Region</span>
                <input name="region" required placeholder="Site region or city" />
              </label>
              <label>
                <span>Timeline</span>
                <select name="timeline" defaultValue="Planning phase">
                  <option>Planning phase</option>
                  <option>Concept phase</option>
                  <option>Visualization phase</option>
                  <option>Engineering coordination</option>
                  <option>Execution phase</option>
                </select>
              </label>
              <label className="md:col-span-2">
                <span>Brief</span>
                <textarea name="brief" rows={4} placeholder="Site scale, process flow, logistics needs, workforce, utilities and expansion intent." />
              </label>
            </div>
            <button className="industrial-desk-action mt-7" type="submit">
              <CalendarCheck aria-hidden="true" />
              <span>{deskSent ? "Consultation Scheduled" : "Schedule Industrial Consultation"}</span>
              {deskSent ? <Send aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
