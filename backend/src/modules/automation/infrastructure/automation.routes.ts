import { Router } from 'express';
import { AutomationController } from './automation.controller';
import { authMiddleware } from '../../../shared/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/rules', AutomationController.createRule);
router.get('/rules', AutomationController.listRules);
router.post('/rules/:id/execute', AutomationController.executeRule);
router.get('/history', AutomationController.getHistory);

export default router;
