export type AnalysisType = 'SWOT' | 'PESTEL' | 'PORTER' | 'CANVAS';

export interface AnalysisReportProps {
  id: string;
  type: AnalysisType;
  title: string;
  content: Record<string, any>;
  summary?: string;
  profileId: string;
  userId: string;
  createdAt: Date;
}

export class AnalysisReport {
  constructor(private readonly props: AnalysisReportProps) {}

  get id(): string { return this.props.id; }
  get type(): AnalysisType { return this.props.type; }
  get title(): string { return this.props.title; }
  get content(): Record<string, any> { return this.props.content; }
  get summary(): string | undefined { return this.props.summary; }
  get profileId(): string { return this.props.profileId; }
  get userId(): string { return this.props.userId; }
  get createdAt(): Date { return this.props.createdAt; }

  isSwot(): boolean { return this.props.type === 'SWOT'; }
  isPestel(): boolean { return this.props.type === 'PESTEL'; }
  isPorter(): boolean { return this.props.type === 'PORTER'; }
  isCanvas(): boolean { return this.props.type === 'CANVAS'; }
}
