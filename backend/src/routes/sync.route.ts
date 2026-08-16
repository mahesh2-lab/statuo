import { Router } from "express";
import { syncJobsHandler } from "../controllers/sync.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { syncLimiter } from "../middleware/rate-limiter";

const router = Router();

// POST /api/v1/sync triggers an immediate push sync across all workers
router.post("/sync", authMiddleware, syncLimiter, syncJobsHandler);

export default router;
