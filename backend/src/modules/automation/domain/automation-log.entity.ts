export interface AutomationLogProps {
  id: string;
  action: string;
  status: string;
  result?: Record<string, any>;
  error?: string;
  ruleId: string;
  userId: string;
  executedAt: Date;
}

export class AutomationLog {
  constructor(private readonly props: AutomationLogProps) {}

  get id(): string { return this.props.id; }
  get action(): string { return this.props.action; }
  get status(): string { return this.props.status; }
  get result(): Record<string, any> | undefined { return this.props.result; }
  get error(): string | undefined { return this.props.error; }
  get ruleId(): string { return this.props.ruleId; }
  get userId(): string { return this.props.userId; }
  get executedAt(): Date { return this.props.executedAt; }
}
