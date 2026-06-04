import { z } from 'zod';

export const TrackKpiDtoSchema = z.object({
  name: z.string().min(1),
  category: z.enum(['FINANCIAL', 'CUSTOMER', 'PROCESS', 'GROWTH']),
  value: z.number(),
  target: z.number().optional(),
  unit: z.string().optional(),
  period: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']),
  recordedAt: z.string().datetime().optional(),
});

export type TrackKpiDto = z.infer<typeof TrackKpiDtoSchema>;
