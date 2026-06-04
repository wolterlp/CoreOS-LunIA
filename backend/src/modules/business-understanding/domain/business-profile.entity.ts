export interface BusinessProfileProps {
  id: string;
  companyName: string;
  industry?: string;
  size?: string;
  description?: string;
  mission?: string;
  vision?: string;
  values: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class BusinessProfile {
  constructor(private readonly props: BusinessProfileProps) {}

  get id(): string { return this.props.id; }
  get companyName(): string { return this.props.companyName; }
  get industry(): string | undefined { return this.props.industry; }
  get size(): string | undefined { return this.props.size; }
  get description(): string | undefined { return this.props.description; }
  get mission(): string | undefined { return this.props.mission; }
  get vision(): string | undefined { return this.props.vision; }
  get values(): string[] { return this.props.values; }
  get userId(): string { return this.props.userId; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }
}
