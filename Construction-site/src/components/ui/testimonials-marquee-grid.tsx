"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";
import { cn } from "@/lib/utils";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  image: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Ractysh gave our project a single rhythm. Approvals, vendor calls, drawing changes, and site movement finally stopped living in separate conversations.",
    name: "Arun Prakash",
    role: "Commercial Developer",
    image: "/images/construction/our-work-commercial-complex-site-01.webp",
  },
  {
    quote:
      "The updates were owner-friendly without losing site detail. We could see what was approved, what was blocked, and what needed a decision.",
    name: "Meera Nandakumar",
    role: "Project Investor",
    image: "/images/construction/construction-service-command-center-construction-india-commercial-tower-01.webp",
  },
  {
    quote:
      "Material movement, quality evidence, and handover risks were visible early, before they became expensive surprises.",
    name: "R. Karthik",
    role: "Operations Lead",
    image: "/images/construction/construction-service-command-center-construction-india-rebar-deck-02.webp",
  },
  {
    quote:
      "Contractor coordination felt calmer. Every escalation came with ownership, timing, and a clear next action.",
    name: "Fathima Noor",
    role: "Hospitality Owner",
    image: "/images/construction/our-work-commercial-complex-handover-03.webp",
  },
  {
    quote:
      "The closeout did not feel like a rush. Snags, documents, and readiness were tracked with the same seriousness as construction.",
    name: "Vikram S",
    role: "Facility Director",
    image: "/images/construction/home-service-construction-control-01.webp",
  },
  {
    quote:
      "For a multi-part infrastructure scope, Ractysh became the coordination layer between noise and measurable progress.",
    name: "Sanjay Iyer",
    role: "Infrastructure Consultant",
    image: "/images/construction/construction-service-command-center-construction-india-infrastructure-viaduct-03.webp",
  },
  {
    quote:
      "Weekly lookaheads became shorter and sharper because the blockers, decisions, and site priorities were already mapped.",
    name: "Leela Menon",
    role: "Client Representative",
    image: "/images/construction/business-division-construction-site-01.webp",
  },
  {
    quote:
      "Execution stayed measured even when vendor timelines shifted. The project still had one accountable control room.",
    name: "Naveen Raj",
    role: "Procurement Partner",
    image: "/images/construction/our-work-commercial-complex-structure-02.webp",
  },
];

export default function TestimonialsMarqueeGrid() {
  const firstRow = testimonials.slice(0, 4);
  const secondRow = testimonials.slice(4);

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fff7f7_52%,#ffffff_100%)] py-20 text-slate-950 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(248,113,113,0.18),transparent_34%),radial-gradient(circle_at_18%_60%,rgba(153,27,27,0.08),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(153,27,27,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:76px_76px] opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-10 h-64 w-[min(58rem,88vw)] -translate-x-1/2 rounded-full bg-white/65 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 text-center sm:px-10 lg:px-16">
        <p className="mx-auto mb-4 inline-flex rounded-full border border-red-200 bg-white/70 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-red-800 shadow-sm shadow-red-950/5 backdrop-blur-md">
          Project voices
        </p>
        <h2 className="mx-auto max-w-3xl text-balance text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
          What clients feel when the project has one clear command rhythm.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
          Owners, operators, consultants, and partners use Ractysh to keep
          scope, progress, approvals, and handover visible.
        </p>
      </div>

      <div className="relative mt-14 space-y-6">
        <MarqueeRow testimonials={firstRow} />
        <MarqueeRow testimonials={secondRow} direction="right" />
      </div>
    </section>
  );
}

function MarqueeRow({
  testimonials: rowTestimonials,
  direction = "left",
}: {
  testimonials: Testimonial[];
  direction?: "left" | "right";
}) {
  return (
    <div className="relative [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <Marquee
        direction={direction}
        pauseOnHover
        speed={34}
        gradient={false}
        className="py-1"
      >
        {rowTestimonials.map((testimonial) => (
          <TestimonialCard key={`${testimonial.name}-${testimonial.role}`} testimonial={testimonial} />
        ))}
      </Marquee>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure
      className={cn(
        "mx-3 h-[18rem] w-[min(82vw,24rem)] shrink-0 rounded-2xl border border-white/70 bg-white/62 p-5 text-left shadow-[0_24px_80px_rgba(127,29,29,0.08)] backdrop-blur-xl",
        "transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:bg-white/82",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-full border border-red-100 bg-red-50">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
        <div>
          <figcaption className="text-sm font-semibold text-slate-950">
            {testimonial.name}
          </figcaption>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-red-800/58">
            {testimonial.role}
          </p>
        </div>
      </div>
      <blockquote className="mt-7 text-sm leading-7 text-slate-600">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
    </figure>
  );
}
