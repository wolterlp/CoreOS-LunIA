import { describe, it, expect, vi } from 'vitest';
import { LoginUserUseCase } from '../../src/modules/auth/application/use-cases/login-user.use-case';

describe('LoginUserUseCase', () => {
  const mockRepo = { findByEmail: vi.fn() };
  const mockHasher = { compare: vi.fn() };
  const mockJwt = { sign: vi.fn() };

  const useCase = new LoginUserUseCase(mockRepo as any, mockHasher as any, mockJwt as any);

  it('should throw error if user not found', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    await expect(useCase.execute({ email: 'test@test.com', password: '123' }))
      .rejects.toThrow('Invalid credentials');
  });

  it('should throw error if password incorrect', async () => {
    mockRepo.findByEmail.mockResolvedValue({
        password: 'hash',
        isActive: true,
        isDeleted: () => false // Added mock method
    });
    mockHasher.compare.mockResolvedValue(false);
    await expect(useCase.execute({ email: 'test@test.com', password: '123' }))
      .rejects.toThrow('Invalid credentials');
  });
});
