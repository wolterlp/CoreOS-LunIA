import { MemoryEntry, MemoryType } from '../../domain/memory-entry.entity';
import { MemoryRepository } from '../../domain/memory.repository';
import { CreateMemoryDto } from '../dto/create-memory.dto';
import { randomUUID } from 'crypto';

export class CreateMemoryUseCase {
  constructor(private readonly memoryRepository: MemoryRepository) {}

  async execute(dto: CreateMemoryDto, userId: string): Promise<MemoryEntry> {
    const entry = new MemoryEntry({
      id: randomUUID(),
      type: dto.type as MemoryType,
      title: dto.title,
      content: dto.content,
      tags: dto.tags,
      metadata: dto.metadata,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this.memoryRepository.save(entry);
  }
}
