import { Router, type Response } from "express";
import { createInquiry, type InquiryPayload } from "../services/inquiryService.js";
import { sendInquiryNotification } from "../services/inquiryNotificationService.js";
import { contactInquirySchema, demoInquirySchema } from "../validation/inquiry.js";

const router = Router();

type InquirySchema = typeof contactInquirySchema | typeof demoInquirySchema;

function responseStatus(notification: { sent: boolean; skipped?: boolean }): number {
  if (notification.sent) return 201;
  return notification.skipped ? 503 : 502;
}

async function handleInquiry(
  kind: InquiryPayload["kind"],
  schema: InquirySchema,
  body: unknown,
  skipNotification: boolean,
  res: Response
) {
  const parsed = schema.safeParse(body && typeof body === "object" ? body : {});

  if (!parsed.success) {
    res.status(400).json({
      message: "Please complete the required inquiry fields.",
      issues: parsed.error.issues
    });
    return;
  }

  const submittedAt = new Date().toISOString();
  const inquiryPayload = { ...parsed.data, kind } as InquiryPayload;
  const storage = await createInquiry(inquiryPayload);

  if (!storage.stored) {
    res.status(503).json({
      message: "Unable to save inquiry. Please try again.",
      submittedAt,
      inquiry: {
        stored: false,
        storageError: storage.error
      }
    });
    return;
  }

  const notification = skipNotification
    ? { sent: false, skipped: true, error: "Notification handled by the Next.js App Router." }
    : await sendInquiryNotification({ ...inquiryPayload, inquiryId: storage.id }, submittedAt);

  res.status(skipNotification ? 201 : responseStatus(notification)).json({
    message: notification.sent || skipNotification ? "Inquiry successfully routed." : "Unable to deliver inquiry email.",
    submittedAt,
    inquiry: {
      id: storage.id,
      ingestionId: storage.ingestionId,
      stored: storage.stored,
      storageError: storage.error
    },
    notification
  });
}

router.post("/contact", async (req, res, next) => {
  try {
    await handleInquiry(
      "contact",
      contactInquirySchema,
      req.body,
      req.get("x-ractysh-skip-notification") === "true",
      res
    );
  } catch (error) {
    next(error);
  }
});

router.post("/book-demo", async (req, res, next) => {
  try {
    await handleInquiry(
      "book-demo",
      demoInquirySchema,
      req.body,
      req.get("x-ractysh-skip-notification") === "true",
      res
    );
  } catch (error) {
    next(error);
  }
});

export default router;
