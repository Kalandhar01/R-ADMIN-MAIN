"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Building2, Compass, FileText, Layers3 } from "lucide-react";
import Link from "next/link";
import { MarketingChrome } from "@/components/MarketingChrome";
import { commercialServicePages } from "@/data/commercialServices";
import { servicePages } from "@/data/servicePages";
import type { SiteContent } from "@/lib/types";

interface SitemapDirectoryExperienceProps {
  content: SiteContent;
}

interface DirectoryLink {
  label: string;
  href: string;
  description: string;
}

interface DirectoryGroup {
  eyebrow: string;
  title: string;
  description: string;
  links: DirectoryLink[];
}

const ease = [0.22, 1, 0.36, 1] as const;

const companyLinks: DirectoryLink[] = [
  { label: "Home", href: "/", description: "The primary Ractysh Group enterprise ecosystem entry." },
  { label: "About Us", href: "/about", description: "Company context, operating philosophy and enterprise positioning." },
  { label: "Founder", href: "/founder", description: "Founder profile, vision and leadership direction." },
  { label: "Directors", href: "/directors", description: "Executive leadership and governance presence." },
  { label: "Careers", href: "/careers", description: "Premium career paths, internships and team opportunities." },
  { label: "Blog", href: "/blog", description: "Enterprise briefings, editorial updates and operating insights." },
  { label: "Contact", href: "/contact", description: "Direct communication with the Ractysh enterprise desk." },
  { label: "Book Consultation", href: "/book-consultation", description: "A structured intake for project, design and trade requirements." }
];

const ecosystemLinks: DirectoryLink[] = [
  { label: "Services", href: "/services", description: "A consolidated view of Ractysh service capabilities." },
  { label: "Our Work", href: "/our-projects", description: "Selected environments across Architecture, Construction, Real Estate, Trade and OTC Exchange." },
  { label: "Architecture", href: "/architecture", description: "Design ecosystem overview and spatial intelligence." },
  { label: "Construction", href: "/construction", description: "Construction execution, site control and turnkey delivery systems." },
  { label: "Real Estate", href: "/real-estate", description: "Asset positioning, development advisory and investor-ready property workflows." },
  { label: "Export & Import", href: "/import-export", description: "Enterprise trade coordination and supplier network systems." },
  { label: "OTC Exchange", href: "/otc-exchange", description: "Crypto currency exchange, USDT services and KYC-verified OTC transactions." },
  { label: "Ractysh Design", href: "/ractysh-design", description: "The expanding design studio ecosystem." },
  { label: "Ractysh Construction", href: "/construction", description: "The construction and delivery operating layer." },
  { label: "Ractysh Import & Export", href: "/ractysh-import-export", description: "The expanding global trade operating layer." }
];

const legalFallback: DirectoryLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy", description: "Information handling and enterprise privacy standards." },
  { label: "Terms & Conditions", href: "/terms-and-conditions", description: "Operational terms for using Ractysh digital environments." },
  { label: "Disclosure", href: "/disclosure", description: "Business, project and professional disclosure notes." },
  { label: "Copyright Policy", href: "/copyright-policy", description: "Content ownership and permitted usage standards." },
  { label: "Trademark Certification", href: "/trademark-certification", description: "Trademark notice and certificate access." },
  { label: "XML Sitemap", href: "/sitemap.xml", description: "Machine-readable sitemap for search indexing." }
];

function Reveal({
  children,
  className = "",
  delay = 0
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.62, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function DirectoryCard({ item, index }: { item: DirectoryLink; index: number }) {
  return (
    <Link
      href={item.href}
      className="group flex min-h-[11rem] flex-col justify-between rounded-[8px] border border-[#d4b978]/58 bg-[#fffaf0]/82 p-5 shadow-[0_18px_48px_rgba(88,61,28,0.07),inset_0_1px_0_rgba(255,255,255,0.9)] transition duration-300 hover:-translate-y-1 hover:border-[#c8a65d] hover:bg-[#fffdf8] hover:shadow-[0_24px_64px_rgba(88,61,28,0.12),0_0_26px_rgba(214,180,95,0.14)] md:p-6"
    >
      <div className="flex items-start justify-between gap-5">
        <span className="text-[0.76rem] font-semibold uppercase text-[#9a7428]">{String(index + 1).padStart(2, "0")}</span>
        <ArrowUpRight className="h-4 w-4 text-[#7b5b22] opacity-55 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
      </div>
      <div className="mt-8">
        <h3 className="text-[1.55rem] font-semibold leading-tight text-[#1c1510] font-display md:text-[1.85rem]">
          {item.label}
        </h3>
        <p className="mt-3 text-[0.92rem] leading-6 text-[#665b50]">{item.description}</p>
      </div>
    </Link>
  );
}

export function SitemapDirectoryExperience({ content }: SitemapDirectoryExperienceProps) {
  const legalLinks =
    content.legal.documents.length > 0
      ? [
          ...content.legal.documents.map((document) => ({
            label: document.title,
            href: `/${document.slug}`,
            description: document.summary
          })),
          { label: "XML Sitemap", href: "/sitemap.xml", description: "Machine-readable sitemap for search indexing." }
        ]
      : legalFallback;

  const specializedServiceLinks = [
    ...commercialServicePages.map((service) => ({
      label: service.title,
      href: service.href,
      description: service.summary
    })),
    ...servicePages
      .filter((service) => service.href !== "/book-demo")
      .map((service) => ({
        label: service.eyebrow,
        href: service.href,
        description: service.summary
      }))
  ].filter((link, index, links) => links.findIndex((item) => item.href === link.href) === index);

  const groups: DirectoryGroup[] = [
    {
      eyebrow: "Company",
      title: "Corporate Routes",
      description: "Core destinations for understanding Ractysh, contacting the team and starting a consultation.",
      links: companyLinks
    },
    {
      eyebrow: "Ecosystem",
      title: "Enterprise Directory",
      description: "Division-level navigation across Architecture, Construction, Real Estate, Trade and OTC operating layers.",
      links: ecosystemLinks
    },
    {
      eyebrow: "Services",
      title: "Specialized Workflows",
      description: "Premium service pages organized for architecture, interiors, visualization, build delivery and trade.",
      links: specializedServiceLinks
    },
    {
      eyebrow: "Governance",
      title: "Legal and Policy",
      description: "Readable policy destinations for trust, usage, disclosure and intellectual property standards.",
      links: legalLinks
    }
  ];

  const stats = [
    { label: "Directory Groups", value: String(groups.length), Icon: Layers3 },
    { label: "Enterprise Routes", value: String(groups.reduce((total, group) => total + group.links.length, 0)), Icon: Compass },
    { label: "Service Workflows", value: String(specializedServiceLinks.length), Icon: Building2 },
    { label: "Policy Records", value: String(legalLinks.length), Icon: FileText }
  ];

  return (
    <MarketingChrome content={content}>
      <div className="relative isolate overflow-hidden bg-[#f7f0e3] text-[#201914] [font-family:var(--font-manrope)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#fffdf8_0%,#f8f1e4_45%,#efe2cf_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(68,52,36,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(68,52,36,0.055)_1px,transparent_1px)] [background-size:76px_76px]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,255,255,0))]" />

        <section className="relative z-10 px-5 pb-14 pt-32 md:px-8 md:pb-16 lg:pt-40">
          <div className="mx-auto max-w-[1080px]">
            <Reveal className="text-center">
              <p className="text-[0.78rem] font-semibold uppercase text-[#9a7428]">Enterprise Navigation Directory</p>
              <h1 className="mx-auto mt-5 max-w-[820px] text-[3.45rem] font-semibold leading-[0.92] text-[#18130f] font-display sm:text-[4.5rem] md:text-[5.7rem] lg:text-[6.6rem]">
                Sitemap
              </h1>
              <p className="mx-auto mt-7 max-w-[47rem] text-[1rem] leading-8 text-[#62584e] md:text-[1.12rem] md:leading-9">
                A refined directory for Ractysh Group pages, enterprise divisions, service workflows and governance records.
              </p>
            </Reveal>

            <Reveal delay={0.06} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map(({ label, value, Icon }) => (
                <div key={label} className="rounded-[8px] border border-[#d8c18a]/62 bg-[#fffaf0]/76 p-5 shadow-[0_16px_42px_rgba(88,61,28,0.06),inset_0_1px_0_rgba(255,255,255,0.88)]">
                  <div className="flex items-center justify-between gap-4 text-[#9a7428]">
                    <span className="text-[0.72rem] font-semibold uppercase">{label}</span>
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="mt-5 text-[2.2rem] font-semibold leading-none text-[#1b1511] font-display">{value}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <section className="relative z-10 px-5 pb-24 md:px-8 lg:pb-32">
          <div className="mx-auto grid max-w-[1180px] gap-16 md:gap-20">
            {groups.map((group, groupIndex) => (
              <Reveal key={group.title} delay={Math.min(groupIndex * 0.04, 0.12)}>
                <section className="scroll-mt-28">
                  <div className="mb-7 grid gap-4 border-y border-[#c8a65d]/24 py-6 lg:grid-cols-[0.42fr_1fr] lg:items-end">
                    <div>
                      <p className="text-[0.76rem] font-semibold uppercase text-[#9a7428]">{group.eyebrow}</p>
                      <h2 className="mt-3 text-[2.4rem] font-semibold leading-none text-[#1b1511] font-display md:text-[3.2rem]">
                        {group.title}
                      </h2>
                    </div>
                    <p className="max-w-[42rem] text-[0.98rem] leading-7 text-[#665b50] lg:justify-self-end">{group.description}</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {group.links.map((item, index) => (
                      <DirectoryCard key={`${group.title}-${item.href}`} item={item} index={index} />
                    ))}
                  </div>
                </section>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="relative z-10 px-5 pb-24 md:px-8 lg:pb-32">
          <Reveal className="mx-auto flex max-w-[1000px] flex-col gap-6 rounded-[8px] border border-[#d8c18a]/70 bg-[#f3e8d7]/78 p-6 shadow-[0_24px_70px_rgba(80,52,24,0.08)] md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <p className="text-[0.76rem] font-semibold uppercase text-[#9a7428]">Next Step</p>
              <h2 className="mt-3 text-[2rem] font-semibold leading-tight text-[#1b1511] font-display md:text-[2.6rem]">
                Start with a structured consultation.
              </h2>
            </div>
            <Link href="/book-consultation" className="premium-cta group w-fit">
              Book Consultation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </section>
      </div>
    </MarketingChrome>
  );
}
