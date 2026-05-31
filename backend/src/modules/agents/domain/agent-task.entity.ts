export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface AgentTaskProps {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  result?: Record<string, any>;
  agentId: string;
  assignedBy: string;
  createdAt: Date;
  completedAt?: Date;
}

export class AgentTask {
  constructor(private readonly props: AgentTaskProps) {}

  get id(): string { return this.props.id; }
  get title(): string { return this.props.title; }
  get description(): string | undefined { return this.props.description; }
  get status(): TaskStatus { return this.props.status; }
  get result(): Record<string, any> | undefined { return this.props.result; }
  get agentId(): string { return this.props.agentId; }
  get assignedBy(): string { return this.props.assignedBy; }
  get createdAt(): Date { return this.props.createdAt; }
  get completedAt(): Date | undefined { return this.props.completedAt; }

  isCompleted(): boolean { return this.props.status === TaskStatus.COMPLETED; }
  isFailed(): boolean { return this.props.status === TaskStatus.FAILED; }
}
