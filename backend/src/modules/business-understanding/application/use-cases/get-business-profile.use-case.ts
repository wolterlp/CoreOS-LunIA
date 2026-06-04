import { BusinessRepository } from '../../domain/business.repository';
import { BusinessProfile } from '../../domain/business-profile.entity';

export class GetBusinessProfileUseCase {
  constructor(private readonly businessRepository: BusinessRepository) {}

  async execute(userId: string): Promise<BusinessProfile | null> {
    return await this.businessRepository.getProfileByUserId(userId);
  }
}
