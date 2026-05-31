import { Request, Response, NextFunction } from 'express';
import { PrismaCommunicationRepository } from './prisma-communication.repository';
import { SendMessageUseCase } from '../application/use-cases/send-message.use-case';
import { GetConversationHistoryUseCase } from '../application/use-cases/get-conversation-history.use-case';
import { SendMessageDtoSchema } from '../application/dto/send-message.dto';
import { ResponseHelper } from '../../../shared/response.helper';

const communicationRepository = new PrismaCommunicationRepository();
const sendMessageUseCase = new SendMessageUseCase(communicationRepository);
const getConversationHistoryUseCase = new GetConversationHistoryUseCase(communicationRepository);

export class CommunicationController {
  static async send(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = SendMessageDtoSchema.parse(req.body);
      const userId = (req as any).user.userId;
      const message = await sendMessageUseCase.execute(dto, userId);
      ResponseHelper.success(res, message, 'Message sent', 201);
    } catch (error) {
      next(error);
    }
  }

  static async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const history = await getConversationHistoryUseCase.execute(userId);
      ResponseHelper.success(res, history, 'Conversations retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const messages = await communicationRepository.findMessagesByConversationId(req.params.conversationId);
      ResponseHelper.success(res, messages, 'Messages retrieved');
    } catch (error) {
      next(error);
    }
  }
}
