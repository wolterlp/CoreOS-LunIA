import { AnalysisReport } from '../../domain/analysis-report.entity';
import { BusinessUnderstandingRepository } from '../../domain/business-understanding.repository';

export class GetAnalysisHistoryUseCase {
  constructor(private readonly repository: BusinessUnderstandingRepository) {}

  async execute(userId: string): Promise<AnalysisReport[]> {
    return this.repository.findReportsByUserId(userId);
  }
}
