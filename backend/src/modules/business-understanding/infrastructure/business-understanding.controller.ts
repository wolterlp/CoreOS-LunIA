import { Response, NextFunction } from 'express';
import { PrismaBusinessRepository } from './prisma-business.repository';
import { PrismaDBConnectionRepository } from '../../db-analyzer/infrastructure/prisma-db-connection.repository';
import { AnalyzeBusinessUseCase } from '../application/use-cases/analyze-business.use-case';
import { GetBusinessProfileUseCase } from '../application/use-cases/get-business-profile.use-case';
import { OpenAIAdapter } from '../../../shared/infrastructure/ai/openai.adapter';
import { ResponseHelper } from '../../../shared/response.helper';
import { AuthRequest } from '../../../shared/auth.middleware';

const businessRepository = new PrismaBusinessRepository();
const dbRepository = new PrismaDBConnectionRepository();
const aiProvider = new OpenAIAdapter();

const analyzeUseCase = new AnalyzeBusinessUseCase(businessRepository, dbRepository, aiProvider);
const getProfileUseCase = new GetBusinessProfileUseCase(businessRepository);

export class BusinessUnderstandingController {
  static async analyze(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { connectionId } = req.body;
      const userId = req.user!.userId;
      const profile = await analyzeUseCase.execute(connectionId, userId);
      ResponseHelper.success(res, profile, 'Business profile updated via analysis');
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const profile = await getProfileUseCase.execute(userId);
      ResponseHelper.success(res, profile, 'Business profile retrieved');
    } catch (error) {
      next(error);
    }
  }
}
