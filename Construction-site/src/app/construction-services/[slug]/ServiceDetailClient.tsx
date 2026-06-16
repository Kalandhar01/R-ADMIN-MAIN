"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
  Building2,
  ChevronRight,
} from "lucide-react";
import {
  getServiceBySlug,
  getRelatedServices,
} from "@/lib/construction-services-data";
import ConstructionNavbar from "@/components/ConstructionNavbar";
import ConstructionFooter from "@/components/ConstructionFooter";

export default function ServiceDetailClient({ slug }: { slug: string }) {
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const related = getRelatedServices(slug, 3);

  return (
    <main className="min-h-screen bg-[#F8F6F2] text-[#1A1A1A]">
      <ConstructionNavbar />

      <section className="px-6 pt-28 pb-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/construction-services"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-[#8B6B4A] transition-colors hover:text-[#1A1A1A]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all services
          </Link>

          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {service.title}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-[#6B6560]">
                {service.description}
              </p>

              {service.highlights && service.highlights.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-bold">Key Highlights</h2>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {service.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 shrink-0 text-[#8B6B4A]" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.benefits && service.benefits.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-bold">Benefits</h2>
                  <ul className="mt-3 space-y-2">
                    {service.benefits.map((b) => (
                      <li
                        key={b}
                        className="flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm"
                      >
                        <ShieldCheck className="h-4 w-4 shrink-0 text-[#8B6B4A]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Link
                href="/#contact"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#8B6B4A] px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
              >
                {service.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-28 space-y-6">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src="/images/construction/construction-service-command-center-construction-india-commercial-tower-01.webp"
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="40vw"
                    quality={80}
                  />
                </div>

                <div className="rounded-2xl bg-white p-6">
                  <h3 className="text-sm font-bold">Quick Actions</h3>
                  <div className="mt-4 space-y-2">
                    <Link
                      href="/#contact"
                      className="flex items-center justify-between rounded-lg bg-[#1A1A1A] px-4 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                    >
                      Request Consultation
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/works"
                      className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5"
                      style={{ borderColor: "#E6E1D8" }}
                    >
                      View Related Projects
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-20 border-t pt-12" style={{ borderColor: "#E6E1D8" }}>
              <h2 className="text-2xl font-bold tracking-tight">Related Services</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/construction-services/${slug}`}
                    className="group rounded-xl border bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ borderColor: "#E6E1D8" }}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#8B6B4A]" />
                      <h3 className="text-sm font-bold">{r.title}</h3>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-[#6B6560]">
                      {r.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#8B6B4A]">
                      Explore <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="bg-black">
        <ConstructionFooter />
      </div>
    </main>
  );
}
