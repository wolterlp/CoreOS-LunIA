import { PrismaClient } from '@prisma/client';
import { Conversation } from '../domain/conversation.entity';
import { Message, MessageChannel, MessageDirection } from '../domain/message.entity';
import { CommunicationRepository } from '../domain/communication.repository';
import { config } from '../../../config';

const prisma = new PrismaClient({
  datasources: { db: { url: config.db.url } },
});

export class PrismaCommunicationRepository implements CommunicationRepository {
  private conversationToDomain(p: any): Conversation {
    return new Conversation({
      id: p.id,
      title: p.title,
      channel: p.channel as MessageChannel,
      externalId: p.externalId,
      userId: p.userId,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    });
  }

  private messageToDomain(p: any): Message {
    return new Message({
      id: p.id,
      content: p.content,
      direction: p.direction as MessageDirection,
      channel: p.channel as MessageChannel,
      status: p.status,
      metadata: p.metadata,
      conversationId: p.conversationId,
      userId: p.userId,
      sentAt: p.sentAt,
    });
  }

  async saveConversation(conversation: Conversation): Promise<Conversation> {
    const p = await prisma.conversation.create({
      data: {
        id: conversation.id,
        title: conversation.title,
        channel: conversation.channel,
        externalId: conversation.externalId,
        userId: conversation.userId,
      },
    });
    return this.conversationToDomain(p);
  }

  async findConversationById(id: string): Promise<Conversation | null> {
    const p = await prisma.conversation.findUnique({ where: { id } });
    return p ? this.conversationToDomain(p) : null;
  }

  async findConversationsByUserId(userId: string): Promise<Conversation[]> {
    const items = await prisma.conversation.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } });
    return items.map(this.conversationToDomain);
  }

  async updateConversation(conversation: Conversation): Promise<Conversation> {
    const p = await prisma.conversation.update({
      where: { id: conversation.id },
      data: { title: conversation.title, externalId: conversation.externalId },
    });
    return this.conversationToDomain(p);
  }

  async saveMessage(message: Message): Promise<Message> {
    const p = await prisma.message.create({
      data: {
        id: message.id,
        content: message.content,
        direction: message.direction,
        channel: message.channel,
        status: message.status,
        metadata: message.metadata,
        conversationId: message.conversationId,
        userId: message.userId,
      },
    });
    return this.messageToDomain(p);
  }

  async findMessageById(id: string): Promise<Message | null> {
    const p = await prisma.message.findUnique({ where: { id } });
    return p ? this.messageToDomain(p) : null;
  }

  async findMessagesByConversationId(conversationId: string): Promise<Message[]> {
    const items = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { sentAt: 'asc' },
    });
    return items.map(this.messageToDomain);
  }
}
