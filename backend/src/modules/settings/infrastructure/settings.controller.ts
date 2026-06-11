import { Request, Response, NextFunction } from 'express';
import { PrismaSettingsRepository } from './prisma-settings.repository';
import { GetSettingsUseCase } from '../application/use-cases/get-settings.use-case';
import { UpdateSettingUseCase } from '../application/use-cases/update-setting.use-case';
import { ResponseHelper } from '../../../shared/response.helper';
import { AuthRequest } from '../../../shared/auth.middleware';
import { ForbiddenError } from '../../../shared/errors';

const settingsRepository = new PrismaSettingsRepository();
const getSettingsUseCase = new GetSettingsUseCase(settingsRepository);
const updateSettingUseCase = new UpdateSettingUseCase(settingsRepository);

export class SettingsController {
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (req.user?.role !== 'ADMIN') {
        throw new ForbiddenError('Only admins can access settings');
      }
      const settings = await getSettingsUseCase.execute();
      ResponseHelper.success(res, settings, 'Settings retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (req.user?.role !== 'ADMIN') {
        throw new ForbiddenError('Only admins can update settings');
      }
      const { key, value } = req.body;
      const setting = await updateSettingUseCase.execute(key, value);
      ResponseHelper.success(res, setting, 'Setting updated');
    } catch (error) {
      next(error);
    }
  }
}
