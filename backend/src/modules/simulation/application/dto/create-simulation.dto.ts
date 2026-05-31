import { z } from 'zod';

export const CreateSimulationDtoSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  variables: z.record(z.any()),
});

export type CreateSimulationDto = z.infer<typeof CreateSimulationDtoSchema>;
