import "dotenv/config";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import consultationRoutes from "./routes/consultations.js";
import { adminBlogRoutes, publicBlogRoutes } from "./routes/blogs.js";
import { adminContactInquiryRoutes, contactRouter } from "./routes/contact.js";
import { adminIngestionRoutes, ingestionRouter } from "./routes/ingestion.js";
import inquiryRoutes from "./routes/inquiries.js";
import { adminNewsletterRoutes, newsletterRoutes, publicNewsletterRoutes } from "./routes/newsletters.js";
import { adminOperationsRoutes } from "./routes/operations.js";
import siteRoutes from "./routes/site.js";
import { connectDatabase } from "./lib/db.js";
import { connectPrismaDatabase } from "./lib/prisma.js";
import { setBlogPrismaEnabled } from "./services/blogService.js";
import { setConsultationPrismaEnabled } from "./services/consultationService.js";
import { setIngestionPrismaEnabled } from "./services/ingestionService.js";
import { setNewsletterPrismaEnabled } from "./services/newsletterService.js";
import { setOperationsPrismaEnabled } from "./services/operationsService.js";
import { setMongoEnabled } from "./services/siteContentService.js";

const app = express();
const port = Number(process.env.PORT || 5000);
const configuredOrigins = process.env.WEB_ORIGIN?.split(",").map((origin) => origin.trim()).filter(Boolean) || [];
const defaultLocalOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:3002",
  "http://127.0.0.1:3003"
];
const allowedOrigins = new Set(configuredOrigins.length ? configuredOrigins : defaultLocalOrigins);
const localhostPattern = /^https?:\/\/(?:localhost|127\.0\.0\.1):\d+$/;

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin) || localhostPattern.test(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS.`));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 240
  })
);

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "ractysh-api" });
});

app.use("/api/site", siteRoutes);
app.use("/api/blogs", publicBlogRoutes);
app.use("/api/admin/blogs", adminBlogRoutes);
app.use("/api/contact", contactRouter);
app.use("/api/admin/contact-inquiries", adminContactInquiryRoutes);
app.use("/api/newsletters", publicNewsletterRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/admin/newsletters", adminNewsletterRoutes);
app.use("/api/admin/operations", adminOperationsRoutes);
app.use("/api/ingestion", ingestionRouter);
app.use("/api/admin/ingestion", adminIngestionRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/inquiries", inquiryRoutes);

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

const [mongoConnected, prismaConnected] = await Promise.all([connectDatabase(), connectPrismaDatabase()]);
setMongoEnabled(mongoConnected);
setBlogPrismaEnabled(prismaConnected);
setConsultationPrismaEnabled(prismaConnected);
setIngestionPrismaEnabled(prismaConnected);
setNewsletterPrismaEnabled(prismaConnected);
setOperationsPrismaEnabled(prismaConnected);

app.listen(port);
