import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config';
import { AppError } from './shared/errors';
import { ResponseHelper } from './shared/response.helper';
import authRoutes from './modules/auth/infrastructure/auth.routes';
import memoryRoutes from './modules/memory/infrastructure/memory.routes';
import agentRoutes from './modules/agents/infrastructure/agent.routes';
import simulationRoutes from './modules/simulation/infrastructure/simulation.routes';
import dbAnalyzerRoutes from './modules/db-analyzer/infrastructure/db-analyzer.routes';
import automationRoutes from './modules/automation/infrastructure/automation.routes';
import communicationRoutes from './modules/communication/infrastructure/communication.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  ResponseHelper.success(res, {
    timestamp: new Date().toISOString(),
    version: '0.2.0',
    env: config.env,
  }, 'Cerebro Empresarial IA API is healthy');
});

app.use('/api/auth', authRoutes);
app.use('/api/memory', memoryRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/db-analyzer', dbAnalyzerRoutes);
app.use('/api/automation', automationRoutes);
app.use('/api/communication', communicationRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[Error]: ${err.message}`);

  if (err instanceof AppError) {
    return ResponseHelper.error(res, err.message, err.error, err.statusCode, err.details);
  }

  if (err.name === 'ZodError') {
    return ResponseHelper.error(
      res,
      'Validation error',
      'ValidationError',
      400,
      err.errors || []
    );
  }

  return ResponseHelper.error(
    res,
    config.env === 'development' ? err.message : 'Internal server error',
    'InternalServerError',
    500
  );
});

app.listen(config.port, () => {
  console.log(`[server]: Cerebro Empresarial IA running at http://localhost:${config.port} in ${config.env} mode`);
});
