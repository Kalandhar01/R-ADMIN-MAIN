import { Prisma } from "@prisma/client";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import {
  createInquiry,
  listContactInquiries,
  updateContactInquiry,
  type InquiryPayload
} from "../services/inquiryService.js";
import { sendInquiryNotification } from "../services/inquiryNotificationService.js";
import { contactInquirySchema } from "../validation/inquiry.js";

const contactRouter = Router();
const adminRouter = Router();

const contactSubmitLimiter = rateLimit({
  windowMs: 10 * 60_000,
  limit: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many contact submissions. Please try again shortly."
  }
});

const statuses = ["new", "contacted", "qualified", "proposal_sent", "won", "closed", "archived"] as const;

const updateSchema = z.object({
  status: z.enum(statuses).optional(),
  notes: z
    .preprocess(
      (value) => (typeof value === "string" ? value.trim() : value),
      z.string().max(4000).optional()
    )
    .transform((value) => value || undefined)
});

function contactBody(body: unknown, fallbackSourcePage: string | undefined) {
  const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  return {
    ...payload,
    sourcePage:
      typeof payload.sourcePage === "string" && payload.sourcePage.trim()
        ? payload.sourcePage
        : fallbackSourcePage || "api/contact"
  };
}

function handlePrismaError(error: unknown): { status: number; body: { message: string } } | null {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    return { status: 404, body: { message: "Contact inquiry not found." } };
  }

  return null;
}

contactRouter.post("/", contactSubmitLimiter, async (req, res, next) => {
  try {
    const parsed = contactInquirySchema.safeParse(contactBody(req.body, req.get("referer") || req.get("origin")));

    if (!parsed.success) {
      res.status(400).json({
        message: "Please complete the required contact fields.",
        issues: parsed.error.issues
      });
      return;
    }

    const submittedAt = new Date().toISOString();
    const inquiryPayload = { ...parsed.data, kind: "contact" } as InquiryPayload;
    const storage = await createInquiry(inquiryPayload);

    if (!storage.stored) {
      res.status(503).json({
        message: "Unable to save contact inquiry. Please try again.",
        submittedAt,
        inquiry: {
          stored: false,
          storageError: storage.error
        }
      });
      return;
    }

    const notification = await sendInquiryNotification({ ...parsed.data, kind: "contact", inquiryId: storage.id }, submittedAt);

    if (!notification.sent) {
      console.error("Contact inquiry email notification failed:", {
        inquiryId: storage.id,
        error: notification.error,
        skipped: notification.skipped
      });
    }

    res.status(201).json({
      message: "Contact inquiry received.",
      submittedAt,
      inquiry: {
        id: storage.id,
        ingestionId: storage.ingestionId,
        stored: true,
        status: "new"
      },
      notification
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/", async (_req, res, next) => {
  try {
    res.json({ inquiries: await listContactInquiries() });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/:id", async (req, res, next) => {
  try {
    const parsed = updateSchema.safeParse(req.body && typeof req.body === "object" ? req.body : {});

    if (!parsed.success) {
      res.status(400).json({ message: "Please provide a valid status or notes.", issues: parsed.error.issues });
      return;
    }

    res.json({ inquiry: await updateContactInquiry(req.params.id, parsed.data) });
  } catch (error) {
    const handled = handlePrismaError(error);
    if (handled) {
      res.status(handled.status).json(handled.body);
      return;
    }

    next(error);
  }
});

export { adminRouter as adminContactInquiryRoutes, contactRouter };
