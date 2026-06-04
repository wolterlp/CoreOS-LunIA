import { Response, NextFunction } from 'express';
import { prisma } from '../../../shared/infrastructure/prisma.client';
import { ResponseHelper } from '../../../shared/response.helper';
import { AuthRequest } from '../../../shared/auth.middleware';

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
}
