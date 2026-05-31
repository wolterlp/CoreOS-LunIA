// src/modules/auth/infrastructure/jwt.service.adapter.ts

import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtService, JwtPayload } from '../domain/jwt.service.port';
import { User } from '../domain/user.entity';
import { config } from '../../../config';

export class JwtServiceAdapter implements JwtService {
  async generateToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const options: SignOptions = {
      expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'],
    };

    return jwt.sign(payload, config.jwt.secret, options);
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const payload = jwt.verify(token, config.jwt.secret) as JwtPayload;
      return payload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}