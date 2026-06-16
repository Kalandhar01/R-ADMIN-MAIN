"use client";

import Image from "next/image";
import Link from "next/link";
import India from "@react-map/india";
import { type CSSProperties, type FormEvent, type MouseEvent, type TouchEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type Variants } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { LandingData, PropertyView } from "@/lib/real-estate";
import { HeroParallax } from "@/components/ui/hero-parallax";
import ParallaxHeroImagesDemo from "@/components/parallax-hero-images-demo";
import { RactyshGroupFooterSubscribeCompact, RactyshGroupSubscribePopup } from "@/components/RactyshGroupSubscribe";
import FeaturedServicesSection from "@/components/FeaturedServicesSection";

gsap.registerPlugin(ScrollTrigger);

const heroDuration = 7000;
const buildingAutoplayDuration = 6000;
const buildingManualPauseDuration = 9000;
const editorialEase = [0.22, 1, 0.36, 1] as const;
const heroHeadlineLines = ["Invest In", "Spaces That", "Appreciate."];
const mobileMenuLinks = [
  ["Services", "#services"],
  ["The Building", "#building"],
  ["Portfolio", "#portfolio"],
  ["Location", "#location"],
  ["Investor Stories", "#stories"]
] as const;

const mobileMenuContainerVariants: Variants = {
  hidden: {
    opacity: 0,
    backdropFilter: "blur(0px)"
  },
  show: {
    opacity: 1,
    backdropFilter: "blur(26px)",
    transition: { duration: 0.6, ease: editorialEase }
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: { duration: 0.42, ease: editorialEase }
  }
};

const mobileMenuLogoVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(12px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 110, damping: 18, mass: 0.8, delay: 0.1 }
  }
};

const mobileMenuListVariants: Variants = {
  hidden: {},
  show: {
    transition: { delayChildren: 0.18, staggerChildren: 0.08 }
  }
};

const mobileMenuItemVariants: Variants = {
  hidden: { opacity: 0, x: -30, y: 20, filter: "blur(10px)" },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.62, ease: editorialEase }
  }
};

const mobileMenuCtaVariants: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 105, damping: 18, mass: 0.86, delay: 0.58 }
  }
};

const quoteTextVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.14,
      staggerChildren: 0.012
    }
  }
};

const quoteCharacterVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.48, ease: editorialEase }
  }
};

const heroCardContainerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 56,
    scale: 0.96,
    filter: "blur(20px)"
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      delay: 0.6,
      delayChildren: 0.78,
      staggerChildren: 0.08,
      ease: editorialEase
    }
  }
};

const mobileHeroCardContainerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 56,
    scale: 0.96,
    filter: "blur(20px)"
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      delay: 1.32,
      delayChildren: 1.48,
      staggerChildren: 0.08,
      ease: editorialEase
    }
  }
};

const heroCardContentVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.78,
      staggerChildren: 0.08
    }
  }
};

const heroCardItemVariants: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: editorialEase }
  }
};

const pageRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 56,
    filter: "blur(18px)"
  },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.82,
      delay,
      ease: editorialEase
    }
  })
};

const pageRevealItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 34,
    filter: "blur(14px)"
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.68,
      ease: editorialEase
    }
  }
};

const pageRevealContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.08
    }
  }
};

function pageRevealProps(reduced: boolean, delay = 0, amount = 0.2) {
  return {
    custom: delay,
    initial: reduced ? false : "hidden",
    whileInView: reduced ? undefined : "show",
    viewport: { once: true, amount, margin: "0px 0px -8% 0px" },
    variants: pageRevealVariants
  };
}

const buildingContentVariants = {
  initial: (reduced: boolean) => reduced ? { opacity: 0 } : { opacity: 0, y: 40, filter: "blur(16px)" },
  animate: (reduced: boolean) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: reduced ? 0.01 : 0.6, ease: editorialEase }
  }),
  exit: (reduced: boolean) => reduced
    ? { opacity: 0, transition: { duration: 0.01 } }
    : { opacity: 0, y: 24, filter: "blur(12px)", transition: { duration: 0.35, ease: editorialEase } }
};

const buildingImageVariants = {
  initial: (reduced: boolean) => reduced ? { opacity: 0 } : { opacity: 0, y: 38, scale: 1.06, filter: "blur(14px)" },
  animate: (reduced: boolean) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: reduced ? 0.01 : 0.8, ease: editorialEase }
  }),
  exit: (reduced: boolean) => reduced
    ? { opacity: 0, transition: { duration: 0.01 } }
    : { opacity: 0, y: 24, scale: 1.03, filter: "blur(10px)", transition: { duration: 0.35, ease: editorialEase } }
};

const buildingMobileImageVariants = {
  initial: (reduced: boolean) => reduced ? { opacity: 0 } : { opacity: 0, y: 38, scale: 1.08, filter: "blur(10px)" },
  animate: (reduced: boolean) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: reduced ? 0.01 : 0.8, ease: editorialEase }
  }),
  exit: (reduced: boolean) => reduced
    ? { opacity: 0, transition: { duration: 0.01 } }
    : { opacity: 0, y: 24, scale: 1.04, filter: "blur(8px)", transition: { duration: 0.35, ease: editorialEase } }
};

const heroVisuals = [
  {
    label: "Luxury Villa",
    image: "/images/hero/luxury-villa-golden-hour.webp",
    match: (property: PropertyView) => /villa|residence|estate/i.test(`${property.title} ${property.propertyType}`)
  },
  {
    label: "Premium Apartments",
    image: "/images/hero/premium-apartments-sunset.webp",
    match: (property: PropertyView) => /apartment|sky/i.test(`${property.title} ${property.propertyType}`)
  },
  {
    label: "Commercial Investment",
    image: "/images/hero/commercial-investment-evening.webp",
    match: (property: PropertyView) => /commercial|tower|frontage|office/i.test(`${property.title} ${property.propertyType}`)
  },
  {
    label: "Gated Community",
    image: "/images/hero/gated-community-sunrise.webp",
    match: (property: PropertyView) => /estate|community|courtyard|grove/i.test(`${property.title} ${property.propertyType}`)
  },
  {
    label: "Enterprise Property",
    image: "/images/hero/enterprise-property-campus.webp",
    match: (property: PropertyView) => /commercial|enterprise|heights|campus|investment/i.test(`${property.title} ${property.propertyType} ${property.summary}`)
  }
];

const enterprisePerformanceMetrics = [
  {
    value: 9,
    suffix: "+",
    label: "Assets Delivered"
  },
  {
    value: 3,
    suffix: "+",
    label: "Investor Partnerships"
  },
  {
    value: 55,
    suffix: " Cr+",
    label: "Portfolio Value"
  },
  {
    value: 100,
    suffix: "%",
    label: "Client Satisfaction"
  }
] as const;

const investmentLocationMarkers = [
  {
    city: "Coimbatore",
    x: 25.7,
    y: 84.9,
    labelPlacement: "left",
    thesis: "Western growth corridor",
    signal: "Villa and plotted development demand",
    asset: "Premium residential assets"
  },
  {
    city: "Palani",
    x: 27.6,
    y: 86.8,
    labelPlacement: "bottom",
    thesis: "Temple-town land bank",
    signal: "Long-hold appreciation pocket",
    asset: "Land-led acquisitions"
  },
  {
    city: "Dindigul",
    x: 29.2,
    y: 87.1,
    labelPlacement: "right",
    thesis: "Inland logistics spine",
    signal: "Residential-commercial expansion",
    asset: "Mixed-use corridors"
  },
  {
    city: "Chennai",
    x: 37,
    y: 77.7,
    labelPlacement: "right",
    thesis: "Coastal capital market",
    signal: "Urban edge and ECR demand",
    asset: "Apartment and villa exits"
  }
] as const;

type LeadIntent = "site_visit" | "callback" | "brochure" | "consultation";

const leadLabels: Record<LeadIntent, string> = {
  site_visit: "Book Site Visit",
  callback: "Request Callback",
  brochure: "Download Brochure",
  consultation: "Investment Consultation"
};

function statusText(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function heroLabel(property: PropertyView) {
  const text = `${property.title} ${property.propertyType} ${property.locationName}`.toLowerCase();
  if (text.includes("water") || text.includes("beach") || text.includes("coast") || text.includes("ecr")) return "Beachfront Property";
  if (text.includes("apartment") || text.includes("sky")) return "Premium Apartment";
  if (text.includes("commercial") || text.includes("tower") || text.includes("frontage")) return "Commercial Investment Property";
  return "Luxury Villa";
}

function selectHeroSlides(properties: PropertyView[]) {
  const used = new Set<string>();

  return heroVisuals.map((visual, index) => {
    const matched = properties.find((property) => visual.match(property) && !used.has(property.id));
    const property = matched || properties.find((item) => !used.has(item.id)) || properties[index % Math.max(properties.length, 1)];
    if (property) used.add(property.id);

    return {
      ...visual,
      property
    };
  }).filter((slide): slide is (typeof heroVisuals)[number] & { property: PropertyView } => Boolean(slide.property));
}

function selectBuildingProperties(properties: PropertyView[]) {
  const preferredSlugs = ["gardenia-apartment", "skyline-residence", "palm-grove-villa", "emerald-heights"];
  const selected = preferredSlugs
    .map((slug) => properties.find((property) => property.slug === slug))
    .filter((property): property is PropertyView => Boolean(property));

  properties.forEach((property) => {
    if (selected.length >= 4) return;
    if (!selected.some((item) => item.id === property.id)) selected.push(property);
  });

  return selected.slice(0, 4);
}

function metricNumber(value: string) {
  const match = value.replace(/,/g, "").match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function metricSuffix(label: string, property: PropertyView) {
  if (label === "Space") {
    return property.area.toLowerCase().includes("sqft") || property.area.toLowerCase().includes("sq.ft") ? " sq ft" : " sqm";
  }
  return "";
}

function MobileHeroHeadlineLine({ line, lineIndex }: { line: string; lineIndex: number }) {
  return (
    <span className="re-hero-mobile-line" aria-hidden="true">
      {line.split(" ").map((word, wordIndex, words) => (
        <span className="re-hero-word" key={`${line}-${word}`}>
          {Array.from(word).map((char, charIndex) => (
            <span
              className="re-hero-char"
              data-hero-char
              key={`${line}-${word}-${char}-${charIndex}`}
              style={{ "--char-index": lineIndex * 18 + wordIndex * 9 + charIndex } as CSSProperties}
            >
              {char}
            </span>
          ))}
          {wordIndex < words.length - 1 ? <span className="re-hero-word-space" aria-hidden="true" /> : null}
        </span>
      ))}
    </span>
  );
}

function AnimatedQuoteText({ text }: { text: string }) {
  return (
    <motion.span
      className="re-story-quote-text"
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.65 }}
      variants={quoteTextVariants}
    >
      {text.split(" ").map((word, wordIndex, words) => (
        <span key={`${word}-${wordIndex}`} className="re-story-word" aria-hidden="true">
          {Array.from(word).map((character, characterIndex) => (
            <motion.span key={`${word}-${character}-${characterIndex}`} className="re-story-char" variants={quoteCharacterVariants}>
              {character}
            </motion.span>
          ))}
          {wordIndex < words.length - 1 ? <span className="re-story-space"> </span> : null}
        </span>
      ))}
    </motion.span>
  );
}

function MetricCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const count = useMotionValue(0);
  const display = useTransform(count, (latest) => `${Math.round(latest).toLocaleString("en-IN")}${suffix}`);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHasEntered(true);
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasEntered) return;
    count.set(0);
    const controls = animate(count, value, {
      duration: prefersReducedMotion ? 0.01 : 0.9,
      ease: [0.22, 1, 0.36, 1]
    });
    return () => controls.stop();
  }, [count, hasEntered, prefersReducedMotion, value]);

  return (
    <motion.span ref={ref}>{display}</motion.span>
  );
}

function InvestmentIndiaMap() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="re-investment-map"
      data-map-reveal
      aria-label="India map highlighting Tamil Nadu investment locations"
      {...pageRevealProps(Boolean(prefersReducedMotion), 0, 0.22)}
    >
      <div className="re-investment-map-frame" aria-hidden="true" />
      <div className="re-investment-map-axis" aria-hidden="true">
        <span>South India Acquisition Axis</span>
      </div>
      <motion.div
        className="re-investment-map-canvas"
        {...pageRevealProps(Boolean(prefersReducedMotion), 0.08, 0.32)}
      >
        <India
          type="select-single"
          size={560}
          mapColor="#e8ddd4"
          strokeColor="rgba(62, 43, 36, 0.46)"
          strokeWidth={0.82}
          hoverColor="#d8ccb6"
          selectColor="#3e2b24"
          cityColors={{
            "Tamil Nadu": "#3e2b24",
            Karnataka: "#e3d8c8",
            Kerala: "#ddd0bf",
            "Andhra Pradesh": "#e6ddd2",
            Telangana: "#e7ded4"
          }}
          disableClick
          hints={false}
        />
        <svg className="re-investment-map-lines" viewBox="0 0 100 100" aria-hidden="true">
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 1.05, delay: 0.45, ease: "easeOut" }}
            d="M25.7 84.9C28.2 84.1 32.9 81.1 37 77.7"
          />
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.9, delay: 0.58, ease: "easeOut" }}
            d="M27.6 86.8C28.2 87.1 28.6 87.2 29.2 87.1"
          />
          <motion.path
            className="re-investment-map-route-primary"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 1.2, delay: 0.74, ease: "easeOut" }}
            d="M25.7 84.9C27.1 86.1 28.3 86.9 29.2 87.1C32.4 84 35.1 80.8 37 77.7"
          />
        </svg>
      </motion.div>
      <motion.div className="re-investment-map-caption" {...pageRevealProps(Boolean(prefersReducedMotion), 0.12, 0.32)}>
        <span>Investment Geography</span>
        <strong>Tamil Nadu Network</strong>
        <small>Coimbatore / Palani / Dindigul / Chennai</small>
      </motion.div>
      <motion.div className="re-investment-map-legend" aria-hidden="true" {...pageRevealProps(Boolean(prefersReducedMotion), 0.16, 0.32)}>
        <span><i />Active Corridors</span>
        <span><i />Tamil Nadu Focus</span>
      </motion.div>
      <div className="re-investment-markers-layer">
        {investmentLocationMarkers.map((marker, index) => (
          <motion.span
            key={marker.city}
            className="re-investment-marker"
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            data-placement={marker.labelPlacement}
            tabIndex={0}
            aria-label={`${marker.city} investment marker`}
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.76, y: 18, filter: "blur(10px)" }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: 0.48, delay: 0.72 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="re-investment-marker-label">{marker.city}</span>
            <span className="re-investment-marker-tooltip">
              <strong>{marker.city}</strong>
              <span>{marker.thesis}</span>
              <em>{marker.asset}</em>
              <small>{marker.signal}</small>
            </span>
          </motion.span>
        ))}
      </div>
      <div className="re-investment-place-list" aria-label="Investment locations">
        {investmentLocationMarkers.map((marker, index) => (
          <motion.span
            key={`place-list-${marker.city}`}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18, filter: "blur(8px)" }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.48, delay: 0.88 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {marker.city}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

function RoiGraph({ activeKey }: { activeKey: string }) {
  const reduceMotion = useReducedMotion();
  const lineTransition = reduceMotion
    ? { duration: 0.01 }
    : { duration: 1.5, delay: 1.2, ease: editorialEase };

  return (
    <div className="re-roi-graph" aria-label="Animated growth visualization">
      <span>Growth Outlook</span>
      <svg viewBox="0 0 260 92" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="roiGradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(196,182,147,0.15)" />
            <stop offset="52%" stopColor="rgba(196,182,147,0.82)" />
            <stop offset="100%" stopColor="rgba(241,236,234,0.95)" />
          </linearGradient>
        </defs>
        <path className="re-roi-grid" d="M10 72H250M10 46H250M10 20H250" />
        <motion.path
          key={`${activeKey}-roi-glow`}
          className="re-roi-glow"
          d="M12 74 C48 68 62 60 88 57 C120 53 128 34 154 36 C185 39 196 20 222 17 C236 15 246 13 252 10"
          initial={{ pathLength: 0, opacity: reduceMotion ? 1 : 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={lineTransition}
        />
        <motion.path
          key={`${activeKey}-roi-line`}
          className="re-roi-line"
          d="M12 74 C48 68 62 60 88 57 C120 53 128 34 154 36 C185 39 196 20 222 17 C236 15 246 13 252 10"
          initial={{ pathLength: 0, opacity: reduceMotion ? 1 : 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={lineTransition}
        />
        {[
          [12, 74],
          [88, 57],
          [154, 36],
          [222, 17],
          [252, 10]
        ].map(([cx, cy], index) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="3.5"
            className="re-roi-point"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: reduceMotion ? 0.01 : 0.38,
              delay: reduceMotion ? 0 : 1.7 + index * 0.08,
              ease: editorialEase
            }}
          />
        ))}
      </svg>
    </div>
  );
}

function LeadDrawer({
  property,
  intent,
  onClose
}: {
  property: PropertyView | null;
  intent: LeadIntent | null;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!property || !intent) return;
    setStatus("idle");
    setMessage("");
  }, [property, intent]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!property || !intent) return;

    const formData = new FormData(event.currentTarget);
    setStatus("submitting");
    setMessage("");

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        budget: formData.get("budget"),
        message: formData.get("message"),
        propertyId: property.id,
        propertySlug: property.slug,
        propertyTitle: property.title,
        propertyType: property.propertyType,
        interestType: intent,
        sourcePage: window.location.href
      })
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus("error");
      setMessage(payload.message || "Please check the details and try again.");
      return;
    }

    setStatus("success");
    setMessage(payload.message || "Consultation request received. Our real estate desk will reach out shortly.");
  }

  return (
    <AnimatePresence>
      {property && intent ? (
        <motion.div
          className="re-lead-shell"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.form
            className="re-lead-form"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 28, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={submit}
            onClick={(event) => event.stopPropagation()}
          >
            <button className="re-lead-close" type="button" onClick={onClose} aria-label="Close request form">
              Close
            </button>
            <p>{leadLabels[intent]}</p>
            <h2>{property.title}</h2>
            <span>{property.locationName} / {property.investmentValue}</span>

            {status === "success" ? (
              <div className="re-success">
                <h3>Consultation Request Received.</h3>
                <p>{message}</p>
              </div>
            ) : (
              <>
                <div className="re-lead-grid">
                  <label>Name<input name="name" required /></label>
                  <label>Email<input name="email" type="email" required /></label>
                  <label>Phone<input name="phone" /></label>
                  <label>Budget<input name="budget" /></label>
                </div>
                <label className="re-message">Message<textarea name="message" rows={4} /></label>
                {status === "error" ? <strong className="re-error">{message}</strong> : null}
                <button type="submit" disabled={status === "submitting"}>
                  {status === "submitting" ? "Submitting" : leadLabels[intent]}
                </button>
              </>
            )}
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function RealEstateLandingClient({ data }: { data: LandingData }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const heroCardRef = useRef<HTMLElement | null>(null);
  const cursorGlowRef = useRef<HTMLDivElement | null>(null);
  const pauseTimerRef = useRef<number | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const buildingImageParallaxRef = useRef<HTMLElement | null>(null);
  const buildingPauseTimerRef = useRef<number | null>(null);
  const storyTouchStartXRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);
  const navScrollTickingRef = useRef(false);
  const reduceMotion = useReducedMotion();
  const prefersReducedMotion = Boolean(reduceMotion);
  const buildingImageRawX = useMotionValue(0);
  const buildingImageRawY = useMotionValue(0);
  const buildingImageX = useSpring(buildingImageRawX, { stiffness: 120, damping: 24, mass: 0.35 });
  const buildingImageY = useSpring(buildingImageRawY, { stiffness: 120, damping: 24, mass: 0.35 });
  const { scrollYProgress: buildingImageScrollProgress } = useScroll({
    target: buildingImageParallaxRef,
    offset: ["start end", "end start"]
  });
  const buildingImageParallaxY = useTransform(buildingImageScrollProgress, [0, 1], prefersReducedMotion ? [0, 0] : [24, -24]);
  const [activeHero, setActiveHero] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [navSurface, setNavSurface] = useState<"dark" | "light">("dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileBuilding, setIsMobileBuilding] = useState(false);
  const [isMobileStories, setIsMobileStories] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [activeBuilding, setActiveBuilding] = useState(0);
  const [buildingManualPaused, setBuildingManualPaused] = useState(false);
  const [leadProperty, setLeadProperty] = useState<PropertyView | null>(null);
  const [leadIntent, setLeadIntent] = useState<LeadIntent | null>(null);
  const heroSlides = useMemo(() => selectHeroSlides(data.properties), [data.properties]);
  const buildingProperties = useMemo(() => selectBuildingProperties(data.properties), [data.properties]);
  const showcaseProjects = useMemo(() => {
    const source = data.featured.length ? data.featured : data.properties;
    const selected = [...source];

    data.properties.forEach((property) => {
      if (!selected.some((item) => item.id === property.id)) selected.push(property);
    });

    return selected.slice(0, 8);
  }, [data.featured, data.properties]);
  const activeHeroSlide = heroSlides[activeHero];
  const hero = activeHeroSlide?.property || data.properties[0];
  const building = buildingProperties[activeBuilding] || buildingProperties[0] || data.properties[0];
  const story = data.testimonials[storyIndex];

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileMenuOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const isOpen = leadProperty && leadIntent;
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [leadProperty, leadIntent]);

  useEffect(() => {
    const buildingMediaQuery = window.matchMedia("(max-width: 767px)");
    const storiesMediaQuery = window.matchMedia("(max-width: 900px)");

    function syncMobileSections() {
      setIsMobileBuilding(buildingMediaQuery.matches);
      setIsMobileStories(storiesMediaQuery.matches);
    }

    syncMobileSections();
    buildingMediaQuery.addEventListener("change", syncMobileSections);
    storiesMediaQuery.addEventListener("change", syncMobileSections);

    return () => {
      buildingMediaQuery.removeEventListener("change", syncMobileSections);
      storiesMediaQuery.removeEventListener("change", syncMobileSections);
    };
  }, []);

  useEffect(() => {
    if (heroSlides.length <= 1 || reduceMotion || heroPaused) return;
    const timer = window.setInterval(() => setActiveHero((current) => (current + 1) % heroSlides.length), heroDuration);
    return () => window.clearInterval(timer);
  }, [activeHero, heroPaused, heroSlides.length, reduceMotion]);

  useEffect(() => {
    if (buildingProperties.length <= 1 || prefersReducedMotion || buildingManualPaused) return;
    const timer = window.setInterval(() => {
      setActiveBuilding((current) => (current + 1) % buildingProperties.length);
    }, buildingAutoplayDuration);
    return () => window.clearInterval(timer);
  }, [buildingManualPaused, buildingProperties.length, prefersReducedMotion]);

  useEffect(() => {
    if (!buildingProperties.length) return;
    setActiveBuilding((current) => Math.min(current, buildingProperties.length - 1));
  }, [buildingProperties.length]);

  useEffect(() => {
    if (data.testimonials.length <= 1) return;
    const timer = window.setInterval(() => setStoryIndex((current) => (current + 1) % data.testimonials.length), 5600);
    return () => window.clearInterval(timer);
  }, [data.testimonials.length]);

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current);
      if (buildingPauseTimerRef.current) window.clearTimeout(buildingPauseTimerRef.current);
    };
  }, []);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    function updateNavVisibility() {
      const currentY = Math.max(window.scrollY, 0);
      const delta = currentY - lastScrollYRef.current;
      const sampleY = currentY + Math.min(window.innerHeight * 0.22, 180);
      const isMobileViewport = window.matchMedia("(max-width: 1023px)").matches;
      const sectionMap: Array<[string, "dark" | "light"]> = [
        ["top", "dark"],
        ["about", "light"],
        ["building", "light"],
        ["portfolio", "light"],
        ["location", "light"],
        ["stories", "light"],
        ["contact", "dark"]
      ];
      const currentSection = sectionMap.find(([sectionId]) => {
        const section = document.getElementById(sectionId);
        if (!section) return false;
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        return sampleY >= sectionTop && sampleY < sectionBottom;
      });

      setNavScrolled(currentY > 18);
      setNavSurface(currentSection?.[1] || "light");

      if (isMobileViewport || currentY < 48) {
        setNavHidden(false);
      } else if (Math.abs(delta) > 8) {
        setNavHidden(delta > 0);
      }

      lastScrollYRef.current = currentY;
      navScrollTickingRef.current = false;
    }

    function handleScroll() {
      if (navScrollTickingRef.current) return;
      navScrollTickingRef.current = true;
      window.requestAnimationFrame(updateNavVisibility);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateNavVisibility();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const glow = cursorGlowRef.current;
    if (!glow) return;

    const finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches) return;

    gsap.set(glow, { autoAlpha: 0, x: window.innerWidth / 2, y: window.innerHeight / 2 });

    function handlePointerMove(event: PointerEvent) {
      gsap.to(glow, {
        autoAlpha: 1,
        x: event.clientX,
        y: event.clientY,
        duration: 0.42,
        ease: "power3.out",
        overwrite: "auto"
      });
    }

    function handlePointerLeave() {
      gsap.to(glow, { autoAlpha: 0, duration: 0.28, ease: "power2.out" });
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
      gsap.killTweensOf(glow);
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (!rootRef.current || reduceMotion) return;
    const activeSlide = rootRef.current.querySelector("[data-hero-active='true'] .re-hero-media");
    const activeImage = rootRef.current.querySelector("[data-hero-active='true'] .re-hero-media img");
    const kicker = rootRef.current.querySelector("[data-hero-kicker]");
    const lines = rootRef.current.querySelectorAll("[data-hero-line]");
    const mobileChars = rootRef.current.querySelectorAll("[data-hero-char]");
    const subheading = rootRef.current.querySelector("[data-hero-subheading]");
    const cta = rootRef.current.querySelector("[data-hero-cta]");
    const progress = progressRef.current;
    const isMobileHero = window.matchMedia("(max-width: 900px)").matches;
    const timeline = gsap.timeline();

    gsap.killTweensOf([activeSlide, activeImage, kicker, lines, mobileChars, subheading, cta, progress]);
    timeline.fromTo(activeSlide, { autoAlpha: 0, scale: isMobileHero ? 1.1 : 1.08 }, { autoAlpha: 1, scale: 1, duration: 1.25, ease: "power3.out" }, 0);
    if (activeImage) {
      timeline.to(activeImage, { scale: 1.035, duration: 7.4, ease: "sine.inOut", repeat: -1, yoyo: true }, 1.15);
    }
    timeline.fromTo(kicker, { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, ease: "power3.out" }, 0.28);
    timeline.fromTo(
      lines,
      { y: 48, autoAlpha: 0, clipPath: "inset(0 0 100% 0)" },
      { y: 0, autoAlpha: 1, clipPath: "inset(0 0 0% 0)", duration: 1, stagger: 0.12, ease: "power4.out" },
      0.42
    );
    if (isMobileHero && mobileChars.length) {
      timeline.fromTo(
        mobileChars,
        { y: 28, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.58, stagger: 0.018, ease: "power4.out" },
        0.48
      );
    }
    timeline.fromTo(subheading, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.62, ease: "power3.out" }, 1.02);
    timeline.fromTo(cta, { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.56, ease: "power3.out" }, 1.18);
    if (progress) gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: heroDuration / 1000, ease: "none", transformOrigin: "left center" });

    return () => {
      timeline.kill();
      if (activeImage) gsap.killTweensOf(activeImage);
      if (progress) gsap.killTweensOf(progress);
    };
  }, [activeHero, reduceMotion]);

  useEffect(() => {
    if (!rootRef.current) return;

    const context = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set("[data-reveal]", { clearProps: "all" });
        return;
      }

      gsap.to(".re-hero-parallax", {
        yPercent: -6,
        scale: 1.05,
        ease: "none",
        scrollTrigger: { trigger: ".re-hero", start: "top top", end: "bottom top", scrub: 0.9 }
      });

      gsap.to(".re-hero-content", {
        autoAlpha: 0,
        yPercent: -6,
        ease: "none",
        scrollTrigger: { trigger: ".re-hero", start: "58% top", end: "bottom top", scrub: 0.8 }
      });

      gsap.utils.toArray<SVGPathElement>("[data-map-line]").forEach((path) => {
        const length = path.getTotalLength();
        const trigger = path.closest("[data-map-reveal]") as HTMLElement | null;

        gsap.set(path, {
          autoAlpha: 1,
          strokeDasharray: length,
          strokeDashoffset: length
        });

        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.45,
          ease: "power3.out",
          scrollTrigger: { trigger: trigger || path, start: "top 76%" }
        });
      });

      gsap.fromTo(
        "[data-map-marker]",
        { autoAlpha: 0, y: 16, scale: 0.86 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.72,
          stagger: 0.09,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: ".re-india-map", start: "top 72%" }
        }
      );

      gsap.utils.toArray<HTMLElement>(".re-story-panel img, .re-property-panel img").forEach((image) => {
        gsap.to(image, {
          scale: 1.06,
          yPercent: -5,
          ease: "none",
          scrollTrigger: { trigger: image, start: "top bottom", end: "bottom top", scrub: 0.8 }
        });
      });

    }, rootRef);

    const refresh = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      window.cancelAnimationFrame(refresh);
      context.revert();
    };
  }, []);

  function openLead(property: PropertyView, intent: LeadIntent) {
    setLeadProperty(property);
    setLeadIntent(intent);
  }

  function pauseHeroBriefly() {
    setHeroPaused(true);
    if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = window.setTimeout(() => setHeroPaused(false), 9000);
  }

  function setHeroSlide(index: number) {
    pauseHeroBriefly();
    setActiveHero(index);
  }

  function handleHeroMouseMove(event: MouseEvent<HTMLElement>) {
    if (reduceMotion || !heroCardRef.current) return;
    if (window.matchMedia("(max-width: 900px), (pointer: coarse)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroCardRef.current.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    heroCardRef.current.style.setProperty("--my", `${(y + 0.5) * 100}%`);
    gsap.to(heroCardRef.current, { x: x * 10, y: y * 10, duration: 0.6, ease: "power3.out" });
  }

  function handleHeroMouseLeave() {
    setHeroPaused(false);
    if (heroCardRef.current) {
      gsap.to(heroCardRef.current, { x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 0.7, ease: "power3.out" });
    }
  }

  function handleAnchoredNavClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault();
    setMobileMenuOpen(false);

    const target = document.getElementById(href.replace("#", ""));
    if (!target) return;

    const isMobileViewport = window.matchMedia("(max-width: 1023px)").matches;
    const header = document.querySelector<HTMLElement>(".lp-header");
    const headerHeight = isMobileViewport ? header?.getBoundingClientRect().height ?? 80 : 0;
    const offset = isMobileViewport ? headerHeight + 14 : 0;
    const targetY = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: "smooth"
    });
  }

  function pauseBuildingAutoplay() {
    setBuildingManualPaused(true);
    if (buildingPauseTimerRef.current) window.clearTimeout(buildingPauseTimerRef.current);
    buildingPauseTimerRef.current = window.setTimeout(() => setBuildingManualPaused(false), buildingManualPauseDuration);
  }

  function setBuildingSlide(index: number) {
    pauseBuildingAutoplay();
    setActiveBuilding(((index % buildingProperties.length) + buildingProperties.length) % buildingProperties.length);
  }

  function moveBuildingSlide(direction: 1 | -1) {
    pauseBuildingAutoplay();
    setActiveBuilding((current) => (current + direction + buildingProperties.length) % buildingProperties.length);
  }

  function moveStory(direction: 1 | -1) {
    if (!data.testimonials.length) return;
    setStoryIndex((current) => (current + direction + data.testimonials.length) % data.testimonials.length);
  }

  function handleStoryTouchStart(event: TouchEvent<HTMLElement>) {
    storyTouchStartXRef.current = event.touches[0]?.clientX ?? null;
  }

  function handleStoryTouchEnd(event: TouchEvent<HTMLElement>) {
    const startX = storyTouchStartXRef.current;
    storyTouchStartXRef.current = null;
    if (startX === null) return;

    const endX = event.changedTouches[0]?.clientX ?? startX;
    const distance = endX - startX;
    if (Math.abs(distance) < 42) return;

    moveStory(distance < 0 ? 1 : -1);
  }

  function resetBuildingImageParallax() {
    buildingImageRawX.set(0);
    buildingImageRawY.set(0);
  }

  function handleBuildingImageMove(event: MouseEvent<HTMLElement>) {
    if (prefersReducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    buildingImageRawX.set(x * 16);
    buildingImageRawY.set(y * 16);
  }

  function handleBuildingSectionLeave() {
    resetBuildingImageParallax();
  }

  return (
    <main ref={rootRef} className="lp52-site re-site">
      <div ref={cursorGlowRef} className="re-cursor-glow" aria-hidden="true" />
      <RactyshGroupSubscribePopup />
      <header className={`lp-header ${navHidden ? "is-hidden" : ""} ${navScrolled ? "is-scrolled" : ""} ${mobileMenuOpen ? "is-menu-open" : ""} is-on-${navSurface}`} aria-label="Primary navigation">
        <nav className="lp-nav" aria-label="Main menu">
          <a href="#services">Services</a>
          <a href="#building">The Building</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#location">Location</a>
          <a href="#stories">Stories</a>
        </nav>
        <a className="lp-logo" href="#top" aria-label="Ractysh Real Estate home">Ractysh Real Estate</a>
        <a className="re-mobile-brand" href="#top" aria-label="Ractysh Real Estate home">
          <span className="re-mobile-brand-mark" aria-hidden="true">R</span>
          <span className="re-mobile-brand-copy">
            <span>RACTYSH</span>
            <small>REAL ESTATE</small>
          </span>
        </a>
        <div className="lp-actions">
          <a className="inquire-link" href="#contact">Inquire</a>
        </div>
        <motion.button
          className="re-mobile-menu-button"
          type="button"
          aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
          animate={{
            scale: mobileMenuOpen ? 0.98 : 1,
            boxShadow: mobileMenuOpen
              ? "0 18px 46px rgba(62, 43, 36, 0.26), inset 0 1px 0 rgba(255, 255, 255, 0.18)"
              : "0 16px 42px rgba(62, 43, 36, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.18)"
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.4, ease: editorialEase }}
        >
          <span className="re-mobile-monogram" aria-hidden="true">
            <motion.span
              className="re-mobile-monogram-r"
              animate={mobileMenuOpen ? { opacity: 0, scale: 0.72, rotate: -12, filter: "blur(6px)" } : { opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.4, ease: editorialEase }}
            >
              R
            </motion.span>
            <motion.span
              className="re-mobile-monogram-x"
              animate={mobileMenuOpen ? { opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" } : { opacity: 0, scale: 0.72, rotate: 12, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: editorialEase }}
            >
              <motion.span
                className="re-mobile-monogram-x-line re-mobile-monogram-x-line-a"
                animate={mobileMenuOpen ? { opacity: 1, width: 24 } : { opacity: 0, width: 0 }}
                transition={{ duration: 0.38, ease: editorialEase }}
              />
              <motion.span
                className="re-mobile-monogram-x-line re-mobile-monogram-x-line-b"
                animate={mobileMenuOpen ? { opacity: 1, width: 24 } : { opacity: 0, width: 0 }}
                transition={{ duration: 0.38, delay: mobileMenuOpen ? 0.04 : 0, ease: editorialEase }}
              />
            </motion.span>
          </span>
        </motion.button>
      </header>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <motion.nav
            className="re-mobile-menu"
            aria-label="Mobile menu"
            variants={mobileMenuContainerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <motion.button
              className="re-mobile-menu-close"
              type="button"
              aria-label="Close mobile menu"
              onClick={() => setMobileMenuOpen(false)}
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
              transition={{ type: "spring", stiffness: 140, damping: 18, mass: 0.8 }}
              whileTap={{ scale: 0.94 }}
            >
              <span className="re-mobile-menu-close-line re-mobile-menu-close-line-a" aria-hidden="true" />
              <span className="re-mobile-menu-close-line re-mobile-menu-close-line-b" aria-hidden="true" />
            </motion.button>
            <div className="re-mobile-menu-inner">
              <motion.div className="re-mobile-menu-brand" variants={mobileMenuLogoVariants}>
                <span>Ractysh Real Estate</span>
                <small>South India Premium Assets</small>
              </motion.div>
              <motion.div className="re-mobile-menu-links" variants={mobileMenuListVariants}>
                {mobileMenuLinks.map(([label, href]) => (
                  <motion.a
                    className="re-mobile-menu-link"
                    key={label}
                    href={href}
                    onClick={(event) => handleAnchoredNavClick(event, href)}
                    variants={mobileMenuItemVariants}
                    whileHover={{ x: 8, opacity: 1 }}
                    whileTap={{ x: 8, scale: 0.99 }}
                    transition={{ duration: 0.3, ease: editorialEase }}
                  >
                    <strong>{label}</strong>
                  </motion.a>
                ))}
              </motion.div>
              <motion.a
                className="re-mobile-menu-cta"
                href="#contact"
                onClick={(event) => handleAnchoredNavClick(event, "#contact")}
                variants={mobileMenuCtaVariants}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Private Consultation</span>
                <ArrowRight aria-hidden />
              </motion.a>
              <motion.figure
                className="re-mobile-menu-preview"
                variants={mobileMenuItemVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
              >
                <Image
                  src="/real-estate/projects/palm-grove-villa.webp"
                  alt=""
                  fill
                  sizes="(max-width: 767px) 88vw, 360px"
                />
                <figcaption>
                  <strong>Palm Grove Villa</strong>
                  <span>Coimbatore</span>
                </figcaption>
              </motion.figure>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>

      <motion.section
        className="re-hero"
        id="top"
        aria-label="Ractysh Real Estate showcase"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 40, filter: "blur(18px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: editorialEase }}
      >
        {heroSlides.map((slide, index) => (
          <div key={slide.label} className="re-hero-slide" data-hero-active={index === activeHero}>
            <div className="re-hero-media re-hero-parallax">
              <Image src={slide.image} alt="" fill priority={index === 0} sizes="100vw" />
            </div>
          </div>
        ))}
        <div className="re-hero-depth" aria-hidden="true" />
        <div className="re-hero-grid" aria-hidden="true" />
        <div className="re-hero-shade" />
        <div
          className="re-hero-content"
          onMouseEnter={() => setHeroPaused(true)}
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
        >
          <div className="re-hero-title">
            <p data-hero-kicker>{activeHeroSlide?.label || (hero ? heroLabel(hero) : "Ractysh Real Estate")}</p>
            <h1 aria-label={heroHeadlineLines.join(" ")}>
              {heroHeadlineLines.map((line, lineIndex) => (
                <span key={line} data-hero-line>
                  <span className="re-hero-desktop-line">{line}</span>
                  <MobileHeroHeadlineLine line={line} lineIndex={lineIndex} />
                </span>
              ))}
            </h1>
            <small data-hero-subheading>Premium residences, commercial properties and investment opportunities curated through one enterprise ecosystem.</small>
            <div data-hero-cta className="re-hero-actions">
              <a href="#portfolio">View Opportunities <ArrowDown aria-hidden /></a>
              {hero ? <button type="button" onClick={() => openLead(hero, "consultation")}>Private Consultation <ArrowRight aria-hidden /></button> : null}
            </div>
            {hero ? (
              <motion.aside
                key={`mobile-hero-card-${hero.id}`}
                className="re-mobile-hero-preview"
                variants={mobileHeroCardContainerVariants}
                initial="hidden"
                animate="show"
              >
                <motion.span variants={heroCardItemVariants}>{hero.propertyType}</motion.span>
                <motion.strong variants={heroCardItemVariants}>{hero.title}</motion.strong>
                <dl>
                  <motion.div variants={heroCardItemVariants}><dt>Location</dt><dd>{hero.locationName}</dd></motion.div>
                  <motion.div variants={heroCardItemVariants}><dt>Investment</dt><dd>{hero.investmentValue}</dd></motion.div>
                </dl>
              </motion.aside>
            ) : null}
          </div>
          {hero ? (
            <motion.div
              key={`hero-card-${hero.id}`}
              className="re-hero-card-shell"
              data-hero-card
              variants={heroCardContainerVariants}
              initial="hidden"
              animate="show"
            >
              <motion.div
                className="re-hero-card-float"
                animate={reduceMotion ? { y: 0 } : { y: [0, -8, 0], transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
                whileHover={reduceMotion ? undefined : { y: -8, transition: { duration: 0.3, ease: editorialEase } }}
              >
                <motion.aside className="re-hero-card" ref={heroCardRef} variants={heroCardContentVariants} initial="hidden" animate="show">
                  <motion.span variants={heroCardItemVariants}>{hero.propertyType}</motion.span>
                  <motion.h2 variants={heroCardItemVariants}>{hero.title}</motion.h2>
                  <motion.p variants={heroCardItemVariants}>{hero.summary}</motion.p>
                  <motion.dl variants={heroCardItemVariants}>
                    <motion.div variants={heroCardItemVariants}><dt>Location</dt><dd>{hero.locationName}</dd></motion.div>
                    <motion.div variants={heroCardItemVariants}><dt><span className="re-investment-label-desktop">Investment</span><span className="re-investment-label-mobile">Starting Price</span></dt><dd>{hero.investmentValue}</dd></motion.div>
                    <motion.div variants={heroCardItemVariants}><dt>Signal</dt><dd>{hero.roiIndicator}</dd></motion.div>
                  </motion.dl>
                  <motion.div variants={heroCardItemVariants}>
                    <RoiGraph activeKey={hero.id} />
                  </motion.div>
                  <motion.div variants={heroCardItemVariants}>
                    <Link className="re-hero-card-link" href={`/properties/${hero.slug}`}>View Property <ArrowUpRight aria-hidden /></Link>
                  </motion.div>
                </motion.aside>
              </motion.div>
            </motion.div>
          ) : null}
        </div>
        {heroSlides.length > 1 ? (
          <div className="re-hero-controls" aria-label="Property showcase controls">
            <button type="button" onClick={() => setHeroSlide((activeHero - 1 + heroSlides.length) % heroSlides.length)} aria-label="Previous property"><ChevronLeft /></button>
            <div className="re-progress"><span ref={progressRef} /></div>
            <button type="button" onClick={() => setHeroSlide((activeHero + 1) % heroSlides.length)} aria-label="Next property"><ChevronRight /></button>
            <div className="re-dots">
              {heroSlides.map((slide, index) => (
                <button key={slide.label} type="button" onClick={() => setHeroSlide(index)} aria-label={`Show ${slide.label}`} className={index === activeHero ? "active" : ""} />
              ))}
            </div>
          </div>
        ) : null}
        <a className="re-hero-scroll-indicator" href="#portfolio" aria-label="Explore opportunities">
          <span>Explore Opportunities</span>
          <i aria-hidden="true" />
        </a>
      </motion.section>

      <motion.section
        id="about"
        aria-label="Ractysh Real Estate private acquisition platform"
        {...pageRevealProps(prefersReducedMotion, 0, 0.32)}
      >
        <ParallaxHeroImagesDemo />
      </motion.section>

      <FeaturedServicesSection />

      {building ? (
        <motion.section
          className="building-section re-building"
          id="building"
          onMouseLeave={handleBuildingSectionLeave}
          {...pageRevealProps(prefersReducedMotion, 0, 0.18)}
        >
          <div className="building-inner re-building-inner">
            <motion.div
              className="building-heading re-building-heading"
              data-reveal
              {...pageRevealProps(prefersReducedMotion, 0.04, 0.45)}
            >
              <p>The Building</p>
              <div className="re-building-mobile-stats" aria-label="Building highlights">
                <span>18 Floors</span>
                <i aria-hidden="true" />
                <span>Modern Icon</span>
              </div>
              <h2>
                At 18 stories and with its <em>unique design</em>, La Perla is a <em>modernist icon</em> in the city&apos;s skyline.
              </h2>
              <p className="re-building-mobile-description">
                A landmark residential development crafted for modern urban living and long-term value.
              </p>
            </motion.div>

            <motion.div className="re-building-switcher" aria-label="Property switcher" data-reveal {...pageRevealProps(prefersReducedMotion, 0.1, 0.32)}>
              {buildingProperties.map((property, index) => (
                <motion.button
                  key={property.id}
                  type="button"
                  initial={false}
                  animate={{
                    backgroundColor: index === activeBuilding ? "#3e2b24" : "rgba(241, 236, 234, 0.18)",
                    borderColor: index === activeBuilding ? "rgba(196, 182, 147, 0.34)" : "rgba(62, 43, 36, 0)",
                    boxShadow: index === activeBuilding ? "inset 0 0 0 1px rgba(196, 182, 147, 0.18)" : "inset 0 0 0 1px rgba(62, 43, 36, 0)",
                    color: index === activeBuilding ? "#c4b693" : "#3e2b24"
                  }}
                  whileHover={{
                    backgroundColor: "#3e2b24",
                    borderColor: "rgba(196, 182, 147, 0.34)",
                    boxShadow: "inset 0 0 0 1px rgba(196, 182, 147, 0.18)",
                    color: "#c4b693"
                  }}
                  transition={{ duration: 0.5, ease: editorialEase }}
                  onClick={() => setBuildingSlide(index)}
                  className={index === activeBuilding ? "active" : ""}
                  aria-pressed={index === activeBuilding}
                >
                  <span>{property.title}</span>
                  <small>{property.locationName}</small>
                </motion.button>
              ))}
            </motion.div>

            {buildingProperties.length > 1 ? (
              <motion.div className="re-building-carousel-controls" aria-label="Building carousel controls" data-reveal {...pageRevealProps(prefersReducedMotion, 0.14, 0.32)}>
                <button type="button" onClick={() => moveBuildingSlide(-1)} aria-label="Previous building">
                  <ChevronLeft aria-hidden />
                </button>
                <span>{String(activeBuilding + 1).padStart(2, "0")} / {String(buildingProperties.length).padStart(2, "0")}</span>
                <button type="button" onClick={() => moveBuildingSlide(1)} aria-label="Next building">
                  <ChevronRight aria-hidden />
                </button>
              </motion.div>
            ) : null}

            <div className="re-building-stage">
              <motion.figure
                ref={buildingImageParallaxRef}
                key={isMobileBuilding ? "building-mobile-image" : "building-desktop-image"}
                className="re-building-image"
                data-clip-reveal
                {...pageRevealProps(prefersReducedMotion, 0.16, 0.32)}
                onMouseMove={handleBuildingImageMove}
                onMouseLeave={resetBuildingImageParallax}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={building.id}
                    layout
                    layoutId="re-building-property-image"
                    custom={prefersReducedMotion}
                    variants={isMobileBuilding ? buildingMobileImageVariants : buildingImageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{ x: buildingImageX, y: isMobileBuilding ? buildingImageParallaxY : buildingImageY }}
                  >
                    <Image src={building.coverImage} alt={building.title} fill sizes="(min-width: 900px) 55vw, 100vw" />
                  </motion.div>
                </AnimatePresence>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.figcaption
                    key={`building-image-overlay-${building.id}`}
                    className="re-building-mobile-image-overlay"
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { duration: prefersReducedMotion ? 0.01 : 0.8, ease: editorialEase }
                    }}
                    exit={prefersReducedMotion
                      ? { opacity: 0, transition: { duration: 0.01 } }
                      : { opacity: 0, y: 18, transition: { duration: 0.3, ease: editorialEase } }}
                  >
                    <strong>Gardenia Apartment</strong>
                    <span>ECR Urban Edge, Chennai</span>
                    <em>Luxury Residence</em>
                  </motion.figcaption>
                </AnimatePresence>
              </motion.figure>
              <span className="re-building-mobile-divider" aria-hidden="true" />

              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  key={building.id}
                  className="re-building-card"
                  custom={prefersReducedMotion}
                  variants={buildingContentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
                    <motion.span variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}>{building.propertyType}</motion.span>
                    <motion.h3 variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}>{building.title}</motion.h3>
                    <motion.p variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}>{building.summary}</motion.p>
                  </motion.div>
                  <ul className="re-building-metrics">
                    {building.metrics.slice(0, 4).map((metric) => (
                      <motion.li
                        key={`${building.id}-${metric.label}`}
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 24, filter: "blur(10px)" }}
                        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.55, ease: editorialEase }}
                      >
                        <span>{metric.label}</span>
                        <strong>
                          <MetricCounter value={metricNumber(metric.value)} suffix={metricSuffix(metric.label, building)} />
                        </strong>
                      </motion.li>
                    ))}
                  </ul>
                  <div className="re-building-actions">
                    <Link href={`/properties/${building.slug}`}>View Property <ArrowUpRight aria-hidden /></Link>
                    <button type="button" onClick={() => openLead(building, "brochure")}>View Floor Plan</button>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>
        </motion.section>
      ) : null}

      <motion.section id="portfolio" className="re-portfolio re-works-showcase" {...pageRevealProps(prefersReducedMotion, 0, 0.18)}>
        <HeroParallax
          projects={showcaseProjects}
          title="Featured Developments"
          subtitle="Ownership-grade residences, investment assets and premium developments across South India."
        />
      </motion.section>

      <motion.section className="re-location-intelligence" id="location" aria-label="Location intelligence" {...pageRevealProps(prefersReducedMotion, 0, 0.16)}>
        <div className="re-location-intelligence-overview">
          <div className="re-location-intelligence-left">
            <motion.div className="re-location-intelligence-copy re-location-intelligence-copy-centered" data-reveal {...pageRevealProps(prefersReducedMotion, 0.04, 0.35)}>
              <p>Location Intelligence</p>
              <h2>South India Investment Network</h2>
              <span>Strategically selected acquisition corridors positioned across high-growth residential and commercial markets.</span>
            </motion.div>

            <motion.div
              className="re-location-trust-panel"
              data-reveal
              initial={prefersReducedMotion ? false : "hidden"}
              whileInView={prefersReducedMotion ? undefined : "show"}
              viewport={{ once: true, amount: 0.32, margin: "0px 0px -8% 0px" }}
              variants={pageRevealContainerVariants}
            >
              <p className="re-location-trust-label">Trust Signals</p>
              <div className="re-location-trust-grid" aria-label="Trust signals">
                {enterprisePerformanceMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    className="re-location-trust-card"
                    variants={pageRevealItemVariants}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.56, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <strong><MetricCounter value={metric.value} suffix={metric.suffix} /></strong>
                    <span>{metric.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            className="re-location-intelligence-map-shell"
            {...pageRevealProps(prefersReducedMotion, 0.08, 0.28)}
          >
            <InvestmentIndiaMap />
          </motion.div>
        </div>
      </motion.section>

      {story ? (
        <motion.section className="re-stories" id="stories" {...pageRevealProps(prefersReducedMotion, 0, 0.18)}>
          <motion.div className="re-section-head re-stories-heading" data-reveal {...pageRevealProps(prefersReducedMotion, 0.04, 0.38)}>
            <p>Investor Stories</p>
            <h2>Private acquisition stories, told with restraint.</h2>
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.article
              key={story.id}
              className="re-story-panel"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 42, filter: "blur(18px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24, filter: "blur(12px)" }}
              transition={{ duration: 0.58, ease: editorialEase }}
              onTouchStart={handleStoryTouchStart}
              onTouchEnd={handleStoryTouchEnd}
            >
              <motion.figure
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 38, scale: isMobileStories ? 0.95 : 1, filter: "blur(16px)", clipPath: "inset(0 0 12% 0)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)", clipPath: "inset(0 0 0% 0)" }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98, filter: "blur(12px)", clipPath: "inset(0 0 10% 0)" }}
                transition={{ duration: 0.86, ease: editorialEase }}
              >
                <Image src={story.image} alt={story.name} fill sizes="(min-width: 1100px) 38vw, 100vw" quality={90} />
              </motion.figure>
              <motion.div
                className="re-story-copy"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 40, filter: "blur(14px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, filter: "blur(10px)" }}
                transition={{ duration: 0.6, ease: editorialEase }}
              >
                <span className="re-story-quote-mark" aria-hidden="true">“</span>
                <blockquote>
                  <AnimatedQuoteText text={story.quote} />
                </blockquote>
                <motion.div
                  className="re-story-author-card"
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 14, filter: "blur(8px)" }}
                  transition={{ duration: 0.5, delay: 0.28, ease: editorialEase }}
                >
                  <strong>{story.name}</strong>
                  <span>{story.role}</span>
                  <span>{story.companyName || "Private Acquisition"}</span>
                  <small>Acquired through Ractysh Real Estate</small>
                </motion.div>
              </motion.div>
            </motion.article>
          </AnimatePresence>
          <motion.div className="re-story-controls">
            <button className="re-story-arrow" type="button" onClick={() => moveStory(-1)} aria-label="Previous investor story">← Previous</button>
            <span className="re-story-count" aria-label={`Story ${storyIndex + 1} of ${data.testimonials.length}`}>
              {String(storyIndex + 1).padStart(2, "0")} / {String(data.testimonials.length).padStart(2, "0")}
            </span>
            <button className="re-story-arrow" type="button" onClick={() => moveStory(1)} aria-label="Next investor story">Next →</button>
            <div className="re-story-dots">
              {data.testimonials.map((item, index) => (
                <button key={item.id} type="button" onClick={() => setStoryIndex(index)} className={index === storyIndex ? "active" : ""} aria-label={`Show story ${index + 1}`} />
              ))}
            </div>
          </motion.div>
        </motion.section>
      ) : null}

      <motion.section className="prefooter-spacer re-closing" {...pageRevealProps(prefersReducedMotion, 0, 0.24)}>
        <h2>Acquire spaces with clarity, restraint and long-term value.</h2>
        <p className="text-xl">Private residences, premium apartments and commercial investments shaped through the Ractysh enterprise ecosystem.</p>
        {hero ? <button type="button" onClick={() => openLead(hero, "consultation")}>Schedule Consultation</button> : null}
      </motion.section>

      <motion.footer
        className="re-footer"
        id="contact"
        variants={pageRevealContainerVariants}
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView={prefersReducedMotion ? undefined : "show"}
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="re-footer-inner">
          <div className="re-footer-grid">
            <motion.div className="re-footer-brand-col" variants={pageRevealItemVariants}>
              <div className="re-footer-brand-logo">
                <span className="re-footer-brand-mark">R</span>
                <div className="re-footer-brand-text">
                  <strong>RACTYSH</strong>
                  <small>REAL ESTATE</small>
                </div>
              </div>
              <p className="re-footer-brand-desc">
                Premium property acquisition and investment opportunities across South India.
              </p>
              <div className="re-footer-social">
                <a href="https://instagram.com/ractysh" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
                <a href="https://linkedin.com/company/ractysh" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>
                <a href="mailto:hello@ractysh.com" aria-label="Email">
                  <Mail size={18} />
                </a>
              </div>
            </motion.div>

            <motion.div className="re-footer-links-col" variants={pageRevealItemVariants}>
              <h3 className="re-footer-col-title">Locations</h3>
              <ul className="re-footer-col-list">
                <li><a href="#location">Coimbatore</a></li>
                <li><a href="#location">Palani</a></li>
                <li><a href="#location">Dindigul</a></li>
              </ul>
            </motion.div>

            <motion.div className="re-footer-links-col" variants={pageRevealItemVariants}>
              <h3 className="re-footer-col-title">Services</h3>
              <ul className="re-footer-col-list">
                <li><a href="#portfolio">Residential</a></li>
                <li><a href="#portfolio">Commercial</a></li>
                <li><a href="#portfolio">Investment Consulting</a></li>
                <li><a href="#portfolio">Portfolio Advisory</a></li>
              </ul>
            </motion.div>

            <motion.div className="re-footer-links-col" variants={pageRevealItemVariants}>
              <h3 className="re-footer-col-title">Contact</h3>
              <ul className="re-footer-col-list re-footer-contact-list">
                <li>
                  <a href="mailto:hello@ractysh.com">
                    <Mail size={14} />
                    <span>hello@ractysh.com</span>
                  </a>
                </li>
                <li>
                  <a href="tel:+919876543210">
                    <Phone size={14} />
                    <span>+91 98765 43210</span>
                  </a>
                </li>
                <li>
                  <span className="re-footer-contact-addr">
                    <MapPin size={14} />
                    <span>Coimbatore, Tamil Nadu</span>
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div className="re-footer-subscribe-row" variants={pageRevealItemVariants}>
            <RactyshGroupFooterSubscribeCompact />
          </motion.div>

          <motion.div className="re-footer-bottom" variants={pageRevealItemVariants}>
            <p className="re-footer-copy">&copy; 2026 Ractysh Real Estate. All rights reserved.</p>
            <div className="re-footer-legal">
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
            </div>
          </motion.div>
        </div>
      </motion.footer>

      <LeadDrawer property={leadProperty} intent={leadIntent} onClose={() => {
        setLeadProperty(null);
        setLeadIntent(null);
      }} />
    </main>
  );
}
