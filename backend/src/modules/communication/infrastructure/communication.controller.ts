import { Response, NextFunction } from 'express';
import { PrismaCommunicationRepository } from './prisma-communication.repository';
import { SendMessageUseCase } from '../application/use-cases/send-message.use-case';
import { GetConversationHistoryUseCase } from '../application/use-cases/get-conversation-history.use-case';
import { SendMessageDtoSchema } from '../application/dto/send-message.dto';
import { ResponseHelper } from '../../../shared/response.helper';
import { AuthRequest } from '../../../shared/auth.middleware';

const communicationRepository = new PrismaCommunicationRepository();
const sendMessageUseCase = new SendMessageUseCase(communicationRepository);
const getConversationHistoryUseCase = new GetConversationHistoryUseCase(communicationRepository);

export class CommunicationController {
  static async sendMessage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto = SendMessageDtoSchema.parse(req.body);
      const userId = req.user!.userId;
      const message = await sendMessageUseCase.execute(dto, userId);
      ResponseHelper.success(res, message, 'Message sent', 201);
    } catch (error) {
      next(error);
    }
  }

  static async listConversations(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const conversations = await communicationRepository.findConversationsByUserId(userId);
      ResponseHelper.success(res, conversations, 'Conversations retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getMessages(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const messages = await getConversationHistoryUseCase.execute(req.params.conversationId);
      ResponseHelper.success(res, messages, 'Messages retrieved');
    } catch (error) {
      next(error);
    }
  }
}
