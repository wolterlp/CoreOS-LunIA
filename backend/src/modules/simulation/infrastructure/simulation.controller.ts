import { Response, NextFunction } from 'express';
import { PrismaSimulationRepository } from './prisma-simulation.repository';
import { CreateSimulationUseCase } from '../application/use-cases/create-simulation.use-case';
import { RunSimulationUseCase } from '../application/use-cases/run-simulation.use-case';
import { GetSimulationHistoryUseCase } from '../application/use-cases/get-simulation-history.use-case';
import { CreateSimulationDtoSchema } from '../application/dto/create-simulation.dto';
import { ResponseHelper } from '../../../shared/response.helper';
import { OpenAIAdapter } from '../../../shared/infrastructure/ai/openai.adapter';
import { AuthRequest } from '../../../shared/auth.middleware';

const simulationRepository = new PrismaSimulationRepository();
const aiProvider = new OpenAIAdapter();

const createSimulationUseCase = new CreateSimulationUseCase(simulationRepository);
const runSimulationUseCase = new RunSimulationUseCase(simulationRepository, aiProvider);
const getSimulationHistoryUseCase = new GetSimulationHistoryUseCase(simulationRepository);

export class SimulationController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto = CreateSimulationDtoSchema.parse(req.body);
      const userId = req.user!.userId;
      const scenario = await createSimulationUseCase.execute(dto, userId);
      ResponseHelper.success(res, scenario, 'Simulation scenario created', 201);
    } catch (error) {
      next(error);
    }
  }

  static async run(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await runSimulationUseCase.execute(req.params.id, userId);
      ResponseHelper.success(res, result, 'Simulation executed');
    } catch (error) {
      next(error);
    }
  }

  static async getHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const history = await getSimulationHistoryUseCase.execute(userId);
      ResponseHelper.success(res, history, 'Simulation history retrieved');
    } catch (error) {
      next(error);
    }
  }
}
