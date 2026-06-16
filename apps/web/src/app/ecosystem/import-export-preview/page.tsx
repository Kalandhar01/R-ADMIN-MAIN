import type { Metadata } from "next";
import { ImportExportFutureWorkPage } from "@/components/EcosystemFutureWorkPage";

export const metadata: Metadata = {
  title: "Ractysh Import & Export | Global Trade Ecosystem Preview",
  description: "A minimal luxury global trade ecosystem preview for the Ractysh Import & Export division."
};

export default function ImportExportPreviewPage() {
  return <ImportExportFutureWorkPage />;
}
