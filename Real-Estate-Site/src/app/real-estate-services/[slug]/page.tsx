import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getServiceBySlug, getAllServices, type ServiceSlug } from "@/lib/real-estate-services";
import { RealEstateServiceDetailClient } from "@/components/RealEstateServiceDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = getAllServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) return { title: "Service Not Found" };

  return {
    title: `${service.title} | Ractysh Real Estate`,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) notFound();

  return <RealEstateServiceDetailClient serviceSlug={service.slug as ServiceSlug} />;
}
