import { Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { sql } from "drizzle-orm";
import { auth } from "../libs/auth";
import { db } from "../db";
import { redisPublisher } from "../libs/redis";
import { ApiResponse, asyncHandler } from "../utils/api-response";

/**
 * Get current authenticated user session
 * GET /api/me
 */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  return ApiResponse.ok(res, session, "Session retrieved successfully");
});

/**
 * Comprehensive System Health Check
 * GET /health, GET /api/health, GET /api/v1/health
 */
export const getHealthCheck = asyncHandler(async (req: Request, res: Response) => {
  const checks: Record<string, { status: string; latencyMs?: number; error?: string }> = {};

  // 1. PostgreSQL Database Check
  const dbStart = Date.now();
  try {
    await db.execute(sql`SELECT 1`);
    checks.database = {
      status: "connected",
      latencyMs: Date.now() - dbStart,
    };
  } catch (err: any) {
    checks.database = {
      status: "disconnected",
      error: err.message || "Database query failed",
    };
  }

  // 2. Redis Connection Check
  const redisStart = Date.now();
  try {
    const pingRes = await redisPublisher.ping();
    checks.redis = {
      status: pingRes === "PONG" ? "connected" : "degraded",
      latencyMs: Date.now() - redisStart,
    };
  } catch (err: any) {
    checks.redis = {
      status: "disconnected",
      error: err.message || "Redis ping failed",
    };
  }

  const isHealthy =
    checks.database?.status === "connected" &&
    checks.redis?.status === "connected";

  const statusCode = isHealthy ? 200 : 503;

  return res.status(statusCode).json({
    success: isHealthy,
    statusCode,
    status: isHealthy ? "healthy" : "degraded",
    service: "Statuo Monitoring Engine",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    checks,
  });
});
