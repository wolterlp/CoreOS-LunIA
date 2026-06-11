import { Response, NextFunction } from 'express';
import { PrismaBusinessRepository } from './prisma-business.repository';
import { PrismaDBConnectionRepository } from '../../db-analyzer/infrastructure/prisma-db-connection.repository';
import { PrismaBusinessUnderstandingRepository } from './prisma-business-understanding.repository';
import { AnalyzeBusinessUseCase } from '../application/use-cases/analyze-business.use-case';
import { GetBusinessProfileUseCase } from '../application/use-cases/get-business-profile.use-case';
import { CreateProfileUseCase } from '../application/use-cases/create-profile.use-case';
import { SubmitAnalysisUseCase } from '../application/use-cases/submit-analysis.use-case';
import { GetAnalysisHistoryUseCase } from '../application/use-cases/get-analysis-history.use-case';
import { CreateProfileDtoSchema } from '../application/dto/create-profile.dto';
import { SubmitAnalysisDtoSchema } from '../application/dto/submit-analysis.dto';
import { OpenAIAdapter } from '../../../shared/infrastructure/ai/openai.adapter';
import { ResponseHelper } from '../../../shared/response.helper';
import { AuthRequest } from '../../../shared/auth.middleware';

const businessRepository = new PrismaBusinessRepository();
const dbRepository = new PrismaDBConnectionRepository();
const aiProvider = new OpenAIAdapter();
const repo = new PrismaBusinessUnderstandingRepository();

const analyzeUseCase = new AnalyzeBusinessUseCase(businessRepository, dbRepository, aiProvider);
const getProfileUseCase = new GetBusinessProfileUseCase(businessRepository);
const createProfileUseCase = new CreateProfileUseCase(repo);
const submitAnalysisUseCase = new SubmitAnalysisUseCase(repo);
const getAnalysisHistoryUseCase = new GetAnalysisHistoryUseCase(repo);

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

  static async createProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto = CreateProfileDtoSchema.parse(req.body);
      const userId = req.user!.userId;
      const profile = await createProfileUseCase.execute(dto, userId);
      ResponseHelper.success(res, profile, 'Business profile created', 201);
    } catch (error) {
      next(error);
    }
  }

  static async submitAnalysis(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto = SubmitAnalysisDtoSchema.parse(req.body);
      const userId = req.user!.userId;
      const report = await submitAnalysisUseCase.execute(dto, userId);
      ResponseHelper.success(res, report, 'Analysis submitted', 201);
    } catch (error) {
      next(error);
    }
  }

  static async getAnalysisHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const reports = await getAnalysisHistoryUseCase.execute(userId);
      ResponseHelper.success(res, reports, 'Analysis history retrieved');
    } catch (error) {
      next(error);
    }
  }
}
