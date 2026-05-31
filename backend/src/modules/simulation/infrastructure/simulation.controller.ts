import { Request, Response, NextFunction } from 'express';
import { PrismaSimulationRepository } from './prisma-simulation.repository';
import { OpenAIAdapter } from '../../../shared/infrastructure/ai';
import { CreateSimulationUseCase } from '../application/use-cases/create-simulation.use-case';
import { RunSimulationUseCase } from '../application/use-cases/run-simulation.use-case';
import { GetSimulationHistoryUseCase } from '../application/use-cases/get-simulation-history.use-case';
import { CreateSimulationDtoSchema } from '../application/dto/create-simulation.dto';
import { ResponseHelper } from '../../../shared/response.helper';

const simulationRepository = new PrismaSimulationRepository();
const aiProvider = new OpenAIAdapter();
const createSimulationUseCase = new CreateSimulationUseCase(simulationRepository);
const runSimulationUseCase = new RunSimulationUseCase(simulationRepository, aiProvider);
const getSimulationHistoryUseCase = new GetSimulationHistoryUseCase(simulationRepository);

export class SimulationController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = CreateSimulationDtoSchema.parse(req.body);
      const userId = (req as any).user.userId;
      const scenario = await createSimulationUseCase.execute(dto, userId);
      ResponseHelper.success(res, scenario, 'Simulation scenario created', 201);
    } catch (error) {
      next(error);
    }
  }

  static async history(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const scenarios = await getSimulationHistoryUseCase.execute(userId);
      ResponseHelper.success(res, scenarios, 'Simulation history retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async run(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const result = await runSimulationUseCase.execute(req.params.id, userId);
      ResponseHelper.success(res, result, 'Simulation executed successfully');
    } catch (error) {
      next(error);
    }
  }
}
