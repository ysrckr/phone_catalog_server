import { Redis } from "ioredis";

export const redisClient = new Redis({
  password: process.env.REDIS_PASSWORD,
});