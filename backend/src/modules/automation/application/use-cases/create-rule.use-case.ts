import { AutomationRule, AutomationTrigger, AutomationMode } from '../../domain/automation-rule.entity';
import { AutomationRepository } from '../../domain/automation.repository';
import { CreateRuleDto } from '../dto/create-rule.dto';
import { randomUUID } from 'crypto';

export class CreateRuleUseCase {
  constructor(private readonly automationRepository: AutomationRepository) {}

  async execute(dto: CreateRuleDto, userId: string): Promise<AutomationRule> {
    const rule = new AutomationRule({
      id: randomUUID(),
      name: dto.name,
      description: dto.description,
      trigger: dto.trigger as AutomationTrigger,
      mode: dto.mode as AutomationMode,
      condition: dto.condition,
      action: dto.action,
      isActive: true,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this.automationRepository.save(rule);
  }
}
