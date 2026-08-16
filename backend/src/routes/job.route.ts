import { Router } from "express";
import {
  listJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  toggleJobStatus,
  triggerJobTest,
  getJobLogs,
  getDashboardAnalytics,
} from "../controllers/job.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { triggerPingLimiter } from "../middleware/rate-limiter";

const router = Router();

// All job routes require authentication
router.use(authMiddleware);

// Analytics & Dashboard Summary
router.get("/analytics", getDashboardAnalytics);

// Jobs CRUD
router.get("/jobs", listJobs);
router.post("/jobs", createJob);
router.post("/registerjob", createJob); // Backwards-compatible alias

router.get("/jobs/:id", getJobById);
router.patch("/jobs/:id", updateJob);
router.delete("/jobs/:id", deleteJob);

// Actions & Execution (with DoS rate limiter on on-demand test pings)
router.post("/jobs/:id/toggle", toggleJobStatus);
router.post("/jobs/:id/trigger", triggerPingLimiter, triggerJobTest);

// Logs & History
router.get("/jobs/:id/logs", getJobLogs);

export default router;
