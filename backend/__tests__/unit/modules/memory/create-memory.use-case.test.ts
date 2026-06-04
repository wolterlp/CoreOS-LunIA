import { CreateMemoryUseCase } from '../../../../src/modules/memory/application/use-cases/create-memory.use-case';
import { MemoryEntry, MemoryType } from '../../../../src/modules/memory/domain/memory-entry.entity';

describe('CreateMemoryUseCase', () => {
  let useCase: CreateMemoryUseCase;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn().mockImplementation((entry: MemoryEntry) => Promise.resolve(entry)),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findByType: jest.fn(),
      findByTags: jest.fn(),
      search: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new CreateMemoryUseCase(mockRepository);
  });

  it('should create a strategic memory entry', async () => {
    const dto = {
      type: 'STRATEGIC' as const,
      title: 'Market Analysis 2025',
      content: 'Identified 3 new market opportunities',
      tags: ['market', 'opportunities'],
      metadata: { source: 'ai-analysis' },
    };

    const result = await useCase.execute(dto, 'user-1');

    expect(result.type).toBe(MemoryType.STRATEGIC);
    expect(result.title).toBe('Market Analysis 2025');
    expect(result.tags).toEqual(['market', 'opportunities']);
    expect(result.metadata).toEqual({ source: 'ai-analysis' });
    expect(result.userId).toBe('user-1');
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should create memory entry without optional fields', async () => {
    const dto = {
      type: 'OPERATIONAL' as const,
      title: 'Quick Note',
      content: 'Remember to follow up',
      tags: [],
    };

    const result = await useCase.execute(dto, 'user-1');

    expect(result.type).toBe(MemoryType.OPERATIONAL);
    expect(result.title).toBe('Quick Note');
    expect(result.tags).toEqual([]);
    expect(result.metadata).toBeUndefined();
  });
});
