import { MemoryEntry } from '../../domain/memory-entry.entity';
import { MemoryRepository } from '../../domain/memory.repository';
import { QueryMemoryDto } from '../dto/query-memory.dto';

export class QueryMemoryUseCase {
  constructor(private readonly memoryRepository: MemoryRepository) {}

  async execute(dto: QueryMemoryDto, userId: string): Promise<MemoryEntry[]> {
    if (dto.query) {
      return await this.memoryRepository.search(userId, dto.query);
    }
    if (dto.type) {
      return await this.memoryRepository.findByType(userId, dto.type);
    }
    if (dto.tags && dto.tags.length > 0) {
      return await this.memoryRepository.findByTags(userId, dto.tags);
    }
    return await this.memoryRepository.findByUserId(userId);
  }
}
