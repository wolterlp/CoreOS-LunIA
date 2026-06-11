import { Response, NextFunction } from 'express';
import { PrismaGrowthAdvisorRepository } from './prisma-growth-advisor.repository';
import { CreateRecommendationUseCase } from '../application/use-cases/create-recommendation.use-case';
import { TrackKpiUseCase } from '../application/use-cases/track-kpi.use-case';
import { GetDashboardUseCase } from '../application/use-cases/get-dashboard.use-case';
import { DiagnoseMaturityUseCase } from '../application/use-cases/diagnose-maturity.use-case';
import { GenerateGrowthPlanUseCase } from '../application/use-cases/generate-growth-plan.use-case';
import { CreateRecommendationDtoSchema } from '../application/dto/create-recommendation.dto';
import { TrackKpiDtoSchema } from '../application/dto/track-kpi.dto';
import { OpenAIAdapter } from '../../../shared/infrastructure/ai/openai.adapter';
import { prisma } from '../../../shared/infrastructure/prisma.client';
import { ResponseHelper } from '../../../shared/response.helper';
import { AuthRequest } from '../../../shared/auth.middleware';

const repository = new PrismaGrowthAdvisorRepository();
const aiProvider = new OpenAIAdapter();
const createRecommendationUseCase = new CreateRecommendationUseCase(repository);
const trackKpiUseCase = new TrackKpiUseCase(repository);
const getDashboardUseCase = new GetDashboardUseCase(repository);
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

  static async createRecommendation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto = CreateRecommendationDtoSchema.parse(req.body);
      const userId = req.user!.userId;
      const recommendation = await createRecommendationUseCase.execute(dto, userId);
      ResponseHelper.success(res, recommendation, 'Recommendation created', 201);
    } catch (error) {
      next(error);
    }
  }

  static async listRecommendations(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const recommendations = await repository.findRecommendationsByUserId(userId);
      ResponseHelper.success(res, recommendations, 'Recommendations retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async trackKpi(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto = TrackKpiDtoSchema.parse(req.body);
      const userId = req.user!.userId;
      const entry = await trackKpiUseCase.execute(dto, userId);
      ResponseHelper.success(res, entry, 'KPI entry recorded', 201);
    } catch (error) {
      next(error);
    }
  }

  static async listKpis(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const period = req.query.period as string | undefined;
      const entries = await repository.findKpiEntriesByUserId(userId, period);
      ResponseHelper.success(res, entries, 'KPI entries retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const dashboard = await getDashboardUseCase.execute(userId);
      ResponseHelper.success(res, dashboard, 'Dashboard data retrieved');
    } catch (error) {
      next(error);
    }
  }
}
