import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const redisPublisher = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
  retryStrategy(times) {
    const delay = Math.min(times * 100, 3000);
    return delay;
  },
});

export const redisSubscriber = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
  retryStrategy(times) {
    const delay = Math.min(times * 100, 3000);
    return delay;
  },
});

redisPublisher.on("connect", () => {
  console.log("[Redis] Publisher connected");
});

redisPublisher.on("error", (err) => {
  console.error("[Redis Publisher Error]:", err.message);
});

redisSubscriber.on("connect", () => {
  console.log("[Redis] Subscriber connected");
});

redisSubscriber.on("error", (err) => {
  console.error("[Redis Subscriber Error]:", err.message);
});

export const SYNC_CHANNEL = "statuo:jobs:sync";
