import { BusinessProfile } from './business-profile.entity';
import { AnalysisReport } from './analysis-report.entity';

export interface BusinessUnderstandingRepository {
  saveProfile(profile: BusinessProfile): Promise<BusinessProfile>;
  findProfileById(id: string): Promise<BusinessProfile | null>;
  findProfileByUserId(userId: string): Promise<BusinessProfile | null>;
  updateProfile(profile: BusinessProfile): Promise<BusinessProfile>;
  saveReport(report: AnalysisReport): Promise<AnalysisReport>;
  findReportById(id: string): Promise<AnalysisReport | null>;
  findReportsByProfileId(profileId: string): Promise<AnalysisReport[]>;
  findReportsByUserId(userId: string): Promise<AnalysisReport[]>;
  deleteReport(id: string): Promise<void>;
}
