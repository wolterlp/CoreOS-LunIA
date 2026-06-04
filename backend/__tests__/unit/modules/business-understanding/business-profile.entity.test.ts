import { BusinessProfile } from '../../../../src/modules/business-understanding/domain/business-profile.entity';

describe('BusinessProfile Entity', () => {
  const mockDate = new Date('2025-01-01');

  const validProps = {
    id: 'profile-1',
    companyName: 'TechCorp',
    industry: 'Technology',
    size: '50-100',
    description: 'A tech company',
    mission: 'Innovate the future',
    vision: 'Global leader',
    values: ['innovation', 'integrity'],
    userId: 'user-1',
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  it('should create a business profile', () => {
    const profile = new BusinessProfile(validProps);
    expect(profile.companyName).toBe('TechCorp');
    expect(profile.industry).toBe('Technology');
    expect(profile.values).toEqual(['innovation', 'integrity']);
  });

  it('should handle optional fields', () => {
    const profile = new BusinessProfile({
      ...validProps,
      industry: undefined,
      description: undefined,
    });
    expect(profile.industry).toBeUndefined();
    expect(profile.description).toBeUndefined();
  });
});
