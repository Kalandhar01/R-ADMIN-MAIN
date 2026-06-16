import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertyDetailClient } from "@/components/PropertyDetailClient";
import { getPropertyDetail } from "@/lib/real-estate";

export const dynamic = "force-dynamic";

type PropertyPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPropertyDetail(slug);

  if (!data) {
    return {
      title: "Property | Ractysh Real Estate",
      description: "Premium property acquisition through Ractysh Real Estate."
    };
  }

  return {
    title: `${data.property.title} | Ractysh Real Estate`,
    description: data.property.summary,
    openGraph: {
      title: `${data.property.title} | Ractysh Real Estate`,
      description: data.property.summary,
      images: [{ url: data.property.coverImage }]
    }
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const data = await getPropertyDetail(slug);
  if (!data) notFound();

  return <PropertyDetailClient data={data} />;
}
