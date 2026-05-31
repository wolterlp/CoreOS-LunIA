import { Router } from 'express';
import { AutomationController } from './automation.controller';
import { authMiddleware } from '../../../shared/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/rules', AutomationController.createRule);
router.get('/rules', AutomationController.listRules);
router.delete('/rules/:id', AutomationController.deleteRule);
router.post('/rules/:id/execute', AutomationController.execute);
router.get('/history', AutomationController.getHistory);

export default router;
