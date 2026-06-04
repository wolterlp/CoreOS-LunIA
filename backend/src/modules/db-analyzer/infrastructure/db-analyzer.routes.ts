import { Router } from 'express';
import { DbAnalyzerController } from './db-analyzer.controller';
import { authMiddleware } from '../../../shared/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/connections', DbAnalyzerController.connect);
router.get('/connections', DbAnalyzerController.listConnections);
router.post('/connections/:id/analyze', DbAnalyzerController.analyze);
router.get('/connections/:id/schemas', DbAnalyzerController.listSchemas);
router.post('/connections/:id/query', DbAnalyzerController.executeQuery);

export default router;
