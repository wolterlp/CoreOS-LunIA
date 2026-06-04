import { KpiEntry, KpiCategory, KpiPeriod } from '../../domain/kpi-entry.entity';
import { GrowthAdvisorRepository } from '../../domain/growth-advisor.repository';
import { TrackKpiDto } from '../dto/track-kpi.dto';
import { randomUUID } from 'crypto';

export class TrackKpiUseCase {
  constructor(private readonly repository: GrowthAdvisorRepository) {}

  async execute(dto: TrackKpiDto, userId: string): Promise<KpiEntry> {
    const entry = new KpiEntry({
      id: randomUUID(),
      name: dto.name,
      category: dto.category as KpiCategory,
      value: dto.value,
      target: dto.target,
      unit: dto.unit,
      period: dto.period as KpiPeriod,
      recordedAt: dto.recordedAt ? new Date(dto.recordedAt) : new Date(),
      userId,
      createdAt: new Date(),
    });

    return this.repository.saveKpiEntry(entry);
  }
}
