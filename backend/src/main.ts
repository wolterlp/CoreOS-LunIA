import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config';
import { AppError } from './shared/errors';
import { ResponseHelper } from './shared/response.helper';
import { HeartbeatService } from './shared/services/heartbeat.service';
import { initCoreDb, getCoreDb } from './shared/core-db';
import { ConfigController } from './shared/infrastructure/config.controller';
import { validateStartupConfig } from './shared/infrastructure/startup-validator';
import authRoutes from './modules/auth/infrastructure/auth.routes';
import memoryRoutes from './modules/memory/infrastructure/memory.routes';
import agentRoutes from './modules/agents/infrastructure/agent.routes';
import simulationRoutes from './modules/simulation/infrastructure/simulation.routes';
import dbAnalyzerRoutes from './modules/db-analyzer/infrastructure/db-analyzer.routes';
import automationRoutes from './modules/automation/infrastructure/automation.routes';
import communicationRoutes from './modules/communication/infrastructure/communication.routes';
import { alertRoutes } from './modules/alerts/infrastructure/alert.routes';
import businessUnderstandingRoutes from './modules/business-understanding/infrastructure/business-understanding.routes';
import virtualSecretaryRoutes from './modules/virtual-secretary/infrastructure/virtual-secretary.routes';
import growthAdvisorRoutes from './modules/growth-advisor/infrastructure/growth-advisor.routes';
import settingsRoutes from './modules/settings/infrastructure/settings.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Initialize CoreDB (internal file-based database, transparent for the user)
const coreDb = initCoreDb(config.coreDb.path);
const startupTime = new Date().toISOString();
coreDb.collection<{ id: string; key: string; value: any; startedAt: string }>('_system').insertOne({
  id: 'startup',
  key: 'startup',
  value: { version: '0.2.0', env: config.server.env },
  startedAt: startupTime,
});

app.get('/health', (req, res) => {
  ResponseHelper.success(res, {
    timestamp: startupTime,
    version: '0.2.0',
    env: config.server.env,
    coreDb: (coreDb.collection('_system').findById('startup') as any)?.startedAt ?? startupTime,
  }, 'Cerebro Empresarial IA API is healthy');
});

app.get('/api/config/status', ConfigController.getStatus);

app.use('/api/auth', authRoutes);
app.use('/api/memory', memoryRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/db-analyzer', dbAnalyzerRoutes);
app.use('/api/automation', automationRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/business-understanding', businessUnderstandingRoutes);
app.use('/api/virtual-secretary', virtualSecretaryRoutes);
app.use('/api/growth-advisor', growthAdvisorRoutes);
app.use('/api/settings', settingsRoutes);

// Validate configuration
validateStartupConfig();

// Start the Heartbeat system
const heartbeat = HeartbeatService.getInstance();
heartbeat.start();

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
    config.server.env === 'development' ? err.message : 'Internal server error',
    'InternalServerError',
    500
  );
});

const server = app.listen(config.server.port, () => {
  console.log(`[server]: ${config.server.appName} running at http://localhost:${config.server.port} in ${config.server.env} mode`);
});

// Graceful shutdown: flush CoreDB + stop heartbeat
const shutdown = () => {
  console.log('[server]: Shutting down gracefully...');
  heartbeat.stop();
  coreDb.flush();
  coreDb.destroy();
  server.close(() => {
    console.log('[server]: Closed.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
