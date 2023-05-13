import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
  role: z.enum(['ADMIN', 'USER']).optional().default('USER'),
});

export type User = z.infer<typeof userSchema>;
