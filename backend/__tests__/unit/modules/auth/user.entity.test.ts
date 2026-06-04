import { User, Role } from '../../../../src/modules/auth/domain/user.entity';

describe('User Entity', () => {
  const mockDate = new Date('2025-01-01');

  const validProps = {
    id: 'user-1',
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User',
    role: Role.MANAGER,
    isActive: true,
    createdAt: mockDate,
    updatedAt: mockDate,
    deletedAt: null,
  };

  it('should create a user with valid props', () => {
    const user = new User(validProps);
    expect(user.id).toBe('user-1');
    expect(user.email).toBe('test@example.com');
    expect(user.name).toBe('Test User');
    expect(user.role).toBe(Role.MANAGER);
    expect(user.isActive).toBe(true);
  });

  it('should default role to VIEWER', () => {
    const user = new User({ ...validProps, role: Role.VIEWER });
    expect(user.role).toBe(Role.VIEWER);
  });

  it('should identify admin role via isAdmin()', () => {
    const admin = new User({ ...validProps, role: Role.ADMIN });
    const manager = new User({ ...validProps, role: Role.MANAGER });
    expect(admin.isAdmin()).toBe(true);
    expect(manager.isAdmin()).toBe(false);
  });

  it('should identify manager role via isManager()', () => {
    const manager = new User({ ...validProps, role: Role.MANAGER });
    expect(manager.isManager()).toBe(true);
  });

  it('should detect deleted user', () => {
    const active = new User(validProps);
    const deleted = new User({ ...validProps, deletedAt: new Date() });
    expect(active.isDeleted()).toBe(false);
    expect(deleted.isDeleted()).toBe(true);
  });

  it('should check role with hasRole()', () => {
    const user = new User({ ...validProps, role: Role.FINANCE });
    expect(user.hasRole(Role.FINANCE)).toBe(true);
    expect(user.hasRole(Role.ADMIN)).toBe(false);
  });
});
