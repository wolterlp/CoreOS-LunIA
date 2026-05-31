export interface TableSchemaProps {
  id: string;
  tableName: string;
  columns: Record<string, any>;
  rowCount?: number;
  connectionId: string;
  analyzedAt: Date;
}

export class TableSchema {
  constructor(private readonly props: TableSchemaProps) {}

  get id(): string { return this.props.id; }
  get tableName(): string { return this.props.tableName; }
  get columns(): Record<string, any> { return this.props.columns; }
  get rowCount(): number | undefined { return this.props.rowCount; }
  get connectionId(): string { return this.props.connectionId; }
  get analyzedAt(): Date { return this.props.analyzedAt; }
}
