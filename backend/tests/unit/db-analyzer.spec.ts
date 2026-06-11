import { describe, it, expect, vi } from 'vitest';
import { ExecuteQueryUseCase } from '../../src/modules/db-analyzer/application/use-cases/execute-query.use-case';

describe('ExecuteQueryUseCase - Security', () => {
  const mockRepo = {
    findById: vi.fn(),
    findSchemasByConnectionId: vi.fn(),
    saveQueryLog: vi.fn(log => log)
  };
  const mockAI = { generateText: vi.fn() };

  const useCase = new ExecuteQueryUseCase(mockRepo as any, mockAI as any);

  it('should allow SELECT for regular users', async () => {
    mockRepo.findById.mockResolvedValue({ userId: 'u1', type: 'postgres' });
    mockAI.generateText.mockResolvedValue({ content: '[]' });

    const result = await useCase.execute('c1', { query: 'SELECT * FROM users' }, 'u1', 'MANAGER');
    expect(result.query).toBe('SELECT * FROM users');
  });

  it('should block DROP for non-admin users', async () => {
    mockRepo.findById.mockResolvedValue({ userId: 'u1', type: 'postgres' });

    await expect(
      useCase.execute('c1', { query: 'DROP TABLE users' }, 'u1', 'MANAGER')
    ).rejects.toThrow('Read-only mode');
  });
});
