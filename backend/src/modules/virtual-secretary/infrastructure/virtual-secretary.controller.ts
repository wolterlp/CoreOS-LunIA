import { Response, NextFunction } from 'express';
import { PrismaSecretaryRepository } from './prisma-secretary.repository';
import { PrismaMemoryRepository } from '../../memory/infrastructure/prisma-memory.repository';
import { ScheduleEventUseCase } from '../application/use-cases/schedule-event.use-case';
import { GetRemindersUseCase } from '../application/use-cases/get-reminders.use-case';
import { OpenAIAdapter } from '../../../shared/infrastructure/ai/openai.adapter';
import { ResponseHelper } from '../../../shared/response.helper';
import { AuthRequest } from '../../../shared/auth.middleware';

const secretaryRepository = new PrismaSecretaryRepository();
const memoryRepository = new PrismaMemoryRepository();
const aiProvider = new OpenAIAdapter();

const scheduleUseCase = new ScheduleEventUseCase(secretaryRepository, memoryRepository, aiProvider);
const getRemindersUseCase = new GetRemindersUseCase(secretaryRepository);

export class VirtualSecretaryController {
  static async scheduleEvent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const event = await scheduleUseCase.execute(req.body, req.user!.userId);
      ResponseHelper.success(res, event, 'Event scheduled', 201);
    } catch (error) {
      next(error);
    }
  }

  static async listEvents(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const events = await secretaryRepository.getEventsByUserId(req.user!.userId);
      ResponseHelper.success(res, events, 'Events retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async listReminders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const reminders = await getRemindersUseCase.execute(req.user!.userId);
      ResponseHelper.success(res, reminders, 'Reminders retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async completeReminder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await secretaryRepository.completeReminder(req.params.id, req.user!.userId);
      ResponseHelper.success(res, null, 'Reminder completed');
    } catch (error) {
      next(error);
    }
  }
}
