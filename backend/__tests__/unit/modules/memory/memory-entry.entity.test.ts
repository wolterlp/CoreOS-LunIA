import { MemoryEntry, MemoryType } from '../../../../src/modules/memory/domain/memory-entry.entity';

describe('MemoryEntry Entity', () => {
  const mockDate = new Date('2025-01-01');

  const validProps = {
    id: 'mem-1',
    type: MemoryType.OPERATIONAL,
    title: 'Sales Report',
    content: 'Q4 sales increased by 15%',
    tags: ['sales', 'q4'],
    metadata: { source: 'dashboard' },
    userId: 'user-1',
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  it('should create a memory entry with valid props', () => {
    const entry = new MemoryEntry(validProps);
    expect(entry.id).toBe('mem-1');
    expect(entry.type).toBe(MemoryType.OPERATIONAL);
    expect(entry.title).toBe('Sales Report');
    expect(entry.tags).toContain('sales');
  });

  it('should identify memory type correctly', () => {
    const operational = new MemoryEntry({ ...validProps, type: MemoryType.OPERATIONAL });
    const strategic = new MemoryEntry({ ...validProps, type: MemoryType.STRATEGIC });
    const learning = new MemoryEntry({ ...validProps, type: MemoryType.LEARNING });

    expect(operational.isOperational()).toBe(true);
    expect(operational.isStrategic()).toBe(false);
    expect(strategic.isStrategic()).toBe(true);
    expect(learning.isLearning()).toBe(true);
  });

  it('should return metadata if provided', () => {
    const entry = new MemoryEntry(validProps);
    expect(entry.metadata).toEqual({ source: 'dashboard' });
  });

  it('should return undefined metadata when not provided', () => {
    const { metadata, ...rest } = validProps;
    const entry = new MemoryEntry({ ...rest, metadata: undefined });
    expect(entry.metadata).toBeUndefined();
  });
});
