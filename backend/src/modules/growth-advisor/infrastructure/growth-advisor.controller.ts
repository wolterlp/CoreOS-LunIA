import { Response, NextFunction } from 'express';
import { PrismaGrowthAdvisorRepository } from './prisma-growth-advisor.repository';
import { CreateRecommendationUseCase } from '../application/use-cases/create-recommendation.use-case';
import { TrackKpiUseCase } from '../application/use-cases/track-kpi.use-case';
import { GetDashboardUseCase } from '../application/use-cases/get-dashboard.use-case';
import { CreateRecommendationDtoSchema } from '../application/dto/create-recommendation.dto';
import { TrackKpiDtoSchema } from '../application/dto/track-kpi.dto';
import { ResponseHelper } from '../../../shared/response.helper';
import { AuthRequest } from '../../../shared/auth.middleware';

const repository = new PrismaGrowthAdvisorRepository();
const createRecommendationUseCase = new CreateRecommendationUseCase(repository);
const trackKpiUseCase = new TrackKpiUseCase(repository);
const getDashboardUseCase = new GetDashboardUseCase(repository);

export class GrowthAdvisorController {
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
