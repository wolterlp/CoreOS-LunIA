import { GrowthRecommendation } from '../../domain/growth-recommendation.entity';
import { KpiEntry } from '../../domain/kpi-entry.entity';
import { GrowthAdvisorRepository } from '../../domain/growth-advisor.repository';

export interface DashboardData {
  recommendations: GrowthRecommendation[];
  kpiEntries: KpiEntry[];
  summary: {
    activeRecommendations: number;
    implementedRecommendations: number;
    kpiCount: number;
    onTrackKpis: number;
  };
}

export class GetDashboardUseCase {
  constructor(private readonly repository: GrowthAdvisorRepository) {}

  async execute(userId: string): Promise<DashboardData> {
    const recommendations = await this.repository.findRecommendationsByUserId(userId);
    const kpiEntries = await this.repository.findKpiEntriesByUserId(userId);

    const activeRecommendations = recommendations.filter(r => r.isActive()).length;
    const implementedRecommendations = recommendations.filter(r => r.status === 'IMPLEMENTED').length;
    const onTrackKpis = kpiEntries.filter(k => k.isOnTrack() === true).length;

    return {
      recommendations,
      kpiEntries,
      summary: {
        activeRecommendations,
        implementedRecommendations,
        kpiCount: kpiEntries.length,
        onTrackKpis,
      },
    };
  }
}
