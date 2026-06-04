import { Response, NextFunction } from 'express';
import { PrismaBusinessUnderstandingRepository } from './prisma-business-understanding.repository';
import { CreateProfileUseCase } from '../application/use-cases/create-profile.use-case';
import { SubmitAnalysisUseCase } from '../application/use-cases/submit-analysis.use-case';
import { GetAnalysisHistoryUseCase } from '../application/use-cases/get-analysis-history.use-case';
import { CreateProfileDtoSchema } from '../application/dto/create-profile.dto';
import { SubmitAnalysisDtoSchema } from '../application/dto/submit-analysis.dto';
import { ResponseHelper } from '../../../shared/response.helper';
import { AuthRequest } from '../../../shared/auth.middleware';

const repository = new PrismaBusinessUnderstandingRepository();
const createProfileUseCase = new CreateProfileUseCase(repository);
const submitAnalysisUseCase = new SubmitAnalysisUseCase(repository);
const getAnalysisHistoryUseCase = new GetAnalysisHistoryUseCase(repository);

export class BusinessUnderstandingController {
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

  static async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const profile = await repository.findProfileByUserId(userId);
      if (!profile) {
        return ResponseHelper.error(res, 'Business profile not found', 'NotFound', 404);
      }
      ResponseHelper.success(res, profile, 'Business profile retrieved');
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
