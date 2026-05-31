import { z } from 'zod';

export const AssignTaskDtoSchema = z.object({
  agentId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
});

export type AssignTaskDto = z.infer<typeof AssignTaskDtoSchema>;
