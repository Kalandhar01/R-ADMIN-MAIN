import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Construction Division | Ractysh Group",
  description:
    "Legacy construction requests now route into the Ractysh Construction Division."
};

export default function InfrastructurePage() {
  redirect("/construction");
}
