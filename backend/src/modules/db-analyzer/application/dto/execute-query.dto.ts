import { z } from 'zod';

export const ExecuteQueryDtoSchema = z.object({
  connectionId: z.string().uuid(),
  query: z.string().min(1),
  naturalLanguage: z.string().optional(),
});

export type ExecuteQueryDto = z.infer<typeof ExecuteQueryDtoSchema>;
