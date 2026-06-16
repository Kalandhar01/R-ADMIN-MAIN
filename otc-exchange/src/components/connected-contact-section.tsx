"use client";

import { type FormEvent, useState, useRef, useEffect } from "react";
import { ArrowRight, Mail, Search, Check, X, ChevronDown } from "lucide-react";
import DeferredDither from "@/components/deferred-dither";

const services = [
  "Cryptocurrency Exchange Services",
  "USDT / Stablecoin Exchange Services",
  "Institutional OTC Trading Support",
  "KYC & Client Verification Services",
  "Secure Transaction Processing",
  "Compliance & Documentation Support",
  "Corporate Digital Asset Solutions",
  "Cross-Border Settlement Assistance",
  "Block Trade Coordination",
  "Treasury Conversion Services",
  "OTC Quote & Pricing Advisory",
  "Private Mandate Consultation",
  "Settlement Proof & Record Keeping",
  "Wallet & Beneficiary Verification",
  "AML & Compliance Advisory",
] as const;

const projectTypes = [
  "Crypto-to-Crypto",
  "Crypto-to-Fiat",
  "Stablecoin Conversion",
  "Block Trade",
  "Treasury Management",
  "Cross-Border Settlement",
  "Institutional Mandate",
] as const;

const budgetRanges = [
  "Under ₹10 Lakhs",
  "₹10 Lakhs – ₹50 Lakhs",
  "₹50 Lakhs – ₹1 Crore",
  "₹1 Crore – ₹5 Crores",
  "₹5 Crores – ₹25 Crores",
  "₹25 Crores+",
] as const;

function SelectDropdown<T extends string>({
  label,
  options,
  value,
  onChange,
  placeholder,
  searchable = false,
}: {
  label: string;
  options: readonly T[];
  value: T | "";
  onChange: (value: T) => void;
  placeholder: string;
  searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = searchable
    ? options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <div ref={containerRef} className="relative">
      <span className="mb-2 block text-sm font-medium text-[#3d3b35]">
        {label}
      </span>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-12 w-full items-center justify-between rounded-md border border-[#d7d2c5] bg-white px-4 text-base text-[#11140f] shadow-sm outline-none transition focus:border-[#16b893] focus:ring-2 focus:ring-[#16b893]/20"
      >
        <span className={!value ? "text-[#8f8a7d]" : ""}>
          {value || placeholder}
        </span>
        <ChevronDown className={`size-4 text-[#8f8a7d] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-[#d7d2c5] bg-white shadow-lg">
          {searchable && (
            <div className="flex items-center gap-2 border-b border-[#d7d2c5] px-3 py-2">
              <Search className="size-4 text-[#8f8a7d]" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 border-0 bg-transparent text-sm text-[#11140f] outline-none placeholder:text-[#8f8a7d]"
                autoFocus
              />
            </div>
          )}
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-sm text-[#8f8a7d]">No options found.</p>
            ) : (
              filtered.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[#11140f] transition hover:bg-[#16b893]/5"
                >
                  <span
                    className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                      value === option
                        ? "border-[#16b893] bg-[#16b893]"
                        : "border-[#d7d2c5]"
                    }`}
                  >
                    {value === option && <Check className="size-3 text-white" />}
                  </span>
                  {option}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ServiceCombobox({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (services: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = services.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase()),
  );

  const toggle = (service: string) => {
    onChange(
      selected.includes(service)
        ? selected.filter((s) => s !== service)
        : [...selected, service],
    );
  };

  return (
    <div ref={containerRef} className="relative">
      <span className="mb-2 block text-sm font-medium text-[#3d3b35]">
        Services Required
      </span>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-12 w-full items-center justify-between rounded-md border border-[#d7d2c5] bg-white px-4 text-base text-[#11140f] shadow-sm outline-none transition focus:border-[#16b893] focus:ring-2 focus:ring-[#16b893]/20"
      >
        <span className={selected.length === 0 ? "text-[#8f8a7d]" : ""}>
          {selected.length === 0
            ? "Select services..."
            : `${selected.length} service${selected.length > 1 ? "s" : ""} selected`}
        </span>
        <ChevronDown className={`size-4 text-[#8f8a7d] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selected.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 rounded-md bg-[#16b893]/10 px-2 py-1 text-xs font-medium text-[#0c4a3e]"
            >
              {s}
              <button type="button" onClick={() => toggle(s)} className="hover:opacity-60">
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-[#d7d2c5] bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-[#d7d2c5] px-3 py-2">
            <Search className="size-4 text-[#8f8a7d]" />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border-0 bg-transparent text-sm text-[#11140f] outline-none placeholder:text-[#8f8a7d]"
              autoFocus
            />
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-sm text-[#8f8a7d]">No services found.</p>
            ) : (
              filtered.map((service) => (
                <button
                  key={service}
                  type="button"
                  onClick={() => toggle(service)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[#11140f] transition hover:bg-[#16b893]/5"
                >
                  <span
                    className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                      selected.includes(service)
                        ? "border-[#16b893] bg-[#16b893]"
                        : "border-[#d7d2c5]"
                    }`}
                  >
                    {selected.includes(service) && <Check className="size-3 text-white" />}
                  </span>
                  {service}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConnectedContactSection() {
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [formMessage, setFormMessage] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [mandateType, setMandateType] = useState<typeof projectTypes[number] | "">("");
  const [budget, setBudget] = useState<typeof budgetRanges[number] | "">("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setFormStatus("submitting");
    setFormMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("name") || ""),
          email: String(formData.get("email") || ""),
          phone: String(formData.get("phone") || ""),
          company: String(formData.get("company") || ""),
          services: selectedServices,
          projectType: String(formData.get("projectType") || ""),
          location: String(formData.get("location") || ""),
          budget: String(formData.get("budget") || ""),
          message: String(formData.get("message") || ""),
          sourcePage:
            typeof window === "undefined" ? "/" : window.location.pathname,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(payload.message || "Unable to submit right now.");
      }

      form.reset();
      setSelectedServices([]);
      setMandateType("");
      setBudget("");
      setFormStatus("success");
      setFormMessage(
        payload.message ||
          "Mandate request received. Our desk team will review and respond within 24 hours.",
      );
    } catch (error) {
      setFormStatus("error");
      setFormMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit right now. Please try again.",
      );
    }
  }

  return (
    <section
      className="relative z-20 scroll-mt-28 overflow-hidden bg-transparent px-5 py-20 text-white sm:scroll-mt-32 sm:px-8 lg:px-10 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(22,184,147,0.025),rgba(4,7,6,0)_42%,rgba(189,121,29,0.03))]" />

      <div className="relative mx-auto grid max-w-7xl overflow-hidden border border-white/10 bg-black/24 shadow-[0_34px_120px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl lg:min-h-[720px] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative min-h-[420px] overflow-hidden border-b border-white/10 bg-[#050806] lg:min-h-0 lg:border-b-0 lg:border-r">
          <div className="absolute inset-0">
            <DeferredDither
              waveColor={[0.24, 0.92, 0.76]}
              disableAnimation={false}
              enableMouseInteraction
              mouseRadius={0.88}
              colorNum={6}
              pixelSize={1.5}
              waveAmplitude={0.58}
              waveFrequency={2.65}
              waveSpeed={0.1}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.18),transparent_23%),radial-gradient(circle_at_74%_30%,rgba(22,184,147,0.22),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.48))]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:28px_28px] opacity-30" />

          <div className="relative flex h-full min-h-[420px] flex-col justify-between p-6 sm:p-8 lg:min-h-[720px] lg:p-10">
            <div className="inline-flex w-fit items-center gap-3 border border-white/12 bg-black/28 px-4 py-3 text-sm font-semibold text-white/76 backdrop-blur-md">
              <span className="grid size-8 place-items-center rounded-full bg-emerald-300/14 text-emerald-100">
                R
              </span>
              Ractysh OTC Exchange
            </div>

            <div>
              <p className="max-w-xl text-3xl font-medium leading-tight tracking-tight text-white sm:text-4xl">
                &ldquo;Private mandates need quiet routing, clean authority, and a
                settlement record operators can trust.&rdquo;
              </p>
              <div className="mt-7 flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-full border border-emerald-200/25 bg-emerald-300/14 text-sm font-bold text-emerald-100">
                  OTC
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">
                    Mandate Desk
                  </span>
                  <span className="mt-1 block text-sm text-white/52">
                    Private exchange coordination
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#f3f1ea] px-5 py-10 text-[#151512] sm:px-8 lg:px-12 lg:py-14">
          <div className="mx-auto max-w-xl">
            <div className="grid size-14 place-items-center rounded-md bg-white shadow-[0_18px_48px_rgba(0,0,0,0.12)]">
              <div className="grid size-10 place-items-center rounded-sm bg-[#07100d] text-emerald-200">
                <Mail className="size-5" aria-hidden="true" />
              </div>
            </div>

            <h2 className="mt-9 text-4xl font-semibold tracking-tight text-[#11140f] sm:text-5xl">
              Start Your OTC Exchange Mandate
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-[#58564f]">
              Tell us about your mandate, required services, asset class, and
              settlement expectations. Our OTC desk team will review your
              requirements and coordinate next steps. Email us at{" "}
              <a
                href="mailto:desk@ractysh.com"
                className="font-medium text-[#11140f] underline decoration-[#16b893]/40 underline-offset-4 transition hover:decoration-[#16b893]"
              >
                desk@ractysh.com
              </a>
              .
            </p>

            <form className="mt-9 space-y-6" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#3d3b35]">
                  Full Name
                </span>
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  required
                  className="h-12 w-full rounded-md border border-[#d7d2c5] bg-white px-4 text-base text-[#11140f] shadow-sm outline-none transition placeholder:text-[#8f8a7d] focus:border-[#16b893] focus:ring-2 focus:ring-[#16b893]/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#3d3b35]">
                  Email Address
                </span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="email@example.com"
                  required
                  className="h-12 w-full rounded-md border border-[#d7d2c5] bg-white px-4 text-base text-[#11140f] shadow-sm outline-none transition placeholder:text-[#8f8a7d] focus:border-[#16b893] focus:ring-2 focus:ring-[#16b893]/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#3d3b35]">
                  Phone Number
                </span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  required
                  className="h-12 w-full rounded-md border border-[#d7d2c5] bg-white px-4 text-base text-[#11140f] shadow-sm outline-none transition placeholder:text-[#8f8a7d] focus:border-[#16b893] focus:ring-2 focus:ring-[#16b893]/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#3d3b35]">
                  Company Name <span className="text-[#8f8a7d]">(optional)</span>
                </span>
                <input
                  name="company"
                  type="text"
                  autoComplete="organization"
                  placeholder="Your company or organisation"
                  className="h-12 w-full rounded-md border border-[#d7d2c5] bg-white px-4 text-base text-[#11140f] shadow-sm outline-none transition placeholder:text-[#8f8a7d] focus:border-[#16b893] focus:ring-2 focus:ring-[#16b893]/20"
                />
              </label>

              <ServiceCombobox
                selected={selectedServices}
                onChange={setSelectedServices}
              />

              <SelectDropdown
                label="Mandate Type"
                options={projectTypes}
                value={mandateType}
                onChange={(v) => setMandateType(v)}
                placeholder="Select mandate type..."
                searchable
              />
              <input type="hidden" name="projectType" value={mandateType} />

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#3d3b35]">
                  Jurisdiction / Location
                </span>
                <input
                  name="location"
                  type="text"
                  autoComplete="off"
                  placeholder="City, State"
                  className="h-12 w-full rounded-md border border-[#d7d2c5] bg-white px-4 text-base text-[#11140f] shadow-sm outline-none transition placeholder:text-[#8f8a7d] focus:border-[#16b893] focus:ring-2 focus:ring-[#16b893]/20"
                />
              </label>

              <SelectDropdown
                label="Budget Range"
                options={budgetRanges}
                value={budget}
                onChange={(v) => setBudget(v)}
                placeholder="Select budget range..."
              />
              <input type="hidden" name="budget" value={budget} />

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#3d3b35]">
                  Mandate Brief
                </span>
                <textarea
                  name="message"
                  rows={5}
                  required
                  placeholder="Describe your mandate, asset class, volume, and settlement preferences."
                  className="min-h-[132px] w-full resize-none rounded-md border border-[#d7d2c5] bg-white px-4 py-4 text-base leading-7 text-[#11140f] shadow-sm outline-none transition placeholder:text-[#8f8a7d] focus:border-[#16b893] focus:ring-2 focus:ring-[#16b893]/20"
                />
              </label>

              {formMessage ? (
                <p
                  className={`rounded-md border px-4 py-3 text-sm leading-6 ${
                    formStatus === "success"
                      ? "border-[#16b893]/35 bg-[#16b893]/10 text-[#0c4a3e]"
                      : "border-red-300 bg-red-50 text-red-700"
                  }`}
                >
                  {formMessage}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={formStatus === "submitting"}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#11140f] px-5 text-sm font-semibold text-white transition hover:bg-[#25322c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {formStatus === "submitting" ? "Submitting..." : "Submit OTC Mandate"}
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
