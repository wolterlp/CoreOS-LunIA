import { Router } from 'express';
import { AlertController } from './alert.controller';
import { authMiddleware } from '../../../shared/auth.middleware';

const router = Router();

router.get('/', authMiddleware, AlertController.list);
router.patch('/:id/read', authMiddleware, AlertController.markAsRead);
router.delete('/:id', authMiddleware, AlertController.delete);

router.post('/rules', authMiddleware, AlertController.createRule);
router.get('/rules', authMiddleware, AlertController.listRules);
router.post('/check', authMiddleware, AlertController.triggerManualCheck);

export { router as alertRoutes };
