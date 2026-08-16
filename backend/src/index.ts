import "dotenv/config";
import path from "path";
import fs from "fs";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./libs/auth";
import { schedulerService } from "./services/scheduler.service";
import apiRouter from "./routes";
import { getHealthCheck } from "./controllers/user.controller";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

// 1. Core Security & CORS Middlewares
app.use(
  cors({
    origin: [CORS_ORIGIN, "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// 2. Better Auth Route Handlers (Wildcard mounted before body-parser)
app.all("/api/auth/*splat", toNodeHandler(auth));

// 3. Body Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// 4. Application Routes
app.get("/health", getHealthCheck);
app.use("/api", apiRouter);

// 4.1 Production Frontend Static Serving
const clientDistPath = process.env.CLIENT_DIST_PATH || path.resolve(process.cwd(), "client");
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get("*splat", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/health")) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => res.redirect("/api/health"));
}

// 5. Error & 404 Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// 6. Bootstrap Server & Distributed Scheduler Engine
async function bootstrap() {
  try {
    const server = app.listen(PORT, async () => {
      console.log(`[Statuo API] Server listening at http://localhost:${PORT}`);
      console.log(`[Statuo API] Better Auth endpoints mounted at /api/auth`);
      console.log(`[Statuo API] Job & Metrics routes mounted at /api/v1/jobs`);

      // Initialize Distributed Scheduler with Push + 30s Polling Fallback
      await schedulerService.initScheduler();
    });

    server.on("error", (error) => {
      console.error("[Statuo API] Server startup error:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("[Statuo API] Bootstrap failed:", error);
    process.exit(1);
  }
}

bootstrap();

export default app;
