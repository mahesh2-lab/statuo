import { z } from "zod";
import { jobLogs, scheduledJobs } from "../db/schema";
import { registerJobValidation, updateJobValidation } from "./validations";

export type ScheduledJob = typeof scheduledJobs.$inferSelect;
export type NewScheduledJob = typeof scheduledJobs.$inferInsert;
export type JobLog = typeof jobLogs.$inferSelect;
export type NewJobLog = typeof jobLogs.$inferInsert;
export type RegisterJobInput = z.infer<typeof registerJobValidation>;
export type UpdateJobInput = z.infer<typeof updateJobValidation>;

export interface IRegisterJob {
  name: string;
  url: string;
  description?: string;
  method?: string;
  token?: string;
  interval: number;
  retryCount?: number;
  retryInterval?: number;
  nextRetryAt?: number;
  timeoutSeconds?: number;
  isActive?: boolean;
}