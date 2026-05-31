import { z } from 'zod';

export const CreateMemoryDtoSchema = z.object({
  type: z.enum(['OPERATIONAL', 'STRATEGIC', 'LEARNING']),
  title: z.string().min(1),
  content: z.string().min(1),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.any()).optional(),
});

export type CreateMemoryDto = z.infer<typeof CreateMemoryDtoSchema>;
