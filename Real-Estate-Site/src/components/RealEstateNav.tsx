"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

const editorialEase = [0.22, 1, 0.36, 1] as const;

const mobileMenuContainerVariants: Variants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
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
  show: { transition: { delayChildren: 0.18, staggerChildren: 0.08 } }
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

const mobileMenuLinks = [
  ["Services", "/real-estate-services"],
  ["The Building", "/#building"],
  ["Portfolio", "/#portfolio"],
  ["Location", "/#location"],
  ["Stories", "/#stories"]
] as const;

export default function RealEstateNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 10) {
        setNavHidden(false);
      } else if (currentY > lastScrollYRef.current) {
        setNavHidden(true);
      } else {
        setNavHidden(false);
      }
      lastScrollYRef.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`lp-header is-scrolled ${navHidden ? "is-hidden" : ""}`} aria-label="Primary navigation">
        <nav className="lp-nav" aria-label="Main menu">
          <Link href="/real-estate-services">Services</Link>
          <Link href="/#building">The Building</Link>
          <Link href="/#portfolio">Portfolio</Link>
          <Link href="/#location">Location</Link>
          <Link href="/#stories">Stories</Link>
        </nav>
        <Link className="lp-logo" href="/" aria-label="Ractysh Real Estate home">
          Ractysh Real Estate
        </Link>
        <Link className="re-mobile-brand" href="/" aria-label="Ractysh Real Estate home">
          <span className="re-mobile-brand-mark" aria-hidden="true">R</span>
          <span className="re-mobile-brand-copy">
            <span>RACTYSH</span>
            <small>REAL ESTATE</small>
          </span>
        </Link>
        <div className="lp-actions">
          <Link className="inquire-link" href="/#contact">Inquire</Link>
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
                    variants={mobileMenuItemVariants}
                    whileHover={{ x: 8, opacity: 1 }}
                    whileTap={{ x: 8, scale: 0.99 }}
                    transition={{ duration: 0.3, ease: editorialEase }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <strong>{label}</strong>
                  </motion.a>
                ))}
              </motion.div>
              <motion.a
                className="re-mobile-menu-cta"
                href="/#contact"
                variants={mobileMenuCtaVariants}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMobileMenuOpen(false)}
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
    </>
  );
}
