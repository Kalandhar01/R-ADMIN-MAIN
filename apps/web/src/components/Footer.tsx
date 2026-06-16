"use client";

import { motion } from "framer-motion";
import type { NavItem, SocialLink } from "@/lib/types";
import { FooterBackground } from "@/components/FooterBackground";
import { FooterBottom } from "@/components/FooterBottom";

interface FooterProps {
  headline: string;
  description: string;
  links: NavItem[];
  socialLinks?: SocialLink[];
}

export function Footer({ headline, description, links, socialLinks }: FooterProps) {
  return (
    <footer className="relative z-[70] isolate overflow-hidden overflow-x-clip bg-[#080807] px-6 py-8 text-white [contain:paint] sm:px-7 md:px-8 md:py-6">
      <FooterBackground />
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.76, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto max-w-[76rem]"
      >
        <FooterBottom headline={headline} description={description} links={links} socialLinks={socialLinks} />
      </motion.div>
    </footer>
  );
}
