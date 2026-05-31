export enum AutomationTrigger {
  SCHEDULED = 'SCHEDULED',
  EVENT = 'EVENT',
  THRESHOLD = 'THRESHOLD',
}

export enum AutomationMode {
  MANUAL = 'MANUAL',
  SUPERVISED = 'SUPERVISED',
  AUTONOMOUS = 'AUTONOMOUS',
}

export interface AutomationRuleProps {
  id: string;
  name: string;
  description?: string;
  trigger: AutomationTrigger;
  mode: AutomationMode;
  condition?: Record<string, any>;
  action: Record<string, any>;
  isActive: boolean;
  userId: string;
  lastRunAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class AutomationRule {
  constructor(private readonly props: AutomationRuleProps) {}

  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get description(): string | undefined { return this.props.description; }
  get trigger(): AutomationTrigger { return this.props.trigger; }
  get mode(): AutomationMode { return this.props.mode; }
  get condition(): Record<string, any> | undefined { return this.props.condition; }
  get action(): Record<string, any> { return this.props.action; }
  get isActive(): boolean { return this.props.isActive; }
  get userId(): string { return this.props.userId; }
  get lastRunAt(): Date | undefined { return this.props.lastRunAt; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  isManual(): boolean { return this.props.mode === AutomationMode.MANUAL; }
  isSupervised(): boolean { return this.props.mode === AutomationMode.SUPERVISED; }
  isAutonomous(): boolean { return this.props.mode === AutomationMode.AUTONOMOUS; }
}
