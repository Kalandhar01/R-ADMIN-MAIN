import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { Router, type NextFunction, type Request, type Response } from "express";
import multer from "multer";
import type { ConsultationAttachment, ConsultationRecord } from "../types/consultation.js";
import {
  createConsultation,
  getConsultationWorkflow,
  updateConsultationNotification,
} from "../services/consultationService.js";
import { subscribeConsultationUpdate } from "../services/consultationWorkflowEvents.js";
import { sendConsultationNotification } from "../services/consultationNotificationService.js";
import { consultationSubmissionSchema } from "../validation/consultation.js";

const router = Router();

const maxTotalUploadSize = 35 * 1024 * 1024;
const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".dwg", ".dxf", ".ifc", ".rvt"];
const allowedMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/acad",
  "application/x-acad",
  "application/autocad_dwg",
  "application/x-autocad",
  "application/dwg",
  "application/x-dwg",
  "application/octet-stream"
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024,
    files: 5
  },
  fileFilter: (_req, file, callback) => {
    const lowerName = file.originalname.toLowerCase();
    const accepted =
      file.mimetype.startsWith("image/") ||
      allowedMimeTypes.includes(file.mimetype) ||
      allowedExtensions.some((extension) => lowerName.endsWith(extension));

    if (!accepted) {
      callback(new Error("Unsupported file type. Upload PDFs, images or blueprint files only."));
      return;
    }

    callback(null, true);
  }
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

function runUpload(req: Request, res: Response, next: NextFunction) {
  upload.array("requirementFiles", 5)(req, res, (error) => {
    if (!error) {
      const files = Array.isArray(req.files) ? req.files : [];
      const totalSize = files.reduce((total, file) => total + file.size, 0);

      if (totalSize > maxTotalUploadSize) {
        res.status(400).json({ message: "Combined uploads must be 35MB or less." });
        return;
      }

      next();
      return;
    }

    const message =
      error instanceof multer.MulterError
        ? error.code === "LIMIT_FILE_SIZE"
          ? "Each file must be 15MB or less."
          : "Upload limit exceeded."
        : error instanceof Error
          ? error.message
          : "Unable to process uploaded files.";

    res.status(400).json({ message });
  });
}

async function uploadToCloudinary(file: Express.Multer.File): Promise<ConsultationAttachment> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return {
      filename: file.originalname,
      mimeType: file.mimetype || "application/octet-stream",
      size: file.size,
      provider: "metadata"
    };
  }

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "ractysh-consultations",
        resource_type: "auto"
      },
      (error, uploadResult) => {
        if (error || !uploadResult) reject(error || new Error("Cloudinary upload failed"));
        else resolve(uploadResult);
      }
    );

    stream.end(file.buffer);
  });

  return {
    filename: file.originalname,
    mimeType: file.mimetype || result.resource_type,
    size: file.size,
    url: result.secure_url,
    provider: "cloudinary",
    providerId: result.public_id
  };
}

router.post("/", runUpload, async (req, res, next) => {
  try {
    const parsed = consultationSubmissionSchema.safeParse(req.body && typeof req.body === "object" ? req.body : {});

    if (!parsed.success) {
      res.status(400).json({
        message: "Please complete the required consultation fields.",
        issues: parsed.error.issues
      });
      return;
    }

    const files = Array.isArray(req.files) ? req.files : [];
    const attachments = await Promise.all(files.map(uploadToCloudinary));
    const consultation = await createConsultation({
      ...parsed.data,
      attachments,
      source: "book-consultation-page"
    });
    const skipNotification = req.get("x-ractysh-skip-notification") === "true";
    const notification: ConsultationRecord["notification"] = skipNotification
      ? { sent: false, skipped: true, error: "Notification handled by the web Resend route." }
      : await sendConsultationNotification(consultation, files);
    const finalRecord: ConsultationRecord = {
      ...consultation,
      notification
    };

    await updateConsultationNotification(consultation._id, notification);

    res.status(201).json({
      message: "Your consultation request has been securely submitted.",
      consultation: finalRecord
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/workflow", async (req, res, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const trackingToken = Array.isArray(req.query.trackingToken) ? req.query.trackingToken[0] : req.query.trackingToken;

    if (!id || typeof trackingToken !== "string" || !trackingToken) {
      res.status(400).json({ message: "Missing consultation id or tracking token" });
      return;
    }

    const workflow = await getConsultationWorkflow(id, trackingToken);

    if (!workflow) {
      res.status(404).json({ message: "Consultation workflow not found" });
      return;
    }

    res.json(workflow);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/events", async (req, res, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const trackingToken = Array.isArray(req.query.trackingToken) ? req.query.trackingToken[0] : req.query.trackingToken;

    if (!id || typeof trackingToken !== "string" || !trackingToken) {
      res.status(400).json({ message: "Missing consultation id or tracking token" });
      return;
    }

    const initialWorkflow = await getConsultationWorkflow(id, trackingToken);

    if (!initialWorkflow) {
      res.status(404).json({ message: "Consultation workflow not found" });
      return;
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no"
    });

    const writeEvent = (event: string, payload: ConsultationRecord) => {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    };

    writeEvent("workflow", initialWorkflow);

    const unsubscribe = subscribeConsultationUpdate(id, async () => {
      const workflow = await getConsultationWorkflow(id, trackingToken);
      if (workflow) writeEvent("workflow", workflow);
    });
    const heartbeat = setInterval(() => {
      res.write(": heartbeat\n\n");
    }, 25_000);

    req.on("close", () => {
      unsubscribe();
      clearInterval(heartbeat);
      res.end();
    });
  } catch (error) {
    next(error);
  }
});

export default router;
