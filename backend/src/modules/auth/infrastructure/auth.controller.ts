
// src/modules/auth/infrastructure/auth.controller.ts

import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../application/use-cases/login-user.use-case';
import { GetProfileUseCase } from '../application/use-cases/get-profile.use-case';
import { PrismaUserRepository } from './prisma-user.repository';
import { BcryptPasswordHasher } from './bcrypt-password-hasher.adapter';
import { JwtServiceAdapter } from './jwt.service.adapter';
import { ResponseHelper } from '../../../shared/response.helper';
import { RegisterDtoSchema } from '../application/dto/register.dto';
import { LoginDtoSchema } from '../application/dto/login.dto';
import { Role } from '../domain/user.entity';

const userRepository = new PrismaUserRepository();
const passwordHasher = new BcryptPasswordHasher();
const jwtService = new JwtServiceAdapter();

const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher);
const loginUserUseCase = new LoginUserUseCase(userRepository, passwordHasher, jwtService);
const getProfileUseCase = new GetProfileUseCase(userRepository);

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = RegisterDtoSchema.parse(req.body);
      const user = await registerUserUseCase.execute(dto);

      ResponseHelper.success(res, {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }, 'User registered successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = LoginDtoSchema.parse(req.body);
      const result = await loginUserUseCase.execute(dto);

      ResponseHelper.success(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const user = await getProfileUseCase.execute(userId);

      ResponseHelper.success(res, {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      }, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

