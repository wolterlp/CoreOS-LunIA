import { Router } from 'express';
import { GrowthAdvisorController } from './growth-advisor.controller';
import { authMiddleware } from '../../../shared/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/diagnose', GrowthAdvisorController.diagnose);
router.post('/plan', GrowthAdvisorController.generatePlan);
router.get('/status', GrowthAdvisorController.getStatus);
router.get('/dashboard', GrowthAdvisorController.getDashboard);
router.post('/recommendations', GrowthAdvisorController.createRecommendation);
router.get('/recommendations', GrowthAdvisorController.listRecommendations);
router.post('/kpis', GrowthAdvisorController.trackKpi);
router.get('/kpis', GrowthAdvisorController.listKpis);

export default router;
