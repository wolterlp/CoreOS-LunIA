import { MemoryRepository } from '../../domain/memory.repository';
import { NotFoundError } from '../../../../shared/errors';

export class DeleteMemoryUseCase {
  constructor(private readonly memoryRepository: MemoryRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const entry = await this.memoryRepository.findById(id);
    if (!entry || entry.userId !== userId) {
      throw new NotFoundError('Memory entry not found');
    }
    await this.memoryRepository.delete(id);
  }
}
