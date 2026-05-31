import { AutomationLog } from '../../domain/automation-log.entity';
import { AutomationRepository } from '../../domain/automation.repository';

export class GetExecutionHistoryUseCase {
  constructor(private readonly automationRepository: AutomationRepository) {}

  async execute(userId: string): Promise<AutomationLog[]> {
    return await this.automationRepository.findLogsByUserId(userId);
  }
}
