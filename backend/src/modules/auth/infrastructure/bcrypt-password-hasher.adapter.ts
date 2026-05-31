// src/modules/auth/infrastructure/bcrypt-password-hasher.adapter.ts

import bcrypt from 'bcrypt';
import { PasswordHasher } from '../domain/password-hasher.port';

export class BcryptPasswordHasher implements PasswordHasher {
  private readonly saltRounds = 12;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}