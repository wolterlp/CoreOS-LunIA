import { Response, NextFunction } from 'express';
import { PrismaAgentRepository } from './prisma-agent.repository';
import { CreateAgentUseCase } from '../application/use-cases/create-agent.use-case';
import { AssignTaskUseCase } from '../application/use-cases/assign-task.use-case';
import { GetAgentStatusUseCase } from '../application/use-cases/get-agent-status.use-case';
import { CreateAgentDtoSchema } from '../application/dto/create-agent.dto';
import { AssignTaskDtoSchema } from '../application/dto/assign-task.dto';
import { ResponseHelper } from '../../../shared/response.helper';
import { AuthRequest } from '../../../shared/auth.middleware';

const agentRepository = new PrismaAgentRepository();
const createAgentUseCase = new CreateAgentUseCase(agentRepository);
const assignTaskUseCase = new AssignTaskUseCase(agentRepository);
const getAgentStatusUseCase = new GetAgentStatusUseCase(agentRepository);

export class AgentController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto = CreateAgentDtoSchema.parse(req.body);
      const userId = req.user!.userId;
      const agent = await createAgentUseCase.execute(dto, userId);
      ResponseHelper.success(res, agent, 'Agent created', 201);
    } catch (error) {
      next(error);
    }
  }

  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const agents = await agentRepository.findByUserId(userId);
      ResponseHelper.success(res, agents, 'Agents retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await getAgentStatusUseCase.execute(req.params.id);
      ResponseHelper.success(res, result, 'Agent status retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async assignTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto = AssignTaskDtoSchema.parse(req.body);
      const userId = req.user!.userId;
      const task = await assignTaskUseCase.execute(dto, userId);
      ResponseHelper.success(res, task, 'Task assigned', 201);
    } catch (error) {
      next(error);
    }
  }

  static async listTasks(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tasks = await agentRepository.findTasksByAgentId(req.params.agentId);
      ResponseHelper.success(res, tasks, 'Tasks retrieved');
    } catch (error) {
      next(error);
    }
  }
}
