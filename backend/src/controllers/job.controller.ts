import { Request, Response } from "express";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { db } from "../db";
import { jobLogs, scheduledJobs } from "../db/schema";
import { registerJobValidation, updateJobValidation } from "../utils/validations";
import { schedulerService } from "../services/scheduler.service";
import { ApiError, ApiResponse, asyncHandler } from "../utils/api-response";
import { encryptToken, decryptToken } from "../utils/crypto";
import { validateTargetUrl } from "../utils/ssrf";

/**
 * Format job object to provide both lastResponseTime and lastResponseTimeMs,
 * and mask encrypted token for security.
 */
const formatJob = (job: any) => {
  if (!job) return job;
  return {
    ...job,
    token: job.token ? "••••••••" : null,
    lastResponseTime: job.lastResponseTimeMs ?? null,
    lastResponseTimeMs: job.lastResponseTimeMs ?? null,
  };
};

/**
 * Format log object to provide both responseTime and responseTimeMs
 */
const formatLog = (log: any) => {
  if (!log) return log;
  return {
    ...log,
    responseTime: log.responseTimeMs ?? null,
    responseTimeMs: log.responseTimeMs ?? null,
  };
};

/**
 * 1. List all jobs for the authenticated user
 * GET /api/v1/jobs
 */
export const listJobs = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw ApiError.unauthorized();

  const { status, search, limit = "50", offset = "0" } = req.query;
  const limitNum = Math.min(Math.max(parseInt(limit as string) || 50, 1), 100);
  const offsetNum = Math.max(parseInt(offset as string) || 0, 0);

  const conditions = [eq(scheduledJobs.userId, userId)];

  if (status && typeof status === "string") {
    conditions.push(eq(scheduledJobs.status, status.toUpperCase()));
  }

  if (search && typeof search === "string") {
    conditions.push(ilike(scheduledJobs.name, `%${search}%`));
  }

  const rawJobs = await db
    .select()
    .from(scheduledJobs)
    .where(and(...conditions))
    .orderBy(desc(scheduledJobs.createdAt))
    .limit(limitNum)
    .offset(offsetNum);

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(scheduledJobs)
    .where(and(...conditions));

  const jobs = rawJobs.map(formatJob);

  return ApiResponse.ok(
    res,
    {
      jobs,
      pagination: {
        total: Number(total),
        limit: limitNum,
        offset: offsetNum,
      },
    },
    "Jobs retrieved successfully"
  );
});

/**
 * 2. Get a single job by ID
 * GET /api/v1/jobs/:id
 */
export const getJobById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const jobId = parseInt(req.params.id as string);

  if (!userId) throw ApiError.unauthorized();
  if (isNaN(jobId)) throw ApiError.badRequest("Invalid job ID");

  const [rawJob] = await db
    .select()
    .from(scheduledJobs)
    .where(and(eq(scheduledJobs.id, jobId), eq(scheduledJobs.userId, userId)));

  if (!rawJob) {
    throw ApiError.notFound("Job not found");
  }

  const rawRecentLogs = await db
    .select()
    .from(jobLogs)
    .where(eq(jobLogs.jobId, jobId))
    .orderBy(desc(jobLogs.executedAt))
    .limit(10);

  const job = formatJob(rawJob);
  const recentLogs = rawRecentLogs.map(formatLog);

  return ApiResponse.ok(res, { job, recentLogs }, "Job details retrieved");
});

/**
 * 3. Create / Register a new job (with AES-256 token encryption & SSRF check)
 * POST /api/v1/jobs or POST /api/v1/registerjob
 */
export const createJob = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw ApiError.unauthorized();

  const validated = registerJobValidation.safeParse(req.body);
  if (!validated.success) {
    throw ApiError.badRequest("Validation failed", validated.error.flatten());
  }

  const data = validated.data;

  // SSRF guard
  const ssrfCheck = validateTargetUrl(data.url);
  if (!ssrfCheck.valid) {
    throw ApiError.badRequest(`SSRF Blocked: ${ssrfCheck.error}`);
  }

  // Encrypt auth token at rest
  const encryptedToken = data.token ? encryptToken(data.token) : null;

  const [newJob] = await db
    .insert(scheduledJobs)
    .values({
      ...data,
      token: encryptedToken,
      userId,
    })
    .returning();

  // Instant distributed push notification
  await schedulerService.notifyJobChange("created", newJob.id);

  return ApiResponse.created(res, formatJob(newJob), "Job registered successfully");
});

/**
 * 4. Update an existing job (with AES-256 token encryption & SSRF check)
 * PATCH /api/v1/jobs/:id
 */
export const updateJob = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const jobId = parseInt(req.params.id as string);

  if (!userId) throw ApiError.unauthorized();
  if (isNaN(jobId)) throw ApiError.badRequest("Invalid job ID");

  const validated = updateJobValidation.safeParse(req.body);
  if (!validated.success) {
    throw ApiError.badRequest("Validation failed", validated.error.flatten());
  }

  const updateData = { ...validated.data };

  // SSRF guard on URL update
  if (updateData.url) {
    const ssrfCheck = validateTargetUrl(updateData.url);
    if (!ssrfCheck.valid) {
      throw ApiError.badRequest(`SSRF Blocked: ${ssrfCheck.error}`);
    }
  }

  // Encrypt token if provided
  if (updateData.token !== undefined) {
    updateData.token = updateData.token ? (encryptToken(updateData.token) as string) : undefined;
  }

  const [existing] = await db
    .select()
    .from(scheduledJobs)
    .where(and(eq(scheduledJobs.id, jobId), eq(scheduledJobs.userId, userId)));

  if (!existing) {
    throw ApiError.notFound("Job not found");
  }

  const [updatedJob] = await db
    .update(scheduledJobs)
    .set({
      ...updateData,
      updatedAt: new Date(),
    })
    .where(and(eq(scheduledJobs.id, jobId), eq(scheduledJobs.userId, userId)))
    .returning();

  await schedulerService.notifyJobChange("updated", updatedJob.id);

  return ApiResponse.ok(res, formatJob(updatedJob), "Job updated successfully");
});

/**
 * 5. Delete a job
 * DELETE /api/v1/jobs/:id
 */
export const deleteJob = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const jobId = parseInt(req.params.id as string);

  if (!userId) throw ApiError.unauthorized();
  if (isNaN(jobId)) throw ApiError.badRequest("Invalid job ID");

  const [deleted] = await db
    .delete(scheduledJobs)
    .where(and(eq(scheduledJobs.id, jobId), eq(scheduledJobs.userId, userId)))
    .returning();

  if (!deleted) {
    throw ApiError.notFound("Job not found");
  }

  await schedulerService.notifyJobChange("deleted", jobId);

  return ApiResponse.ok(res, { jobId }, "Job deleted successfully");
});

/**
 * 6. Toggle Pause / Resume
 * POST /api/v1/jobs/:id/toggle
 */
export const toggleJobStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const jobId = parseInt(req.params.id as string);

  if (!userId) throw ApiError.unauthorized();
  if (isNaN(jobId)) throw ApiError.badRequest("Invalid job ID");

  const [existing] = await db
    .select()
    .from(scheduledJobs)
    .where(and(eq(scheduledJobs.id, jobId), eq(scheduledJobs.userId, userId)));

  if (!existing) {
    throw ApiError.notFound("Job not found");
  }

  const nextActive = !existing.isActive;
  const nextStatus = nextActive ? "PENDING" : "PAUSED";

  const [updatedJob] = await db
    .update(scheduledJobs)
    .set({
      isActive: nextActive,
      status: nextStatus,
      updatedAt: new Date(),
    })
    .where(and(eq(scheduledJobs.id, jobId), eq(scheduledJobs.userId, userId)))
    .returning();

  await schedulerService.notifyJobChange(nextActive ? "updated" : "deleted", jobId);

  return ApiResponse.ok(
    res,
    formatJob(updatedJob),
    `Job ${nextActive ? "resumed" : "paused"} successfully`
  );
});

/**
 * 7. On-demand test ping (with SSRF guard, token decryption, & rate limiting)
 * POST /api/v1/jobs/:id/trigger
 */
export const triggerJobTest = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const jobId = parseInt(req.params.id as string);

  if (!userId) throw ApiError.unauthorized();
  if (isNaN(jobId)) throw ApiError.badRequest("Invalid job ID");

  const [job] = await db
    .select()
    .from(scheduledJobs)
    .where(and(eq(scheduledJobs.id, jobId), eq(scheduledJobs.userId, userId)));

  if (!job) {
    throw ApiError.notFound("Job not found");
  }

  // Pre-flight SSRF check
  const ssrfCheck = validateTargetUrl(job.url);
  if (!ssrfCheck.valid) {
    throw ApiError.badRequest(`SSRF Blocked: ${ssrfCheck.error}`);
  }

  const startTime = performance.now();
  const headers: Record<string, string> = {
    "User-Agent": "Statuo-ManualTest/1.0",
    Accept: "*/*",
  };

  if (job.token) {
    const plainToken = decryptToken(job.token);
    if (plainToken) {
      headers["Authorization"] = plainToken.startsWith("Bearer ")
        ? plainToken
        : `Bearer ${plainToken}`;
    }
  }

  let ok = false;
  let statusCode: number | undefined;
  let errorMessage: string | undefined;

  try {
    const response = await fetch(job.url, {
      method: job.method || "GET",
      headers,
      signal: AbortSignal.timeout((job.timeoutSeconds || 10) * 1000),
    });

    statusCode = response.status;
    ok = response.ok;

    if (!ok) {
      errorMessage = `HTTP ${response.status} ${response.statusText || ""}`.trim();
    }
  } catch (err: any) {
    ok = false;
    const cause = err?.cause;
    errorMessage = cause?.message || err?.message || "Network request failed";
  }

  const durationMs = Math.max(Math.round(performance.now() - startTime), 1);

  // Insert execution record into jobLogs
  await db.insert(jobLogs).values({
    jobId: job.id,
    status: ok ? "SUCCESS" : "FAILED",
    statusCode: statusCode ?? null,
    responseTimeMs: durationMs,
    errorMessage: errorMessage ?? null,
    attempt: 1,
  });

  // Also update scheduledJobs latest metrics
  await db
    .update(scheduledJobs)
    .set({
      lastStatusCode: statusCode ?? (ok ? 200 : null),
      lastResponseTimeMs: durationMs,
      lastRunAt: new Date(),
      lastErrorMessage: errorMessage ?? null,
      status: ok ? "HEALTHY" : "DOWN",
      updatedAt: new Date(),
    })
    .where(eq(scheduledJobs.id, job.id));

  return ApiResponse.ok(
    res,
    {
      ok,
      statusCode,
      responseTime: durationMs,
      responseTimeMs: durationMs,
      errorMessage: errorMessage ?? null,
      testedAt: new Date().toISOString(),
    },
    "Test execution finished"
  );
});

/**
 * 8. Get execution logs for a job
 * GET /api/v1/jobs/:id/logs
 */
export const getJobLogs = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const jobId = parseInt(req.params.id as string);

  if (!userId) throw ApiError.unauthorized();
  if (isNaN(jobId)) throw ApiError.badRequest("Invalid job ID");

  const [job] = await db
    .select({ id: scheduledJobs.id })
    .from(scheduledJobs)
    .where(and(eq(scheduledJobs.id, jobId), eq(scheduledJobs.userId, userId)));

  if (!job) {
    throw ApiError.notFound("Job not found");
  }

  const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 50, 1), 200);
  const offset = Math.max(parseInt(req.query.offset as string) || 0, 0);

  const rawLogs = await db
    .select()
    .from(jobLogs)
    .where(eq(jobLogs.jobId, jobId))
    .orderBy(desc(jobLogs.executedAt))
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(jobLogs)
    .where(eq(jobLogs.jobId, jobId));

  const logs = rawLogs.map(formatLog);

  return ApiResponse.ok(
    res,
    {
      jobId,
      logs,
      pagination: {
        total: Number(count),
        limit,
        offset,
      },
    },
    "Logs retrieved successfully"
  );
});

/**
 * 9. Dashboard Analytics & Summary Metrics
 * GET /api/v1/analytics
 */
export const getDashboardAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw ApiError.unauthorized();

  const rawUserJobs = await db
    .select()
    .from(scheduledJobs)
    .where(eq(scheduledJobs.userId, userId));

  const totalJobs = rawUserJobs.length;
  let healthy = 0;
  let degraded = 0;
  let down = 0;
  let paused = 0;
  let pending = 0;
  let totalLatency = 0;
  let latencyCount = 0;

  for (const j of rawUserJobs) {
    if (!j.isActive || j.status === "PAUSED") paused++;
    else if (j.status === "HEALTHY") healthy++;
    else if (j.status === "DEGRADED") degraded++;
    else if (j.status === "DOWN") down++;
    else pending++;

    if (j.lastResponseTimeMs && j.lastResponseTimeMs > 0) {
      totalLatency += j.lastResponseTimeMs;
      latencyCount++;
    }
  }

  const avgLatencyMs = latencyCount > 0 ? Math.round(totalLatency / latencyCount) : 0;
  const uptimeRate = totalJobs > 0 ? Math.round(((healthy + degraded) / Math.max(totalJobs - paused, 1)) * 100) : 100;

  const jobs = rawUserJobs.map(formatJob);

  return ApiResponse.ok(
    res,
    {
      summary: {
        totalJobs,
        healthy,
        degraded,
        down,
        paused,
        pending,
        avgLatencyMs,
        uptimePercentage: Math.min(uptimeRate, 100),
      },
      jobs,
    },
    "Dashboard analytics retrieved"
  );
});
