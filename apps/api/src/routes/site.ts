import { Router } from "express";
import { getSiteContent } from "../services/siteContentService.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    res.json(await getSiteContent());
  } catch (error) {
    next(error);
  }
});

export default router;
