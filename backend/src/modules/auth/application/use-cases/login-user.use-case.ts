
// src/modules/auth/application/use-cases/login-user.use-case.ts

import { UserRepository } from '../../domain/user.repository';
import { PasswordHasher } from '../../domain/password-hasher.port';
import { JwtService } from '../../domain/jwt.service.port';
import { LoginDto } from '../dto/login.dto';
import { AppError, UnauthorizedError } from '../../../../shared/errors';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (user.isDeleted()) {
      throw new UnauthorizedError('Account is disabled');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is inactive');
    }

    const isPasswordValid = await this.passwordHasher.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = await this.jwtService.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}

