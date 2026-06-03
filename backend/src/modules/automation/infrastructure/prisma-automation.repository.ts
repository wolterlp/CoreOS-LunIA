import { prisma } from '../../../shared/infrastructure/prisma.client';
import { AutomationRule, AutomationTrigger, AutomationMode } from '../domain/automation-rule.entity';
import { AutomationLog } from '../domain/automation-log.entity';
import { AutomationRepository } from '../domain/automation.repository';
import { config } from '../../../config';


export class PrismaAutomationRepository implements AutomationRepository {
  private ruleToDomain(p: any): AutomationRule {
    return new AutomationRule({
      id: p.id,
      name: p.name,
      description: p.description,
      trigger: p.trigger as AutomationTrigger,
      mode: p.mode as AutomationMode,
      condition: p.condition,
      action: p.action,
      isActive: p.isActive,
      userId: p.userId,
      lastRunAt: p.lastRunAt,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    });
  }

  private logToDomain(p: any): AutomationLog {
    return new AutomationLog({
      id: p.id,
      action: p.action,
      status: p.status,
      result: p.result,
      error: p.error,
      ruleId: p.ruleId,
      userId: p.userId,
      executedAt: p.executedAt,
    });
  }

  async save(rule: AutomationRule): Promise<AutomationRule> {
    const p = await prisma.automationRule.create({
      data: {
        id: rule.id,
        name: rule.name,
        description: rule.description,
        trigger: rule.trigger,
        mode: rule.mode,
        condition: rule.condition,
        action: rule.action,
        isActive: rule.isActive,
        userId: rule.userId,
      },
    });
    return this.ruleToDomain(p);
  }

  async findById(id: string): Promise<AutomationRule | null> {
    const p = await prisma.automationRule.findUnique({ where: { id } });
    return p ? this.ruleToDomain(p) : null;
  }

  async findByUserId(userId: string): Promise<AutomationRule[]> {
    const items = await prisma.automationRule.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    return items.map(this.ruleToDomain);
  }

  async update(rule: AutomationRule): Promise<AutomationRule> {
    const p = await prisma.automationRule.update({
      where: { id: rule.id },
      data: {
        name: rule.name,
        description: rule.description,
        trigger: rule.trigger,
        mode: rule.mode,
        condition: rule.condition,
        action: rule.action,
        isActive: rule.isActive,
        lastRunAt: rule.lastRunAt,
      },
    });
    return this.ruleToDomain(p);
  }

  async delete(id: string): Promise<void> {
    await prisma.automationRule.delete({ where: { id } });
  }

  async saveLog(log: AutomationLog): Promise<AutomationLog> {
    const p = await prisma.automationLog.create({
      data: {
        id: log.id,
        action: log.action,
        status: log.status,
        result: log.result,
        error: log.error,
        ruleId: log.ruleId,
        userId: log.userId,
      },
    });
    return this.logToDomain(p);
  }

  async findLogsByRuleId(ruleId: string): Promise<AutomationLog[]> {
    const items = await prisma.automationLog.findMany({ where: { ruleId }, orderBy: { executedAt: 'desc' } });
    return items.map(this.logToDomain);
  }

  async findLogsByUserId(userId: string): Promise<AutomationLog[]> {
    const items = await prisma.automationLog.findMany({ where: { userId }, orderBy: { executedAt: 'desc' } });
    return items.map(this.logToDomain);
  }
}
