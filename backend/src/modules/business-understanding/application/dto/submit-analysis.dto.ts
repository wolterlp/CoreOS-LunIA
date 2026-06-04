import { z } from 'zod';

export const SubmitAnalysisDtoSchema = z.object({
  type: z.enum(['SWOT', 'PESTEL', 'PORTER', 'CANVAS']),
  title: z.string().min(1),
  content: z.record(z.any()),
  summary: z.string().optional(),
  profileId: z.string().min(1),
});

export type SubmitAnalysisDto = z.infer<typeof SubmitAnalysisDtoSchema>;
