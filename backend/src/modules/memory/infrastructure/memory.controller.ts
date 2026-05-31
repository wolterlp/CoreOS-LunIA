import { Request, Response, NextFunction } from 'express';
import { PrismaMemoryRepository } from './prisma-memory.repository';
import { CreateMemoryUseCase } from '../application/use-cases/create-memory.use-case';
import { QueryMemoryUseCase } from '../application/use-cases/query-memory.use-case';
import { DeleteMemoryUseCase } from '../application/use-cases/delete-memory.use-case';
import { CreateMemoryDtoSchema } from '../application/dto/create-memory.dto';
import { QueryMemoryDtoSchema } from '../application/dto/query-memory.dto';
import { ResponseHelper } from '../../../shared/response.helper';

const memoryRepository = new PrismaMemoryRepository();
const createMemoryUseCase = new CreateMemoryUseCase(memoryRepository);
const queryMemoryUseCase = new QueryMemoryUseCase(memoryRepository);
const deleteMemoryUseCase = new DeleteMemoryUseCase(memoryRepository);

export class MemoryController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = CreateMemoryDtoSchema.parse(req.body);
      const userId = (req as any).user.userId;
      const entry = await createMemoryUseCase.execute(dto, userId);
      ResponseHelper.success(res, entry, 'Memory entry created', 201);
    } catch (error) {
      next(error);
    }
  }

  static async query(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = QueryMemoryDtoSchema.parse(req.query);
      const userId = (req as any).user.userId;
      const entries = await queryMemoryUseCase.execute(dto, userId);
      ResponseHelper.success(res, entries, 'Memory entries retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      await deleteMemoryUseCase.execute(req.params.id, userId);
      ResponseHelper.success(res, null, 'Memory entry deleted');
    } catch (error) {
      next(error);
    }
  }
}
