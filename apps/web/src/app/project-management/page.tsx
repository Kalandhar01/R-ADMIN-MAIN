import type { Metadata } from "next";
import { MarketingChrome } from "@/components/MarketingChrome";
import { ProjectManagementExecutionPage } from "@/components/ProjectManagementExecutionPage";
import { getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Project Management | Enterprise Execution Systems",
  description:
    "Premium enterprise project execution, construction coordination and operational workflow management through Ractysh precision systems."
};

export default async function ProjectManagementPage() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content}>
      <ProjectManagementExecutionPage />
    </MarketingChrome>
  );
}
