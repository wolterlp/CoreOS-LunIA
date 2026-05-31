import { z } from 'zod';

export const ConnectDatabaseDtoSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  host: z.string().min(1),
  port: z.number().int().positive(),
  database: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
  ssl: z.boolean().default(false),
});

export type ConnectDatabaseDto = z.infer<typeof ConnectDatabaseDtoSchema>;
