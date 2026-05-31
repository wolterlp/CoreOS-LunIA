export enum AgentType {
  MARKETING = 'MARKETING',
  COMMERCIAL = 'COMMERCIAL',
  FINANCIAL = 'FINANCIAL',
  OPERATIONAL = 'OPERATIONAL',
  COORDINATOR = 'COORDINATOR',
}

export enum AgentStatus {
  ACTIVE = 'ACTIVE',
  IDLE = 'IDLE',
  ERROR = 'ERROR',
  DISABLED = 'DISABLED',
}

export interface AgentProps {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  config?: Record<string, any>;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Agent {
  constructor(private readonly props: AgentProps) {}

  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get type(): AgentType { return this.props.type; }
  get status(): AgentStatus { return this.props.status; }
  get config(): Record<string, any> | undefined { return this.props.config; }
  get userId(): string { return this.props.userId; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  isActive(): boolean { return this.props.status === AgentStatus.ACTIVE; }
  isCoordinator(): boolean { return this.props.type === AgentType.COORDINATOR; }
}
