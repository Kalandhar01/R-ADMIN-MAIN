import { services, toSlug } from "@/lib/construction-services-data";
import ServiceDetailClient from "./ServiceDetailClient";

export async function generateStaticParams() {
  return services.map((s) => ({ slug: toSlug(s.title) }));
}

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return <ServiceDetailClient slug={params.slug} />;
}
