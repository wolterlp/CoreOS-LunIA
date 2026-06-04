import { KpiEntry } from '../../../../src/modules/growth-advisor/domain/kpi-entry.entity';

describe('KpiEntry Entity', () => {
  const mockDate = new Date('2025-01-01');

  const validProps = {
    id: 'kpi-1',
    name: 'Monthly Revenue',
    category: 'FINANCIAL' as const,
    value: 150000,
    target: 200000,
    unit: 'USD',
    period: 'MONTHLY' as const,
    recordedAt: mockDate,
    userId: 'user-1',
    createdAt: mockDate,
  };

  it('should create a KPI entry', () => {
    const entry = new KpiEntry(validProps);
    expect(entry.name).toBe('Monthly Revenue');
    expect(entry.value).toBe(150000);
    expect(entry.target).toBe(200000);
  });

  it('should calculate achievement percentage', () => {
    const entry = new KpiEntry(validProps);
    expect(entry.achievement).toBe(75);
  });

  it('should return null achievement when no target', () => {
    const entry = new KpiEntry({ ...validProps, target: undefined });
    expect(entry.achievement).toBeNull();
  });

  it('should detect on-track status', () => {
    const onTrack = new KpiEntry({ ...validProps, value: 180000, target: 200000 });
    const offTrack = new KpiEntry({ ...validProps, value: 100000, target: 200000 });
    const noTarget = new KpiEntry({ ...validProps, target: undefined });

    expect(onTrack.isOnTrack()).toBe(true);
    expect(offTrack.isOnTrack()).toBe(false);
    expect(noTarget.isOnTrack()).toBeNull();
  });
});
