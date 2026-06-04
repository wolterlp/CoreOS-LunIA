import { Response, NextFunction } from 'express';
import { prisma } from '../../../shared/infrastructure/prisma.client';
import { DiagnoseMaturityUseCase } from '../application/use-cases/diagnose-maturity.use-case';
import { GenerateGrowthPlanUseCase } from '../application/use-cases/generate-growth-plan.use-case';
import { OpenAIAdapter } from '../../../shared/infrastructure/ai/openai.adapter';
import { ResponseHelper } from '../../../shared/response.helper';
import { AuthRequest } from '../../../shared/auth.middleware';

const aiProvider = new OpenAIAdapter();
const diagnoseUseCase = new DiagnoseMaturityUseCase(aiProvider);
const planUseCase = new GenerateGrowthPlanUseCase(aiProvider);

export class GrowthAdvisorController {
  static async diagnose(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const diagnosis = await diagnoseUseCase.execute(req.user!.userId);
      ResponseHelper.success(res, diagnosis, 'Maturity diagnosis completed');
    } catch (error) {
      next(error);
    }
  }

  static async generatePlan(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const plan = await planUseCase.execute(req.user!.userId);
      ResponseHelper.success(res, plan, 'Growth plan generated');
    } catch (error) {
      next(error);
    }
  }

  static async getStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const diagnosis = await prisma.maturityDiagnosis.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' } });
      const plan = await prisma.growthPath.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' } });
      ResponseHelper.success(res, { diagnosis, plan }, 'Growth status retrieved');
    } catch (error) {
      next(error);
    }
  }
}
