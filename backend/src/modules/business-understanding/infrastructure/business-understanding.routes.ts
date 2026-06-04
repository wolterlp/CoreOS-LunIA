import { Router } from 'express';
import { BusinessUnderstandingController } from './business-understanding.controller';
import { authMiddleware } from '../../../shared/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/profile', BusinessUnderstandingController.createProfile);
router.get('/profile', BusinessUnderstandingController.getProfile);
router.post('/analysis', BusinessUnderstandingController.submitAnalysis);
router.get('/analysis', BusinessUnderstandingController.getAnalysisHistory);

export default router;
