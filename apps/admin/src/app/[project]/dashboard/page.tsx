import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminCommandCenter } from "@/components/admin/command-center";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { getAdminCommandCenterData } from "@/lib/admin/data";
import { adminProjectRouteBySlug, fallbackProjectRoute } from "@/lib/admin/projects";

export const dynamic = "force-dynamic";

type ProjectDashboardPageProps = {
  params: Promise<{ project: string }>;
};

export async function generateMetadata({ params }: ProjectDashboardPageProps): Promise<Metadata> {
  const { project } = await params;
  const route = adminProjectRouteBySlug(project) || fallbackProjectRoute(project);

  return {
    title: route ? `${route.title} | Ractysh Admin` : "Ractysh Admin",
    description: route ? `Ractysh ${route.label} admin command center.` : "Ractysh admin command center."
  };
}

export default async function ProjectDashboardPage({ params }: ProjectDashboardPageProps) {
  const { project } = await params;
  const route = adminProjectRouteBySlug(project) || fallbackProjectRoute(project);

  const admin = await getCurrentAdmin();
  if (!admin) redirect("/?error=session_required");

  const data = await getAdminCommandCenterData(admin, project);

  return <AdminCommandCenter initialData={data} initialProject={route.key} dashboardTitle={route.title} />;
}
