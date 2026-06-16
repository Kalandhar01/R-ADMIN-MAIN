import type { Metadata } from "next";
import { RealEstateServicesClient } from "@/components/RealEstateServicesClient";

export const metadata: Metadata = {
  title: "Real Estate Services | Ractysh Property Development",
  description:
    "Explore Ractysh's premium real estate services — luxury villas, residential plots, commercial developments, gated communities, and government-approved lands.",
};

export default function RealEstateServicesPage() {
  return <RealEstateServicesClient />;
}
