"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ChevronRight, Phone } from "lucide-react";
import { motion } from "framer-motion";
import RealEstateNav from "@/components/RealEstateNav";
import RealEstateFooter from "@/components/RealEstateFooter";
import {
  getServiceBySlug,
  getRelatedServices,
  getAllServices,
  type ServiceSlug,
} from "@/lib/real-estate-services";

export function RealEstateServiceDetailClient({
  serviceSlug,
}: {
  serviceSlug: ServiceSlug;
}) {
  const service = getServiceBySlug(serviceSlug);
  if (!service) return null;

  const relatedServices = getRelatedServices(service.relatedSlugs);

  return (
    <    >
      <RealEstateNav />
      <HeroSection service={service} />
      <OverviewSection service={service} />
      <BenefitsSection service={service} />
      <InvestmentValueSection service={service} />
      {relatedServices.length > 0 && (
        <RelatedServicesSection services={relatedServices} />
      )}
      <ConsultationCtaSection />
      <ContactSection />
      <RealEstateFooter />
    </>
  );
}

function HeroSection({
  service,
}: {
  service: NonNullable<ReturnType<typeof getServiceBySlug>>;
}) {
  return (
    <section className="relative h-[70vh] min-h-[520px] overflow-hidden">
      <Image
        src={service.heroImage}
        alt={service.title}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,rgba(196,182,147,0.1),transparent_40%)]" />

      <Link
        href="/real-estate-services"
        className="group absolute left-4 top-[100px] z-10 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-[0.2em] text-black/80 transition-colors hover:text-black sm:left-6 lg:left-8"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
        <span>Back to Services</span>
      </Link>

      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 lg:p-12">
        <div className="mx-auto max-w-[92rem]">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-4 flex items-center gap-2 text-base text-white/60">
              <Link
                href="/real-estate-services"
                className="transition hover:text-white"
              >
                All Services
              </Link>
              <ChevronRight className="size-3" />
              <span className="text-white/80">{service.shortTitle}</span>
            </div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#c4b693]">
              Ractysh Real Estate
            </p>
            <h1 className="max-w-4xl text-5xl font-light text-white sm:text-6xl lg:text-7xl">
              <span className="font-semibold">{service.title}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-xl leading-8 text-white/70">
              {service.tagline}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function OverviewSection({
  service,
}: {
  service: NonNullable<ReturnType<typeof getServiceBySlug>>;
}) {
  return (
    <section className="bg-[#f3f0eb] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[92rem]">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl"
        >
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#7a6b5a]">
            Service Overview
          </p>
          <h2 className="text-4xl font-light tracking-tight text-[#2c1f18] sm:text-5xl lg:text-6xl">
            {service.tagline}
          </h2>
          <p className="mt-6 text-lg leading-8 text-[#6b5b4e] lg:text-xl lg:leading-9">
            {service.description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function BenefitsSection({
  service,
}: {
  service: NonNullable<ReturnType<typeof getServiceBySlug>>;
}) {
  return (
    <section className="bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[92rem]">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#7a6b5a]">
              Key Benefits
            </p>
            <h2 className="text-4xl font-light tracking-tight text-[#2c1f18] sm:text-5xl lg:text-6xl">
              Why Choose Our{" "}
              <span className="font-semibold">{service.shortTitle}</span>
            </h2>
            <ul className="mt-8 space-y-4">
              {service.benefits.map((benefit, index) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[#3e2b24]">
                    <Check className="size-4 text-white" />
                  </span>
                  <span className="text-lg leading-7 text-[#6b5b4e]">
                    {benefit}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/3] overflow-hidden shadow-xl"
          >
            <Image
              src={service.heroImage}
              alt={service.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function InvestmentValueSection({
  service,
}: {
  service: NonNullable<ReturnType<typeof getServiceBySlug>>;
}) {
  return (
    <section className="bg-[#2c1f18] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[92rem]">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#c4b693]">
            Investment Value
          </p>
          <h2 className="text-4xl font-light tracking-tight sm:text-5xl lg:text-6xl">
            Make a Smart{" "}
            <span className="font-semibold text-[#c4b693]">Investment</span>
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {service.investmentValue.map((point, index) => (
            <motion.div
              key={point}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm"
            >
              <span className="text-2xl font-bold text-[#c4b693]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-4 text-base leading-7 text-white/70">{point}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedServicesSection({
  services,
}: {
  services: NonNullable<ReturnType<typeof getRelatedServices>>;
}) {
  return (
    <section className="bg-[#f3f0eb] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[92rem]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#7a6b5a]">
            Explore More
          </p>
          <h2 className="text-4xl font-light tracking-tight text-[#2c1f18] sm:text-5xl">
            Related Services
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative flex flex-col overflow-hidden bg-white shadow-md transition-all duration-500 hover:shadow-xl"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={service.heroImage}
                  alt={service.title}
                  fill
                  className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-xl font-semibold text-[#2c1f18]">
                  {service.title}
                </h3>
                <p className="mt-2 flex-1 text-base leading-6 text-[#6b5b4e] line-clamp-2">
                  {service.shortDescription}
                </p>
                <Link
                  href={`/real-estate-services/${service.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#3e2b24] transition hover:text-[#5a4034]"
                >
                  Explore Service
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConsultationCtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#2c1f18] px-5 py-20 text-white sm:px-8 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(196,182,147,0.08),transparent_40%)]" />
      <div className="relative mx-auto max-w-[92rem]">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-4xl font-light tracking-tight sm:text-5xl lg:text-6xl">
            Speak With Our{" "}
            <span className="font-semibold text-[#c4b693]">
              Investment Advisor
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/60">
            Get personalized guidance on property selection, investment strategy,
            and the complete acquisition process.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-3 border-2 border-[#c4b693] px-8 py-4 text-base font-bold uppercase tracking-wider text-[#c4b693] transition hover:bg-[#c4b693] hover:text-[#2c1f18]"
            >
              <Phone className="size-4" />
              Book a Consultation
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section
      id="contact"
      className="bg-[#f3f0eb] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[92rem]">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#7a6b5a]">
            Get In Touch
          </p>
          <h2 className="text-4xl font-light tracking-tight text-[#2c1f18] sm:text-5xl lg:text-6xl">
            Begin Your{" "}
            <span className="font-semibold">Real Estate Journey</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[#6b5b4e]">
            Our team is ready to assist you with property inquiries, investment
            guidance, and site visits.
          </p>
        </motion.div>

        <div className="mx-auto mt-14 max-w-2xl">
          <RealEstateConsultationForm />
        </div>
      </div>
    </section>
  );
}

function RealEstateConsultationForm() {
  const allServices = getAllServices();

  return (
    <div className="bg-white p-6 shadow-xl sm:p-8 lg:p-10">
      <form className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-base font-semibold text-[#2c1f18]">
              Full Name
            </span>
            <input
              type="text"
              placeholder="Your full name"
              className="h-12 w-full border border-[#d4cfc8] bg-[#faf9f7] px-4 text-base text-[#2c1f18] outline-none transition focus:border-[#3e2b24] focus:ring-2 focus:ring-[#3e2b24]/10"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-base font-semibold text-[#2c1f18]">
              Email Address
            </span>
            <input
              type="email"
              placeholder="email@example.com"
              className="h-12 w-full border border-[#d4cfc8] bg-[#faf9f7] px-4 text-base text-[#2c1f18] outline-none transition focus:border-[#3e2b24] focus:ring-2 focus:ring-[#3e2b24]/10"
            />
          </label>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-base font-semibold text-[#2c1f18]">
              Phone Number
            </span>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              className="h-12 w-full border border-[#d4cfc8] bg-[#faf9f7] px-4 text-base text-[#2c1f18] outline-none transition focus:border-[#3e2b24] focus:ring-2 focus:ring-[#3e2b24]/10"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-base font-semibold text-[#2c1f18]">
              City / Location
            </span>
            <input
              type="text"
              placeholder="Your city"
              className="h-12 w-full border border-[#d4cfc8] bg-[#faf9f7] px-4 text-base text-[#2c1f18] outline-none transition focus:border-[#3e2b24] focus:ring-2 focus:ring-[#3e2b24]/10"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-base font-semibold text-[#2c1f18]">
            Services Interested In
          </span>
          <div className="grid grid-cols-2 gap-2">
            {allServices.map((service) => (
              <label
                key={service.slug}
                className="flex cursor-pointer items-center gap-2 rounded border border-[#d4cfc8] bg-[#faf9f7] px-3 py-2.5 text-base text-[#2c1f18] transition hover:border-[#3e2b24] has-[:checked]:border-[#3e2b24] has-[:checked]:bg-[#3e2b24]/5"
              >
                <input
                  type="checkbox"
                  className="size-4 accent-[#3e2b24]"
                />
                {service.shortTitle}
              </label>
            ))}
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-base font-semibold text-[#2c1f18]">
            Budget Range
          </span>
          <select className="h-12 w-full border border-[#d4cfc8] bg-[#faf9f7] px-4 text-base text-[#2c1f18] outline-none transition focus:border-[#3e2b24] focus:ring-2 focus:ring-[#3e2b24]/10">
            <option value="">Select budget range...</option>
            <option>Under ₹50 Lakhs</option>
            <option>₹50 Lakhs – ₹1 Crore</option>
            <option>₹1 Crore – ₹3 Crores</option>
            <option>₹3 Crores – ₹5 Crores</option>
            <option>₹5 Crores+</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-base font-semibold text-[#2c1f18]">
            Message
          </span>
          <textarea
            rows={4}
            placeholder="Tell us about your requirements..."
            className="min-h-[100px] w-full resize-none border border-[#d4cfc8] bg-[#faf9f7] px-4 py-3 text-base text-[#2c1f18] outline-none transition focus:border-[#3e2b24] focus:ring-2 focus:ring-[#3e2b24]/10"
          />
        </label>

        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center gap-3 bg-[#3e2b24] px-8 text-base font-bold uppercase tracking-wider text-white transition hover:bg-[#5a4034]"
        >
          Submit Inquiry
          <ArrowRight className="size-4" />
        </button>
      </form>
    </div>
  );
}
