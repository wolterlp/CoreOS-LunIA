import { GrowthRecommendation, RecommendationCategory, RecommendationPriority, RecommendationStatus } from '../../domain/growth-recommendation.entity';
import { GrowthAdvisorRepository } from '../../domain/growth-advisor.repository';
import { CreateRecommendationDto } from '../dto/create-recommendation.dto';
import { randomUUID } from 'crypto';

export class CreateRecommendationUseCase {
  constructor(private readonly repository: GrowthAdvisorRepository) {}

  async execute(dto: CreateRecommendationDto, userId: string): Promise<GrowthRecommendation> {
    const recommendation = new GrowthRecommendation({
      id: randomUUID(),
      title: dto.title,
      description: dto.description,
      category: dto.category as RecommendationCategory,
      priority: dto.priority as RecommendationPriority,
      impact: dto.impact,
      status: 'ACTIVE' as RecommendationStatus,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.repository.saveRecommendation(recommendation);
  }
}
