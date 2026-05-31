import { Router } from 'express';
import { DBAnalyzerController } from './db-analyzer.controller';
import { authMiddleware } from '../../../shared/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/connections', DBAnalyzerController.connect);
router.get('/connections', DBAnalyzerController.listConnections);
router.delete('/connections/:id', DBAnalyzerController.deleteConnection);
router.post('/connections/:id/analyze', DBAnalyzerController.analyze);
router.get('/connections/:id/schemas', DBAnalyzerController.getSchemas);
router.post('/connections/:id/query', DBAnalyzerController.executeQuery);
router.get('/connections/:id/logs', DBAnalyzerController.getQueryLogs);

export default router;
