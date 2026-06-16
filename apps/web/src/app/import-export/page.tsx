import type { Metadata } from "next";
import { DivisionPortalPlaceholderPage, divisionPortalConfig } from "@/components/DivisionPortalPlaceholderPage";

const division = divisionPortalConfig["import-export"];

export const metadata: Metadata = {
  title: `${division.title} Launching Soon | Ractysh Group`,
  description: division.metadataDescription
};

export default function ImportExportPage() {
  return <DivisionPortalPlaceholderPage division="import-export" />;
}
