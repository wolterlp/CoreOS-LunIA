import { AutomationLog } from '../../domain/automation-log.entity';
import { AutomationRepository } from '../../domain/automation.repository';
import { NotFoundError } from '../../../../shared/errors';
import { randomUUID } from 'crypto';

export class ExecuteActionUseCase {
  constructor(private readonly automationRepository: AutomationRepository) {}

  async execute(ruleId: string, userId: string): Promise<AutomationLog> {
    const rule = await this.automationRepository.findById(ruleId);
    if (!rule || rule.userId !== userId) {
      throw new NotFoundError('Automation rule not found');
    }

    const log = new AutomationLog({
      id: randomUUID(),
      action: rule.name,
      status: 'EXECUTED',
      result: { message: `Action "${rule.name}" execution triggered` },
      ruleId,
      userId,
      executedAt: new Date(),
    });

    return await this.automationRepository.saveLog(log);
  }
}
