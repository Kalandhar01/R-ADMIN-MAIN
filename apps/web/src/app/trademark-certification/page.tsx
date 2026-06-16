import { LegalDocumentPage } from "@/components/LegalDocumentPage";
import { getSiteContent } from "@/lib/api";

export default async function TrademarkCertificationPage() {
  const content = await getSiteContent();
  const document = content.legal.documents.find((item) => item.slug === "trademark-certification") || content.legal.documents[0];
  return <LegalDocumentPage content={content} document={document} />;
}
