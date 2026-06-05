import { Router } from 'express';
import { SettingsController } from './settings.controller';
import { authMiddleware } from '../../../shared/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', SettingsController.getAll);
router.put('/', SettingsController.update);

export default router;
