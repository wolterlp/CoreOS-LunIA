import { Router } from 'express';
import { GrowthAdvisorController } from './growth-advisor.controller';
import { authMiddleware } from '../../../shared/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/diagnose', GrowthAdvisorController.diagnose);
router.post('/plan', GrowthAdvisorController.generatePlan);
router.get('/status', GrowthAdvisorController.getStatus);

export default router;
