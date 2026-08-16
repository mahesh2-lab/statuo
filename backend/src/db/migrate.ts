import { pool } from "./index";

const INIT_SCHEMA_SQL = `
-- 1. Better Auth: User table
CREATE TABLE IF NOT EXISTS "user" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "email_verified" BOOLEAN NOT NULL DEFAULT FALSE,
  "image" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2. Better Auth: Session table
CREATE TABLE IF NOT EXISTS "session" (
  "id" TEXT PRIMARY KEY,
  "expires_at" TIMESTAMP NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "ip_address" TEXT,
  "user_agent" TEXT,
  "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session"("user_id");

-- 3. Better Auth: Account table
CREATE TABLE IF NOT EXISTS "account" (
  "id" TEXT PRIMARY KEY,
  "account_id" TEXT NOT NULL,
  "provider_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "access_token" TEXT,
  "refresh_token" TEXT,
  "id_token" TEXT,
  "access_token_expires_at" TIMESTAMP,
  "refresh_token_expires_at" TIMESTAMP,
  "scope" TEXT,
  "password" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account"("user_id");

-- 4. Better Auth: Verification table
CREATE TABLE IF NOT EXISTS "verification" (
  "id" TEXT PRIMARY KEY,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expires_at" TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "verification"("identifier");

-- 5. Statuo: Scheduled Jobs table
CREATE TABLE IF NOT EXISTS "scheduled_jobs" (
  "id" SERIAL PRIMARY KEY,
  "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "url" TEXT NOT NULL,
  "method" TEXT NOT NULL DEFAULT 'GET',
  "token" TEXT,
  "interval" INTEGER NOT NULL,
  "retry_count" INTEGER NOT NULL DEFAULT 5,
  "retry_interval" INTEGER NOT NULL DEFAULT 60,
  "next_retry_at" INTEGER NOT NULL DEFAULT 5,
  "timeout_seconds" INTEGER NOT NULL DEFAULT 10,
  "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "last_run_at" TIMESTAMP,
  "last_response_time_ms" INTEGER,
  "last_status_code" INTEGER,
  "last_error_message" TEXT,
  "consecutive_failures" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS "scheduled_jobs_userId_idx" ON "scheduled_jobs"("user_id");
CREATE INDEX IF NOT EXISTS "scheduled_jobs_isActive_idx" ON "scheduled_jobs"("is_active");
CREATE INDEX IF NOT EXISTS "scheduled_jobs_status_idx" ON "scheduled_jobs"("status");

-- 6. Statuo: Job Execution Logs table
CREATE TABLE IF NOT EXISTS "job_logs" (
  "id" SERIAL PRIMARY KEY,
  "job_id" INTEGER NOT NULL REFERENCES "scheduled_jobs"("id") ON DELETE CASCADE,
  "status" TEXT NOT NULL,
  "status_code" INTEGER,
  "response_time_ms" INTEGER,
  "error_message" TEXT,
  "attempt" INTEGER NOT NULL DEFAULT 1,
  "executed_at" TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS "job_logs_jobId_idx" ON "job_logs"("job_id");
CREATE INDEX IF NOT EXISTS "job_logs_executedAt_idx" ON "job_logs"("executed_at");
CREATE INDEX IF NOT EXISTS "job_logs_status_idx" ON "job_logs"("status");
`;

/**
 * Runs idempotent database schema initialization to guarantee all tables
 * and indexes exist on application startup.
 */
export async function runAutoMigrations(): Promise<void> {
  try {
    console.log("[Database] Checking and running schema initialization...");
    await pool.query(INIT_SCHEMA_SQL);
    console.log("[Database] Schema initialization completed successfully.");
  } catch (error) {
    console.error("[Database:ERROR] Failed to run schema auto-migrations:", error);
    throw error;
  }
}
