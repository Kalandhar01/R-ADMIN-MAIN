import type { Metadata } from "next";
import { DivisionPortalPlaceholderPage, divisionPortalConfig } from "@/components/DivisionPortalPlaceholderPage";

const division = divisionPortalConfig.construction;

export const metadata: Metadata = {
  title: `${division.title} Launching Soon | Ractysh Group`,
  description: division.metadataDescription
};

export default function ConstructionDivisionPage() {
  return <DivisionPortalPlaceholderPage division="construction" />;
}
