"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, ChevronRight, Home, MapPin, Shield } from "lucide-react";
import { motion } from "framer-motion";
import RealEstateNav from "@/components/RealEstateNav";
import RealEstateFooter from "@/components/RealEstateFooter";
import { getAllServices } from "@/lib/real-estate-services";

const services = getAllServices();

const categoryIcons: Record<string, typeof Home> = {
  "land-building-promoters": Building2,
  "luxury-villas": Home,
  "premium-residential-plots": MapPin,
  "residential-building-developments": Building2,
  "commercial-building-developments": Building2,
  "modern-row-house-communities": Home,
  "gated-community-projects": Shield,
  "government-approved-lands": MapPin,
};

export function RealEstateServicesClient() {
  return (
    <>
      <RealEstateNav />
      <HeroSection />
      <ServicesGridSection />
      <StatsSection />
      <CtaSection />
      <RealEstateFooter />
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#2c1f18] px-5 py-32 text-white sm:px-8 lg:px-12 lg:py-44">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,rgba(196,182,147,0.12),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(62,43,36,0.2),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />

      <div className="relative mx-auto max-w-[92rem]">
        <Link
          href="/real-estate-services"
          className="group mb-6 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white sm:absolute sm:left-4 sm:top-[164px] lg:left-8 lg:top-[168px]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back to Services</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl pt-6 text-center sm:pt-[88px] lg:pt-[120px]"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#c4b693]">
            Ractysh Real Estate
          </p>
          <h1 className="text-4xl font-light tracking-tight sm:text-5xl lg:text-6xl">
            Property Development{" "}
            <span className="font-semibold text-[#c4b693]">& Investment</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-white/65">
            From architectural luxury villas to government-approved land parcels,
            we deliver exceptional real estate opportunities across every segment
            of the property market.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function ServicesGridSection() {
  return (
    <section className="bg-[#f3f0eb] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[92rem]">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const Icon = categoryIcons[service.slug] || Building2;

            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
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
                        <Icon className="size-4" />
                      </span>
                      {service.shortTitle}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h2 className="text-2xl font-semibold text-[#2c1f18]">
                    {service.title}
                  </h2>
                  <p className="mt-3 flex-1 text-base leading-7 text-[#6b5b4e]">
                    {service.shortDescription}
                  </p>
                  <Link
                    href={`/real-estate-services/${service.slug}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#3e2b24] transition hover:text-[#5a4034]"
                  >
                    Explore Service
                    <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: "250+", label: "Projects Delivered" },
    { value: "8", label: "Service Verticals" },
    { value: "5,000+", label: "Happy Families" },
    { value: "15+", label: "Years Experience" },
  ];

  return (
    <section className="bg-[#2c1f18] px-5 py-16 text-white sm:px-8 lg:py-20">
      <div className="mx-auto max-w-[92rem]">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-center"
            >
              <p className="text-4xl font-semibold tracking-tight text-[#c4b693] sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-white/60">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="bg-[#f3f0eb] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[92rem]">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl font-light tracking-tight text-[#2c1f18] sm:text-4xl lg:text-5xl">
            Ready to Invest in{" "}
            <span className="font-semibold">Premium Real Estate?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#6b5b4e]">
            Speak with our investment advisors to find the perfect property
            opportunity tailored to your goals.
          </p>
          <Link
            href="/real-estate-services#contact"
            className="mt-10 inline-flex items-center gap-3 border-2 border-[#3e2b24] px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#3e2b24] transition hover:bg-[#3e2b24] hover:text-white"
          >
            Schedule a Consultation
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
