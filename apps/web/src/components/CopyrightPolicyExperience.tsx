import { LegalEditorialExperience, type LegalEditorialSection } from "@/components/LegalEditorialExperience";
import type { LegalDocument, SiteContent } from "@/lib/types";

interface CopyrightPolicyExperienceProps {
  content: SiteContent;
  document: LegalDocument;
}

const copyrightSections: LegalEditorialSection[] = [
  {
    id: "intellectual-property",
    title: "Intellectual Property Rights",
    body:
      "Ractysh protects the brand, design language, written content, visual systems, service descriptions, page layouts, presentation frameworks and digital materials published across the Ractysh ecosystem."
  },
  {
    id: "ownership",
    title: "Ownership of Content",
    body:
      "Unless otherwise stated, all website copy, brand marks, graphics, dashboards, interface compositions, photography selections, documents and presentation assets are owned by Ractysh Group or used under appropriate permissions."
  },
  {
    id: "permitted-usage",
    title: "Permitted Usage",
    body:
      "Visitors may view website content for personal evaluation, business review and communication with Ractysh. Limited sharing of public page links is allowed when the content is not altered, misrepresented or used for unauthorized commercial distribution."
  },
  {
    id: "restricted-usage",
    title: "Restricted Usage",
    body:
      "Copying, scraping, reselling, reproducing, modifying, republishing or presenting Ractysh content as your own work is prohibited. Unauthorized use of Ractysh visuals, names, service materials or brand elements may lead to enforcement action."
  },
  {
    id: "reporting",
    title: "Copyright Infringement Reporting",
    body:
      "If you believe copyrighted material has been used improperly on a Ractysh channel, contact the enterprise operations desk with the relevant page, ownership details and a clear description of the issue for review."
  },
  {
    id: "third-party-materials",
    title: "Third-Party Materials",
    body:
      "Some imagery, software, icons, integrations or references may be provided by third-party services. Those materials remain subject to their respective licenses, terms and ownership standards."
  },
  {
    id: "trademark-protection",
    title: "Trademark Protection",
    body:
      "Ractysh names, identity elements and ecosystem marks must not be used in a way that suggests affiliation, endorsement or ownership without written authorization from Ractysh."
  },
  {
    id: "digital-assets",
    title: "Digital Asset Usage",
    body:
      "Digital assets shared by Ractysh for project, consultation or enterprise communication purposes may be used only for the intended scope. They may not be redistributed, edited or reused for unrelated work without permission."
  },
  {
    id: "modifications",
    title: "Policy Modifications",
    body:
      "Ractysh may update this copyright policy as services, content systems and enterprise operations evolve. Continued use of the website indicates acceptance of the latest published version."
  },
  {
    id: "contact",
    title: "Contact Information",
    body:
      "For copyright, brand, licensing or intellectual property questions, contact the Ractysh enterprise operations desk so the request can be reviewed by the appropriate team."
  }
];

export function CopyrightPolicyExperience({ content, document }: CopyrightPolicyExperienceProps) {
  return (
    <LegalEditorialExperience
      content={content}
      document={document}
      eyebrow="Copyright Policy"
      descriptor="Content standards"
      sections={copyrightSections}
      closingText="For copyright, brand, licensing or intellectual property inquiries, contact the Ractysh enterprise operations desk."
    />
  );
}
