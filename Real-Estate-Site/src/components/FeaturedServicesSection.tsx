"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { getFeaturedServices } from "@/lib/real-estate-services";

const services = getFeaturedServices();

const serviceIcons: Record<string, string> = {
  "luxury-villas": "L",
  "premium-residential-plots": "P",
  "commercial-building-developments": "C",
  "residential-building-developments": "R",
  "gated-community-projects": "G",
  "government-approved-lands": "A",
};

export default function FeaturedServicesSection() {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-[#f3f0eb] px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(196,182,147,0.08),transparent_40%),radial-gradient(circle_at_82%_90%,rgba(62,43,36,0.06),transparent_38%)]" />

      <div className="relative mx-auto max-w-[92rem]">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#7a6b5a]">
            Real Estate Services
          </p>
          <h2 className="text-4xl font-light tracking-tight text-[#2c1f18] sm:text-5xl lg:text-6xl">
            Premium Property{" "}
            <span className="font-semibold text-[#c4b693]">Development</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-xl leading-8 text-[#6b5b4e]">
            From architectural luxury villas to government-approved land parcels,
            we deliver exceptional real estate opportunities across every segment.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative flex flex-col overflow-hidden bg-white shadow-lg transition-all duration-500 hover:shadow-2xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={service.heroImage}
                  alt={service.title}
                  fill
                  className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#3e2b24] shadow-sm backdrop-blur-sm">
                    <span className="grid size-6 place-items-center rounded-full bg-[#3e2b24] text-xs font-bold text-white">
                      {serviceIcons[service.slug]}
                    </span>
                    {service.shortTitle}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h3 className="text-2xl font-semibold text-[#2c1f18]">
                  {service.title}
                </h3>
                <p className="mt-3 flex-1 text-base leading-7 text-[#6b5b4e]">
                  {service.shortDescription}
                </p>
                <Link
                  href={`/real-estate-services/${service.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#3e2b24] transition hover:text-[#5a4034]"
                >
                  Explore Service
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 text-center"
        >
          <Link
            href="/real-estate-services"
            className="inline-flex items-center gap-3 border-2 border-[#3e2b24] px-8 py-4 text-base font-bold uppercase tracking-wider text-[#3e2b24] transition hover:bg-[#3e2b24] hover:text-white"
          >
            View All Services
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
