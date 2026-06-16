"use client";

import type { FormEvent, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Building2, CheckCircle2, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { BrandLogo } from "@/components/BrandLogo";
import { COMPANY_CONTACT } from "@/lib/companyContact";
import type { LocationInfo } from "@/lib/types";

const motionEase = [0.22, 1, 0.36, 1] as const;

const serviceOptions = [
  "Architecture Division",
  "Construction Division",
  "Real Estate Division",
  "Export & Import Division",
  "OTC Exchange Division",
  "Private consultation"
];

interface ContactEnterprisePageProps {
  location?: LocationInfo;
}

export function ContactEnterprisePage({ location }: ContactEnterprisePageProps) {
  const submitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const shouldReduceMotion = Boolean(reduceMotion);

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitState("loading");
    setSubmitError("");

    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: new FormData(form)
      });
      const result = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(result?.message || "Unable to send inquiry. Please try again.");
      }

      setSubmitState("success");
      form.reset();
      submitTimeoutRef.current = setTimeout(() => setSubmitState("idle"), 5200);
    } catch (error) {
      setSubmitState("error");
      setSubmitError(error instanceof Error ? error.message : "Unable to send inquiry. Please try again.");
    }
  };

  const contactDetails = [
    { Icon: Mail, label: "Email", value: location?.email || COMPANY_CONTACT.email, href: location?.email ? `mailto:${location.email}` : COMPANY_CONTACT.emailHref },
    { Icon: Phone, label: "Mobile", value: location?.phone || COMPANY_CONTACT.mobile, href: location?.phone ? `tel:${location.phone}` : COMPANY_CONTACT.mobileHref },
    { Icon: Building2, label: "Office", value: location?.name || COMPANY_CONTACT.office, href: COMPANY_CONTACT.officeHref },
    { Icon: MapPin, label: "Locations", value: location?.address || COMPANY_CONTACT.locationDisplay }
  ];

  return (
    <div className="contact-page relative isolate overflow-hidden bg-[#f7f1e6] text-[#191512] [font-family:var(--font-manrope)]">
      <ContactBackground />

      <section className="relative z-10 flex min-h-[100svh] items-center px-5 pb-16 pt-28 sm:px-6 md:px-8 lg:pb-20 lg:pt-32">
        <div className="mx-auto grid w-full max-w-[1420px] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(28rem,1fr)] lg:items-center xl:gap-14">
          <div className="mx-auto max-w-[43rem] text-center lg:mx-0 lg:text-left">
            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.78, ease: motionEase }}
              className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#9b762f] sm:text-[0.72rem]"
            >
              PRIVATE ENTERPRISE DESK
            </motion.p>

            <h1
              aria-label="Connect with Ractysh through a premium coordination layer."
              className="mt-7 text-[2.75rem] font-semibold leading-[0.96] text-[#17130f] font-display sm:text-[4.15rem] sm:leading-[0.9] lg:text-[4.55rem] xl:text-[4.8rem]"
            >
              {["Connect with", "Ractysh through", "a premium", "coordination layer."].map((line, index) => (
                <motion.span
                  key={line}
                  aria-hidden="true"
                  className="block lg:whitespace-nowrap"
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 26 }}
                  animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.08 + index * 0.07, ease: motionEase }}
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.86, delay: 0.42, ease: motionEase }}
              className="mx-auto mt-8 max-w-[38rem] text-[1rem] font-medium leading-8 text-[#655c51] sm:text-[1.08rem] lg:mx-0"
            >
              Architecture, Construction, Real Estate, Export & Import and OTC Exchange coordinated through one
              enterprise ecosystem.
            </motion.p>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.86, delay: 0.54, ease: motionEase }}
              className="mx-auto mt-10 flex w-full max-w-[31rem] items-center gap-4 lg:mx-0"
              aria-hidden="true"
            >
              <span className="h-px flex-1 bg-[linear-gradient(90deg,transparent,rgba(154,117,46,0.42))]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#b99446]" />
              <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(154,117,46,0.42),transparent)]" />
            </motion.div>
          </div>

          <ContactVisual reduceMotion={shouldReduceMotion} />
        </div>
      </section>

      <section className="relative z-10 px-5 py-24 sm:px-6 md:px-8 lg:py-32">
        <div className="mx-auto grid w-full max-w-[1320px] gap-14 lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
          <motion.aside
            initial={shouldReduceMotion ? false : { opacity: 0, y: 26 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 0.86, ease: motionEase }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <div className="mb-9 flex items-center gap-5">
              <BrandLogo size="identity" />
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#9b762f]">
                  Ractysh Group
                </p>
                <p className="mt-2 max-w-[16rem] text-[0.94rem] font-semibold leading-6 text-[#2a241d]">
                  Private company details and enterprise contact access.
                </p>
              </div>
            </div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#9b762f]">Consultation Access</p>
            <h2 className="mt-5 max-w-[31rem] text-[2.7rem] font-semibold leading-[0.98] text-[#18130f] font-display sm:text-[3.8rem]">
              Begin with a calm enterprise exchange.
            </h2>
            <p className="mt-6 max-w-[30rem] text-[0.98rem] font-medium leading-8 text-[#6a6054]">
              Share the initiative, operational context and preferred route of coordination. The private desk will align the right Ractysh team.
            </p>

            <div className="mt-10 border-y border-[#b99446]/28">
              {contactDetails.map((detail) => (
                <ContactDetail key={detail.label} {...detail} />
              ))}
            </div>
          </motion.aside>

          <motion.form
            initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.92, delay: 0.08, ease: motionEase }}
            onSubmit={handleSubmit}
            aria-label="Enterprise contact form"
            className="contact-form-panel"
          >
            <div className="mb-8 flex flex-col gap-5 border-b border-[#b99446]/22 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <BrandLogo size="sm" decorative />
                <div>
                  <p className="text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[#9b762f]">
                    Ractysh Consultation
                  </p>
                  <h2 className="mt-2 text-[1.45rem] font-semibold leading-none text-[#18130f] font-display">
                    Private Intake
                  </h2>
                </div>
              </div>
              <span className="w-fit border border-[#b99446]/30 px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#9b762f]">
                Enterprise Desk
              </span>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Full Name" name="fullName" placeholder="Your name" required />
              <Field label="Email" name="email" type="email" placeholder="you@company.com" required />
              <Field label="Company" name="companyName" placeholder="Company or organization" />
              <Field label="Phone" name="phone" type="tel" placeholder="+91" />

              <label className="block md:col-span-2">
                <span className="contact-field-label">Conversation Focus</span>
                <select name="interest" className="contact-field-input mt-3 h-14 appearance-none pr-12" required defaultValue={serviceOptions[0]}>
                  {serviceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <TextAreaField
                label="Message"
                name="message"
                rows={6}
                required
                placeholder="Briefly outline the initiative, market, timeline or coordination need."
                className="md:col-span-2"
              />
            </div>

            <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
              <button type="submit" disabled={submitState === "loading"} className="contact-primary-button group">
                <span className="relative">{submitState === "loading" ? "Submitting" : "Submit Consultation"}</span>
                {submitState === "loading" ? (
                  <span className="relative h-4 w-4 rounded-full border border-[#fff8ec]/30 border-t-[#fff8ec] animate-spin" />
                ) : (
                  <ArrowRight className="relative h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                )}
              </button>

              {submitState === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.42, ease: motionEase }}
                  className="flex items-center gap-3 text-[0.86rem] font-semibold text-[#51483d]"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#181512] text-[#fff8ec] shadow-[0_14px_32px_rgba(24,21,18,0.16)]">
                    <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                  </span>
                  Consultation submitted. The enterprise desk will respond privately.
                </motion.div>
              ) : null}

              {submitState === "error" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: motionEase }}
                  className="rounded-[0.7rem] border border-red-200 bg-red-50/80 px-4 py-3 text-[0.84rem] font-semibold text-red-700"
                >
                  {submitError}
                </motion.div>
              ) : null}
            </div>
          </motion.form>
        </div>
      </section>
    </div>
  );
}

function ContactBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_12%,rgba(215,181,99,0.24),transparent_32rem),radial-gradient(circle_at_8%_54%,rgba(255,255,255,0.84),transparent_34rem),linear-gradient(180deg,#fffdf8_0%,#f8f0e4_48%,#eee2cf_100%)]" />
      <div className="contact-architectural-texture absolute inset-0 opacity-[0.5]" />
      <div className="contact-paper-texture absolute inset-0 opacity-[0.2]" />
      <div className="contact-light-shelf absolute left-[-8%] top-[18%] h-[34rem] w-[58vw] rotate-[-10deg]" />
      <div className="absolute left-[6%] top-[18%] h-px w-[40vw] bg-[linear-gradient(90deg,transparent,rgba(154,117,46,0.24),transparent)]" />
      <div className="absolute bottom-[19%] right-[5%] h-px w-[46vw] bg-[linear-gradient(90deg,transparent,rgba(154,117,46,0.2),transparent)]" />
    </div>
  );
}

function ContactVisual({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.figure
      initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.985 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.05, delay: 0.28, ease: motionEase }}
      aria-label="Cinematic architectural executive workspace"
      className="relative z-10 mx-auto w-full max-w-[44rem] lg:justify-self-end"
    >
      <div className="contact-hero-image-shell">
        <div className="contact-hero-image-frame">
          <Image
            src="/contact/enterprise-architecture-workspace.webp"
            alt="A warm architectural executive workspace with glass, stone, brass and a private consultation table."
            fill
            priority
            quality={82}
            sizes="(min-width: 1280px) 48vw, (min-width: 1024px) 46vw, 92vw"
            className="contact-hero-image object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,253,248,0.08)_0%,transparent_42%,rgba(24,18,12,0.3)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_8%,rgba(255,255,255,0.34),transparent_26rem),radial-gradient(circle_at_82%_72%,rgba(202,164,83,0.16),transparent_24rem)] mix-blend-soft-light" />
          <div className="absolute inset-0 rounded-[1.6rem] ring-1 ring-inset ring-white/45" />
        </div>
      </div>
    </motion.figure>
  );
}

function Field({ label, className = "", ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="contact-field-label">{label}</span>
      <input {...props} className={`contact-field-input mt-3 h-14 ${className}`} />
    </label>
  );
}

function TextAreaField({
  label,
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="contact-field-label">{label}</span>
      <textarea {...props} className="contact-field-input mt-3 min-h-[12rem] resize-none py-4 leading-7" />
    </label>
  );
}

function ContactDetail({
  Icon,
  label,
  value,
  href
}: {
  Icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#b99446]/24 bg-white/38 text-[#9b762f]">
        <Icon className="h-4 w-4" strokeWidth={1.65} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[#9b762f]">{label}</span>
        <span className="mt-2 block text-[0.9rem] font-semibold leading-6 text-[#2a241d]">{value}</span>
      </span>
    </>
  );

  const className =
    "group flex min-w-0 items-start gap-4 py-5 text-left transition-[opacity,transform] duration-300 ease-out hover:-translate-y-0.5 hover:opacity-85";

  return href ? (
    <a href={href} className={className}>
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  );
}
