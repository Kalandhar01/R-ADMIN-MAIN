import type { Metadata } from "next";
import { DesignFutureWorkPage } from "@/components/EcosystemFutureWorkPage";

export const metadata: Metadata = {
  title: "Ractysh Design Ecosystem Preview | Ractysh",
  description: "A minimal luxury architecture systems preview for the Ractysh Design ecosystem."
};

export default function DesignPreviewPage() {
  return <DesignFutureWorkPage />;
}
