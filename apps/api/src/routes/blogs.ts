import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { Prisma, type BlogStatus } from "@prisma/client";
import { Router, type NextFunction, type Request, type Response } from "express";
import multer from "multer";
import {
  BlogDatabaseUnavailableError,
  createBlog,
  deleteBlog,
  getFeaturedBlog,
  getLatestBlogs,
  getPublicBlogBySlug,
  listAdminBlogs,
  listPublicBlogs,
  updateBlog,
  type BlogListOptions
} from "../services/blogService.js";
import { blogCreateSchema, blogUpdateSchema } from "../validation/blog.js";

const publicRouter = Router();
const adminRouter = Router();

const statuses = ["draft", "scheduled", "published", "archived"] as const;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024,
    files: 1
  }
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

function handleUpload(req: Request, res: Response, next: NextFunction) {
  upload.single("image")(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    const message =
      error instanceof multer.MulterError
        ? error.code === "LIMIT_FILE_SIZE"
          ? "Blog image must be 8MB or less."
          : "Upload limit exceeded."
        : error instanceof Error
          ? error.message
          : "Unable to process uploaded image.";

    res.status(400).json({ message });
  });
}

async function uploadToCloudinary(file: Express.Multer.File): Promise<UploadApiResponse> {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Image upload provider is not configured.");
  }

  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "ractysh-blog-covers",
        resource_type: "image",
        overwrite: false
      },
      (error, uploadResult) => {
        if (error || !uploadResult) reject(error || new Error("Cloudinary upload failed."));
        else resolve(uploadResult);
      }
    );

    stream.end(file.buffer);
  });
}

function stringQuery(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function numberQuery(value: unknown): number | undefined {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function statusQuery(value: unknown): BlogStatus | undefined {
  return typeof value === "string" && statuses.includes(value as BlogStatus) ? (value as BlogStatus) : undefined;
}

function listOptions(req: Request, includeStatus = false): BlogListOptions {
  return {
    page: numberQuery(req.query.page),
    limit: numberQuery(req.query.limit),
    search: stringQuery(req.query.search),
    category: stringQuery(req.query.category),
    status: includeStatus ? statusQuery(req.query.status) : undefined
  };
}

function handleBlogError(error: unknown, res: Response): boolean {
  if (error instanceof BlogDatabaseUnavailableError) {
    res.status(503).json({ message: error.message });
    return true;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "Blog not found." });
      return true;
    }

    if (error.code === "P2002") {
      res.status(409).json({ message: "Blog slug already exists." });
      return true;
    }

    if (error.code === "P2021" || error.code === "P2022") {
      res.status(503).json({ message: "Blog database schema is out of date. Run the latest Prisma migration." });
      return true;
    }
  }

  if (error instanceof Error && /published date|valid date|scheduled blogs|upload provider/i.test(error.message)) {
    res.status(/upload provider/i.test(error.message) ? 503 : 400).json({ message: error.message });
    return true;
  }

  return false;
}

publicRouter.get("/", async (req, res, next) => {
  try {
    res.json(await listPublicBlogs(listOptions(req)));
  } catch (error) {
    if (!handleBlogError(error, res)) next(error);
  }
});

publicRouter.get("/featured", async (_req, res, next) => {
  try {
    const blog = await getFeaturedBlog();
    if (!blog) {
      res.status(404).json({ message: "No featured blog is published." });
      return;
    }

    res.json(blog);
  } catch (error) {
    if (!handleBlogError(error, res)) next(error);
  }
});

publicRouter.get("/latest", async (req, res, next) => {
  try {
    res.json({ blogs: await getLatestBlogs(numberQuery(req.query.limit) || 6) });
  } catch (error) {
    if (!handleBlogError(error, res)) next(error);
  }
});

publicRouter.get("/:slug", async (req, res, next) => {
  try {
    const blog = await getPublicBlogBySlug(req.params.slug, { incrementViews: req.query.trackView !== "0" });
    if (!blog) {
      res.status(404).json({ message: "Blog not found." });
      return;
    }

    res.json(blog);
  } catch (error) {
    if (!handleBlogError(error, res)) next(error);
  }
});

adminRouter.get("/", async (req, res, next) => {
  try {
    res.json(await listAdminBlogs(listOptions(req, true)));
  } catch (error) {
    if (!handleBlogError(error, res)) next(error);
  }
});

adminRouter.post("/upload", handleUpload, async (req, res, next) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ message: "Please upload a blog image." });
    return;
  }

  if (!file.mimetype.startsWith("image/")) {
    res.status(400).json({ message: "Blog cover upload must be an image." });
    return;
  }

  try {
    const uploadResult = await uploadToCloudinary(file);
    const altText = stringQuery(req.body.altText) || file.originalname;

    res.status(201).json({
      coverImage: uploadResult.secure_url,
      coverImageAlt: altText,
      imageMetadata: {
        provider: "cloudinary",
        providerId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
        originalFilename: file.originalname,
        mimeType: file.mimetype,
        uploadedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    if (!handleBlogError(error, res)) next(error);
  }
});

adminRouter.post("/", async (req, res, next) => {
  try {
    const parsed = blogCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Please complete the blog fields.", issues: parsed.error.issues });
      return;
    }

    res.status(201).json(await createBlog(parsed.data));
  } catch (error) {
    if (!handleBlogError(error, res)) next(error);
  }
});

adminRouter.put("/:id", async (req, res, next) => {
  try {
    const parsed = blogUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Please complete the blog fields.", issues: parsed.error.issues });
      return;
    }

    res.json(await updateBlog(req.params.id, parsed.data));
  } catch (error) {
    if (!handleBlogError(error, res)) next(error);
  }
});

adminRouter.delete("/:id", async (req, res, next) => {
  try {
    await deleteBlog(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (!handleBlogError(error, res)) next(error);
  }
});

export { adminRouter as adminBlogRoutes, publicRouter as publicBlogRoutes };
