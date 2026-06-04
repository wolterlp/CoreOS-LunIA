import { Response, NextFunction } from 'express';
import { prisma } from '../../../shared/infrastructure/prisma.client';
import { ResponseHelper } from '../../../shared/response.helper';
import { AuthRequest } from '../../../shared/auth.middleware';
import { CheckRulesUseCase } from '../application/use-cases/check-rules.use-case';
import { DetectAnomalyUseCase } from '../application/use-cases/detect-anomaly.use-case';

const checkRulesUseCase = new CheckRulesUseCase();
const detectAnomalyUseCase = new DetectAnomalyUseCase();

export class AlertController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const alerts = await prisma.alert.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
      ResponseHelper.success(res, alerts, 'Alerts retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      await prisma.alert.updateMany({
        where: { id: req.params.id, userId },
        data: { isRead: true }
      });
      ResponseHelper.success(res, null, 'Alert marked as read');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      await prisma.alert.deleteMany({
        where: { id: req.params.id, userId }
      });
      ResponseHelper.success(res, null, 'Alert deleted');
    } catch (error) {
      next(error);
    }
  }

  static async createRule(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const rule = await prisma.alertRule.create({
        data: { ...req.body, userId }
      });
      ResponseHelper.success(res, rule, 'Alert rule created', 201);
    } catch (error) {
      next(error);
    }
  }

  static async listRules(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const rules = await prisma.alertRule.findMany({ where: { userId } });
      ResponseHelper.success(res, rules, 'Alert rules retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async triggerManualCheck(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      await checkRulesUseCase.execute(userId);
      await detectAnomalyUseCase.execute(userId);
      ResponseHelper.success(res, null, 'Manual alert check completed');
    } catch (error) {
      next(error);
    }
  }
}
