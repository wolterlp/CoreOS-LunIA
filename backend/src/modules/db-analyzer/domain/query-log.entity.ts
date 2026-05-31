export interface QueryLogProps {
  id: string;
  query: string;
  result?: Record<string, any>;
  tokensUsed?: number;
  error?: string;
  connectionId: string;
  userId: string;
  executedAt: Date;
}

export class QueryLog {
  constructor(private readonly props: QueryLogProps) {}

  get id(): string { return this.props.id; }
  get query(): string { return this.props.query; }
  get result(): Record<string, any> | undefined { return this.props.result; }
  get tokensUsed(): number | undefined { return this.props.tokensUsed; }
  get error(): string | undefined { return this.props.error; }
  get connectionId(): string { return this.props.connectionId; }
  get userId(): string { return this.props.userId; }
  get executedAt(): Date { return this.props.executedAt; }

  hasError(): boolean { return this.props.error !== undefined && this.props.error !== null; }
}
