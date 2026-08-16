export type JobStatus = 'HEALTHY' | 'DEGRADED' | 'DOWN' | 'PAUSED' | 'PENDING';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';

export type LogStatus = 'SUCCESS' | 'RETRY' | 'FAILED';

export type EventCategory = 'ALL' | 'HEALTH' | 'INCIDENT' | 'MONITOR' | 'AUTH';

export interface SystemEvent {
  id: string;
  category: 'HEALTH' | 'INCIDENT' | 'MONITOR' | 'AUTH';
  type: string;
  title: string;
  description: string;
  severity: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  actor?: string;
  target?: string;
  metadata?: Record<string, any>;
  timestamp: string;
  relativeTime?: string;
}

export interface EventsResponse {
  events: SystemEvent[];
  pagination: Pagination;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Session {
  id: string;
  userId: string;
  token?: string;
  expiresAt: string;
  user?: User;
}

export interface Job {
  id: string;
  userId?: string;
  name: string;
  url: string;
  method: HttpMethod;
  interval: number; // in seconds
  description?: string | null;
  token?: string | null;
  retryCount: number;
  retryInterval: number; // in seconds
  timeout: number; // in seconds
  isActive: boolean;
  status: JobStatus;
  lastRunAt?: string | null;
  lastResponseTime?: number | null; // in ms
  lastResponseTimeMs?: number | null; // in ms
  lastStatusCode?: number | null;
  consecutiveFailures?: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobLog {
  id: string;
  jobId: string;
  status: LogStatus;
  statusCode?: number | null;
  responseTime?: number | null; // in ms
  responseTimeMs?: number | null; // in ms
  attempt: number;
  errorMessage?: string | null;
  executedAt: string;
  createdAt?: string;
}

export interface CreateJobPayload {
  name: string;
  url: string;
  method?: HttpMethod;
  interval: number;
  description?: string;
  token?: string;
  retryCount?: number;
  retryInterval?: number;
  timeout?: number;
  isActive?: boolean;
}

export interface UpdateJobPayload {
  name?: string;
  url?: string;
  method?: HttpMethod;
  interval?: number;
  description?: string;
  token?: string;
  retryCount?: number;
  retryInterval?: number;
  timeout?: number;
  isActive?: boolean;
}

export interface TestExecutionResult {
  ok: boolean;
  statusCode?: number | null;
  responseTimeMs?: number | null;
  errorMessage?: string | null;
  testedAt: string;
}

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
}

export interface JobsResponse {
  jobs: Job[];
  pagination: Pagination;
}

export interface JobDetailResponse {
  job: Job;
  recentLogs: JobLog[];
}

export interface JobLogsResponse {
  logs: JobLog[];
  pagination: Pagination;
}

export interface AnalyticsSummary {
  totalJobs: number;
  healthyJobs: number;
  degradedJobs: number;
  downJobs: number;
  pausedJobs: number;
  pendingJobs?: number;
  avgLatencyMs: number;
  uptimePercentage: number;
}

export interface AnalyticsResponse {
  summary: AnalyticsSummary;
  jobs: Job[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  error: string;
  message: string;
  errors?: Record<string, string[] | string> | { field: string; message: string }[] | string[];
}

export interface AuthSessionResponse {
  session?: Session;
  user: User;
}

export interface GetJobsQueryParams {
  search?: string;
  status?: JobStatus | 'ALL' | string;
  limit?: number;
  offset?: number;
}

export interface GetJobLogsQueryParams {
  limit?: number;
  offset?: number;
}

export interface GetEventsQueryParams {
  search?: string;
  category?: EventCategory | string;
  severity?: string;
  limit?: number;
  offset?: number;
}
