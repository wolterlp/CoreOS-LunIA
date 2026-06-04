import { Response, NextFunction } from 'express';
import { PrismaAutomationRepository } from './prisma-automation.repository';
import { CreateRuleUseCase } from '../application/use-cases/create-rule.use-case';
import { ExecuteActionUseCase } from '../application/use-cases/execute-action.use-case';
import { GetExecutionHistoryUseCase } from '../application/use-cases/get-execution-history.use-case';
import { CreateRuleDtoSchema } from '../application/dto/create-rule.dto';
import { ResponseHelper } from '../../../shared/response.helper';
import { AuthRequest } from '../../../shared/auth.middleware';

const automationRepository = new PrismaAutomationRepository();
const createRuleUseCase = new CreateRuleUseCase(automationRepository);
const executeActionUseCase = new ExecuteActionUseCase(automationRepository);
const getExecutionHistoryUseCase = new GetExecutionHistoryUseCase(automationRepository);

export class AutomationController {
  static async createRule(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto = CreateRuleDtoSchema.parse(req.body);
      const userId = req.user!.userId;
      const rule = await createRuleUseCase.execute(dto, userId);
      ResponseHelper.success(res, rule, 'Automation rule created', 201);
    } catch (error) {
      next(error);
    }
  }

  static async listRules(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const rules = await automationRepository.findByUserId(userId);
      ResponseHelper.success(res, rules, 'Automation rules retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async executeRule(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await executeActionUseCase.execute(req.params.id, userId);
      ResponseHelper.success(res, result, 'Automation rule executed');
    } catch (error) {
      next(error);
    }
  }

  static async getHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const history = await getExecutionHistoryUseCase.execute(userId);
      ResponseHelper.success(res, history, 'Execution history retrieved');
    } catch (error) {
      next(error);
    }
  }
}
