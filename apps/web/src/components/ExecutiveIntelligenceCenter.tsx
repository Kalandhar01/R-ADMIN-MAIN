import { getExecutiveIntelligence } from "@/lib/api";
import { ExecutiveIntelligenceCenterClient } from "@/components/ExecutiveIntelligenceCenterClient";

export async function ExecutiveIntelligenceCenter() {
  const intelligence = await getExecutiveIntelligence();
  const hasPublishedContent = Boolean(
    intelligence?.featured || intelligence?.latest || intelligence?.recentIssues.length
  );

  if (!intelligence || !hasPublishedContent) {
    return null;
  }

  return <ExecutiveIntelligenceCenterClient intelligence={intelligence} />;
}
