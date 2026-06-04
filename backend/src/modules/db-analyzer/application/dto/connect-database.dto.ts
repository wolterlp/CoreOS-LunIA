import { z } from 'zod';

const ConnectionStringSchema = z.string().url().or(z.string().startsWith('postgresql://')).or(z.string().startsWith('mysql://')).or(z.string().startsWith('mongodb://'));

export const ConnectDatabaseDtoSchema = z.object({
  name: z.string().min(1),
  connectionString: ConnectionStringSchema.optional(),
  type: z.string().optional(),
  host: z.string().optional(),
  port: z.number().int().positive().optional(),
  database: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  ssl: z.boolean().default(false),
}).refine(
  data => data.connectionString || (data.host && data.database),
  { message: 'Provide either a connectionString or host + database fields' }
);

export type ConnectDatabaseDto = z.infer<typeof ConnectDatabaseDtoSchema>;
