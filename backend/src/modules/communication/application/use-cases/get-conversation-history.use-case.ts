import { Conversation } from '../../domain/conversation.entity';
import { Message } from '../../domain/message.entity';
import { CommunicationRepository } from '../../domain/communication.repository';

export interface ConversationDetail {
  conversation: Conversation;
  messages: Message[];
}

export class GetConversationHistoryUseCase {
  constructor(private readonly communicationRepository: CommunicationRepository) {}

  async execute(userId: string): Promise<ConversationDetail[]> {
    const conversations = await this.communicationRepository.findConversationsByUserId(userId);
    const result: ConversationDetail[] = [];

    for (const conversation of conversations) {
      const messages = await this.communicationRepository.findMessagesByConversationId(conversation.id);
      result.push({ conversation, messages });
    }

    return result;
  }
}
