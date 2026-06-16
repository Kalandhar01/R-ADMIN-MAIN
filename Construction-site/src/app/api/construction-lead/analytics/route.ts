import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const [
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      proposalSentLeads,
      wonLeads,
      lostLeads,
      allServices,
    ] = await Promise.all([
      prisma.constructionLead.count(),
      prisma.constructionLead.count({ where: { status: "new" } }),
      prisma.constructionLead.count({ where: { status: "contacted" } }),
      prisma.constructionLead.count({ where: { status: "qualified" } }),
      prisma.constructionLead.count({ where: { status: "proposal_sent" } }),
      prisma.constructionLead.count({ where: { status: "won" } }),
      prisma.constructionLead.count({ where: { status: "lost" } }),
      prisma.constructionLead.findMany({
        where: { selectedServices: { isEmpty: false } },
        select: { selectedServices: true },
      }),
    ]);

    const serviceCount: Record<string, number> = {};
    for (const entry of allServices) {
      for (const svc of entry.selectedServices) {
        serviceCount[svc] = (serviceCount[svc] || 0) + 1;
      }
    }

    const serviceAnalytics = Object.entries(serviceCount)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0,
      }));

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const leadsThisWeek = await prisma.constructionLead.count({
      where: { createdAt: { gte: last7Days } },
    });

    return NextResponse.json({
      total: totalLeads,
      byStatus: {
        new: newLeads,
        contacted: contactedLeads,
        qualified: qualifiedLeads,
        proposal_sent: proposalSentLeads,
        won: wonLeads,
        lost: lostLeads,
      },
      serviceAnalytics,
      leadsThisWeek,
    });
  } catch (err) {
    console.error("Failed to fetch analytics:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
