// lib/rateLimit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 5 requests per 1 minute
export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  /**
   * Optional prefix for the keys in Redis. This is useful if you want to share a Redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */ 
  prefix: "ratelimit:auth",
  
  // Optional transform for the key - here we'll use IP + user agent
  ephemeralCache: new Map(),
  analytics: true,
});