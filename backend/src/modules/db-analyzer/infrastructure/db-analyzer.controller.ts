import { Response, NextFunction } from 'express';
import { PrismaDBConnectionRepository } from './prisma-db-connection.repository';
import { ConnectDatabaseUseCase } from '../application/use-cases/connect-database.use-case';
import { AnalyzeSchemaUseCase } from '../application/use-cases/analyze-schema.use-case';
import { ExecuteQueryUseCase } from '../application/use-cases/execute-query.use-case';
import { ConnectDatabaseDtoSchema } from '../application/dto/connect-database.dto';
import { ExecuteQueryDtoSchema } from '../application/dto/execute-query.dto';
import { ResponseHelper } from '../../../shared/response.helper';
import { OpenAIAdapter } from '../../../shared/infrastructure/ai/openai.adapter';
import { AuthRequest } from '../../../shared/auth.middleware';

const dbConnectionRepository = new PrismaDBConnectionRepository();
const aiProvider = new OpenAIAdapter();

const connectDatabaseUseCase = new ConnectDatabaseUseCase(dbConnectionRepository);
const analyzeSchemaUseCase = new AnalyzeSchemaUseCase(dbConnectionRepository, aiProvider);
const executeQueryUseCase = new ExecuteQueryUseCase(dbConnectionRepository, aiProvider);

export class DbAnalyzerController {
  static async connect(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto = ConnectDatabaseDtoSchema.parse(req.body);
      const userId = req.user!.userId;
      const connection = await connectDatabaseUseCase.execute(dto, userId);
      ResponseHelper.success(res, connection, 'Database connected', 201);
    } catch (error) {
      next(error);
    }
  }

  static async listConnections(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const connections = await dbConnectionRepository.findByUserId(userId);
      ResponseHelper.success(res, connections, 'Database connections retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async analyze(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const schemas = await analyzeSchemaUseCase.execute(req.params.id, userId);
      ResponseHelper.success(res, schemas, 'Database schema analyzed');
    } catch (error) {
      next(error);
    }
  }

  static async listSchemas(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schemas = await dbConnectionRepository.findSchemasByConnectionId(req.params.id);
      ResponseHelper.success(res, schemas, 'Table schemas retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async executeQuery(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto = ExecuteQueryDtoSchema.parse(req.body);
      const userId = req.user!.userId;
      const userRole = req.user!.role;
      const result = await executeQueryUseCase.execute(req.params.id, dto, userId, userRole);
      ResponseHelper.success(res, result, 'Query executed');
    } catch (error) {
      next(error);
    }
  }
}
