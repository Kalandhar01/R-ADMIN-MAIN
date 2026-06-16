import type { Metadata } from "next";
import { DivisionPortalPlaceholderPage, divisionPortalConfig } from "@/components/DivisionPortalPlaceholderPage";

const division = divisionPortalConfig["real-estate"];

export const metadata: Metadata = {
  title: `${division.title} Launching Soon | Ractysh Group`,
  description: division.metadataDescription
};

export default function RealEstateDivisionPage() {
  return <DivisionPortalPlaceholderPage division="real-estate" />;
}
