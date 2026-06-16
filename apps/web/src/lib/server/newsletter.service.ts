import { Prisma, type NewsletterSubscriber } from "@prisma/client";
import { sendWelcomeEmail } from "@/lib/email/sendWelcomeEmail";
import { elapsedMs, logSubmissionTiming, runBackgroundJob } from "@/lib/server/backgroundJobs";
import type { EmailDeliveryResult } from "@/lib/server/emailDelivery";
import { prisma } from "@/lib/server/prisma";

export type NewsletterSubscribeResult =
  | {
      success: true;
      subscriber?: NewsletterSubscriber;
      welcomeEmail: EmailDeliveryResult;
    }
  | {
      success: false;
      message: "Already subscribed";
      subscriber?: NewsletterSubscriber | null;
    }
  | {
      success: false;
      message: string;
      subscriber?: NewsletterSubscriber;
      welcomeEmail?: EmailDeliveryResult;
    };

export async function listNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  return prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" }
  });
}

export async function subscribeNewsletterSubscriber(input: {
  email: string;
  division?: string;
  request?: Request;
  source?: string;
}): Promise<NewsletterSubscribeResult> {
  const startedAt = performance.now();
  const email = input.email.trim().toLowerCase();
  const source = input.source || "footer_newsletter";

  runBackgroundJob(
    "newsletter-subscription",
    async () => {
      const dbStartedAt = performance.now();

      try {
        const subscriber = await prisma.newsletterSubscriber.create({
          data: { email, division: input.division || "ractysh-group" }
        });
        const dbMs = elapsedMs(dbStartedAt);

        logSubmissionTiming("newsletter-db", {
          success: true,
          subscriberId: subscriber.id,
          dbMs,
          welcomeEmailQueued: true
        });

        const emailStartedAt = performance.now();
        const delivery = await sendWelcomeEmail({
          email: subscriber.email,
          request: input.request,
          source,
          idempotencyKey: `newsletter-welcome-${subscriber.id}`
        });

        logSubmissionTiming("newsletter-email", {
          subscriberId: subscriber.id,
          sent: delivery.sent,
          skipped: delivery.skipped,
          originalRecipient: delivery.originalRecipient,
          recipients: delivery.recipients?.join(","),
          redirected: delivery.redirected,
          emailMs: elapsedMs(emailStartedAt),
          error: delivery.error
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
          logSubmissionTiming("newsletter-db", {
            success: false,
            duplicate: true,
            dbMs: elapsedMs(dbStartedAt)
          });
          return;
        }

        throw error;
      }
    },
    { email, source }
  );

  logSubmissionTiming("newsletter", {
    success: true,
    totalMs: elapsedMs(startedAt),
    backgroundQueued: true
  });

  return {
    success: true,
    welcomeEmail: {
      sent: false,
      queued: true
    }
  };
}
