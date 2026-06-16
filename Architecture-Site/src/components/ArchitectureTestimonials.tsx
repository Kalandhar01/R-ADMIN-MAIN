"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { OptimizedImage as Image } from "@/components/OptimizedImage";
import { testimonialsContent } from "@/lib/architecturePremiumContent";
import { gsap, registerGsapPlugins } from "@/lib/gsap-client";

// Add images and metadata to the content
const enhancedTestimonials = testimonialsContent.items.map((item, idx) => {
  const images = [
    "/images/architecture/ractysh-laterite-court-residence.avif",
    "/images/architecture/ractysh-executive-work-pavilion.avif",
    "/images/architecture/architecture-content-premium-enterprise-building-04.webp",
    "/images/architecture/architecture-content-waterfront-home-05.webp",
    "/images/architecture/ractysh-madurai-quiet-court.avif",
    "/images/architecture/architecture-content-commercial-architecture-studio-03.webp",
  ];
  const years = ["2024", "2023", "2024", "2025", "2023", "2024"];
  const categories = [
    "Residential Architecture",
    "Commercial Workspace",
    "Corporate Headquarters",
    "Waterfront Hospitality",
    "Courtyard Residence",
    "Modern Residential",
  ];
  
  return {
    ...item,
    image: images[idx % images.length],
    year: years[idx % years.length],
    category: categories[idx % categories.length],
  };
});

// Magnetic Button Component
const MagneticButton = ({ children, onClick, className, direction = "next" }: { children: React.ReactNode, onClick: () => void, className?: string, direction?: "prev" | "next" }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    
    gsap.to(buttonRef.current, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.6,
      ease: "power2.out"
    });
    
    gsap.to(textRef.current, {
      x: x * 0.15,
      y: y * 0.15,
      duration: 0.6,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    gsap.to([buttonRef.current, textRef.current], {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.3)"
    });
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative flex items-center justify-center gap-2.5 overflow-hidden rounded-full border border-white/20 bg-white/5 px-6 py-3 text-[0.58rem] font-bold uppercase tracking-[0.22em] text-white backdrop-blur-xl transition-colors hover:border-executive-red/40",
        className
      )}
    >
      <div className="absolute inset-0 z-0 bg-executive-red/0 transition-colors group-hover:bg-executive-red/10" />
      <span ref={textRef} className="relative z-10 flex items-center gap-2.5 pointer-events-none">
        {direction === "prev" && <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1.5" />}
        {children}
        {direction === "next" && <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1.5" />}
      </span>
    </button>
  );
};

// Counter Component
const Counter = ({ value, suffix, label, index }: { value: string; suffix: string; label: string; index: number }) => {
  const numberRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const target = parseInt(value);
  
  useEffect(() => {
    registerGsapPlugins();
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current, 
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.5, 
          delay: index * 0.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );

      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 3,
        delay: index * 0.2 + 0.3,
        ease: "power4.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
        },
        onUpdate: () => {
          if (numberRef.current) numberRef.current.innerText = Math.floor(obj.val).toString();
        }
      });
    });
    return () => ctx.revert();
  }, [target, index]);

  return (
    <div ref={containerRef} className="flex flex-col opacity-0">
      <div className="font-display text-2xl md:text-4xl lg:text-5xl text-executive-red leading-none tracking-tighter">
        <span ref={numberRef}>0</span>{suffix}
      </div>
      <div className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.4em] text-nearblack/40 mt-3 md:mt-4">
        {label}
      </div>
    </div>
  );
};

// Character reveal utility
const CharacterReveal = ({ text, delay = 0, className }: { text: string, delay?: number, className?: string }) => {
  const chars = text.split("");
  return (
    <span className={cn("inline-block", className)}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.03,
            ease: "easeOut"
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

// Line reveal utility
const LineReveal = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  const words = text.split(" ");
  return (
    <span className="inline-block overflow-hidden">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{
            duration: 0.9,
            delay: delay + i * 0.03,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="inline-block mr-[0.25em] py-1"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

export function ArchitectureTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const AUTOPLAY_DURATION = 8000; // 8 seconds

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % enhancedTestimonials.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + enhancedTestimonials.length) % enhancedTestimonials.length);
  }, []);

  // Autoplay Logic
  useEffect(() => {
    const currentProgress = progressRef.current;

    if (!isPaused) {
      autoPlayTimerRef.current = setInterval(nextSlide, AUTOPLAY_DURATION);
      
      if (currentProgress) {
        gsap.fromTo(currentProgress, 
          { scaleX: 0 }, 
          { 
            scaleX: 1, 
            duration: AUTOPLAY_DURATION / 1000, 
            ease: "none",
            transformOrigin: "left"
          }
        );
      }
    } else {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      if (currentProgress) gsap.killTweensOf(currentProgress);
    }

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      if (currentProgress) gsap.killTweensOf(currentProgress);
    };
  }, [isPaused, currentIndex, nextSlide]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reduceMotion) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
    
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setMousePos({ x, y });

    // 3D Tilt for Card
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotateY: x * 8,
        rotateX: -y * 8,
        duration: 1.2,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotateY: 0,
        rotateX: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.3)"
      });
    }
  };

  const testimonial = enhancedTestimonials[currentIndex];

  return (
    <section 
      ref={containerRef}
      className="relative overflow-hidden bg-white text-nearblack" 
      data-arch-section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsPaused(true)}
    >
      {/* Background blueprint grid */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" 
           style={{ backgroundImage: "linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)", backgroundSize: "100px 100px" }} 
      />

      {/* Spotlight Effect */}
      <motion.div 
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-1000 lg:group-hover:opacity-100"
        animate={{ 
          background: `radial-gradient(1000px circle at ${mousePos.x * 100 + 50}% ${mousePos.y * 100 + 50}%, rgba(184, 147, 79, 0.08), transparent 80%)`
        }}
      />
      
      <div className="relative z-10 mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-32 lg:px-12 lg:py-48">
        <header className="mb-16 lg:mb-32">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 lg:gap-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
              }}
            >
              <div className="flex items-center gap-4">
                <div className="h-px w-8 md:w-12 bg-executive-red" />
                <p className="text-[0.55rem] md:text-[0.62rem] font-black uppercase tracking-[0.4em] text-executive-red">
                  Client Perspectives
                </p>
              </div>
              <h2 className="mt-6 md:mt-8 font-display text-4xl md:text-7xl lg:text-[7rem] font-light leading-[0.82] tracking-tighter">
                Trusted By <br />
                <span className="italic text-executive-red/90">Visionaries.</span>
              </h2>
            </motion.div>
            
            {/* Animated Counters */}
            <div className="grid grid-cols-3 gap-8 md:gap-16 lg:border-l lg:border-nearblack/10 lg:pl-20">
              <Counter value="500" suffix="+" label="Projects Delivered" index={0} />
              <Counter value="20" suffix="+" label="Years Experience" index={1} />
              <Counter value="98" suffix="%" label="Client Satisfaction" index={2} />
            </div>
          </div>
        </header>

        <div 
          ref={cardRef}
          className="relative flex flex-col md:block h-auto md:h-[620px] lg:h-[540px] w-full lg:max-w-[1180px] lg:mx-auto overflow-hidden rounded-[1.25rem] md:rounded-[2rem] border border-nearblack/5 shadow-[0_30px_80px_-24px_rgba(0,0,0,0.12)] bg-nearblack transition-shadow duration-700 hover:shadow-[0_44px_100px_-24px_rgba(0,0,0,0.18)]"
          style={{ perspective: "2000px" }}
        >
          {/* Card-specific spotlight */}
          <motion.div 
            className="pointer-events-none absolute inset-0 z-50 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            animate={{ 
              background: `radial-gradient(600px circle at ${mousePos.x * 100 + 50}% ${mousePos.y * 100 + 50}%, rgba(255, 255, 255, 0.03), transparent 70%)`
            }}
          />

          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative md:absolute md:inset-0 order-2 md:order-none grid grid-cols-1 lg:grid-cols-[44%_56%]"
            >
              {/* Left Side: Image with advanced parallax & zoom */}
              <div className="hidden md:block relative h-[36%] lg:h-full w-full overflow-hidden">
                <motion.div 
                  initial={{ scale: 1.15, x: direction * 40 }}
                  animate={{ scale: 1, x: 0 }}
                  exit={{ scale: 1.15, x: -direction * 40 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full w-full relative"
                  style={{ 
                    x: reduceMotion ? 0 : mousePos.x * -40,
                    y: reduceMotion ? 0 : mousePos.y * -40,
                  }}
                >
                  <Image
                    src={testimonial.image}
                    alt={testimonial.role}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-nearblack/20" />
                
                {/* Floating Image Mask Reveal for entry */}
                <motion.div 
                  initial={{ scaleY: 1 }}
                  whileInView={{ scaleY: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="absolute inset-0 bg-white z-20 origin-top"
                />

                <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8 text-white z-20 hidden lg:block overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="text-[0.55rem] font-bold uppercase tracking-[0.4em] text-white/60">Featured Project</p>
                    <p className="mt-2 font-display text-lg font-light tracking-tight">{testimonial.category}</p>
                  </motion.div>
                </div>
              </div>

              {/* Right Side: Content with line-by-line reveal */}
              <div className="relative flex flex-col justify-center bg-nearblack p-6 md:p-12 lg:p-16 text-white overflow-hidden">
                {/* Decorative depth element */}
                <motion.div 
                  className="absolute -right-10 -top-10 md:-right-16 md:-top-16 text-[9rem] md:text-[16rem] font-display text-white/[0.02] leading-none pointer-events-none"
                  style={{ 
                    x: reduceMotion ? 0 : mousePos.x * 60,
                    y: reduceMotion ? 0 : mousePos.y * 60,
                  }}
                >
                  &ldquo;
                </motion.div>

                <div className="relative z-10">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1, ease: "backOut" }}
                  >
                    <Quote className="h-8 w-8 md:h-12 md:w-12 text-executive-red mb-5 md:mb-8" />
                  </motion.div>
                  
                  <div className="min-h-[120px] md:min-h-[200px]">
                    <p className="font-display text-lg md:text-2xl lg:text-[1.875rem] font-light leading-[1.35] tracking-tight text-white/95">
                      <LineReveal text={`"${testimonial.quote}"`} delay={0.2} />
                    </p>
                  </div>

                  <div className="mt-6 md:mt-10 space-y-6 md:space-y-7">
                    <div className="overflow-hidden">
                      <div className="space-y-2">
                        <p className="font-display text-lg md:text-2xl font-light tracking-tight">
                          <CharacterReveal text={testimonial.author} delay={1} />
                        </p>
                        <motion.div 
                          className="flex items-center gap-3"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.8, delay: 1.3 }}
                        >
                          <div className="h-px w-4 md:h-px md:w-5 bg-executive-red" />
                          <p className="text-[0.55rem] md:text-[0.62rem] font-bold uppercase tracking-[0.28em] text-executive-red line-clamp-1">{testimonial.role}</p>
                        </motion.div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 md:gap-10 border-t border-white/10 pt-6 md:pt-7">
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.5 }}
                      >
                        <p className="text-[0.55rem] md:text-[0.58rem] font-bold uppercase tracking-[0.25em] text-white/40 mb-1 md:mb-1.5">Context</p>
                        <p className="text-[0.7rem] md:text-xs font-medium tracking-wide truncate">{testimonial.location}</p>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.6 }}
                      >
                        <p className="text-[0.55rem] md:text-[0.58rem] font-bold uppercase tracking-[0.25em] text-white/40 mb-1 md:mb-1.5">Delivered</p>
                        <p className="text-[0.7rem] md:text-xs font-medium tracking-wide truncate">{testimonial.year}</p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="relative order-3 md:order-none md:absolute md:bottom-8 md:right-8 z-[60] flex items-center justify-end gap-3 md:gap-4 px-6 pb-6 md:p-0">
            <div className="hidden md:flex gap-3">
              <MagneticButton onClick={prevSlide} direction="prev">
                Previous
              </MagneticButton>
              <MagneticButton onClick={nextSlide} direction="next">
                Next Story
              </MagneticButton>
            </div>
            {/* Mobile Controls: Compact & Accessible */}
            <div className="flex md:hidden gap-2 bg-nearblack/40 backdrop-blur-xl p-1.5 rounded-full border border-white/10">
               <button 
                 onClick={prevSlide} 
                 className="p-3 rounded-full bg-white/5 border border-white/10 text-white active:scale-95 transition-transform"
                 aria-label="Previous story"
               >
                 <ArrowLeft size={16}/>
               </button>
               <button 
                 onClick={nextSlide} 
                 className="p-3 rounded-full bg-executive-red/20 border border-executive-red/40 text-white active:scale-95 transition-transform"
                 aria-label="Next story"
               >
                 <ArrowRight size={16}/>
               </button>
            </div>
          </div>

          {/* Slide Indicator with Progress Bars: Moved to Top Right for Mobile Visibility */}
          <div className="relative order-1 md:order-none md:absolute md:top-8 md:left-8 lg:left-auto lg:right-8 z-[60] flex items-center gap-3 md:gap-4 px-6 pt-6 md:p-0">
            <span className="font-display text-[9px] md:text-xs text-white/40 tracking-widest">
              {String(currentIndex + 1).padStart(2, '0')} / {String(enhancedTestimonials.length).padStart(2, '0')}
            </span>
            <div className="flex gap-1.5 md:gap-2">
              {enhancedTestimonials.map((_, i) => (
                <div 
                  key={i} 
                  className="relative h-0.5 md:h-1 w-5 md:w-9 overflow-hidden rounded-full bg-white/20 cursor-pointer"
                  onClick={() => {
                    setDirection(i > currentIndex ? 1 : -1);
                    setCurrentIndex(i);
                  }}
                >
                  {currentIndex === i && (
                    <motion.div 
                      ref={progressRef}
                      className="absolute inset-0 bg-executive-red origin-left"
                      initial={{ scaleX: 0 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
