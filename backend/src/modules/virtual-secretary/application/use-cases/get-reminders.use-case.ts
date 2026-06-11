import { SecretaryRepository } from '../../domain/secretary.repository';

export class GetRemindersUseCase {
  constructor(private readonly secretaryRepository: SecretaryRepository) {}

  async execute(userId: string) {
    return await this.secretaryRepository.getRemindersByUserId(userId);
  }
}
