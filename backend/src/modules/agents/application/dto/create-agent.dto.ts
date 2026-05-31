import { z } from 'zod';

export const CreateAgentDtoSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['MARKETING', 'COMMERCIAL', 'FINANCIAL', 'OPERATIONAL', 'COORDINATOR']),
  config: z.record(z.any()).optional(),
});

export type CreateAgentDto = z.infer<typeof CreateAgentDtoSchema>;
