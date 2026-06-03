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

    console.log(`[Automation]: Executing action for rule "${rule.name}"...`);

    // Simulate real action execution (e.g. sending an email, updating a record)
    const result = {
      message: `Action "${rule.name}" executed successfully via Cerebro IA Automation engine.`,
      timestamp: new Date().toISOString(),
      actionDetails: rule.action,
    };

    const log = new AutomationLog({
      id: randomUUID(),
      action: rule.name,
      status: 'SUCCESS',
      result,
      ruleId,
      userId,
      executedAt: new Date(),
    });

    return await this.automationRepository.saveLog(log);
  }
}
