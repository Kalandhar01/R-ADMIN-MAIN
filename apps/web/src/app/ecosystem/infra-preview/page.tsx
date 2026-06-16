import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Ractysh Group Business Ecosystem | Ractysh",
  description:
    "The Ractysh five-pillar enterprise ecosystem across Architecture, Construction, Real Estate, Export-Import and OTC Exchange."
};

export default function InfraPreviewPage() {
  redirect("/business");
}
