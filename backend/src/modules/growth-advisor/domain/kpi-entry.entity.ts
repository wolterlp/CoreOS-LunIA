export type KpiCategory = 'FINANCIAL' | 'CUSTOMER' | 'PROCESS' | 'GROWTH';
export type KpiPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export interface KpiEntryProps {
  id: string;
  name: string;
  category: KpiCategory;
  value: number;
  target?: number;
  unit?: string;
  period: KpiPeriod;
  recordedAt: Date;
  userId: string;
  createdAt: Date;
}

export class KpiEntry {
  constructor(private readonly props: KpiEntryProps) {}

  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get category(): KpiCategory { return this.props.category; }
  get value(): number { return this.props.value; }
  get target(): number | undefined { return this.props.target; }
  get unit(): string | undefined { return this.props.unit; }
  get period(): KpiPeriod { return this.props.period; }
  get recordedAt(): Date { return this.props.recordedAt; }
  get userId(): string { return this.props.userId; }
  get createdAt(): Date { return this.props.createdAt; }

  get achievement(): number | null {
    if (this.props.target === undefined || this.props.target === 0) return null;
    return (this.props.value / this.props.target) * 100;
  }

  isOnTrack(): boolean | null {
    if (this.achievement === null) return null;
    return this.achievement >= 80;
  }
}
