export enum MemoryType {
  OPERATIONAL = 'OPERATIONAL',
  STRATEGIC = 'STRATEGIC',
  LEARNING = 'LEARNING',
}

export interface MemoryEntryProps {
  id: string;
  type: MemoryType;
  title: string;
  content: string;
  tags: string[];
  metadata?: Record<string, any>;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class MemoryEntry {
  constructor(private readonly props: MemoryEntryProps) {}

  get id(): string { return this.props.id; }
  get type(): MemoryType { return this.props.type; }
  get title(): string { return this.props.title; }
  get content(): string { return this.props.content; }
  get tags(): string[] { return this.props.tags; }
  get metadata(): Record<string, any> | undefined { return this.props.metadata; }
  get userId(): string { return this.props.userId; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  isOperational(): boolean { return this.props.type === MemoryType.OPERATIONAL; }
  isStrategic(): boolean { return this.props.type === MemoryType.STRATEGIC; }
  isLearning(): boolean { return this.props.type === MemoryType.LEARNING; }
}
