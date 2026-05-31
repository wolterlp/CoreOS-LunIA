export interface DatabaseConnectionProps {
  id: string;
  name: string;
  type: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  isActive: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class DatabaseConnection {
  constructor(private readonly props: DatabaseConnectionProps) {}

  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get type(): string { return this.props.type; }
  get host(): string { return this.props.host; }
  get port(): number { return this.props.port; }
  get database(): string { return this.props.database; }
  get username(): string { return this.props.username; }
  get password(): string { return this.props.password; }
  get ssl(): boolean { return this.props.ssl; }
  get isActive(): boolean { return this.props.isActive; }
  get userId(): string { return this.props.userId; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }
}
