"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RactyshGroupFooterSubscribeCompact } from "@/components/RactyshGroupSubscribe";
import { Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

const editorialEase = [0.22, 1, 0.36, 1] as const;

const footerContainerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const footerItemVariants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: editorialEase },
  },
};

export default function RealEstateFooter() {
  return (
    <motion.footer
      className="re-footer"
      id="contact"
      variants={footerContainerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="re-footer-inner">
        <div className="re-footer-grid">
          <motion.div className="re-footer-brand-col" variants={footerItemVariants}>
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

          <motion.div className="re-footer-links-col" variants={footerItemVariants}>
            <h3 className="re-footer-col-title">Locations</h3>
            <ul className="re-footer-col-list">
              <li><Link href="/#location">Coimbatore</Link></li>
              <li><Link href="/#location">Palani</Link></li>
              <li><Link href="/#location">Dindigul</Link></li>
            </ul>
          </motion.div>

          <motion.div className="re-footer-links-col" variants={footerItemVariants}>
            <h3 className="re-footer-col-title">Services</h3>
            <ul className="re-footer-col-list">
              <li><Link href="/real-estate-services">Residential</Link></li>
              <li><Link href="/real-estate-services">Commercial</Link></li>
              <li><Link href="/real-estate-services">Investment Consulting</Link></li>
              <li><Link href="/real-estate-services">Portfolio Advisory</Link></li>
            </ul>
          </motion.div>

          <motion.div className="re-footer-links-col" variants={footerItemVariants}>
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

        <motion.div className="re-footer-subscribe-row" variants={footerItemVariants}>
          <RactyshGroupFooterSubscribeCompact />
        </motion.div>

        <motion.div className="re-footer-bottom" variants={footerItemVariants}>
          <p className="re-footer-copy">&copy; 2026 Ractysh Real Estate. All rights reserved.</p>
          <div className="re-footer-legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
