import { RealEstateLandingClient } from "@/components/RealEstateLandingClient";
import { getLandingData } from "@/lib/real-estate";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getLandingData();
  return <RealEstateLandingClient data={data} />;
}
