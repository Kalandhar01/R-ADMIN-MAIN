import { Router } from "express";
import { getOperationsOverview } from "../services/operationsService.js";

const adminRouter = Router();

adminRouter.get("/overview", async (_req, res, next) => {
  try {
    res.json(await getOperationsOverview());
  } catch (error) {
    next(error);
  }
});

export { adminRouter as adminOperationsRoutes };
