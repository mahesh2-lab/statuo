import { Router } from "express";
import jobRouter from "./job.route";
import syncRouter from "./sync.route";
import { getCurrentUser, getHealthCheck } from "../controllers/user.controller";

const apiRouter = Router();

// Public Health & System Info
apiRouter.get("/health", getHealthCheck);
apiRouter.get("/v1/health", getHealthCheck);
apiRouter.get("/", getHealthCheck);

// Current User Session
apiRouter.get("/me", getCurrentUser);

// V1 API Routes
apiRouter.use("/v1", jobRouter);
apiRouter.use("/v1", syncRouter);

export default apiRouter;
