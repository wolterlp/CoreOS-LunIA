import { z } from 'zod';

export const CreateRecommendationDtoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(['MARKETING', 'SALES', 'OPERATIONS', 'FINANCE', 'STRATEGY']),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
  impact: z.string().optional(),
});

export type CreateRecommendationDto = z.infer<typeof CreateRecommendationDtoSchema>;
