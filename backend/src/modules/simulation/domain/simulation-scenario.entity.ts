export interface SimulationScenarioProps {
  id: string;
  name: string;
  description?: string;
  variables: Record<string, any>;
  results?: Record<string, any>;
  status: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class SimulationScenario {
  constructor(private readonly props: SimulationScenarioProps) {}

  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get description(): string | undefined { return this.props.description; }
  get variables(): Record<string, any> { return this.props.variables; }
  get results(): Record<string, any> | undefined { return this.props.results; }
  get status(): string { return this.props.status; }
  get userId(): string { return this.props.userId; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  isDraft(): boolean { return this.props.status === 'DRAFT'; }
  isCompleted(): boolean { return this.props.status === 'COMPLETED'; }
}
