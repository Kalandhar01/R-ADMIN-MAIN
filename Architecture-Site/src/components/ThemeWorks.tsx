import { motion, type Variants } from "framer-motion";

// Placeholder component for "Theme works" – a dedicated visual block that can later be
// populated with themed projects, videos, or interactive content. It follows the same
// reveal animation pattern used throughout the site.

const reveal: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function ThemeWorks() {
  return (
    <motion.section className="arch-theme-works" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
      <h2 className="font-display arch-section-title">Theme Works</h2>
      <p className="arch-theme-works-copy">
        {/* TODO: Populate with themed project showcases, renderings, or interactive media. */}
        This area will highlight curated works that embody the visual and conceptual theme of the site.
      </p>
    </motion.section>
  );
}
