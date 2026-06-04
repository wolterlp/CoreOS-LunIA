import { z } from 'zod';

export const CreateProfileDtoSchema = z.object({
  companyName: z.string().min(1),
  industry: z.string().optional(),
  size: z.string().optional(),
  description: z.string().optional(),
  mission: z.string().optional(),
  vision: z.string().optional(),
  values: z.array(z.string()).default([]),
});

export type CreateProfileDto = z.infer<typeof CreateProfileDtoSchema>;
