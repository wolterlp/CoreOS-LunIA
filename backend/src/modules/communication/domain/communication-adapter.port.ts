import { Message } from './message.entity';

export interface CommunicationAdapter {
  send(message: Message): Promise<{ success: boolean; externalId?: string; error?: string }>;
}
