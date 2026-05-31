import { AutomationRule } from './automation-rule.entity';
import { AutomationLog } from './automation-log.entity';

export interface AutomationRepository {
  save(rule: AutomationRule): Promise<AutomationRule>;
  findById(id: string): Promise<AutomationRule | null>;
  findByUserId(userId: string): Promise<AutomationRule[]>;
  update(rule: AutomationRule): Promise<AutomationRule>;
  delete(id: string): Promise<void>;

  saveLog(log: AutomationLog): Promise<AutomationLog>;
  findLogsByRuleId(ruleId: string): Promise<AutomationLog[]>;
  findLogsByUserId(userId: string): Promise<AutomationLog[]>;
}
