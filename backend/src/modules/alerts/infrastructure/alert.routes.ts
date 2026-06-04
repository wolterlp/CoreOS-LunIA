import { Router } from 'express';
import { AlertController } from './alert.controller';
import { authMiddleware } from '../../../shared/auth.middleware';

const router = Router();

router.get('/', authMiddleware, AlertController.list);
router.patch('/:id/read', authMiddleware, AlertController.markAsRead);
router.delete('/:id', authMiddleware, AlertController.delete);

export { router as alertRoutes };
