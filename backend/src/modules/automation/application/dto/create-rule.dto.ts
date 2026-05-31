import { z } from 'zod';

export const CreateRuleDtoSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  trigger: z.enum(['SCHEDULED', 'EVENT', 'THRESHOLD']),
  mode: z.enum(['MANUAL', 'SUPERVISED', 'AUTONOMOUS']).default('MANUAL'),
  condition: z.record(z.any()).optional(),
  action: z.record(z.any()),
});

export type CreateRuleDto = z.infer<typeof CreateRuleDtoSchema>;
