import { prisma } from '../../../shared/infrastructure/prisma.client';
import { BusinessRepository } from '../domain/business.repository';
import { BusinessProfile } from '../domain/business-profile.entity';
import { BusinessMetric } from '../domain/business-metric.entity';

export class PrismaBusinessRepository implements BusinessRepository {
  async saveProfile(profile: BusinessProfile): Promise<BusinessProfile> {
    const p = await prisma.businessProfile.upsert({
      where: { userId: profile.userId },
      create: {
        industry: profile.industry,
        size: profile.size,
        revenueRange: profile.revenueRange,
        productsServices: profile.productsServices,
        processes: profile.processes,
        customerSegments: profile.customerSegments,
        userId: profile.userId,
      },
      update: {
        industry: profile.industry,
        size: profile.size,
        revenueRange: profile.revenueRange,
        productsServices: profile.productsServices,
        processes: profile.processes,
        customerSegments: profile.customerSegments,
      },
    });
    return new BusinessProfile(p);
  }

  async getProfileByUserId(userId: string): Promise<BusinessProfile | null> {
    const p = await prisma.businessProfile.findUnique({ where: { userId } });
    return p ? new BusinessProfile(p) : null;
  }

  async saveMetric(metric: BusinessMetric): Promise<BusinessMetric> {
    const p = await prisma.businessMetric.create({
      data: {
        name: metric.name,
        value: metric.value,
        period: metric.period,
        trend: metric.trend,
        userId: metric.userId,
      },
    });
    return new BusinessMetric({
      ...p,
      trend: p.trend || undefined
    });
  }

  async getMetricsByUserId(userId: string): Promise<BusinessMetric[]> {
    const items = await prisma.businessMetric.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    return items.map(m => new BusinessMetric({
      ...m,
      trend: m.trend || undefined
    }));
  }
}
