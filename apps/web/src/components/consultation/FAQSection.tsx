"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How quickly can we start?",
    answer:
      "Most demo requests can be reviewed within one business day after the intake is submitted. Priority enterprise requests can move directly into a strategy session once the scope is clear."
  },
  {
    question: "Do you handle enterprise-scale projects?",
    answer:
      "Yes. Ractysh is structured for multi-stakeholder enterprise requirements across Architecture, Construction, Real Estate, Export-Import operations, OTC Exchange coordination and turnkey execution."
  },
  {
    question: "Can consultations include export-import or OTC exchange workflows?",
    answer:
      "Yes. The consultation can include export-import planning, global trade coordination, private counterparty intake, documentation readiness and enterprise supply workflows."
  },
  {
    question: "Do you provide site visits?",
    answer:
      "Yes. Site visits can be arranged when the project requires physical inspection, construction review, interior scope validation or infrastructure feasibility assessment."
  },
  {
    question: "Can Ractysh manage turnkey execution?",
    answer:
      "Yes. When the scope fits the Ractysh ecosystem, the demo can progress into a full execution roadmap with partners, milestones, delivery governance and handover planning."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      className="relative isolate overflow-hidden bg-[#F8F6F1] px-5 pb-20 pt-16 text-[#181512] md:px-8 md:pb-24 md:pt-20 lg:pt-24"
      id="consultation-faq"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_8%,rgba(214,180,95,0.16),transparent_30rem),radial-gradient(circle_at_18%_82%,rgba(255,252,247,0.94),transparent_30rem),linear-gradient(135deg,#FFFCF7_0%,#F8F6F1_48%,#F4F1EA_100%)]" />
      <div
        data-faq-background-grid
        className="pointer-events-none absolute -inset-x-8 -inset-y-16 opacity-100 [background-image:linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.035)_1px,transparent_1px)] [background-size:58px_58px]"
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle,rgba(154,116,40,0.42)_1px,transparent_1.4px)] [background-size:38px_38px] [mask-image:radial-gradient(circle_at_68%_36%,black,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(214,180,95,0.34),transparent)]" />
      <div className="mx-auto grid max-w-[86rem] gap-9 lg:grid-cols-[0.45fr_0.55fr] lg:gap-12">
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#9a7428]">FAQ</p>
          <h2 className="mt-3 font-display text-[2.45rem] font-semibold leading-[0.98] tracking-[0] text-[#181512] md:text-[3.15rem] lg:text-[3.65rem]">
            Clear answers before the first private session.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.7] text-[#68645b]/80 md:text-[16px]">
            The intake is designed to reduce ambiguity before a senior Ractysh team member reviews your requirement.
          </p>
        </motion.div>

        <motion.div
          data-faq-card
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 overflow-hidden rounded-[1.2rem] border border-[#d8bd78]/45 bg-[#fffdf8]/95 shadow-[0_26px_84px_rgba(98,78,34,0.1),inset_0_1px_0_rgba(255,255,255,0.92)]"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={faq.question} className="border-b border-[#e2d6bd]/70 last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-5 px-5 py-4 text-left text-[15px] font-medium text-[#181512] transition hover:bg-[#fff8e7]/74 md:px-7"
                >
                  <span>{faq.question}</span>
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#dcc895]/64 bg-[#fffaf0] text-[#9a7428] transition duration-300",
                      isOpen && "rotate-180 border-[#c6a45b]/75 bg-[#fff4d8]"
                    )}
                  >
                    <ChevronDown className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-[14px] leading-[1.7] text-[#6b665d]/80 md:px-7">{faq.answer}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
