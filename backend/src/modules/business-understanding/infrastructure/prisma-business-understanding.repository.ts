import { prisma } from '../../../shared/infrastructure/prisma.client';
import { BusinessProfile } from '../domain/business-profile.entity';
import { AnalysisReport, AnalysisType } from '../domain/analysis-report.entity';
import { BusinessUnderstandingRepository } from '../domain/business-understanding.repository';

export class PrismaBusinessUnderstandingRepository implements BusinessUnderstandingRepository {
  private toProfile(p: any): BusinessProfile {
    return new BusinessProfile({
      id: p.id,
      companyName: p.companyName,
      industry: p.industry,
      size: p.size,
      description: p.description,
      mission: p.mission,
      vision: p.vision,
      values: p.values,
      userId: p.userId,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    });
  }

  private toReport(p: any): AnalysisReport {
    return new AnalysisReport({
      id: p.id,
      type: p.type as AnalysisType,
      title: p.title,
      content: p.content,
      summary: p.summary,
      profileId: p.profileId,
      userId: p.userId,
      createdAt: p.createdAt,
    });
  }

  async saveProfile(profile: BusinessProfile): Promise<BusinessProfile> {
    const p = await prisma.businessProfile.create({
      data: {
        id: profile.id,
        companyName: profile.companyName,
        industry: profile.industry,
        size: profile.size,
        description: profile.description,
        mission: profile.mission,
        vision: profile.vision,
        values: profile.values,
        userId: profile.userId,
      },
    });
    return this.toProfile(p);
  }

  async findProfileById(id: string): Promise<BusinessProfile | null> {
    const p = await prisma.businessProfile.findUnique({ where: { id } });
    return p ? this.toProfile(p) : null;
  }

  async findProfileByUserId(userId: string): Promise<BusinessProfile | null> {
    const p = await prisma.businessProfile.findFirst({ where: { userId } });
    return p ? this.toProfile(p) : null;
  }

  async updateProfile(profile: BusinessProfile): Promise<BusinessProfile> {
    const p = await prisma.businessProfile.update({
      where: { id: profile.id },
      data: {
        companyName: profile.companyName,
        industry: profile.industry,
        size: profile.size,
        description: profile.description,
        mission: profile.mission,
        vision: profile.vision,
        values: profile.values,
      },
    });
    return this.toProfile(p);
  }

  async saveReport(report: AnalysisReport): Promise<AnalysisReport> {
    const p = await prisma.analysisReport.create({
      data: {
        id: report.id,
        type: report.type,
        title: report.title,
        content: report.content,
        summary: report.summary,
        profileId: report.profileId,
        userId: report.userId,
      },
    });
    return this.toReport(p);
  }

  async findReportById(id: string): Promise<AnalysisReport | null> {
    const p = await prisma.analysisReport.findUnique({ where: { id } });
    return p ? this.toReport(p) : null;
  }

  async findReportsByProfileId(profileId: string): Promise<AnalysisReport[]> {
    const items = await prisma.analysisReport.findMany({
      where: { profileId },
      orderBy: { createdAt: 'desc' },
    });
    return items.map(this.toReport);
  }

  async findReportsByUserId(userId: string): Promise<AnalysisReport[]> {
    const items = await prisma.analysisReport.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return items.map(this.toReport);
  }

  async deleteReport(id: string): Promise<void> {
    await prisma.analysisReport.delete({ where: { id } });
  }
}
