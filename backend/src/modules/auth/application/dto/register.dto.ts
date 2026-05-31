
// src/modules/auth/application/dto/register.dto.ts

import { z } from 'zod';

export const RegisterDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['ADMIN', 'MANAGER', 'FINANCE', 'HR', 'OPERATIONS', 'VIEWER']).default('VIEWER'),
});

export type RegisterDto = z.infer<typeof RegisterDtoSchema>;

