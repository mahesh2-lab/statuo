import { eq } from "drizzle-orm";
import { db } from "../db";
import { jobLogs, scheduledJobs } from "../db/schema";
import { ScheduledJob } from "../utils/types";
import { redisPublisher, redisSubscriber, SYNC_CHANNEL } from "../libs/redis";
import { decryptToken } from "../utils/crypto";
import { validateTargetUrl } from "../utils/ssrf";

interface ExecutionResult {
  ok: boolean;
  statusCode?: number;
  durationMs: number;
  errorMessage?: string;
}

class SchedulerService {
  private activeTimers: Map<number, NodeJS.Timeout> = new Map();
  private inFlightJobs: Set<number> = new Set();
  private pollInterval: NodeJS.Timeout | null = null;
  private isSyncing: boolean = false;
  private isShuttingDown: boolean = false;
  private readonly workerId: string = `worker_${process.pid}_${Math.random().toString(36).substring(2, 6)}`;

  /**
   * Initialize Scheduler Service:
   * 1. Run initial synchronization from PostgreSQL
   * 2. Subscribe to Redis Pub/Sub for instant sub-millisecond push updates
   * 3. Start the 30-second fallback polling loop
   * 4. Register graceful shutdown hooks
   */
  public async initScheduler(): Promise<void> {
    console.log(
      `[Scheduler] Initializing Scheduler Service [Worker ID: ${this.workerId}]...`,
    );

    // 1. Initial sync
    await this.syncJobs("initial");

    // 2. Subscribe to Redis Pub/Sub
    try {
      await redisSubscriber.subscribe(SYNC_CHANNEL);
      redisSubscriber.on("message", async (channel, message) => {
        if (channel === SYNC_CHANNEL && !this.isShuttingDown) {
          try {
            const data = JSON.parse(message);
            const action = data.action || "sync";
            const jobId = data.jobId ? `Job #${data.jobId}` : "All Jobs";
            console.log(
              `[Scheduler:Push] Received instant push notification: ${action} (${jobId})`,
            );
            await this.syncJobs("push");
          } catch {
            await this.syncJobs("push");
          }
        }
      });
      console.log(`[Scheduler] Subscribed to Redis channel: ${SYNC_CHANNEL}`);
    } catch (err) {
      console.warn(
        "[Scheduler] Redis pub/sub unavailable, falling back to polling-only mode:",
        err,
      );
    }

    // 3. Fallback Polling (Every 30 seconds)
    this.pollInterval = setInterval(async () => {
      if (!this.isShuttingDown) {
        await this.syncJobs("poll");
      }
    }, 30000);
    console.log("[Scheduler] 30-second fallback polling loop active");

    // 4. Graceful shutdown
    this.registerShutdownHooks();
  }

  /**
   * Synchronize active jobs from PostgreSQL into memory schedule
   */
  public async syncJobs(source: "initial" | "push" | "poll"): Promise<void> {
    if (this.isSyncing || this.isShuttingDown) return;
    this.isSyncing = true;

    try {
      // Query all active jobs
      const jobsFromDb = await db
        .select()
        .from(scheduledJobs)
        .where(eq(scheduledJobs.isActive, true));

      const activeJobIdsFromDb = new Set(jobsFromDb.map((j) => j.id));

      let added = 0;
      let updated = 0;
      let removed = 0;

      // 1. Cancel and remove timers for deleted or paused jobs
      for (const [id, timer] of this.activeTimers.entries()) {
        if (!activeJobIdsFromDb.has(id)) {
          clearTimeout(timer);
          this.activeTimers.delete(id);
          removed++;
        }
      }

      // 2. Add new or schedule existing jobs
      for (const job of jobsFromDb) {
        const hasTimer = this.activeTimers.has(job.id);

        if (!hasTimer) {
          // Stagger new jobs slightly on initial sync to avoid burst
          const initialDelaySeconds =
            source === "initial"
              ? Math.floor(Math.random() * Math.min(job.interval, 10))
              : 0;

          this.scheduleNextRun(job, initialDelaySeconds);
          added++;
        } else if (source === "push") {
          // If explicitly notified via push, refresh schedule
          this.scheduleNextRun(job);
          updated++;
        }
      }

      if (source !== "poll" || added > 0 || removed > 0) {
        console.log(
          `[Scheduler:${source.toUpperCase()}] Synced with DB. Active: ${this.activeTimers.size} (Added: ${added}, Updated: ${updated}, Removed: ${removed})`,
        );
      }
    } catch (error) {
      console.error(
        `[Scheduler:ERROR] Failed to sync jobs from database (${source}):`,
        error,
      );
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Schedule the next execution cycle for a job (prevents overlapping intervals)
   */
  private scheduleNextRun(job: ScheduledJob, delaySeconds?: number): void {
    if (this.isShuttingDown) return;

    // Clear existing timer if any
    const existing = this.activeTimers.get(job.id);
    if (existing) {
      clearTimeout(existing);
    }

    const waitMs =
      delaySeconds !== undefined
        ? Math.max(delaySeconds * 1000, 100)
        : Math.max(job.interval * 1000, 1000);

    const timer = setTimeout(async () => {
      await this.runJobLifecycle(job.id);
    }, waitMs);

    this.activeTimers.set(job.id, timer);
  }

  /**
   * Execute full job lifecycle with distributed lock, retries, DB logs, and next cycle scheduling
   */
  private async runJobLifecycle(jobId: number): Promise<void> {
    if (this.isShuttingDown) return;

    // Concurrency guard: avoid running the same job concurrently in this worker
    if (this.inFlightJobs.has(jobId)) {
      return;
    }

    // Fetch latest job configuration from DB
    const [job] = await db
      .select()
      .from(scheduledJobs)
      .where(eq(scheduledJobs.id, jobId));

    if (!job || !job.isActive) {
      this.activeTimers.delete(jobId);
      return;
    }

    // Distributed Redis Lock: Prevents duplicate execution across multiple replicas/instances
    const runToken = `${this.workerId}:${Date.now()}:${Math.random().toString(36).substring(2, 8)}`;
    const lockKey = `pulse:lock:job:${job.id}`;
    const lockTtlMs = Math.max((job.timeoutSeconds || 10) * 1000 + 5000, 15000);
    const hasLock = await this.acquireDistributedLock(lockKey, runToken, lockTtlMs);

    if (!hasLock) {
      // Another worker instance has acquired this run; schedule next check
      this.scheduleNextRun(job);
      return;
    }

    this.inFlightJobs.add(job.id);

    try {
      let attempt = 1;
      let finalResult: ExecutionResult | null = null;
      const maxRetries = Math.max(job.retryCount, 1);

      while (attempt <= maxRetries && !this.isShuttingDown) {
        const result = await this.performHttpRequest(job);
        finalResult = result;

        if (result.ok) {
          // Success
          console.log(
            `[Job:OK] #${job.id} "${job.name}" -> ${job.method} ${job.url} (${result.statusCode}) in ${result.durationMs}ms`,
          );

          await this.recordAuditLog(
            job.id,
            "SUCCESS",
            result.statusCode,
            result.durationMs,
            null,
            attempt,
          );
          await this.updateJobStatus(
            job.id,
            true,
            result.statusCode,
            result.durationMs,
            null,
          );
          break;
        } else {
          // Failure on this attempt
          const isFinalAttempt = attempt >= maxRetries;
          const logStatus = isFinalAttempt ? "FAILED" : "RETRY";

          console.warn(
            `[Job:${logStatus}] #${job.id} "${job.name}" (Attempt ${attempt}/${maxRetries}): ${result.errorMessage} (${result.durationMs}ms)`,
          );

          await this.recordAuditLog(
            job.id,
            logStatus,
            result.statusCode,
            result.durationMs,
            result.errorMessage,
            attempt,
          );

          if (!isFinalAttempt) {
            const retryDelayMs = (job.retryInterval || 60) * 1000;
            console.log(
              `[Job:RETRY] #${job.id} "${job.name}" Waiting ${job.retryInterval || 60}s before attempt ${attempt + 1}...`,
            );
            await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
          } else {
            // Final failure: update status to DOWN
            await this.updateJobStatus(
              job.id,
              false,
              result.statusCode,
              result.durationMs,
              result.errorMessage,
            );
          }
        }

        attempt++;
      }
    } catch (err) {
      console.error(
        `[Job:CRITICAL_ERROR] #${job.id} Execution threw exception:`,
        err,
      );
    } finally {
      this.inFlightJobs.delete(job.id);
      await this.releaseDistributedLock(lockKey, runToken);

      // Re-schedule the next standard run
      if (!this.isShuttingDown) {
        this.scheduleNextRun(job);
      }
    }
  }

  /**
   * Perform HTTP Request with SSRF guard and deep network error extraction
   */
  private async performHttpRequest(
    job: ScheduledJob,
  ): Promise<ExecutionResult> {
    // 1. Pre-execution SSRF validation
    const ssrfCheck = validateTargetUrl(job.url);
    if (!ssrfCheck.valid) {
      return {
        ok: false,
        statusCode: undefined,
        durationMs: 1,
        errorMessage: `SSRF Blocked: ${ssrfCheck.error}`,
      };
    }

    const startTime = performance.now();
    const headers: Record<string, string> = {
      "User-Agent": "Statuo-Healthcheck/1.0",
      Accept: "*/*",
    };

    if (job.token) {
      const decrypted = decryptToken(job.token);
      if (decrypted) {
        headers["Authorization"] = decrypted.startsWith("Bearer ")
          ? decrypted
          : `Bearer ${decrypted}`;
      }
    }

    const timeoutSeconds = job.timeoutSeconds || 10;

    try {
      const response = await fetch(job.url, {
        method: job.method || "GET",
        headers,
        signal: AbortSignal.timeout(timeoutSeconds * 1000),
      });

      const durationMs = Math.max(Math.round(performance.now() - startTime), 1);

      if (response.ok) {
        return {
          ok: true,
          statusCode: response.status,
          durationMs,
        };
      } else {
        return {
          ok: false,
          statusCode: response.status,
          durationMs,
          errorMessage:
            `HTTP ${response.status} ${response.statusText || ""}`.trim(),
        };
      }
    } catch (error: any) {
      const durationMs = Math.max(Math.round(performance.now() - startTime), 1);
      const formattedError = this.extractDetailedError(error, timeoutSeconds);

      return {
        ok: false,
        statusCode: undefined,
        durationMs,
        errorMessage: formattedError,
      };
    }
  }

  /**
   * Extract human-readable root cause from Node.js fetch/system errors
   */
  private extractDetailedError(error: any, timeoutSeconds: number): string {
    if (error?.name === "TimeoutError" || error?.name === "AbortError") {
      return `Request timed out after ${timeoutSeconds}s`;
    }

    const cause = error?.cause;
    if (cause) {
      if (cause.code === "ENOTFOUND") {
        return `DNS lookup failed (Domain not found: ${cause.hostname || "unknown"})`;
      }
      if (cause.code === "ECONNREFUSED") {
        return `Connection refused (Port closed or service down)`;
      }
      if (cause.code === "ECONNRESET") {
        return `Connection reset by peer`;
      }
      if (cause.code === "ETIMEDOUT") {
        return `Connection timed out`;
      }
      if (
        cause.code === "CERT_HAS_EXPIRED" ||
        cause.code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE"
      ) {
        return `SSL/TLS certificate verification failed (${cause.code})`;
      }
      if (cause.message) {
        return cause.message;
      }
    }

    return error?.message || "Network request failed";
  }

  /**
   * Record audit log in PostgreSQL
   */
  private async recordAuditLog(
    jobId: number,
    status: "SUCCESS" | "FAILED" | "RETRY",
    statusCode: number | undefined,
    responseTimeMs: number,
    errorMessage: string | null | undefined,
    attempt: number,
  ): Promise<void> {
    try {
      await db.insert(jobLogs).values({
        jobId,
        status,
        statusCode: statusCode ?? null,
        responseTimeMs,
        errorMessage: errorMessage ?? null,
        attempt,
      });
    } catch (err) {
      console.error(
        `[Scheduler:Audit] Failed to insert job_log for job #${jobId}:`,
        err,
      );
    }
  }

  /**
   * Update job status and metrics in PostgreSQL
   */
  private async updateJobStatus(
    jobId: number,
    isSuccess: boolean,
    statusCode: number | undefined,
    responseTimeMs: number,
    errorMessage: string | null | undefined,
  ): Promise<void> {
    try {
      if (isSuccess) {
        await db
          .update(scheduledJobs)
          .set({
            status: "HEALTHY",
            consecutiveFailures: 0,
            lastStatusCode: statusCode ?? 200,
            lastResponseTimeMs: responseTimeMs,
            lastRunAt: new Date(),
            lastErrorMessage: null,
            updatedAt: new Date(),
          })
          .where(eq(scheduledJobs.id, jobId));
      } else {
        const [current] = await db
          .select({
            failures: scheduledJobs.consecutiveFailures,
            retryCount: scheduledJobs.retryCount,
          })
          .from(scheduledJobs)
          .where(eq(scheduledJobs.id, jobId));

        const nextFailures = (current?.failures || 0) + 1;
        const maxRetries = current?.retryCount || 5;

        // If failures exceed max retries -> DOWN, otherwise DEGRADED
        const nextStatus = nextFailures >= maxRetries ? "DOWN" : "DEGRADED";

        await db
          .update(scheduledJobs)
          .set({
            status: nextStatus,
            consecutiveFailures: nextFailures,
            lastStatusCode: statusCode ?? null,
            lastResponseTimeMs: responseTimeMs,
            lastRunAt: new Date(),
            lastErrorMessage: errorMessage ?? "Healthcheck probe failed",
            updatedAt: new Date(),
          })
          .where(eq(scheduledJobs.id, jobId));
      }
    } catch (err) {
      console.error(
        `[Scheduler:DB] Failed to update job status for job #${jobId}:`,
        err,
      );
    }
  }

  /**
   * Acquire distributed lock in Redis
   */
  private async acquireDistributedLock(
    lockKey: string,
    runToken: string,
    ttlMs: number,
  ): Promise<boolean> {
    try {
      const result = await redisPublisher.set(
        lockKey,
        runToken,
        "PX",
        ttlMs,
        "NX",
      );
      return result === "OK";
    } catch {
      // If Redis is unreachable, allow single in-process execution
      return true;
    }
  }

  /**
   * Release distributed lock safely using atomic Lua script
   */
  private async releaseDistributedLock(
    lockKey: string,
    runToken: string,
  ): Promise<void> {
    try {
      const luaScript = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("del", KEYS[1])
        else
          return 0
        end
      `;
      await redisPublisher.eval(luaScript, 1, lockKey, runToken);
    } catch {
      // Ignore cleanup error
    }
  }

  /**
   * Broadcast change event across nodes/replicas
   */
  public async notifyJobChange(
    action: "created" | "updated" | "deleted" | "sync",
    jobId?: number,
  ): Promise<void> {
    try {
      await redisPublisher.publish(
        SYNC_CHANNEL,
        JSON.stringify({
          action,
          jobId,
          workerId: this.workerId,
          timestamp: new Date().toISOString(),
        }),
      );
    } catch (err) {
      console.warn("[Scheduler] Redis publish failed, syncing locally:", err);
      await this.syncJobs("push");
    }
  }

  /**
   * Graceful shutdown handlers
   */
  private registerShutdownHooks(): void {
    const shutdown = async (signal: string) => {
      if (this.isShuttingDown) return;
      this.isShuttingDown = true;
      console.log(
        `\n[Scheduler] ${signal} received. Initiating graceful shutdown...`,
      );

      if (this.pollInterval) {
        clearInterval(this.pollInterval);
        this.pollInterval = null;
      }

      for (const timer of this.activeTimers.values()) {
        clearTimeout(timer);
      }
      this.activeTimers.clear();

      // Wait for any active in-flight requests (max 5s)
      const startWait = Date.now();
      while (this.inFlightJobs.size > 0 && Date.now() - startWait < 5000) {
        await new Promise((r) => setTimeout(r, 200));
      }

      console.log("[Scheduler] Shutdown completed cleanly.");
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  }
}

export const schedulerService = new SchedulerService();
