
// src/modules/auth/domain/jwt.service.port.ts

import { User } from './user.entity';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface JwtService {
  generateToken(user: User): Promise<string>;
  verifyToken(token: string): Promise<JwtPayload>;
}

