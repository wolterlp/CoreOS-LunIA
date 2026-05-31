import { Request, Response, NextFunction } from 'express';
import { PrismaDBConnectionRepository } from './prisma-db-connection.repository';
import { OpenAIAdapter } from '../../../shared/infrastructure/ai';
import { ConnectDatabaseUseCase } from '../application/use-cases/connect-database.use-case';
import { AnalyzeSchemaUseCase } from '../application/use-cases/analyze-schema.use-case';
import { ExecuteQueryUseCase } from '../application/use-cases/execute-query.use-case';
import { ConnectDatabaseDtoSchema } from '../application/dto/connect-database.dto';
import { ExecuteQueryDtoSchema } from '../application/dto/execute-query.dto';
import { ResponseHelper } from '../../../shared/response.helper';

const dbConnectionRepository = new PrismaDBConnectionRepository();
const aiProvider = new OpenAIAdapter();
const connectDatabaseUseCase = new ConnectDatabaseUseCase(dbConnectionRepository);
const analyzeSchemaUseCase = new AnalyzeSchemaUseCase(dbConnectionRepository, aiProvider);
const executeQueryUseCase = new ExecuteQueryUseCase(dbConnectionRepository, aiProvider);

export class DBAnalyzerController {
  static async connect(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = ConnectDatabaseDtoSchema.parse(req.body);
      const userId = (req as any).user.userId;
      const connection = await connectDatabaseUseCase.execute(dto, userId);
      ResponseHelper.success(res, connection, 'Database connected successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async analyze(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const schemas = await analyzeSchemaUseCase.execute(req.params.id, userId);
      ResponseHelper.success(res, schemas, 'Schema analysis completed');
    } catch (error) {
      next(error);
    }
  }

  static async listConnections(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const connections = await dbConnectionRepository.findByUserId(userId);
      ResponseHelper.success(res, connections, 'Connections retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getSchemas(req: Request, res: Response, next: NextFunction) {
    try {
      const schemas = await dbConnectionRepository.findSchemasByConnectionId(req.params.id);
      ResponseHelper.success(res, schemas, 'Schemas retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async executeQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = ExecuteQueryDtoSchema.parse(req.body);
      const userId = (req as any).user.userId;
      const result = await executeQueryUseCase.execute(dto, userId);
      ResponseHelper.success(res, result, 'Query executed');
    } catch (error) {
      next(error);
    }
  }

  static async getQueryLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await dbConnectionRepository.findQueryLogsByConnectionId(req.params.id);
      ResponseHelper.success(res, logs, 'Query logs retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async deleteConnection(req: Request, res: Response, next: NextFunction) {
    try {
      await dbConnectionRepository.delete(req.params.id);
      ResponseHelper.success(res, null, 'Connection deleted');
    } catch (error) {
      next(error);
    }
  }
}
