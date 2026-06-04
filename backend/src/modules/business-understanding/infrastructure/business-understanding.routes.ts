import { Router } from 'express';
import { BusinessUnderstandingController } from './business-understanding.controller';
import { authMiddleware } from '../../../shared/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/analyze', BusinessUnderstandingController.analyze);
router.get('/profile', BusinessUnderstandingController.getProfile);

export default router;
