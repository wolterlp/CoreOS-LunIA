import { Router } from 'express';
import { AgentController } from './agent.controller';
import { authMiddleware } from '../../../shared/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', AgentController.create);
router.get('/', AgentController.list);
router.get('/:id/status', AgentController.getStatus);
router.post('/:agentId/tasks', AgentController.assignTask);
router.get('/:agentId/tasks', AgentController.listTasks);

export default router;
