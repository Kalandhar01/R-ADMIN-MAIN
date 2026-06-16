import type { Metadata } from "next";
import { IndustrialDesignExperience } from "@/components/IndustrialDesignExperience";

export const metadata: Metadata = {
  title: "Industrial Design | Ractysh Architecture",
  description:
    "Industrial facilities engineered through architectural intelligence, operational efficiency and long-term growth planning."
};

export default function IndustrialDesignPage() {
  return <IndustrialDesignExperience />;
}
