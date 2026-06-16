"use client";

import { MouseEvent } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import ArchitectureNav from "@/components/ArchitectureNav";
import ArchitectureFooter from "@/components/ArchitectureFooter";
import { servicesContent } from "@/lib/architecturePremiumContent";

const power4Out = [0.16, 1, 0.3, 1] as const;

const reveal: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: power4Out }
  }
};

const staggerReveal: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

const heroReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: power4Out }
  }
};

export default function ServicesPage() {
  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      event.preventDefault();
      window.location.href = "/" + href;
    }
  };

  return (
    <div className="architecture-site min-h-screen bg-white text-nearblack">
      <ArchitectureNav activeSection="services" />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-warm-100 py-32 pt-40 text-nearblack sm:py-40 sm:pt-48 lg:py-56 lg:pt-64">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(#111 0.5px, transparent 0.5px)", backgroundSize: "30px 30px" }}
        />
        <motion.div
          className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12"
          initial="hidden"
          animate="visible"
          variants={staggerReveal}
        >
          <motion.div variants={heroReveal}>
              <Link
              href="/#services"
              className="group inline-flex items-center gap-3 text-[0.65rem] font-black uppercase tracking-[0.4em] text-nearblack/40 transition-colors hover:text-nearblack"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </Link>
          </motion.div>

          <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-end">
            <motion.div variants={heroReveal}>
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-executive-red" />
                <p className="text-[0.7rem] font-black uppercase tracking-[0.4em] text-executive-red">
                  {servicesContent.kicker}
                </p>
              </div>
              <motion.h1 className="mt-8 font-display text-[3.5rem] font-light leading-[0.88] tracking-tighter sm:text-[5.5rem] lg:text-[7rem]">
                Fourteen <br />
                <span className="italic text-executive-red/80">Disciplines.</span>
              </motion.h1>
            </motion.div>
            <motion.div variants={heroReveal}>
              <p className="max-w-xl text-lg leading-relaxed text-nearblack/60 sm:text-xl">
                {servicesContent.body}
              </p>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-nearblack/40">
                Each service is delivered with the same rigour — from the first conversation to the final detail. Scroll to explore every discipline the studio offers.
              </p>
            </motion.div>
          </div>

          <motion.div
            className="mt-20 flex items-center gap-3 text-[0.6rem] font-black uppercase tracking-[0.4em] text-nearblack/20"
            variants={heroReveal}
          >
            <span>Scroll to Explore</span>
            <div className="h-px w-16 bg-nearblack/20" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-nearblack/5 bg-warm-100">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-8 px-5 py-12 sm:grid-cols-4 sm:px-8 lg:px-12">
          {[
            { value: "14", label: "Design Disciplines" },
            { value: "147+", label: "Projects Delivered" },
            { value: "21", label: "Cities Served" },
            { value: "12+", label: "Years Practice" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="font-display text-4xl font-light text-executive-red sm:text-5xl">{stat.value}</span>
              <p className="mt-2 text-[0.6rem] font-black uppercase tracking-[0.3em] text-nearblack/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Full Services Grid */}
      <section className="relative py-24 sm:py-32 lg:py-48" data-arch-section>
        <div className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "radial-gradient(#111 0.5px, transparent 0.5px)", backgroundSize: "30px 30px" }}
        />

        <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <motion.div
            className="mb-16 lg:mb-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerReveal}
          >
            <motion.p className="text-[0.7rem] font-black uppercase tracking-[0.4em] text-executive-red" variants={reveal}>
              Full Catalogue
            </motion.p>
            <motion.h2 className="mt-4 font-display text-4xl font-light leading-tight tracking-tight sm:text-5xl lg:text-6xl" variants={reveal}>
              Every service,<br />considered in full.
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={staggerReveal}
          >
            {servicesContent.items.map((service, index) => {
              let colSpan = "lg:col-span-4";
              if (index % 7 === 0) colSpan = "lg:col-span-8";
              if (index % 7 === 4) colSpan = "lg:col-span-8";

              return (
                <motion.div key={service.slug} className={colSpan} variants={reveal}>
                  <ServiceCard
                    index={index + 1}
                    title={service.title}
                    shortDescription={service.shortDescription}
                    image={service.image}
                    imageAlt={service.imageAlt}
                    description={service.description}
                    features={service.features}
                    cta={service.cta}
                    href="#architecture-consultation-desk"
                    onNavigate={handleNavigate}
                  />
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            className="mt-24 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={reveal}
          >
            <div className="mx-auto max-w-2xl">
              <p className="text-[0.7rem] font-black uppercase tracking-[0.4em] text-executive-red">Start Your Project</p>
              <h3 className="mt-4 font-display text-3xl font-light leading-tight text-nearblack sm:text-4xl lg:text-5xl">
                Ready to begin a conversation?
              </h3>
              <p className="mt-6 text-base leading-relaxed text-nearblack/60">
                Every project starts with a conversation. Share your brief, and the studio will respond with a considered proposal.
              </p>
              <Link
                href="/#architecture-consultation-desk"
                className="mt-10 inline-flex items-center gap-4 border-2 border-nearblack/20 px-10 py-5 text-[0.75rem] font-black uppercase tracking-[0.4em] text-nearblack transition-all duration-500 hover:border-executive-red hover:bg-executive-red hover:text-white"
              >
                <span>Request Consultation</span>
                <ArrowUpRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <ArchitectureFooter />
    </div>
  );
}
