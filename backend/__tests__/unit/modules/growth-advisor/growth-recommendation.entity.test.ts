import { GrowthRecommendation } from '../../../../src/modules/growth-advisor/domain/growth-recommendation.entity';

describe('GrowthRecommendation Entity', () => {
  const mockDate = new Date('2025-01-01');

  const validProps = {
    id: 'rec-1',
    title: 'Expand to Latin America',
    description: 'Market analysis shows high potential',
    category: 'STRATEGY' as const,
    priority: 'HIGH' as const,
    impact: 'Potential 30% revenue increase',
    status: 'ACTIVE' as const,
    userId: 'user-1',
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  it('should create a recommendation', () => {
    const rec = new GrowthRecommendation(validProps);
    expect(rec.title).toBe('Expand to Latin America');
    expect(rec.category).toBe('STRATEGY');
    expect(rec.priority).toBe('HIGH');
  });

  it('should detect high priority', () => {
    const high = new GrowthRecommendation(validProps);
    const low = new GrowthRecommendation({ ...validProps, priority: 'LOW' });
    expect(high.isHighPriority()).toBe(true);
    expect(low.isHighPriority()).toBe(false);
  });

  it('should detect active status', () => {
    const active = new GrowthRecommendation(validProps);
    const implemented = new GrowthRecommendation({ ...validProps, status: 'IMPLEMENTED' });
    expect(active.isActive()).toBe(true);
    expect(implemented.isActive()).toBe(false);
  });
});
