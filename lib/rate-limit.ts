// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Different rate limits for different scenarios
export const ratelimit = {
  // Authenticated users get more requests
  authenticated: new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(100, "60 s"),
    prefix: "ratelimit:authenticated",
  }),
  // Anonymous users get fewer requests
  anonymous: new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(20, "60 s"),
    prefix: "ratelimit:anonymous",
  }),
  // Strict limit for sensitive endpoints (login, signup)
  auth: new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    prefix: "ratelimit:auth",
  }),
};