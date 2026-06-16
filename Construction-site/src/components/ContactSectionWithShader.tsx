"use client";

import { services } from "@/lib/construction-services-data";
import {
  Check,
  ChevronDown,
  X,
  ArrowRight,
  Building2,
  HardHat,
  ClipboardCheck,
  LineChart,
  ShieldCheck,
  MapPin,
  Clock,
  IndianRupee,
  Send,
  Phone,
  Mail,
  User,
  FileText,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Link from "next/link";
import { type FormEvent, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projectTypes = [
  "Residential",
  "Commercial",
  "Industrial",
  "Government",
  "Infrastructure",
];

const budgetRanges = [
  "Under ₹50 Lakhs",
  "₹50 Lakhs – ₹2 Crore",
  "₹2 Crore – ₹10 Crore",
  "₹10 Crore – ₹50 Crore",
  "₹50 Crore – ₹200 Crore",
  "Above ₹200 Crore",
];

const timelineOptions = [
  "0 – 3 Months",
  "3 – 6 Months",
  "6 – 12 Months",
  "12 – 18 Months",
  "18 – 24 Months",
  "24+ Months",
];

function ServiceMultiSelect({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const toggle = (title: string) => {
    onChange(
      selected.includes(title)
        ? selected.filter((t) => t !== title)
        : [...selected, title],
    );
  };

  const filtered = services.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="relative">
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
        Services Required
      </label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition-all"
        style={{ borderColor: "#E6E1D8", backgroundColor: "#FFFFFF" }}
      >
        <span style={{ color: selected.length ? "#1A1A1A" : "#9CA3AF" }}>
          {selected.length
            ? `${selected.length} service${selected.length > 1 ? "s" : ""} selected`
            : "Select services..."}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          style={{ color: "#8B6B4A" }}
        />
      </button>

      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selected.map((title) => (
            <span
              key={title}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
              style={{ backgroundColor: "#F5F0EB", color: "#8B6B4A" }}
            >
              {title}
              <button
                type="button"
                onClick={() => toggle(title)}
                className="hover:opacity-70"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border shadow-lg" style={{ borderColor: "#E6E1D8", backgroundColor: "#FFFFFF" }}>
          <Command>
            <CommandInput
              placeholder="Search services..."
              value={search}
              onValueChange={setSearch}
              className="text-sm"
            />
            <CommandList>
              <CommandEmpty>No services found.</CommandEmpty>
              <CommandGroup>
                {filtered.map((service) => (
                  <CommandItem
                    key={service.id}
                    onSelect={() => toggle(service.title)}
                    className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer"
                  >
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                        selected.includes(service.title)
                          ? "border-transparent"
                          : ""
                      }`}
                      style={{
                        backgroundColor: selected.includes(service.title)
                          ? "#8B6B4A"
                          : "transparent",
                        borderColor: selected.includes(service.title)
                          ? "#8B6B4A"
                          : "#D1D5DB",
                      }}
                    >
                      {selected.includes(service.title) && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    {service.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}

export default function ContactSectionWithShader() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      const leftEls = leftRef.current?.querySelectorAll(".gsap-l");
      if (leftEls && leftEls.length) {
        tl.fromTo(
          leftEls,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out" },
        );
      }

      if (rightRef.current) {
        tl.fromTo(
          rightRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          "-=0.3",
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/construction-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          selectedServices,
          projectType: formData.projectType,
          projectLocation: formData.location,
          budgetRange: formData.budget,
          timeline: formData.timeline,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="overflow-hidden px-6 py-48 sm:px-10 lg:px-16"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#C4A87C]/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#8B6B4A]/10 blur-[120px]" />
      </div>
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ===== LEFT: EDITORIAL ===== */}
          <div ref={leftRef} className="flex flex-col justify-center">
            <p className="gsap-l text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#8B6B4A" }}>
              Start Your Consultation
            </p>
            <h2 className="gsap-l mt-4 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl" style={{ color: "#1A1A1A" }}>
              Tell us what<br />
              <span style={{ color: "#8B6B4A" }}>you&apos;re building.</span>
            </h2>
            <p className="gsap-l mt-5 max-w-md text-sm leading-relaxed" style={{ color: "#6B6560" }}>
              Ractysh delivers 25 integrated construction and engineering
              services — from soil testing to handover. Share your project
              details and our team will respond with a tailored proposal
              within 24 hours.
            </p>

            {/* Discipline tags */}
            <div className="gsap-l mt-8 flex flex-wrap gap-2">
              {[
                { icon: Building2, label: "Construction" },
                { icon: HardHat, label: "Engineering" },
                { icon: ClipboardCheck, label: "PMC" },
                { icon: LineChart, label: "Infrastructure" },
                { icon: ShieldCheck, label: "Government" },
              ].map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium"
                  style={{ borderColor: "#E6E1D8", backgroundColor: "#FFFFFF", color: "#4A4540" }}
                >
                  <item.icon className="h-3.5 w-3.5" style={{ color: "#8B6B4A" }} />
                  {item.label}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="gsap-l mt-10 grid grid-cols-3 gap-6 border-t pt-8" style={{ borderColor: "#E6E1D8" }}>
              {[
                { value: "25+", label: "Integrated Services" },
                { value: "250+", label: "Projects Delivered" },
                { value: "98%", label: "Client Satisfaction" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold" style={{ color: "#8B6B4A" }}>{stat.value}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.08em]" style={{ color: "#6B6560" }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="gsap-l mt-8 flex items-center gap-4 text-xs" style={{ color: "#9CA3AF" }}>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" style={{ color: "#8B6B4A" }} />
                ISO-aligned processes
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" style={{ color: "#8B6B4A" }} />
                24hr response
              </span>
            </div>
          </div>

          {/* ===== RIGHT: FORM ===== */}
          <div ref={rightRef}>
            <div
              className="rounded-2xl border p-8 shadow-sm"
              style={{ borderColor: "#E6E1D8", backgroundColor: "#FFFFFF" }}
            >
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#F5F0EB" }}
                  >
                    <Check className="h-8 w-8" style={{ color: "#8B6B4A" }} />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: "#1A1A1A" }}>
                    Consultation Request Received
                  </h3>
                  <p className="mt-3 max-w-sm text-sm" style={{ color: "#6B6560" }}>
                    Thank you. Our team will review your project requirements
                    and get back to you within 24 hours with a tailored
            proposal.
                  </p>
                  <Link
                    href="/"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold"
                    style={{ color: "#8B6B4A" }}
                  >
                    Back to Home <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-lg font-bold" style={{ color: "#1A1A1A", paddingTop: "3rem" }}>
                    Project Consultation Form
                  </h3>
                  <p className="text-sm" style={{ color: "#6B6560" }}>
                    Tell us about your project and we&apos;ll prepare a
                    customised proposal.
                  </p>

                  {/* Services Multi-Select */}
                  <ServiceMultiSelect
                    selected={selectedServices}
                    onChange={setSelectedServices}
                  />

                  {/* Name */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "#6B6560" }}>
                      <User className="mr-1 inline h-3 w-3" />
                      Full Name
                    </label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all focus:ring-2"
                      style={{ borderColor: "#E6E1D8", backgroundColor: "#F8F6F2", color: "#1A1A1A" }}
                      placeholder="Your full name"
                    />
                  </div>

                  {/* Email + Phone */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "#6B6560" }}>
                        <Mail className="mr-1 inline h-3 w-3" />
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all focus:ring-2"
                        style={{ borderColor: "#E6E1D8", backgroundColor: "#F8F6F2", color: "#1A1A1A" }}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "#6B6560" }}>
                        <Phone className="mr-1 inline h-3 w-3" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all focus:ring-2"
                        style={{ borderColor: "#E6E1D8", backgroundColor: "#F8F6F2", color: "#1A1A1A" }}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "#6B6560" }}>
                      <MapPin className="mr-1 inline h-3 w-3" />
                      Project Location
                    </label>
                    <input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all focus:ring-2"
                      style={{ borderColor: "#E6E1D8", backgroundColor: "#F8F6F2", color: "#1A1A1A" }}
                      placeholder="City, State"
                    />
                  </div>

                  {/* Project Type + Budget */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "#6B6560" }}>
                        Project Type
                      </label>
                      <select
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all focus:ring-2"
                        style={{ borderColor: "#E6E1D8", backgroundColor: "#F8F6F2", color: "#1A1A1A" }}
                      >
                        <option value="">Select type...</option>
                        {projectTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "#6B6560" }}>
                        <IndianRupee className="mr-1 inline h-3 w-3" />
                        Budget Range
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all focus:ring-2"
                        style={{ borderColor: "#E6E1D8", backgroundColor: "#F8F6F2", color: "#1A1A1A" }}
                      >
                        <option value="">Select budget...</option>
                        {budgetRanges.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "#6B6560" }}>
                      <Clock className="mr-1 inline h-3 w-3" />
                      Expected Timeline
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all focus:ring-2"
                      style={{ borderColor: "#E6E1D8", backgroundColor: "#F8F6F2", color: "#1A1A1A" }}
                    >
                      <option value="">Select timeline...</option>
                      {timelineOptions.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "#6B6560" }}>
                      <FileText className="mr-1 inline h-3 w-3" />
                      Project Details
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 resize-none"
                      style={{ borderColor: "#E6E1D8", backgroundColor: "#F8F6F2", color: "#1A1A1A" }}
                      placeholder="Brief description of your project requirements..."
                    />
                  </div>

                  {submitError && (
                    <p className="text-xs text-red-500">{submitError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
                    style={{ backgroundColor: "#8B6B4A" }}
                  >
                    {submitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Consultation Request
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs" style={{ color: "#9CA3AF" }}>
                    We&apos;ll respond within 24 hours. No spam, ever.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
