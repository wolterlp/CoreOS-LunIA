import { Request, Response, NextFunction } from 'express';
import { PrismaAutomationRepository } from './prisma-automation.repository';
import { CreateRuleUseCase } from '../application/use-cases/create-rule.use-case';
import { ExecuteActionUseCase } from '../application/use-cases/execute-action.use-case';
import { GetExecutionHistoryUseCase } from '../application/use-cases/get-execution-history.use-case';
import { CreateRuleDtoSchema } from '../application/dto/create-rule.dto';
import { ResponseHelper } from '../../../shared/response.helper';

const automationRepository = new PrismaAutomationRepository();
const createRuleUseCase = new CreateRuleUseCase(automationRepository);
const executeActionUseCase = new ExecuteActionUseCase(automationRepository);
const getExecutionHistoryUseCase = new GetExecutionHistoryUseCase(automationRepository);

export class AutomationController {
  static async createRule(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = CreateRuleDtoSchema.parse(req.body);
      const userId = (req as any).user.userId;
      const rule = await createRuleUseCase.execute(dto, userId);
      ResponseHelper.success(res, rule, 'Automation rule created', 201);
    } catch (error) {
      next(error);
    }
  }

  static async listRules(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const rules = await automationRepository.findByUserId(userId);
      ResponseHelper.success(res, rules, 'Automation rules retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async execute(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const log = await executeActionUseCase.execute(req.params.id, userId);
      ResponseHelper.success(res, log, 'Action executed');
    } catch (error) {
      next(error);
    }
  }

  static async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const logs = await getExecutionHistoryUseCase.execute(userId);
      ResponseHelper.success(res, logs, 'Execution history retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async deleteRule(req: Request, res: Response, next: NextFunction) {
    try {
      await automationRepository.delete(req.params.id);
      ResponseHelper.success(res, null, 'Rule deleted');
    } catch (error) {
      next(error);
    }
  }
}
