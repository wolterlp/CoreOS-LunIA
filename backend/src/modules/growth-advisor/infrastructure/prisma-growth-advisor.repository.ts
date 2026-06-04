import { prisma } from '../../../shared/infrastructure/prisma.client';
import { GrowthRecommendation, RecommendationCategory, RecommendationPriority, RecommendationStatus } from '../domain/growth-recommendation.entity';
import { KpiEntry, KpiCategory, KpiPeriod } from '../domain/kpi-entry.entity';
import { GrowthAdvisorRepository } from '../domain/growth-advisor.repository';

export class PrismaGrowthAdvisorRepository implements GrowthAdvisorRepository {
  private toRecommendation(p: any): GrowthRecommendation {
    return new GrowthRecommendation({
      id: p.id,
      title: p.title,
      description: p.description,
      category: p.category as RecommendationCategory,
      priority: p.priority as RecommendationPriority,
      impact: p.impact,
      status: p.status as RecommendationStatus,
      userId: p.userId,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    });
  }

  private toKpiEntry(p: any): KpiEntry {
    return new KpiEntry({
      id: p.id,
      name: p.name,
      category: p.category as KpiCategory,
      value: p.value,
      target: p.target,
      unit: p.unit,
      period: p.period as KpiPeriod,
      recordedAt: p.recordedAt,
      userId: p.userId,
      createdAt: p.createdAt,
    });
  }

  async saveRecommendation(recommendation: GrowthRecommendation): Promise<GrowthRecommendation> {
    const p = await prisma.growthRecommendation.create({
      data: {
        id: recommendation.id,
        title: recommendation.title,
        description: recommendation.description,
        category: recommendation.category,
        priority: recommendation.priority,
        impact: recommendation.impact,
        status: recommendation.status,
        userId: recommendation.userId,
      },
    });
    return this.toRecommendation(p);
  }

  async findRecommendationById(id: string): Promise<GrowthRecommendation | null> {
    const p = await prisma.growthRecommendation.findUnique({ where: { id } });
    return p ? this.toRecommendation(p) : null;
  }

  async findRecommendationsByUserId(userId: string): Promise<GrowthRecommendation[]> {
    const items = await prisma.growthRecommendation.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    return items.map(this.toRecommendation);
  }

  async updateRecommendation(recommendation: GrowthRecommendation): Promise<GrowthRecommendation> {
    const p = await prisma.growthRecommendation.update({
      where: { id: recommendation.id },
      data: {
        title: recommendation.title,
        description: recommendation.description,
        category: recommendation.category,
        priority: recommendation.priority,
        impact: recommendation.impact,
        status: recommendation.status,
      },
    });
    return this.toRecommendation(p);
  }

  async deleteRecommendation(id: string): Promise<void> {
    await prisma.growthRecommendation.delete({ where: { id } });
  }

  async saveKpiEntry(entry: KpiEntry): Promise<KpiEntry> {
    const p = await prisma.kpiEntry.create({
      data: {
        id: entry.id,
        name: entry.name,
        category: entry.category,
        value: entry.value,
        target: entry.target,
        unit: entry.unit,
        period: entry.period,
        recordedAt: entry.recordedAt,
        userId: entry.userId,
      },
    });
    return this.toKpiEntry(p);
  }

  async findKpiEntriesByUserId(userId: string, period?: string): Promise<KpiEntry[]> {
    const where: any = { userId };
    if (period) where.period = period;
    const items = await prisma.kpiEntry.findMany({ where, orderBy: { recordedAt: 'desc' } });
    return items.map(this.toKpiEntry);
  }

  async findKpiEntriesByCategory(userId: string, category: string): Promise<KpiEntry[]> {
    const items = await prisma.kpiEntry.findMany({ where: { userId, category }, orderBy: { recordedAt: 'desc' } });
    return items.map(this.toKpiEntry);
  }

  async deleteKpiEntry(id: string): Promise<void> {
    await prisma.kpiEntry.delete({ where: { id } });
  }
}
