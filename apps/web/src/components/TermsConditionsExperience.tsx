"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { MarketingChrome } from "@/components/MarketingChrome";
import type { LegalDocument, SiteContent } from "@/lib/types";

interface TermsConditionsExperienceProps {
  content: SiteContent;
  document: LegalDocument;
}

const ease = [0.22, 1, 0.36, 1] as const;

const termsSections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    body:
      "By accessing Ractysh digital environments, requesting information or using our website, you acknowledge these terms and agree to use the platform in a lawful, professional and responsible manner. If you do not agree with these terms, you should discontinue use of the website and related digital services."
  },
  {
    id: "enterprise-services",
    title: "Enterprise Services",
    body:
      "Ractysh presents information about Architecture, Construction, Real Estate, Export-Import, OTC Exchange and enterprise coordination services for business communication purposes. Published content does not create a binding engagement, project scope, transaction mandate or commercial commitment unless confirmed through a written agreement executed by authorized representatives."
  },
  {
    id: "responsibilities",
    title: "User Responsibilities",
    body:
      "Users are responsible for providing accurate inquiry details, maintaining the confidentiality of any shared business materials and avoiding misuse of forms, communication channels or digital resources. You may not interfere with website reliability, attempt unauthorized access or use Ractysh content in a misleading manner."
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    body:
      "All Ractysh names, marks, layouts, copy, visuals, interface concepts, presentation systems and service descriptions remain owned by Ractysh or its licensors unless otherwise stated. Content may be viewed for legitimate business evaluation, but copying, resale, redistribution or brand misuse is not permitted."
  },
  {
    id: "availability",
    title: "Operational Availability",
    body:
      "Ractysh aims to keep its digital environments accessible and reliable, but availability may vary because of maintenance, upgrades, third-party systems, connectivity conditions or operational requirements. We may modify, suspend or retire website features when needed to maintain quality and security."
  },
  {
    id: "third-party",
    title: "Third-Party Systems",
    body:
      "The website may connect with trusted third-party providers for hosting, analytics, communication, forms, media delivery or operational workflows. These providers operate under their own terms, controls and availability standards, and Ractysh is not responsible for external platforms outside its direct control."
  },
  {
    id: "liability",
    title: "Liability Limitations",
    body:
      "Website information is provided for general business communication and may not reflect every project requirement, regulation, risk or commercial condition. To the fullest extent permitted by applicable law, Ractysh is not liable for indirect, incidental or consequential losses arising from use of the website or reliance on general published information."
  },
  {
    id: "privacy",
    title: "Privacy & Communications",
    body:
      "Information submitted through Ractysh forms and digital channels may be used to evaluate requests, respond to inquiries, coordinate enterprise communication and improve service reliability. Privacy handling is further described in the Ractysh Privacy Policy."
  },
  {
    id: "modifications",
    title: "Updates to Terms",
    body:
      "Ractysh may update these terms as services, workflows, legal requirements or operational standards evolve. Continued use of the website after updates are published indicates acceptance of the revised terms."
  },
  {
    id: "contact",
    title: "Contact Information",
    body:
      "Questions about these terms, enterprise engagement conditions or operational policies may be directed to the Ractysh operations desk through the contact channels provided on this website."
  }
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
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.68, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function TermsConditionsExperience({ content, document: legalDocument }: TermsConditionsExperienceProps) {
  const [activeSection, setActiveSection] = useState(termsSections[0].id);

  useEffect(() => {
    const sections = Array.from(globalThis.document.querySelectorAll<HTMLElement>("[data-terms-section]"));

    if (!sections.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-22% 0px -58% 0px",
        threshold: [0.12, 0.32, 0.56]
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <MarketingChrome content={content} showServiceRequestCTA={false}>
      <div className="relative isolate overflow-hidden bg-[#f8f1e4] text-[#211a15] [font-family:var(--font-manrope)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-8rem,rgba(255,255,255,0.96),transparent_36rem),radial-gradient(circle_at_82%_8%,rgba(205,168,92,0.16),transparent_31rem),radial-gradient(circle_at_12%_24%,rgba(255,252,245,0.9),transparent_30rem),linear-gradient(180deg,#fffdf8_0%,#fbf5ea_42%,#f1e5d3_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(70,55,39,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(70,55,39,0.045)_1px,transparent_1px)] [background-size:88px_88px]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[44rem] w-[min(88rem,96vw)] -translate-x-1/2 opacity-55 [background:linear-gradient(90deg,transparent_0%,rgba(178,143,77,0.16)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.74),transparent_72%)] [background-size:18rem_100%,100%_100%]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle,rgba(39,30,22,0.14)_0.58px,transparent_0.9px)] [background-size:18px_18px]" />

        <section className="relative z-10 px-5 pb-20 pt-36 text-center md:px-8 md:pb-24 lg:pb-28 lg:pt-44">
          <div className="mx-auto max-w-[920px]">
            <Reveal className="mx-auto">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.34em] text-[#9c7a35]">LEGAL</p>
              <h1 className="mx-auto mt-7 max-w-[52rem] font-display text-[clamp(4.5rem,10vw,9.4rem)] font-semibold leading-[0.82] tracking-normal text-[#17110d]">
                Terms &amp;
                <span className="block">Conditions</span>
              </h1>
              <p className="mx-auto mt-8 max-w-[42rem] text-[1.02rem] leading-[1.9] text-[#655b51] md:text-[1.13rem]">
                The operational terms governing the use of the Ractysh enterprise ecosystem.
              </p>
            </Reveal>

            <Reveal delay={0.06} className="mx-auto mt-14 grid max-w-[760px] gap-3 border-y border-[#c8a65d]/28 py-5 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[#75685d] sm:grid-cols-2">
              <span>Last updated: {legalDocument.updatedAt}</span>
              <span className="sm:text-right">Ractysh Enterprise Terms</span>
            </Reveal>
          </div>
        </section>

        <section className="relative z-10 px-5 pb-24 md:px-8 lg:pb-32">
          <div className="mx-auto grid max-w-[1160px] gap-12 xl:grid-cols-[172px_minmax(0,1fr)]">
            <aside className="hidden xl:block">
              <div className="sticky top-32">
                <p className="text-[0.64rem] font-bold uppercase tracking-[0.24em] text-[#9c7a35]">Reading Index</p>
                <nav className="relative mt-6 grid gap-4 border-l border-[#c8a65d]/26 pl-5" aria-label="Terms sections">
                  {termsSections.map((section, index) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      aria-current={activeSection === section.id ? "true" : undefined}
                      className="group relative grid gap-1 text-left transition-colors duration-300"
                    >
                      <span
                        className={`absolute -left-[1.42rem] top-1.5 h-2 w-2 rounded-full border transition duration-300 ${
                          activeSection === section.id
                            ? "border-[#9c7a35] bg-[#9c7a35] shadow-[0_0_0_5px_rgba(200,166,93,0.12)]"
                            : "border-[#c8a65d]/46 bg-[#fbf5ea]"
                        }`}
                      />
                      <span
                        className={`text-[0.62rem] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                          activeSection === section.id ? "text-[#9c7a35]" : "text-[#8c8175]"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`text-[0.78rem] font-semibold leading-[1.45] transition-colors duration-300 ${
                          activeSection === section.id ? "text-[#18120e]" : "text-[#756a60] group-hover:text-[#18120e]"
                        }`}
                      >
                        {section.title}
                      </span>
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            <article className="mx-auto w-full max-w-[920px] rounded-[6px] border border-[#decda8]/72 bg-[#fffdf8]/86 px-5 py-10 shadow-[0_28px_90px_rgba(74,50,25,0.075),inset_0_1px_0_rgba(255,255,255,0.92)] backdrop-blur-sm md:px-12 md:py-14 lg:px-14">
              <Reveal className="mx-auto max-w-[790px]">
                <p className="text-[1rem] leading-[1.9] text-[#544b43] md:text-[1.07rem]">{legalDocument.body}</p>
              </Reveal>

              <div className="mt-4 md:mt-8">
                {termsSections.map((section, index) => (
                  <Reveal key={section.id} delay={Math.min(index * 0.018, 0.09)} className="border-t border-[#c8a65d]/24 py-10 first:mt-7 md:py-12">
                    <section id={section.id} data-terms-section className="scroll-mt-28">
                      <p className="text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[#9c7a35]">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h2 className="mt-4 font-display text-[2.2rem] font-semibold leading-[1.02] tracking-normal text-[#18120e] md:text-[2.9rem]">
                        {section.title}
                      </h2>
                      <p className="mt-5 max-w-[48rem] text-[1rem] leading-[1.9] text-[#5d5349] md:text-[1.055rem]">
                        {section.body}
                      </p>
                    </section>
                  </Reveal>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="relative z-10 px-5 pb-28 md:px-8 lg:pb-36">
          <Reveal className="mx-auto max-w-[920px] overflow-hidden rounded-[6px] border border-[#d8c18a]/68 bg-[#f6eddf]/80 p-6 shadow-[0_24px_70px_rgba(74,50,25,0.075)] md:flex md:items-center md:justify-between md:gap-10 md:p-8">
            <p className="max-w-[39rem] text-[1rem] font-medium leading-[1.85] text-[#4e443b]">
              For enterprise legal inquiries, connect with the Ractysh operations desk.
            </p>
            <Link
              href="/contact"
              className="group mt-6 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[12px] border border-[#d6b45f]/42 bg-[#11100e] px-5 text-[0.86rem] font-semibold text-[#fff8ec] shadow-[0_16px_38px_rgba(15,14,12,0.21),0_0_18px_rgba(214,180,95,0.14)] transition duration-300 hover:-translate-y-0.5 hover:border-[#d6b45f]/70 hover:shadow-[0_20px_50px_rgba(15,14,12,0.27),0_0_30px_rgba(214,180,95,0.24)] md:mt-0"
            >
              Contact Enterprise Desk
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </section>
      </div>
    </MarketingChrome>
  );
}
