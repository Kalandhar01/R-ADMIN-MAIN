import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { Prisma } from "@prisma/client";
import { Router, type NextFunction, type Request, type Response } from "express";
import multer from "multer";
import {
  IngestionDatabaseUnavailableError,
  getIngestionKnowledgeSnapshot,
  getIngestionMonitor,
  ingestDocument,
  ingestLead,
  ingestMedia,
  ingestProject,
  recordFailedIngestion,
  updateIngestedProject
} from "../services/ingestionService.js";
import {
  documentIngestionSchema,
  leadIngestionSchema,
  mediaIngestionSchema,
  projectIngestionSchema,
  projectUpdateIngestionSchema
} from "../validation/ingestion.js";

const ingestionRouter = Router();
const adminRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024,
    files: 1
  }
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

function handleUpload(req: Request, res: Response, next: NextFunction) {
  upload.single("file")(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    const message =
      error instanceof multer.MulterError
        ? error.code === "LIMIT_FILE_SIZE"
          ? "Uploaded file must be 25MB or less."
          : "Upload limit exceeded."
        : error instanceof Error
          ? error.message
          : "Unable to process uploaded file.";

    res.status(400).json({ message });
  });
}

function metadataFromBody(value: unknown): Record<string, unknown> {
  if (!value) return {};
  if (typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  if (typeof value !== "string") return {};

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function normalizedBody(req: Request): Record<string, unknown> {
  const body = req.body && typeof req.body === "object" ? (req.body as Record<string, unknown>) : {};
  return {
    ...body,
    metadata: metadataFromBody(body.metadata)
  };
}

function inferMediaKind(mimeType: string | undefined): "image" | "video" | "document" | "other" {
  if (!mimeType) return "other";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (
    mimeType === "application/pdf" ||
    mimeType === "application/msword" ||
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "document";
  }
  return "other";
}

async function uploadToCloudinary(file: Express.Multer.File, folder: string) {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return null;
  }

  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto"
      },
      (error, uploadResult) => {
        if (error || !uploadResult) reject(error || new Error("Cloudinary upload failed"));
        else resolve(uploadResult);
      }
    );

    stream.end(file.buffer);
  });
}

function handleIngestionError(error: unknown, res: Response): boolean {
  if (error instanceof IngestionDatabaseUnavailableError) {
    res.status(503).json({ message: "Enterprise ingestion database is unavailable." });
    return true;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    res.status(404).json({ message: "Ingestion record not found." });
    return true;
  }

  return false;
}

ingestionRouter.post("/leads", async (req, res, next) => {
  const body = normalizedBody(req);
  const parsed = leadIngestionSchema.safeParse(body);

  if (!parsed.success) {
    res.status(400).json({ message: "Please complete the lead ingestion fields.", issues: parsed.error.issues });
    return;
  }

  try {
    res.status(201).json({
      message: "Lead ingested.",
      ingestion: await ingestLead(parsed.data)
    });
  } catch (error) {
    await recordFailedIngestion({
      sourceType: parsed.data.sourceType,
      entityType: "lead",
      source: parsed.data.source,
      service: parsed.data.service,
      location: parsed.data.location,
      payload: parsed.data,
      error
    }).catch(() => undefined);

    if (!handleIngestionError(error, res)) next(error);
  }
});

ingestionRouter.post("/projects", async (req, res, next) => {
  const body = normalizedBody(req);
  const parsed = projectIngestionSchema.safeParse(body);

  if (!parsed.success) {
    res.status(400).json({ message: "Please complete the project ingestion fields.", issues: parsed.error.issues });
    return;
  }

  try {
    res.status(201).json({
      message: "Project ingested.",
      ingestion: await ingestProject(parsed.data)
    });
  } catch (error) {
    await recordFailedIngestion({
      sourceType: "admin_project",
      entityType: "project",
      source: "admin",
      service: parsed.data.division,
      location: parsed.data.location,
      priority: parsed.data.priority,
      payload: parsed.data,
      error
    }).catch(() => undefined);

    if (!handleIngestionError(error, res)) next(error);
  }
});

ingestionRouter.patch("/projects/:id", async (req, res, next) => {
  const body = normalizedBody(req);
  const parsed = projectUpdateIngestionSchema.safeParse(body);

  if (!parsed.success) {
    res.status(400).json({ message: "Please complete the project update fields.", issues: parsed.error.issues });
    return;
  }

  try {
    res.json({
      message: "Project update ingested.",
      ingestion: await updateIngestedProject(req.params.id, parsed.data)
    });
  } catch (error) {
    await recordFailedIngestion({
      sourceType: "admin_project",
      entityType: "project",
      source: "admin",
      service: parsed.data.division,
      location: parsed.data.location,
      priority: parsed.data.priority,
      payload: { id: req.params.id, ...parsed.data },
      error
    }).catch(() => undefined);

    if (!handleIngestionError(error, res)) next(error);
  }
});

ingestionRouter.post("/documents", handleUpload, async (req, res, next) => {
  const body = normalizedBody(req);
  const file = req.file;
  let uploadResult: UploadApiResponse | null = null;

  try {
    if (file) {
      uploadResult = await uploadToCloudinary(file, "ractysh-ingestion-documents");
    }

    const parsed = documentIngestionSchema.safeParse({
      ...body,
      filename: body.filename || file?.originalname,
      mimeType: body.mimeType || file?.mimetype || "application/octet-stream",
      size: body.size || file?.size,
      url: body.url || uploadResult?.secure_url,
      provider: uploadResult ? "cloudinary" : body.provider || "metadata",
      providerId: body.providerId || uploadResult?.public_id
    });

    if (!parsed.success) {
      res.status(400).json({ message: "Please complete the document ingestion fields.", issues: parsed.error.issues });
      return;
    }

    res.status(201).json({
      message: "Document ingested.",
      ingestion: await ingestDocument(parsed.data)
    });
  } catch (error) {
    if (!handleIngestionError(error, res)) next(error);
  }
});

ingestionRouter.post("/media", handleUpload, async (req, res, next) => {
  const body = normalizedBody(req);
  const file = req.file;
  let uploadResult: UploadApiResponse | null = null;

  try {
    if (file) {
      uploadResult = await uploadToCloudinary(file, "ractysh-ingestion-media");
    }

    const parsed = mediaIngestionSchema.safeParse({
      ...body,
      kind: body.kind || inferMediaKind(file?.mimetype),
      title: body.title || file?.originalname,
      url: body.url || uploadResult?.secure_url,
      metadata: {
        ...metadataFromBody(body.metadata),
        originalFilename: file?.originalname,
        mimeType: file?.mimetype,
        size: file?.size,
        provider: uploadResult ? "cloudinary" : "metadata",
        providerId: uploadResult?.public_id
      }
    });

    if (!parsed.success) {
      res.status(400).json({ message: "Please complete the media ingestion fields.", issues: parsed.error.issues });
      return;
    }

    res.status(201).json({
      message: "Media ingested.",
      ingestion: await ingestMedia(parsed.data)
    });
  } catch (error) {
    if (!handleIngestionError(error, res)) next(error);
  }
});

adminRouter.get("/monitor", async (_req, res, next) => {
  try {
    res.json(await getIngestionMonitor());
  } catch (error) {
    if (!handleIngestionError(error, res)) next(error);
  }
});

adminRouter.get("/knowledge", async (_req, res, next) => {
  try {
    res.json(await getIngestionKnowledgeSnapshot());
  } catch (error) {
    if (!handleIngestionError(error, res)) next(error);
  }
});

export { adminRouter as adminIngestionRoutes, ingestionRouter };
