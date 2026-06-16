"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Download, MapPin, Play } from "lucide-react";
import type { PropertyDetailData, PropertyView } from "@/lib/real-estate";
import { OptimizedImage as Image } from "@/components/OptimizedImage";

const easeOut = [0.22, 1, 0.36, 1] as const;
const power4Out = [0.16, 1, 0.3, 1] as const;

// --- Animation Variants (from Architecture Site) ---

const reveal: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: power4Out }
  }
};

const maskReveal: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const maskLineReveal: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.72, ease: power4Out }
  }
};

const maskCopyReveal: Variants = {
  hidden: { y: "112%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.8, ease: power4Out }
  }
};

const imageReveal: Variants = {
  hidden: { clipPath: "inset(0% 0% 100% 0%)" },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 1.4, ease: power4Out }
  }
};

const ruleReveal: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.95, ease: power4Out }
  }
};

// --- Sub-components (Architecture Style) ---

function MaskRevealH1({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.h1 className={`arch-mask-reveal ${className}`} variants={maskReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <motion.span className="arch-draft-line" variants={maskLineReveal} aria-hidden="true" />
      <motion.span className="arch-mask-reveal-copy" variants={maskCopyReveal}>
        {children}
      </motion.span>
    </motion.h1>
  );
}

function MaskRevealH2({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.h2 className={`arch-mask-reveal ${className}`} variants={maskReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <motion.span className="arch-draft-line" variants={maskLineReveal} aria-hidden="true" />
      <motion.span className="arch-mask-reveal-copy" variants={maskCopyReveal}>
        {children}
      </motion.span>
    </motion.h2>
  );
}

function PropertyLeadForm({ property }: { property: PropertyView }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
        interestType: "property_page_consultation",
        propertyId: property.id,
        propertySlug: property.slug,
        propertyTitle: property.title,
        propertyType: property.propertyType,
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
    <div className="consultation-desk">
      <div className="desk-strip">
        <div className="desk-kicker">Private Acquisition Desk</div>
        <h2 className="desk-title">Schedule a confidential consultation.</h2>
      </div>

      <form className="desk-form" onSubmit={submit}>
        {status === "success" ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="desk-success">
            <Check className="w-8 h-8 text-warm-gold mb-4" />
            <h3 className="text-2xl font-display mb-2">Request Received.</h3>
            <p className="text-warm-muted">{message}</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="desk-field">
                <label>Name</label>
                <input name="name" required placeholder="Your full name" />
              </div>
              <div className="desk-field">
                <label>Email</label>
                <input name="email" type="email" required placeholder="email@address.com" />
              </div>
              <div className="desk-field">
                <label>Phone</label>
                <input name="phone" placeholder="+91 ..." />
              </div>
              <div className="desk-field">
                <label>Investment Budget</label>
                <input name="budget" placeholder="Expected range" />
              </div>
            </div>
            <div className="space-y-6 flex flex-col">
              <div className="desk-field flex-grow">
                <label>Inquiry Details</label>
                <textarea name="message" rows={6} placeholder="Specific requirements or questions..." />
              </div>
              {status === "error" && <p className="text-executive-red text-sm">{message}</p>}
              <button type="submit" className="desk-submit" disabled={status === "submitting"}>
                {status === "submitting" ? "Processing..." : "Schedule Consultation"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export function CinematicPropertyDetail({ data }: { data: PropertyDetailData }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { property } = data;
  const imageGallery = property.gallery.filter((item) => item.kind !== "video");
  const floorPlan = property.gallery.find((item) => item.kind === "floor_plan")?.url || property.floorPlanUrl;
  const video = property.gallery.find((item) => item.kind === "video")?.url || property.heroVideo;

  return (
    <main ref={rootRef} className="architecture-site">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center mix-blend-difference">
        <Link href="/" className="flex items-center gap-3 text-warm-white hover:text-warm-gold transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-inter text-xs tracking-widest uppercase">Portfolio</span>
        </Link>
        <div className="flex items-center gap-8">
           <a href="#consultation" className="font-inter text-xs tracking-widest uppercase text-warm-white hover:text-warm-gold transition-colors">Consultation</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-end p-8 md:p-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={property.coverImage}
            alt={property.title}
            fill
            priority
            className="object-cover scale-105"
            style={{ filter: "brightness(0.6)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-nearblack via-transparent to-nearblack/30" />
        </div>

        <div className="relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: power4Out }}
          >
            <span className="font-inter text-xs tracking-[0.3em] uppercase text-warm-gold mb-6 block">
              {property.locationName} • {property.propertyType}
            </span>
            <h1 className="font-display text-5xl md:text-8xl text-warm-white leading-[1.1] mb-8">
              {property.title}
            </h1>
            <p className="font-body text-lg md:text-xl text-warm-muted max-w-2xl leading-relaxed">
              {property.summary}
            </p>
          </motion.div>
        </div>
        
        <div className="absolute bottom-12 right-12 hidden md:block">
           <div className="flex flex-col items-center gap-4">
              <div className="w-px h-24 bg-gradient-to-b from-warm-gold/0 to-warm-gold" />
              <span className="font-inter text-[10px] tracking-[0.4em] uppercase text-warm-gold rotate-90 origin-left mt-8">Scroll</span>
           </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="bg-nearblack py-24 md:py-32 px-8 border-y border-warm-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {[
            { label: "Investment Value", value: property.investmentValue },
            { label: "Ticket Size", value: property.ticketSize },
            { label: "Area", value: property.area },
            { label: "Handover", value: property.handover }
          ].map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="flex flex-col gap-2"
            >
              <span className="font-inter text-[10px] tracking-widest uppercase text-stone">{metric.label}</span>
              <strong className="font-display text-3xl text-warm-white">{metric.value}</strong>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Narrative Section */}
      <section className="bg-[#080807] py-32 px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <MaskRevealH2 className="font-display text-4xl md:text-6xl text-warm-white mb-16 leading-tight">
            Intelligence, location and ownership, composed.
          </MaskRevealH2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-8"
            >
              <p className="font-body text-xl text-warm-muted leading-relaxed">
                {property.description}
              </p>
              <div className="flex flex-wrap gap-3">
                {[property.roiIndicator, property.appreciation, property.priceLabel, property.microMarket].map((highlight) => (
                  <span key={highlight} className="px-4 py-2 bg-warm-white/5 border border-warm-white/10 text-warm-gold font-inter text-xs tracking-wider uppercase">
                    {highlight}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={imageReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative aspect-[4/5] overflow-hidden"
            >
              <Image
                src={imageGallery[1]?.url || property.coverImage}
                alt="Architectural Detail"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Showcase */}
      <section className="bg-nearblack py-32 overflow-hidden">
         <div className="px-8 mb-16">
            <span className="font-inter text-xs tracking-widest uppercase text-warm-gold mb-4 block">Visual Narrative</span>
            <MaskRevealH2 className="font-display text-5xl text-warm-white italic">The Acquisition Experience</MaskRevealH2>
         </div>

         <div className="flex flex-col gap-32">
            {imageGallery.slice(0, 4).map((item, index) => (
              <div key={item.id} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 px-8`}>
                <motion.div 
                  variants={imageReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex-grow aspect-video relative overflow-hidden"
                >
                  <Image src={item.url} alt={item.alt} fill className="object-cover" />
                </motion.div>
                <div className="md:w-1/3 flex flex-col justify-center">
                  <motion.div 
                    initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <span className="text-warm-gold font-display text-4xl mb-6 block">0{index + 1}</span>
                    <h3 className="text-warm-white font-body text-xl tracking-wide uppercase mb-4">{item.alt || 'Perspective'}</h3>
                    <div className="w-12 h-px bg-warm-gold mb-6" />
                  </motion.div>
                </div>
              </div>
            ))}
         </div>
      </section>

      {/* Amenities & Details */}
      <section className="bg-[#fbf8f2] py-32 px-8 text-nearblack">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <span className="font-inter text-xs tracking-widest uppercase text-warm-gold mb-6 block">Refinement</span>
            <h2 className="font-display text-5xl md:text-6xl mb-12 text-stonework-900">Amenities & Intelligence</h2>
            <div className="space-y-6">
              {property.amenities.map((amenity, i) => (
                <motion.div 
                  key={amenity}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 border-b border-nearblack/5 pb-4"
                >
                  <Check className="w-4 h-4 text-warm-gold" />
                  <span className="font-body text-lg uppercase tracking-tight">{amenity}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="space-y-16">
            <article>
               <h3 className="font-display text-3xl mb-8 italic">Spatial Planning</h3>
               <div className="aspect-square relative bg-nearblack/5 border border-nearblack/10 flex items-center justify-center overflow-hidden">
                  {floorPlan ? (
                    <Image src={floorPlan} alt="Floor Plan" fill className="object-contain p-8" />
                  ) : (
                    <span className="text-stone font-inter text-xs uppercase tracking-widest">Available on Request</span>
                  )}
               </div>
            </article>
            <article>
               <h3 className="font-display text-3xl mb-8 italic">Cinematic Overview</h3>
               <div className="aspect-video relative bg-nearblack overflow-hidden group cursor-pointer">
                  {video ? (
                    <video src={video} className="w-full h-full object-cover" controls playsInline />
                  ) : (
                    <>
                      <Image src={property.coverImage} alt="Video Poster" fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-20 h-20 rounded-full border border-warm-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                            <Play className="w-8 h-8 text-warm-white fill-warm-white" />
                         </div>
                      </div>
                    </>
                  )}
               </div>
            </article>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="bg-[#121313] py-32 px-8 overflow-hidden">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20">
            <div className="md:w-1/2">
               <span className="font-inter text-xs tracking-widest uppercase text-warm-gold mb-6 block">Context</span>
               <h2 className="font-display text-5xl md:text-7xl text-warm-white mb-8">{property.city}</h2>
               <p className="font-body text-xl text-warm-muted mb-12">{property.address}</p>
               
               <div className="grid grid-cols-1 gap-6">
                  {property.landmarks.map((landmark, i) => (
                    <div key={landmark} className="flex items-center gap-4">
                       <MapPin className="w-5 h-5 text-warm-gold" />
                       <span className="text-warm-white font-inter text-sm uppercase tracking-wider">{landmark}</span>
                    </div>
                  ))}
               </div>
            </div>
            <div className="md:w-1/2 aspect-square relative grayscale contrast-125 opacity-70">
               {/* Placeholder for map/context image */}
               <Image src={property.coverImage} alt="Map Context" fill className="object-cover" />
            </div>
         </div>
      </section>

      {/* Consultation Desk */}
      <section id="consultation" className="bg-[#080807] py-32 px-8">
        <div className="max-w-6xl mx-auto">
          <PropertyLeadForm property={property} />
        </div>
      </section>

      {/* Related Properties */}
      <section className="bg-nearblack py-32 px-8 border-t border-warm-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
               <span className="font-inter text-xs tracking-widest uppercase text-warm-gold mb-4 block">Continue Exploration</span>
               <h2 className="font-display text-5xl text-warm-white italic">Related Opportunities</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {data.related.map((item) => (
              <Link key={item.id} href={`/properties/${item.slug}`} className="group block">
                <div className="aspect-[4/5] relative overflow-hidden mb-6">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <span className="font-inter text-[10px] tracking-widest uppercase text-warm-gold mb-2 block">{item.locationName}</span>
                <h3 className="font-display text-2xl text-warm-white group-hover:text-warm-gold transition-colors">{item.title}</h3>
                <p className="font-body text-sm text-stone mt-2">{item.investmentValue}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer (Architecture Style) */}
      <footer className="bg-nearblack pt-32 pb-12 px-8 border-t border-warm-white/10">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between gap-20 mb-32">
               <div className="max-w-md">
                  <h2 className="font-display text-7xl md:text-9xl text-warm-white leading-none mb-12">Ractysh.</h2>
                  <p className="font-body text-stone leading-relaxed uppercase tracking-[0.2em] text-[10px]">Premium Property Acquisition Desk</p>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                  <div className="space-y-6">
                     <h4 className="font-inter text-[10px] tracking-widest uppercase text-warm-gold">Navigation</h4>
                     <ul className="space-y-4 text-warm-white font-body text-sm uppercase tracking-wider">
                        <li><Link href="/">Home</Link></li>
                        <li><a href="#consultation">Consultation</a></li>
                     </ul>
                  </div>
                  <div className="space-y-6">
                     <h4 className="font-inter text-[10px] tracking-widest uppercase text-warm-gold">Contact</h4>
                     <ul className="space-y-4 text-warm-white font-body text-sm uppercase tracking-wider">
                        <li><a href="mailto:hello@ractysh.com">hello@ractysh.com</a></li>
                     </ul>
                  </div>
               </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center border-t border-warm-white/5 pt-12 gap-8">
               <p className="font-inter text-[10px] tracking-widest uppercase text-stone">© 2026 Ractysh Group. All Rights Reserved.</p>
               <div className="flex gap-8">
                  <span className="font-inter text-[10px] tracking-widest uppercase text-stone">Privacy Policy</span>
                  <span className="font-inter text-[10px] tracking-widest uppercase text-stone">Terms of Service</span>
               </div>
            </div>
         </div>
      </footer>
    </main>
  );
}
