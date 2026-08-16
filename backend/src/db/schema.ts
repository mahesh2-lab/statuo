import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
export * from "./auth-schema";
import { user, session, account } from "./auth-schema";

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  scheduledJobs: many(scheduledJobs),
}));

export const scheduledJobs = pgTable(
  "scheduled_jobs",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    url: text("url").notNull(),
    method: text("method").notNull().default("GET"),
    token: text("token"), // Encrypted at rest via AES-256-GCM
    interval: integer("interval").notNull(), // in seconds
    retryCount: integer("retry_count").notNull().default(5),
    retryInterval: integer("retry_interval").notNull().default(60), // in seconds
    nextRetryAt: integer("next_retry_at").notNull().default(5),
    timeoutSeconds: integer("timeout_seconds").notNull().default(10),
    isActive: boolean("is_active").notNull().default(true),
    status: text("status").notNull().default("PENDING"), // PENDING, HEALTHY, DEGRADED, DOWN, PAUSED
    lastRunAt: timestamp("last_run_at"),
    lastResponseTimeMs: integer("last_response_time_ms"),
    lastStatusCode: integer("last_status_code"),
    lastErrorMessage: text("last_error_message"),
    consecutiveFailures: integer("consecutive_failures").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("scheduled_jobs_userId_idx").on(table.userId),
    index("scheduled_jobs_isActive_idx").on(table.isActive),
    index("scheduled_jobs_status_idx").on(table.status),
  ]
);

export const jobLogs = pgTable(
  "job_logs",
  {
    id: serial("id").primaryKey(),
    jobId: integer("job_id")
      .notNull()
      .references(() => scheduledJobs.id, { onDelete: "cascade" }),
    status: text("status").notNull(), // SUCCESS, FAILED, RETRY
    statusCode: integer("status_code"),
    responseTimeMs: integer("response_time_ms"),
    errorMessage: text("error_message"),
    attempt: integer("attempt").notNull().default(1),
    executedAt: timestamp("executed_at").defaultNow().notNull(),
  },
  (table) => [
    index("job_logs_jobId_idx").on(table.jobId),
    index("job_logs_executedAt_idx").on(table.executedAt),
    index("job_logs_status_idx").on(table.status),
  ]
);

export const scheduledJobsRelations = relations(
  scheduledJobs,
  ({ one, many }) => ({
    user: one(user, {
      fields: [scheduledJobs.userId],
      references: [user.id],
    }),
    logs: many(jobLogs),
  })
);

export const jobLogsRelations = relations(jobLogs, ({ one }) => ({
  job: one(scheduledJobs, {
    fields: [jobLogs.jobId],
    references: [scheduledJobs.id],
  }),
}));
