import { PrismaClient } from '@prisma/client';
import { MemoryEntry, MemoryType } from '../domain/memory-entry.entity';
import { MemoryRepository } from '../domain/memory.repository';
import { config } from '../../../config';

const prisma = new PrismaClient({
  datasources: { db: { url: config.db.url } },
});

export class PrismaMemoryRepository implements MemoryRepository {
  private toDomain(p: any): MemoryEntry {
    return new MemoryEntry({
      id: p.id,
      type: p.type as MemoryType,
      title: p.title,
      content: p.content,
      tags: p.tags,
      metadata: p.metadata,
      userId: p.userId,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    });
  }

  async save(entry: MemoryEntry): Promise<MemoryEntry> {
    const p = await prisma.memoryEntry.create({
      data: {
        id: entry.id,
        type: entry.type,
        title: entry.title,
        content: entry.content,
        tags: entry.tags,
        metadata: entry.metadata,
        userId: entry.userId,
      },
    });
    return this.toDomain(p);
  }

  async findById(id: string): Promise<MemoryEntry | null> {
    const p = await prisma.memoryEntry.findUnique({ where: { id } });
    return p ? this.toDomain(p) : null;
  }

  async findByUserId(userId: string): Promise<MemoryEntry[]> {
    const items = await prisma.memoryEntry.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    return items.map(this.toDomain);
  }

  async findByType(userId: string, type: string): Promise<MemoryEntry[]> {
    const items = await prisma.memoryEntry.findMany({ where: { userId, type: type as any }, orderBy: { createdAt: 'desc' } });
    return items.map(this.toDomain);
  }

  async findByTags(userId: string, tags: string[]): Promise<MemoryEntry[]> {
    const items = await prisma.memoryEntry.findMany({ where: { userId, tags: { hasSome: tags } }, orderBy: { createdAt: 'desc' } });
    return items.map(this.toDomain);
  }

  async search(userId: string, query: string): Promise<MemoryEntry[]> {
    const items = await prisma.memoryEntry.findMany({
      where: { userId, OR: [{ title: { contains: query } }, { content: { contains: query } }] },
      orderBy: { createdAt: 'desc' },
    });
    return items.map(this.toDomain);
  }

  async update(entry: MemoryEntry): Promise<MemoryEntry> {
    const p = await prisma.memoryEntry.update({
      where: { id: entry.id },
      data: {
        title: entry.title,
        content: entry.content,
        tags: entry.tags,
        metadata: entry.metadata,
      },
    });
    return this.toDomain(p);
  }

  async delete(id: string): Promise<void> {
    await prisma.memoryEntry.delete({ where: { id } });
  }
}
