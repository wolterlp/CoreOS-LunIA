// src/modules/auth/application/use-cases/get-profile.use-case.ts

import { User } from '../../domain/user.entity';
import { UserRepository } from '../../domain/user.repository';
import { NotFoundError } from '../../../../shared/errors';

export class GetProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }
}