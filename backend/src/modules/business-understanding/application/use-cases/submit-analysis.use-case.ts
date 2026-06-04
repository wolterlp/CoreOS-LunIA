import { AnalysisReport, AnalysisType } from '../../domain/analysis-report.entity';
import { BusinessUnderstandingRepository } from '../../domain/business-understanding.repository';
import { SubmitAnalysisDto } from '../dto/submit-analysis.dto';
import { randomUUID } from 'crypto';

export class SubmitAnalysisUseCase {
  constructor(private readonly repository: BusinessUnderstandingRepository) {}

  async execute(dto: SubmitAnalysisDto, userId: string): Promise<AnalysisReport> {
    const report = new AnalysisReport({
      id: randomUUID(),
      type: dto.type as AnalysisType,
      title: dto.title,
      content: dto.content,
      summary: dto.summary,
      profileId: dto.profileId,
      userId,
      createdAt: new Date(),
    });

    return this.repository.saveReport(report);
  }
}
