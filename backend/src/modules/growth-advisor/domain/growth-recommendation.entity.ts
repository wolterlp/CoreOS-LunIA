export type RecommendationCategory = 'MARKETING' | 'SALES' | 'OPERATIONS' | 'FINANCE' | 'STRATEGY';
export type RecommendationPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type RecommendationStatus = 'ACTIVE' | 'IMPLEMENTED' | 'DISMISSED';

export interface GrowthRecommendationProps {
  id: string;
  title: string;
  description: string;
  category: RecommendationCategory;
  priority: RecommendationPriority;
  impact?: string;
  status: RecommendationStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class GrowthRecommendation {
  constructor(private readonly props: GrowthRecommendationProps) {}

  get id(): string { return this.props.id; }
  get title(): string { return this.props.title; }
  get description(): string { return this.props.description; }
  get category(): RecommendationCategory { return this.props.category; }
  get priority(): RecommendationPriority { return this.props.priority; }
  get impact(): string | undefined { return this.props.impact; }
  get status(): RecommendationStatus { return this.props.status; }
  get userId(): string { return this.props.userId; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  isHighPriority(): boolean { return this.props.priority === 'HIGH'; }
  isActive(): boolean { return this.props.status === 'ACTIVE'; }
}
