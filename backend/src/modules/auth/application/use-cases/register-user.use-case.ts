
// src/modules/auth/application/use-cases/register-user.use-case.ts

import { User, Role } from '../../domain/user.entity';
import { UserRepository } from '../../domain/user.repository';
import { PasswordHasher } from '../../domain/password-hasher.port';
import { RegisterDto } from '../dto/register.dto';
import { AppError } from '../../../../shared/errors';
import { randomUUID } from 'crypto';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(dto: RegisterDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new AppError('Email already registered', 409, 'Conflict');
    }

    const hashedPassword = await this.passwordHasher.hash(dto.password);

    const user = new User({
      id: randomUUID(),
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      role: dto.role as Role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this.userRepository.save(user);
  }
}

