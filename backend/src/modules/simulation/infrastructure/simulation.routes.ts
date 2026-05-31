import { Router } from 'express';
import { SimulationController } from './simulation.controller';
import { authMiddleware } from '../../../shared/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', SimulationController.create);
router.get('/history', SimulationController.history);
router.post('/:id/run', SimulationController.run);

export default router;
