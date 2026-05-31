import { MemoryEntry } from './memory-entry.entity';

export interface MemoryRepository {
  save(entry: MemoryEntry): Promise<MemoryEntry>;
  findById(id: string): Promise<MemoryEntry | null>;
  findByUserId(userId: string): Promise<MemoryEntry[]>;
  findByType(userId: string, type: string): Promise<MemoryEntry[]>;
  findByTags(userId: string, tags: string[]): Promise<MemoryEntry[]>;
  search(userId: string, query: string): Promise<MemoryEntry[]>;
  update(entry: MemoryEntry): Promise<MemoryEntry>;
  delete(id: string): Promise<void>;
}
