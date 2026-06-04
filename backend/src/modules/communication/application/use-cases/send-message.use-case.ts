import { Message, MessageChannel, MessageDirection } from '../../domain/message.entity';
import { Conversation } from '../../domain/conversation.entity';
import { CommunicationRepository } from '../../domain/communication.repository';
import { SendMessageDto } from '../dto/send-message.dto';
import { randomUUID } from 'crypto';
import { CommunicationProviderFactory } from '../../infrastructure/adapters/communication-provider.factory';

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
      status: 'SENDING',
      metadata: dto.metadata,
      conversationId,
      userId,
      sentAt: new Date(),
    });

    // Save initial state
    const savedMessage = await this.communicationRepository.saveMessage(message);

    // Try to send via real adapter
    const adapter = CommunicationProviderFactory.getAdapter(dto.channel);
    const result = await adapter.send(savedMessage);

    if (result.success) {
      savedMessage.status = 'SENT';
      savedMessage.metadata = { ...savedMessage.metadata, externalId: result.externalId };
    } else {
      savedMessage.status = 'FAILED';
      savedMessage.metadata = { ...savedMessage.metadata, error: result.error };
    }

    // Update with result
    return await this.communicationRepository.saveMessage(savedMessage);
  }
}
