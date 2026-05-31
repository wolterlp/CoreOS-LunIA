import { Conversation } from './conversation.entity';
import { Message } from './message.entity';

export interface CommunicationRepository {
  saveConversation(conversation: Conversation): Promise<Conversation>;
  findConversationById(id: string): Promise<Conversation | null>;
  findConversationsByUserId(userId: string): Promise<Conversation[]>;
  updateConversation(conversation: Conversation): Promise<Conversation>;

  saveMessage(message: Message): Promise<Message>;
  findMessageById(id: string): Promise<Message | null>;
  findMessagesByConversationId(conversationId: string): Promise<Message[]>;
}
