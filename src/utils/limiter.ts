import { MemoryStore, rateLimit } from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Send standard rate limit headers
  legacyHeaders: false, // Don't send legacy rate limit headers
  message: 'Too many requests from this IP, please try again later',
  store: new MemoryStore(),
});
