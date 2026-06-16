import { Prisma } from "@prisma/client";
import { Router } from "express";
import {
  NewsletterDatabaseUnavailableError,
  createNewsletter,
  deleteNewsletter,
  getExecutiveIntelligence,
  getFeaturedNewsletter,
  getLatestNewsletter,
  getPublicNewsletterBySlug,
  listAdminNewsletters,
  subscribeToNewsletter,
  updateNewsletter
} from "../services/newsletterService.js";
import {
  newsletterCreateSchema,
  newsletterSubscribeSchema,
  newsletterUpdateSchema
} from "../validation/newsletter.js";

const publicRouter = Router();
const adminRouter = Router();
const subscribeRouter = Router();

function limitFromQuery(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 6;
}

function handleNewsletterError(error: unknown, res: { status: (code: number) => { json: (body: unknown) => void } }): boolean {
  if (error instanceof NewsletterDatabaseUnavailableError) {
    res.status(503).json({ message: error.message });
    return true;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "Newsletter not found." });
      return true;
    }

    if (error.code === "P2002") {
      res.status(409).json({ message: "Newsletter slug already exists." });
      return true;
    }

    if (error.code === "P2021" || error.code === "P2022") {
      res.status(503).json({ message: "Newsletter database schema is out of date. Run the latest Prisma migration." });
      return true;
    }
  }

  if (error instanceof Error && /publish date|valid date/i.test(error.message)) {
    res.status(400).json({ message: error.message });
    return true;
  }

  return false;
}

publicRouter.get("/", async (req, res, next) => {
  try {
    res.json(await getExecutiveIntelligence(limitFromQuery(req.query.limit)));
  } catch (error) {
    if (!handleNewsletterError(error, res)) next(error);
  }
});

publicRouter.get("/featured", async (_req, res, next) => {
  try {
    const newsletter = await getFeaturedNewsletter();
    if (!newsletter) {
      res.status(404).json({ message: "No featured newsletter is published." });
      return;
    }

    res.json(newsletter);
  } catch (error) {
    if (!handleNewsletterError(error, res)) next(error);
  }
});

publicRouter.get("/latest", async (_req, res, next) => {
  try {
    const newsletter = await getLatestNewsletter();
    if (!newsletter) {
      res.status(404).json({ message: "No newsletter is published." });
      return;
    }

    res.json(newsletter);
  } catch (error) {
    if (!handleNewsletterError(error, res)) next(error);
  }
});

publicRouter.get("/:slug", async (req, res, next) => {
  try {
    const newsletter = await getPublicNewsletterBySlug(req.params.slug);
    if (!newsletter) {
      res.status(404).json({ message: "Newsletter not found." });
      return;
    }

    res.json(newsletter);
  } catch (error) {
    if (!handleNewsletterError(error, res)) next(error);
  }
});

adminRouter.get("/", async (_req, res, next) => {
  try {
    res.json({ newsletters: await listAdminNewsletters() });
  } catch (error) {
    if (!handleNewsletterError(error, res)) next(error);
  }
});

adminRouter.post("/", async (req, res, next) => {
  try {
    const parsed = newsletterCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Please complete the newsletter fields.", issues: parsed.error.issues });
      return;
    }

    res.status(201).json(await createNewsletter(parsed.data));
  } catch (error) {
    if (!handleNewsletterError(error, res)) next(error);
  }
});

adminRouter.put("/:id", async (req, res, next) => {
  try {
    const parsed = newsletterUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Please complete the newsletter fields.", issues: parsed.error.issues });
      return;
    }

    res.json(await updateNewsletter(req.params.id, parsed.data));
  } catch (error) {
    if (!handleNewsletterError(error, res)) next(error);
  }
});

adminRouter.delete("/:id", async (req, res, next) => {
  try {
    await deleteNewsletter(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (!handleNewsletterError(error, res)) next(error);
  }
});

subscribeRouter.post("/subscribe", async (req, res, next) => {
  try {
    const parsed = newsletterSubscribeSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Please enter a valid email.", issues: parsed.error.issues });
      return;
    }

    res.status(201).json({
      message: "Subscription confirmed.",
      subscriber: await subscribeToNewsletter(parsed.data)
    });
  } catch (error) {
    if (!handleNewsletterError(error, res)) next(error);
  }
});

export { adminRouter as adminNewsletterRoutes, publicRouter as publicNewsletterRoutes, subscribeRouter as newsletterRoutes };
