import { LegalEditorialExperience, type LegalEditorialSection } from "@/components/LegalEditorialExperience";
import type { LegalDocument, SiteContent } from "@/lib/types";

interface DisclosureExperienceProps {
  content: SiteContent;
  document: LegalDocument;
}

const disclosureSections: LegalEditorialSection[] = [
  {
    id: "scope",
    title: "Scope of Information",
    body:
      "Ractysh publishes website content for general business communication, service discovery and enterprise evaluation. It should be read as an overview of capabilities, not as a final project specification, legal opinion, financial commitment or technical certification."
  },
  {
    id: "dependencies",
    title: "Project Dependencies",
    body:
      "Architecture, Construction, Real Estate, Export-Import and OTC Exchange workflows may depend on site conditions, authority approvals, specialist consultants, vendors, trade partners, documentation readiness, counterparty suitability and third-party timelines that sit outside a single published page."
  },
  {
    id: "estimates",
    title: "Timelines and Estimates",
    body:
      "Any indicative timelines, budgets, availability notes or delivery references shared through digital content are preliminary. Formal commitments are defined only through written scopes, commercial terms and approved project documentation."
  },
  {
    id: "professional-advice",
    title: "Professional Advice",
    body:
      "Website content is not a substitute for legal, tax, investment, structural engineering, compliance or regulatory advice. Clients should consult qualified professionals for matters that require jurisdiction-specific or discipline-specific review."
  },
  {
    id: "third-party",
    title: "Third-Party Coordination",
    body:
      "Ractysh may coordinate with external vendors, consultants, trade support providers, technology platforms and approval bodies. Their services, timelines, licensing standards and operational availability remain governed by their own controls and obligations."
  },
  {
    id: "accuracy",
    title: "Content Accuracy",
    body:
      "Ractysh works to keep published information accurate and current, but business services, visuals, project references and operational descriptions may evolve. The latest written engagement documentation takes precedence over general website content."
  },
  {
    id: "client-responsibility",
    title: "Client Responsibility",
    body:
      "Clients and prospective clients are responsible for sharing accurate requirements, site information, ownership details, compliance context and decision constraints so Ractysh can route inquiries and project discussions appropriately."
  },
  {
    id: "updates",
    title: "Disclosure Updates",
    body:
      "This disclosure may be refined as Ractysh services, enterprise systems and operating standards evolve. Continued use of the website indicates acknowledgement of the latest published disclosure."
  }
];

export function DisclosureExperience({ content, document }: DisclosureExperienceProps) {
  return (
    <LegalEditorialExperience
      content={content}
      document={document}
      eyebrow="Legal Disclosure"
      descriptor="Enterprise disclosure"
      sections={disclosureSections}
      closingText="For project-specific disclosure, commercial scope or professional coordination questions, contact the Ractysh enterprise operations desk."
    />
  );
}
