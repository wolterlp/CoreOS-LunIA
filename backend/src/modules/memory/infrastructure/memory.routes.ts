import { Router } from 'express';
import { MemoryController } from './memory.controller';
import { authMiddleware } from '../../../shared/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', MemoryController.create);
router.get('/', MemoryController.query);
router.delete('/:id', MemoryController.delete);

export default router;
