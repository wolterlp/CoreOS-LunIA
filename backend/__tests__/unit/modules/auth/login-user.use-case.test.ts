import { LoginUserUseCase } from '../../../../src/modules/auth/application/use-cases/login-user.use-case';
import { User, Role } from '../../../../src/modules/auth/domain/user.entity';

describe('LoginUserUseCase', () => {
  let useCase: LoginUserUseCase;
  let mockUserRepository: any;
  let mockPasswordHasher: any;
  let mockJwtService: any;
  let mockDate: Date;

  beforeEach(() => {
    mockDate = new Date('2025-01-01');

    mockUserRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    };

    mockPasswordHasher = {
      compare: jest.fn(),
      hash: jest.fn(),
    };

    mockJwtService = {
      generateToken: jest.fn().mockResolvedValue('mock-token'),
      verify: jest.fn(),
    };

    useCase = new LoginUserUseCase(mockUserRepository, mockPasswordHasher, mockJwtService);
  });

  it('should login successfully with valid credentials', async () => {
    const mockUser = new User({
      id: 'user-1',
      email: 'test@example.com',
      password: 'hashed-pass',
      name: 'Test User',
      role: Role.MANAGER,
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
      deletedAt: null,
    });

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockPasswordHasher.compare.mockResolvedValue(true);

    const result = await useCase.execute({ email: 'test@example.com', password: 'correct-pass' });

    expect(result.user.email).toBe('test@example.com');
    expect(result.token).toBe('mock-token');
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockPasswordHasher.compare).toHaveBeenCalledWith('correct-pass', 'hashed-pass');
    expect(mockJwtService.generateToken).toHaveBeenCalledWith(mockUser);
  });

  it('should throw error for invalid email', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({ email: 'nonexistent@example.com', password: 'any-pass' })
    ).rejects.toThrow('Invalid credentials');
  });

  it('should throw error for wrong password', async () => {
    const mockUser = new User({
      id: 'user-1',
      email: 'test@example.com',
      password: 'hashed-pass',
      name: 'Test User',
      role: Role.VIEWER,
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
      deletedAt: null,
    });

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockPasswordHasher.compare.mockResolvedValue(false);

    await expect(
      useCase.execute({ email: 'test@example.com', password: 'wrong-pass' })
    ).rejects.toThrow('Invalid credentials');
  });

  it('should throw error for deleted account', async () => {
    const deletedUser = new User({
      id: 'user-2',
      email: 'deleted@example.com',
      password: 'hashed',
      name: 'Deleted',
      role: Role.VIEWER,
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
      deletedAt: new Date(),
    });

    mockUserRepository.findByEmail.mockResolvedValue(deletedUser);

    await expect(
      useCase.execute({ email: 'deleted@example.com', password: 'any-pass' })
    ).rejects.toThrow('Account is disabled');
  });

  it('should throw error for inactive account', async () => {
    const inactiveUser = new User({
      id: 'user-3',
      email: 'inactive@example.com',
      password: 'hashed',
      name: 'Inactive',
      role: Role.VIEWER,
      isActive: false,
      createdAt: mockDate,
      updatedAt: mockDate,
      deletedAt: null,
    });

    mockUserRepository.findByEmail.mockResolvedValue(inactiveUser);

    await expect(
      useCase.execute({ email: 'inactive@example.com', password: 'any-pass' })
    ).rejects.toThrow('Account is inactive');
  });
});
