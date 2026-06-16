import type { Division } from "@/lib/types";
import { DashboardCard } from "@/components/DashboardCard";

interface FloatingCardsProps {
  divisions: Division[];
}

export function FloatingCards({ divisions }: FloatingCardsProps) {
  void divisions;

  const cards = [
    {
      title: "Architecture & Real Estate Mandate",
      eyebrow: "Spatial + Asset Strategy",
      status: "In Progress",
      description: "Coordinate planning logic, property positioning, investor material and stakeholder approvals",
      iconText: "ARE",
      assignee: "Ractysh A",
      progress: "9 out of 14",
      due: "Active cycle"
    },
    {
      title: "Construction Delivery Control",
      eyebrow: "Construction Command",
      status: "In Progress",
      description: "Track civil works, MEP, building construction, interiors, landscape, swimming pools, lifts and turnkey delivery",
      iconText: "CON",
      assignee: "Ractysh C",
      progress: "18 out of 26",
      due: "Live lane"
    },
    {
      title: "Export-Import & OTC Exchange Desk",
      eyebrow: "Trade + Private Deals",
      status: "Ongoing",
      description: "Manage supplier movement, documentation, counterparty intake and private transaction readiness",
      iconText: "OTC",
      assignee: "Ractysh E",
      progress: "11 out of 18",
      due: "Private desk"
    }
  ];

  return (
    <div
      data-card-stage
      className="home-floating-card-stage pointer-events-none absolute left-1/2 top-[30rem] z-30 hidden h-[22rem] w-[56rem] max-w-[97vw] -translate-x-1/2 md:block md:top-[19.25rem]"
    >
      <div className="home-floating-card-stage-scaler relative h-full w-full">
        {cards.map((card, index) => (
          <DashboardCard key={card.title} {...card} index={index} floating />
        ))}
      </div>
    </div>
  );
}
