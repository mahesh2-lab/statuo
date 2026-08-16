import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-response";

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, RateLimitStore>();

// Periodic cleanup of expired entries (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of memoryStore.entries()) {
    if (now > record.resetTime) {
      memoryStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Creates a rate limiting middleware
 * @param windowMs Time window in milliseconds
 * @param max Max requests per window per key
 * @param keyGenerator Function to extract key (e.g. userId or IP)
 * @param message Error message
 */
export function createRateLimiter(options: {
  windowMs: number;
  max: number;
  keyGenerator?: (req: Request) => string;
  message?: string;
}) {
  const {
    windowMs,
    max,
    keyGenerator = (req) => req.user?.id || req.ip || "anonymous",
    message = "Too many requests. Please slow down.",
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const key = `${req.path}:${keyGenerator(req)}`;
    const now = Date.now();

    const record = memoryStore.get(key);

    if (!record || now > record.resetTime) {
      // First request or window expired
      memoryStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", max - 1);
      return next();
    }

    if (record.count >= max) {
      const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader("Retry-After", retryAfterSec);
      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", 0);
      return next(
        new ApiError(429, `${message} Retry after ${retryAfterSec}s.`)
      );
    }

    record.count++;
    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", Math.max(max - record.count, 0));
    next();
  };
}

/**
 * Limit on-demand trigger pings (Max 15 per minute per user)
 */
export const triggerPingLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 15,
  message: "Test ping limit exceeded for this monitor.",
});

/**
 * Limit cluster manual sync requests (Max 5 per minute per user)
 */
export const syncLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 5,
  message: "Scheduler synchronization limit exceeded.",
});
