"use client";

import React, { type MouseEvent } from "react";
import { motion, type Variants } from "framer-motion";
import ServiceCard from "@/components/ServiceCard";
import { servicesContent, testimonialsContent } from "@/lib/architecturePremiumContent";

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
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

type AnchorNavigateHandler = (event: MouseEvent<HTMLAnchorElement>, href: string) => void;

function ServicesSection({ onAnchorNavigate }: { onAnchorNavigate: AnchorNavigateHandler }) {
  return (
    <section id="services" className="relative overflow-hidden bg-white py-24 text-nearblack sm:py-32 lg:py-48" data-arch-section>
      {/* Blueprint Grid Overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02]" 
           style={{ backgroundImage: "radial-gradient(#111 0.5px, transparent 0.5px)", backgroundSize: "30px 30px" }} 
      />
      
      <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <motion.div 
          className="mb-24 lg:mb-40"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerReveal}
        >
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-executive-red" />
            <motion.p className="text-[0.7rem] font-black uppercase tracking-[0.4em] text-executive-red" variants={reveal}>
              {servicesContent.kicker}
            </motion.p>
          </div>
          
          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-end">
            <motion.h2 className="font-display text-[4rem] font-light leading-[0.88] tracking-tighter sm:text-[5.5rem] lg:text-[7rem]" variants={reveal}>
              Fourteen <br />
              <span className="italic text-executive-red/90">Disciplines.</span>
            </motion.h2>
            <motion.p className="max-w-xl text-lg leading-relaxed text-nearblack/60 sm:text-xl" variants={reveal}>
              {servicesContent.body}
            </motion.p>
          </div>
        </motion.div>

        {/* Dynamic Masonry-style Grid - First 4 Services */}
        <motion.div 
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={staggerReveal}
        >
          {servicesContent.items.slice(0, 4).map((service, index) => {
            let colSpan = "lg:col-span-4";
            if (index % 5 === 0) colSpan = "lg:col-span-8";
            if (index % 5 === 3) colSpan = "lg:col-span-8";

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
                  onNavigate={onAnchorNavigate}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Explore All Services CTA */}
        <motion.div 
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={reveal}
        >
          <a
            href="/services"
            className="group inline-flex items-center gap-4 border-2 border-nearblack/20 px-10 py-5 text-[0.75rem] font-black uppercase tracking-[0.4em] text-nearblack transition-all duration-500 hover:border-executive-red hover:bg-executive-red hover:text-white"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/services";
            }}
          >
            <span>Explore All Services</span>
            <svg className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 7l-5 5m0 0l-5-5m5 5V3" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export function ArchitectureTestimonialsSection() {
  return (
    <section id="testimonials" className="bg-warm-100 text-nearblack" data-arch-section>
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
        <motion.div className="grid gap-10 lg:grid-cols-[0.76fr_1.24fr] lg:items-end" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.24 }} variants={staggerReveal}>
          <div>
            <motion.p className="arch-kicker text-executive-red" variants={reveal}>
              {testimonialsContent.kicker}
            </motion.p>
            <motion.h2 className="arch-section-title mt-5 font-display" variants={reveal}>
              {testimonialsContent.title}
            </motion.h2>
          </div>
          <motion.p className="max-w-2xl text-base leading-8 text-nearblack/68 sm:text-lg" variants={reveal}>
            {testimonialsContent.body}
          </motion.p>
        </motion.div>

        <motion.div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerReveal}>
          {testimonialsContent.items.map((item, index) => (
            <motion.article
              key={`${item.author}-${index}`}
              className="flex h-full flex-col rounded-[1.75rem] border border-nearblack/10 bg-white p-7 shadow-[0_26px_80px_rgba(17,17,17,0.08)]"
              variants={reveal}
            >
              <span className="font-display text-[3rem] leading-none text-executive-red/90">&ldquo;</span>
              <p className="mt-5 flex-1 text-[1rem] leading-8 text-nearblack/76">{item.quote}</p>
              <div className="mt-8 border-t border-nearblack/10 pt-5">
                <h3 className="font-display text-[1.5rem] leading-none text-nearblack">{item.author}</h3>
                <p className="mt-2 text-[0.78rem] font-semibold uppercase tracking-[0.28em] text-executive-red/90">{item.role}</p>
                <p className="mt-2 text-sm text-nearblack/58">{item.location}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default function ArchitecturePremiumSections({ onAnchorNavigate }: { onAnchorNavigate: AnchorNavigateHandler }) {
  return (
    <>
      <ServicesSection onAnchorNavigate={onAnchorNavigate} />
    </>
  );
}
