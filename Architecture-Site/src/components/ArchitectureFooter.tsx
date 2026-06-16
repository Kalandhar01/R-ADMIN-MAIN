"use client";

import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Check, Loader2, Mail } from "lucide-react";
import { OptimizedImage as Image } from "@/components/OptimizedImage";
import {
  footerContent,
  heroSupportingContent
} from "@/lib/architecturePremiumContent";

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
      staggerChildren: 0.12,
      delayChildren: 0.05
    }
  }
};

const formFieldReveal: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.68, ease: power4Out }
  }
};

function BrandLogo() {
  return (
    <span className="brand-logo">
      <Image
        src="/images/architecture/ractysh-architecture-logo.webp"
        alt="Ractysh Architecture emblem"
        fill
        sizes="(max-width: 720px) 44px, 56px"
        className="object-contain"
        placeholder="empty"
        style={{ background: "transparent" }}
      />
    </span>
  );
}

const architectureFooterColumns = [footerContent.studio, footerContent.services, footerContent.locations, footerContent.contact] as const;
const architectureFooterStatement = ["Built Beyond", "Blueprints.", "Designed to Endure."] as const;

type DeskState = "idle" | "submitting" | "success" | "error";

export default function ArchitectureFooter() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterState, setNewsletterState] = useState<DeskState>("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [showNewsletterNotice, setShowNewsletterNotice] = useState(false);
  const newsletterSubmitting = newsletterState === "submitting";
  const newsletterSubscribed = newsletterState === "success";

  useEffect(() => {
    if (!newsletterSubscribed) {
      setShowNewsletterNotice(false);
      return;
    }
    setShowNewsletterNotice(true);
    const fadeTimer = window.setTimeout(() => setShowNewsletterNotice(false), 2800);
    const resetTimer = window.setTimeout(() => { setNewsletterState("idle"); setNewsletterMessage(""); }, 3600);
    return () => { window.clearTimeout(fadeTimer); window.clearTimeout(resetTimer); };
  }, [newsletterSubscribed]);

  async function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newsletterSubmitting) return;

    const email = newsletterEmail.trim();
    if (!email) {
      setNewsletterState("error");
      setNewsletterMessage("Enter your email address.");
      return;
    }

    setNewsletterState("submitting");
    setNewsletterMessage("Subscribing...");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "architecture_footer_newsletter" }),
      });
      const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; success?: boolean; alreadySubscribed?: boolean; message?: string };

      if (!response.ok || payload.ok === false || payload.success === false) {
        throw new Error(payload.message || "Unable to subscribe right now.");
      }

      setNewsletterState("success");
      setNewsletterMessage(payload.alreadySubscribed ? "Already subscribed" : "Subscribed");
      setNewsletterEmail("");
    } catch (error) {
      setNewsletterState("error");
      setNewsletterMessage(error instanceof Error ? error.message : "Unable to subscribe right now. Please try again.");
    }
  }

  return (
    <motion.footer
      className="arch-journal-footer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.22 }}
      variants={staggerReveal}
    >
      <div className="arch-journal-footer-grid" aria-hidden="true" />
      <div className="arch-journal-footer-inner">
        <motion.div className="arch-journal-footer-top" variants={staggerReveal}>
          <motion.div className="arch-journal-footer-brand" variants={reveal}>
            <BrandLogo />
            <span>
              <span aria-hidden="true">&#10022;</span>
              {heroSupportingContent.eyebrow}
            </span>
          </motion.div>
          <motion.a
            className="arch-journal-footer-group-link"
            href="https://ractysh.com"
            target="_blank"
            rel="noreferrer"
            variants={reveal}
          >
            <span>Ractysh Group</span>
            <small>{footerContent.legal.notes}</small>
            <ArrowUpRight aria-hidden="true" />
          </motion.a>
        </motion.div>

        <motion.p className="max-w-3xl text-sm leading-8 text-white/66" variants={reveal}>
          {footerContent.brandStatement}
        </motion.p>

        <motion.h2 className="arch-journal-footer-statement font-display" variants={staggerReveal}>
          {architectureFooterStatement.map((line) => (
            <motion.span key={line} variants={{
              hidden: { y: "112%", opacity: 0 },
              visible: { y: "0%", opacity: 1, transition: { duration: 0.8, ease: power4Out } }
            }}>
              {line}
            </motion.span>
          ))}
        </motion.h2>

        <motion.div className="arch-journal-newsletter" variants={reveal}>
          <div className="arch-journal-newsletter-copy">
            <span>Studio Notes</span>
            <p>Receive architecture updates, project stories and design intelligence from Ractysh.</p>
          </div>
          <div>
            <div className={`arch-journal-newsletter-shell ${newsletterSubscribed ? "is-success" : ""}`}>
              <form className="arch-journal-newsletter-form" onSubmit={handleNewsletterSubmit}>
                <label className="sr-only" htmlFor="footer-newsletter-email">Email address</label>
                <span className="arch-journal-newsletter-input-wrap">
                  <Mail aria-hidden="true" />
                  <input
                    id="footer-newsletter-email"
                    name="email"
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(event) => {
                      setNewsletterEmail(event.target.value);
                      if (!newsletterSubmitting) { setNewsletterState("idle"); setNewsletterMessage(""); }
                    }}
                    aria-describedby="footer-newsletter-status"
                    placeholder="Email address"
                  />
                </span>
                <button type="submit" disabled={newsletterSubmitting}>
                  {newsletterSubmitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}
                  <span>{newsletterSubmitting ? "Sending" : "Subscribe"}</span>
                </button>
              </form>
              <AnimatePresence>
                {newsletterSubscribed ? (
                  <motion.div
                    className="arch-journal-newsletter-success"
                    role="status"
                    aria-live="polite"
                    initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                    animate={{ opacity: showNewsletterNotice ? 1 : 0, y: showNewsletterNotice ? 0 : 10, filter: showNewsletterNotice ? "blur(0px)" : "blur(8px)" }}
                    exit={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                    transition={{ duration: 0.6, ease: power4Out }}
                  >
                    <Check aria-hidden="true" />
                    <span>{newsletterMessage || "Subscribed"}</span>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            <p id="footer-newsletter-status" className={`arch-journal-newsletter-status ${newsletterState === "error" ? "is-error" : ""}`} aria-live="polite">
              {newsletterSubscribed ? "" : newsletterMessage}
            </p>
          </div>
        </motion.div>

        <motion.div className="arch-journal-footer-columns" variants={staggerReveal}>
          {architectureFooterColumns.map((column) => (
            <motion.div key={column.title} className="arch-journal-footer-column" variants={staggerReveal}>
              <motion.h3 variants={reveal}>{column.title}</motion.h3>
              <motion.div variants={staggerReveal}>
                {column.items.map((item) =>
                  "href" in item && item.href ? (
                    <Link
                      key={item.label}
                      className="arch-journal-footer-link"
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <motion.span key={item.label} className="arch-journal-footer-location" variants={formFieldReveal}>
                      {item.label}
                    </motion.span>
                  )
                )}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="arch-journal-footer-strip" variants={reveal}>
          <span>{heroSupportingContent.eyebrow}</span>
          <span>{footerContent.locations.items.map((item) => item.label).join(" • ")}</span>
          <span>{footerContent.legal.copyright}</span>
        </motion.div>
      </div>
    </motion.footer>
  );
}
