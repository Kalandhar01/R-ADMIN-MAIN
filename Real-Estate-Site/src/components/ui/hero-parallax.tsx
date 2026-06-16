"use client";

import Image from "next/image";
import { AnimatePresence, motion, type MotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, MapPin, X } from "lucide-react";
import { type CSSProperties, type RefObject, type UIEvent, useMemo, useRef, useState } from "react";
import type { PropertyView } from "@/lib/real-estate";

type HeroParallaxProps = {
  projects: PropertyView[];
  title: string;
  subtitle: string;
};

const springConfig = { stiffness: 160, damping: 36, mass: 0.45 };
const ease = [0.22, 1, 0.36, 1] as const;

function statusLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function galleryImages(project: PropertyView) {
  const images = project.gallery.filter((item) => item.kind !== "video").map((item) => item.url);
  return Array.from(new Set([project.coverImage, ...images])).slice(0, 5);
}

export function HeroParallax({ projects, title, subtitle }: HeroParallaxProps) {
  const [selectedProject, setSelectedProject] = useState<PropertyView | null>(null);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const mobileScrollerRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 300]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -300]), springConfig);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [reduceMotion ? 0 : 5, 0]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [reduceMotion ? 0 : 3, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [reduceMotion ? 0 : -120, 60]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.62, 1]), springConfig);

  const rows = useMemo(() => {
    const primary = projects.slice(0, 4);
    const secondary = projects.slice(4, 8);
    const tertiary = projects.slice(8, 12);

    return [
      { items: primary, reverse: true, translate: translateX },
      { items: secondary, reverse: false, translate: translateXReverse },
      { items: tertiary, reverse: true, translate: translateX }
    ].filter((row) => row.items.length > 0);
  }, [projects, translateX, translateXReverse]);
  const mobileProjects = useMemo(() => projects.slice(0, 8), [projects]);
  const mobileSlideCount = mobileProjects.length + 1;

  if (!projects.length) return null;

  function handleMobileWorksScroll(event: UIEvent<HTMLDivElement>) {
    const scroller = event.currentTarget;
    const slides = Array.from(scroller.querySelectorAll<HTMLElement>("[data-mobile-works-slide]"));
    if (!slides.length) return;

    const center = scroller.scrollLeft + scroller.clientWidth / 2;
    let nextIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    slides.forEach((slide, index) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const distance = Math.abs(slideCenter - center);
      if (distance < closestDistance) {
        closestDistance = distance;
        nextIndex = index;
      }
    });

    setMobileActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  }

  return (
    <>
      <div
        ref={ref}
        className="re-works-parallax-stage relative flex h-[180vh] flex-col self-auto overflow-hidden py-32 antialiased [perspective:1000px] [transform-style:preserve-3d]"
      >
        <HeroParallaxHeader title={title} subtitle={subtitle} />
        <motion.div className="re-works-parallax-stack" style={{ rotateX, rotateZ, translateY, opacity }}>
          {rows.map((row, index) => (
            <motion.div
              key={`property-row-${index}`}
              className={`re-works-row mb-14 flex gap-10 ${row.reverse ? "flex-row-reverse" : "flex-row"}`}
            >
              {row.items.map((project) => (
                <PropertyParallaxCard key={project.id} project={project} translate={row.translate} onOpen={() => setSelectedProject(project)} />
              ))}
            </motion.div>
          ))}
        </motion.div>
      </div>

      <section className="re-mobile-works-showcase" aria-label="Featured developments mobile showcase">
        <motion.div
          className="re-mobile-works-heading"
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 1, ease }}
        >
          <span>Ractysh Real Estate</span>
          <p>{title}</p>
          <h2>
            Ownership-grade residences,{" "}
            <br />
            investment assets and premium{" "}
            <br />
            developments across South India.
          </h2>
        </motion.div>

        <div className="re-mobile-works-rail" ref={mobileScrollerRef} onScroll={handleMobileWorksScroll}>
          {mobileProjects.map((project, index) => (
            <MobileWorksCard
              key={project.id}
              project={project}
              active={mobileActiveIndex === index}
              containerRef={mobileScrollerRef}
              onOpen={() => setSelectedProject(project)}
            />
          ))}
          <motion.div
            className="re-mobile-works-cta-card"
            data-mobile-works-slide
            initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.8, ease }}
          >
            <span>Explore All Developments</span>
            <button
              type="button"
              onClick={() => {
                mobileScrollerRef.current?.scrollTo({ left: 0, behavior: "smooth" });
                setMobileActiveIndex(0);
              }}
            >
              View Portfolio <ArrowUpRight aria-hidden />
            </button>
          </motion.div>
        </div>

        <div
          className="re-mobile-works-progress"
          aria-hidden="true"
          style={{
            "--active-index": mobileActiveIndex,
            "--slide-count": mobileSlideCount,
            "--progress-steps": Math.max(mobileSlideCount - 1, 1)
          } as CSSProperties}
        >
          <span />
        </div>
      </section>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  );
}

function HeroParallaxHeader({ title, subtitle, compact = false }: { title: string; subtitle: string; compact?: boolean }) {
  return (
    <div className={`re-works-header relative left-0 top-0 mx-auto w-full max-w-7xl px-4 ${compact ? "py-8" : "py-20 md:py-28"}`}>
      <p className="font-sans text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[#8d7542]">Ractysh Real Estate Works Showcase</p>
      <h2 className="mt-5 max-w-4xl text-[clamp(3rem,7vw,7rem)] font-medium italic leading-[0.88] text-[#3e2b24]">{title}</h2>
      <p className="mt-7 max-w-2xl font-sans text-[clamp(0.98rem,1.7vw,1.2rem)] leading-8 text-[#645941]">{subtitle}</p>
    </div>
  );
}

function MobileWorksCard({
  project,
  active,
  containerRef,
  onOpen
}: {
  project: PropertyView;
  active: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  onOpen: () => void;
}) {
  const cardRef = useRef<HTMLButtonElement | null>(null);
  const { scrollXProgress } = useScroll({
    container: containerRef,
    target: cardRef,
    axis: "x",
    offset: ["start end", "end start"]
  });
  const imageY = useTransform(scrollXProgress, [0, 1], [-20, 20]);

  return (
    <motion.button
      ref={cardRef}
      type="button"
      data-mobile-works-slide
      className="re-mobile-works-card"
      initial={{ opacity: 0.4, scale: 0.92, filter: "blur(6px)" }}
      animate={{
        opacity: active ? 1 : 0.55,
        scale: active ? 1 : 0.92,
        filter: active ? "blur(0px)" : "blur(6px)"
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 1.02 }}
      transition={{ duration: 0.8, ease }}
      onClick={onOpen}
      aria-label={`Open ${project.title}`}
    >
      <motion.span className="re-mobile-works-image-parallax" style={{ y: imageY }} aria-hidden>
        <span className="re-mobile-works-image-zoom">
          <Image
            src={project.coverImage}
            alt=""
            fill
            sizes="85vw"
            className="object-cover"
            loading="lazy"
          />
        </span>
      </motion.span>
      <span className="re-mobile-works-overlay" aria-hidden />
      <span className="re-mobile-works-card-copy">
        <strong>{project.title}</strong>
        <span>{project.locationName}</span>
        <em>{project.investmentValue}</em>
      </span>
    </motion.button>
  );
}

function PropertyParallaxCard({
  project,
  translate,
  onOpen
}: {
  project: PropertyView;
  translate: MotionValue<number>;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      style={{ x: translate }}
      whileHover={{ scale: 1.03, y: -10 }}
      transition={{ duration: 0.45, ease }}
      className="group/property re-property-parallax-card relative h-[25rem] w-[31rem] shrink-0 overflow-hidden rounded-3xl border border-[#c4b693]/30 bg-[#3e2b24] text-left shadow-[0_34px_100px_rgba(62,43,36,0.22)]"
      onClick={onOpen}
      aria-label={`Open ${project.title}`}
    >
      <PropertyCardImage project={project} sizes="31rem" />
      <PropertyCardChrome project={project} />
    </motion.button>
  );
}

function PropertyCardImage({ project, sizes }: { project: PropertyView; sizes: string }) {
  return (
    <motion.span className="absolute inset-0" aria-hidden whileHover={{ scale: 1.08 }} transition={{ duration: 0.8, ease }}>
      <Image src={project.coverImage} alt="" fill sizes={sizes} className="object-cover" />
    </motion.span>
  );
}

function PropertyCardChrome({ project }: { project: PropertyView }) {
  return (
    <>
      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(62,43,36,0.05),rgba(62,43,36,0.86))]" aria-hidden />
      <span className="absolute inset-0 bg-white/0 backdrop-blur-0 transition duration-500 group-hover/property:bg-white/8 group-hover/property:backdrop-blur-[2px]" aria-hidden />
      <span className="re-property-card-pills absolute left-5 right-5 top-5 flex flex-wrap gap-2">
        <span className="max-w-[13rem] truncate rounded-full border border-[#f1ecea]/25 bg-[#f1ecea]/14 px-3 py-1.5 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#f1ecea] backdrop-blur-md">
          {project.locationName}
        </span>
        <span className="max-w-[10rem] truncate rounded-full border border-[#c4b693]/35 bg-[#3e2b24]/48 px-3 py-1.5 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#f1ecea] backdrop-blur-md">
          {project.investmentValue}
        </span>
        <span className="max-w-[11rem] truncate rounded-full border border-[#c4b693]/35 bg-[#c4b693]/18 px-3 py-1.5 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#f1ecea] backdrop-blur-md">
          ROI {project.roiIndicator}
        </span>
      </span>
      <span className="re-property-card-details absolute bottom-0 left-0 right-0 translate-y-4 p-7 opacity-0 transition duration-500 group-hover/property:translate-y-0 group-hover/property:opacity-100">
        <span className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#c4b693]">{project.propertyType}</span>
        <strong className="mt-3 block text-[2.15rem] font-medium italic leading-none text-[#f1ecea]">{project.title}</strong>
        <span className="mt-4 flex items-center gap-2 font-sans text-sm text-[#f1ecea]/84">
          <MapPin className="h-4 w-4" aria-hidden />
          {project.locationName}
        </span>
        <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#f1ecea]/30 bg-[#f1ecea]/14 px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#f1ecea] backdrop-blur-md">
          View Development <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
      </span>
      <span className="re-property-card-summary absolute bottom-5 left-5 right-5 transition duration-500 group-hover/property:translate-y-3 group-hover/property:opacity-0">
        <span className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#c4b693]">{statusLabel(project.status)}</span>
        <strong className="mt-2 block text-[2rem] font-medium italic leading-none text-[#f1ecea]">{project.title}</strong>
      </span>
    </>
  );
}

function ProjectModal({ project, onClose }: { project: PropertyView | null; onClose: () => void }) {
  const images = project ? galleryImages(project) : [];

  return (
    <AnimatePresence>
      {project ? (
        <motion.div className="fixed inset-0 z-[80] bg-[#120c09]/72 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button className="absolute inset-0 cursor-default" type="button" aria-label="Close project details" onClick={onClose} />
          <motion.article
            className="relative mx-auto grid h-auto max-h-none w-full max-w-6xl overflow-visible rounded-3xl border border-[#c4b693]/34 bg-[#f1ecea] text-[#3e2b24] shadow-[0_44px_140px_rgba(18,12,9,0.42)] lg:grid-cols-[1.18fr_0.82fr]"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.985 }}
            transition={{ duration: 0.42, ease }}
          >
            <button className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-[#3e2b24]/18 bg-[#f1ecea]/78 text-[#3e2b24] backdrop-blur-md" type="button" aria-label="Close project details" onClick={onClose}>
              <X className="h-5 w-5" aria-hidden />
            </button>
            <div className="grid gap-2 p-3">
              <figure className="relative min-h-[21rem] overflow-hidden rounded-[1.25rem] bg-[#3e2b24] lg:min-h-[42rem]">
                <Image src={images[0] || project.coverImage} alt={project.title} fill sizes="(min-width: 1024px) 56vw, 100vw" className="object-cover" />
              </figure>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {images.slice(1, 5).map((image, index) => (
                  <figure key={`${project.id}-gallery-${image}`} className="relative aspect-[1.35/1] overflow-hidden rounded-[1rem] bg-[#3e2b24]">
                    <Image src={image} alt={`${project.title} gallery ${index + 2}`} fill sizes="(min-width: 768px) 14vw, 45vw" className="object-cover" />
                  </figure>
                ))}
              </div>
            </div>
            <div className="p-7 lg:p-9">
              <p className="font-sans text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#8d7542]">{project.categoryName} / {statusLabel(project.status)}</p>
              <h3 className="mt-4 text-[clamp(3rem,6vw,5.7rem)] font-medium italic leading-[0.88]">{project.title}</h3>
              <p className="mt-6 font-sans text-base leading-8 text-[#645941]">{project.description}</p>
              <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[1.25rem] border border-[#3e2b24]/16 bg-[#3e2b24]/16 font-sans">
                {[
                  ["Investment", project.investmentValue],
                  ["Location", project.locationName],
                  ["Property Type", project.propertyType],
                  ["ROI", project.roiIndicator],
                  ["Ticket Size", project.ticketSize],
                  ["Appreciation", project.appreciation]
                ].map(([label, value]) => (
                  <div key={label} className="min-h-28 bg-[#f8f3ef]/82 p-4">
                    <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#8d7542]">{label}</dt>
                    <dd className="mt-3 text-sm font-semibold leading-6 text-[#3e2b24]">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {project.metrics.map((metric) => (
                  <div key={`${project.id}-${metric.label}`} className="rounded-[1rem] border border-[#3e2b24]/14 bg-white/42 p-4">
                    <span className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#8d7542]">{metric.label}</span>
                    <strong className="mt-2 block text-2xl font-medium">{metric.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </motion.article>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
