
// src/modules/auth/domain/user.entity.ts

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  FINANCE = 'FINANCE',
  HR = 'HR',
  OPERATIONS = 'OPERATIONS',
  VIEWER = 'VIEWER',
}

export interface UserProps {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class User {
  constructor(private readonly props: UserProps) {}

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get name(): string {
    return this.props.name;
  }

  get role(): Role {
    return this.props.role;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | null | undefined {
    return this.props.deletedAt;
  }

  isAdmin(): boolean {
    return this.props.role === Role.ADMIN;
  }

  isManager(): boolean {
    return this.props.role === Role.MANAGER;
  }

  isFinance(): boolean {
    return this.props.role === Role.FINANCE;
  }

  isHR(): boolean {
    return this.props.role === Role.HR;
  }

  isOperations(): boolean {
    return this.props.role === Role.OPERATIONS;
  }

  hasRole(role: Role): boolean {
    return this.props.role === role;
  }

  isDeleted(): boolean {
    return this.props.deletedAt !== null && this.props.deletedAt !== undefined;
  }
}

