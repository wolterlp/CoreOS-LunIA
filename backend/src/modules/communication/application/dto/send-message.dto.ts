import { z } from 'zod';

export const SendMessageDtoSchema = z.object({
  conversationId: z.string().uuid().optional(),
  channel: z.enum(['EMAIL', 'WHATSAPP', 'TELEGRAM', 'SLACK', 'TEAMS', 'SMS']),
  content: z.string().min(1),
  title: z.string().optional(),
  externalId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type SendMessageDto = z.infer<typeof SendMessageDtoSchema>;
