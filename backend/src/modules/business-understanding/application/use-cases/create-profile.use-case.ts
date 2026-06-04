import { BusinessProfile } from '../../domain/business-profile.entity';
import { BusinessUnderstandingRepository } from '../../domain/business-understanding.repository';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { randomUUID } from 'crypto';

export class CreateProfileUseCase {
  constructor(private readonly repository: BusinessUnderstandingRepository) {}

  async execute(dto: CreateProfileDto, userId: string): Promise<BusinessProfile> {
    const existing = await this.repository.findProfileByUserId(userId);
    if (existing) {
      const updated = new BusinessProfile({
        id: existing.id,
        userId: existing.userId,
        createdAt: existing.createdAt,
        companyName: dto.companyName,
        industry: dto.industry,
        size: dto.size,
        description: dto.description,
        mission: dto.mission,
        vision: dto.vision,
        values: dto.values,
        updatedAt: new Date(),
      });
      return this.repository.updateProfile(updated);
    }

    const profile = new BusinessProfile({
      id: randomUUID(),
      companyName: dto.companyName,
      industry: dto.industry,
      size: dto.size,
      description: dto.description,
      mission: dto.mission,
      vision: dto.vision,
      values: dto.values,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.repository.saveProfile(profile);
  }
}
