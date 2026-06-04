import { BusinessProfile } from './business-profile.entity';
import { BusinessMetric } from './business-metric.entity';

export interface BusinessRepository {
  saveProfile(profile: BusinessProfile): Promise<BusinessProfile>;
  getProfileByUserId(userId: string): Promise<BusinessProfile | null>;
  saveMetric(metric: BusinessMetric): Promise<BusinessMetric>;
  getMetricsByUserId(userId: string): Promise<BusinessMetric[]>;
}
