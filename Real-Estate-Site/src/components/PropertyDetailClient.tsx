"use client";

import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Download, MapPin, Play } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PropertyDetailData, PropertyView } from "@/lib/real-estate";

gsap.registerPlugin(ScrollTrigger);

function statusText(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function PropertyLeadForm({ property }: { property: PropertyView }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
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
    <form className="pd-lead" onSubmit={submit}>
      <p>Private Acquisition Desk</p>
      <h2>Request the complete property note.</h2>
      {status === "success" ? (
        <div className="pd-success">
          <h3>Consultation Request Received.</h3>
          <span>{message}</span>
        </div>
      ) : (
        <>
          <div>
            <label>Name<input name="name" required /></label>
            <label>Email<input name="email" type="email" required /></label>
            <label>Phone<input name="phone" /></label>
            <label>Budget<input name="budget" /></label>
          </div>
          <label>Message<textarea name="message" rows={4} /></label>
          {status === "error" ? <strong>{message}</strong> : null}
          <button type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Submitting" : "Schedule Consultation"} <ArrowRight aria-hidden />
          </button>
        </>
      )}
    </form>
  );
}

export function PropertyDetailClient({ data }: { data: PropertyDetailData }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { property } = data;
  const floorPlan = property.gallery.find((item) => item.kind === "floor_plan")?.url || property.floorPlanUrl || property.gallery[1]?.url;
  const video = property.gallery.find((item) => item.kind === "video")?.url || property.heroVideo;

  useEffect(() => {
    if (!rootRef.current || reduceMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo("[data-pd-hero]", { y: 44, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.09, ease: "power4.out" });
      gsap.utils.toArray<HTMLElement>("[data-pd-reveal]").forEach((element) => {
        gsap.fromTo(element, { autoAlpha: 0, y: 38 }, { autoAlpha: 1, y: 0, duration: 0.86, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 84%" } });
      });
      gsap.to(".pd-hero-media img", { yPercent: -8, scale: 1.08, ease: "none", scrollTrigger: { trigger: ".pd-hero", start: "top top", end: "bottom top", scrub: 0.9 } });
    }, rootRef);

    const refresh = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      window.cancelAnimationFrame(refresh);
      context.revert();
    };
  }, [reduceMotion]);

  return (
    <motion.main
      ref={rootRef}
      className="pd-site"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <header className="pd-nav">
        <Link href="/"><ArrowLeft aria-hidden /> Ractysh Real Estate</Link>
        <a href="#consultation">Consultation</a>
      </header>

      <section className="pd-hero">
        <div className="pd-hero-media">
          <Image src={property.coverImage} alt={property.title} fill priority sizes="100vw" />
        </div>
        <div className="pd-hero-shade" />
        <div className="pd-hero-copy">
          <p data-pd-hero>{property.locationName}</p>
          <h1 data-pd-hero>{property.title}</h1>
          <span data-pd-hero>{property.propertyType} / {statusText(property.status)}</span>
          <small data-pd-hero>{property.description}</small>
          <div data-pd-hero className="pd-hero-actions">
            <a href="#consultation">Schedule Consultation <ArrowRight aria-hidden /></a>
            {property.brochureUrl ? <a href={property.brochureUrl}>Download Brochure <Download aria-hidden /></a> : null}
          </div>
        </div>
      </section>

      <section className="pd-metrics" data-pd-reveal>
        {[
          ["Investment Value", property.investmentValue],
          ["Ticket Size", property.ticketSize],
          ["Area", property.area],
          ["Handover", property.handover]
        ].map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </section>

      <section className="pd-gallery" data-pd-reveal>
        {property.gallery.slice(0, 5).map((item, index) => (
          <figure key={item.id} className={index === 0 ? "large" : ""}>
            <Image src={item.url} alt={item.alt} fill sizes={index === 0 ? "(min-width: 900px) 58vw, 100vw" : "(min-width: 900px) 28vw, 100vw"} />
          </figure>
        ))}
      </section>

      <section className="pd-split" data-pd-reveal>
        <div>
          <p>Investment Highlights</p>
          <h2>Value, location and ownership intelligence.</h2>
        </div>
        <div className="pd-highlight-grid">
          {[property.roiIndicator, property.appreciation, property.priceLabel, property.microMarket].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="pd-amenities" data-pd-reveal>
        <div>
          <p>Amenities</p>
          <h2>Residential and investment details, composed for diligence.</h2>
        </div>
        <ul>
          {property.amenities.map((amenity) => (
            <li key={amenity}><Check aria-hidden />{amenity}</li>
          ))}
        </ul>
      </section>

      <section className="pd-media-row" data-pd-reveal>
        <article>
          <p>Floor Plans</p>
          <div>
            {floorPlan ? <Image src={floorPlan} alt={`${property.title} floor plan`} fill sizes="(min-width: 900px) 45vw, 100vw" /> : <span>Shared after consultation</span>}
          </div>
        </article>
        <article>
          <p>Property Video</p>
          <div>
            {video ? (
              <video src={video} poster={property.coverImage} controls playsInline />
            ) : (
              <>
                <Image src={property.gallery[0]?.url || property.coverImage} alt={property.title} fill sizes="(min-width: 900px) 45vw, 100vw" />
                <span className="pd-play"><Play aria-hidden /> Video available on request</span>
              </>
            )}
          </div>
        </article>
      </section>

      <section className="pd-location" data-pd-reveal>
        <div>
          <p>Location</p>
          <h2>{property.city}</h2>
          <span>{property.address}</span>
        </div>
        <ul>
          {property.landmarks.map((landmark) => (
            <li key={landmark}><MapPin aria-hidden />{landmark}</li>
          ))}
        </ul>
      </section>

      <section className="pd-related" data-pd-reveal>
        <div>
          <p>Related Properties</p>
          <h2>Continue the acquisition conversation.</h2>
        </div>
        <div>
          {data.related.map((item) => (
            <Link key={item.id} href={`/properties/${item.slug}`}>
              <Image src={item.coverImage} alt={item.title} fill sizes="(min-width: 900px) 24vw, 100vw" />
              <span>{item.locationName}</span>
              <strong>{item.title}</strong>
              <small>{item.investmentValue}</small>
              <ArrowUpRight aria-hidden />
            </Link>
          ))}
        </div>
      </section>

      <section id="consultation" className="pd-consultation" data-pd-reveal>
        <PropertyLeadForm property={property} />
      </section>
    </motion.main>
  );
}
