
// src/modules/auth/domain/password-hasher.port.ts

export interface PasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

