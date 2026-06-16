import { inngest } from "@/lib/inngest/client";

export const scoreConsultationLead = inngest.createFunction(
  {
    id: "score-consultation-lead",
    name: "Score consultation lead",
    triggers: [{ event: "consultation/submitted" }]
  },
  async ({ event, step }) => {
    const score = await step.run("calculate lead score", () => {
      const payload = event.data as Record<string, unknown>;
      const serviceType = String(payload.serviceType || "");
      const budgetRange = String(payload.budgetRange || "");
      let value = 50;
      if (/architecture|turnkey|otc/i.test(serviceType)) value += 20;
      if (/crore|premium|enterprise/i.test(budgetRange)) value += 18;
      return Math.min(100, value);
    });

    return { score };
  }
);

export const publishScheduledContent = inngest.createFunction(
  {
    id: "publish-scheduled-content",
    name: "Publish scheduled content",
    triggers: [{ event: "content/scheduled.publish" }]
  },
  async ({ event, step }) => {
    await step.sleep("settle editorial queue", "5s");

    return step.run("mark publish request received", () => ({
      resource: event.data?.resource,
      resourceId: event.data?.resourceId,
      receivedAt: new Date().toISOString()
    }));
  }
);

export const syncAnalyticsReports = inngest.createFunction(
  {
    id: "sync-analytics-reports",
    name: "Sync analytics reports",
    triggers: [{ cron: "0 */6 * * *" }]
  },
  async ({ step }) => {
    return step.run("collect configured provider statuses", () => ({
      providers: ["sentry", "vercel", "better-stack", "lighthouse"],
      syncedAt: new Date().toISOString()
    }));
  }
);

export const websiteInngestFunctions = [scoreConsultationLead, publishScheduledContent, syncAnalyticsReports];
