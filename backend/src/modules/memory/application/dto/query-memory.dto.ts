import { z } from 'zod';

export const QueryMemoryDtoSchema = z.object({
  type: z.enum(['OPERATIONAL', 'STRATEGIC', 'LEARNING']).optional(),
  tags: z.array(z.string()).optional(),
  query: z.string().optional(),
});

export type QueryMemoryDto = z.infer<typeof QueryMemoryDtoSchema>;
