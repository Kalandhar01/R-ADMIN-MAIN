import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { HomeHeroWhoStoryFlow } from "@/components/HomeHeroWhoStoryFlow";
import { HomeServicesSection } from "@/components/HomeServicesSection";
import { Navbar } from "@/components/Navbar";
import { EnterpriseSolutionsSection } from "@/components/EnterpriseSolutionsSection";
import { ExecutiveIntelligenceCenter } from "@/components/ExecutiveIntelligenceCenter";
import { HomeBlogInsightsSection } from "@/components/HomeBlogInsightsSection";
import { FAQSection } from "@/components/consultation/FAQSection";
import { FinalCTASection } from "@/components/FinalCTASection";
import { SecuritySection } from "@/components/SecuritySection";
import { SubscriptionPopup } from "@/components/SubscriptionPopup";
import { getBlogIndex, getSiteContent } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  return {
    title: content.seo.title,
    description: content.seo.description,
    keywords: content.seo.keywords,
    alternates: content.seo.canonicalUrl ? { canonical: content.seo.canonicalUrl } : undefined,
    openGraph: {
      title: content.seo.title,
      description: content.seo.description,
      images: content.seo.ogImage ? [{ url: content.seo.ogImage }] : undefined
    }
  };
}

export default async function Home() {
  const [content, blogData] = await Promise.all([getSiteContent(), getBlogIndex({ limit: 12 })]);
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ractysh Group",
    url: content.seo.canonicalUrl || "https://ractysh.com",
    description: content.seo.description,
    founder: {
      "@type": "Person",
      name: content.founder.name,
      jobTitle: content.founder.role
    },
    sameAs: content.footer.socialLinks?.map((link) => link.href).filter((href) => href.startsWith("http")) || [],
    makesOffer: content.businessDivisions.map((division) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: division.title,
        description: division.description
      }
    }))
  };

  return (
    <>
      <Navbar logoText={content.nav.logoText} items={content.nav.items} />
      <SubscriptionPopup popup={content.popup} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <main className="homepage-ecosystem relative isolate bg-[#F8F6F1]">
        <div className="relative z-10">
          <HomeHeroWhoStoryFlow hero={content.hero} divisions={content.divisions} />
          <div id="features" className="scroll-mt-24">
            <EnterpriseSolutionsSection />
          </div>
          <ExecutiveIntelligenceCenter />
          <HomeServicesSection />
          <SecuritySection />
          <HomeBlogInsightsSection data={blogData} />
          <FAQSection />
          <FinalCTASection />
        </div>
      </main>
      <Footer
        headline={content.footer.headline}
        description={content.footer.description}
        links={content.footer.links}
        socialLinks={content.footer.socialLinks}
      />
    </>
  );
}
