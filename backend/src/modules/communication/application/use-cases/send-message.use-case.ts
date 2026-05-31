import { Message, MessageChannel, MessageDirection } from '../../domain/message.entity';
import { Conversation } from '../../domain/conversation.entity';
import { CommunicationRepository } from '../../domain/communication.repository';
import { SendMessageDto } from '../dto/send-message.dto';
import { randomUUID } from 'crypto';

export class SendMessageUseCase {
  constructor(private readonly communicationRepository: CommunicationRepository) {}

  async execute(dto: SendMessageDto, userId: string): Promise<Message> {
    let conversationId = dto.conversationId;

    if (!conversationId) {
      const conversation = new Conversation({
        id: randomUUID(),
        title: dto.title,
        channel: dto.channel as MessageChannel,
        externalId: dto.externalId,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const saved = await this.communicationRepository.saveConversation(conversation);
      conversationId = saved.id;
    }

    const message = new Message({
      id: randomUUID(),
      content: dto.content,
      direction: MessageDirection.OUTBOUND,
      channel: dto.channel as MessageChannel,
      status: 'SENT',
      metadata: dto.metadata,
      conversationId,
      userId,
      sentAt: new Date(),
    });

    return await this.communicationRepository.saveMessage(message);
  }
}
