import type { Metadata } from "next";
import { MarketingChrome } from "@/components/MarketingChrome";
import { ConsultationBenefits } from "@/components/consultation/ConsultationBenefits";
import { ConsultationFinalCTA } from "@/components/consultation/ConsultationFinalCTA";
import { ConsultationForm } from "@/components/consultation/ConsultationForm";
import { ConsultationHero } from "@/components/consultation/ConsultationHero";
import { ConsultationWorkflowTracker } from "@/components/consultation/ConsultationWorkflowTracker";
import { FAQSection } from "@/components/consultation/FAQSection";
import { getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Book a Consultation | Ractysh",
  description:
    "Book a premium Ractysh enterprise consultation across Architecture, Construction, Real Estate, Export-Import and OTC Exchange."
};

export default async function BookConsultationPage() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content}>
      <div className="relative overflow-x-clip bg-[#f8f6ef] text-[#17243a]">
        <div className="overflow-hidden">
          <ConsultationHero />
          <ConsultationForm />
          <ConsultationBenefits />
        </div>
        <ConsultationWorkflowTracker />
        <div className="overflow-hidden">
          <FAQSection />
          <ConsultationFinalCTA />
        </div>
      </div>
    </MarketingChrome>
  );
}
