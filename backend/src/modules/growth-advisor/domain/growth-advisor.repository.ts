import { GrowthRecommendation } from './growth-recommendation.entity';
import { KpiEntry } from './kpi-entry.entity';

export interface GrowthAdvisorRepository {
  saveRecommendation(recommendation: GrowthRecommendation): Promise<GrowthRecommendation>;
  findRecommendationById(id: string): Promise<GrowthRecommendation | null>;
  findRecommendationsByUserId(userId: string): Promise<GrowthRecommendation[]>;
  updateRecommendation(recommendation: GrowthRecommendation): Promise<GrowthRecommendation>;
  deleteRecommendation(id: string): Promise<void>;
  saveKpiEntry(entry: KpiEntry): Promise<KpiEntry>;
  findKpiEntriesByUserId(userId: string, period?: string): Promise<KpiEntry[]>;
  findKpiEntriesByCategory(userId: string, category: string): Promise<KpiEntry[]>;
  deleteKpiEntry(id: string): Promise<void>;
}
