// src/modules/auth/infrastructure/prisma-user.repository.ts

import { PrismaClient } from '@prisma/client';
import { User, Role } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';
import { config } from '../../../config';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: config.db.url,
    },
  },
});

export class PrismaUserRepository implements UserRepository {
  private toDomain(prismaUser: any): User {
    return new User({
      id: prismaUser.id,
      email: prismaUser.email,
      password: prismaUser.password,
      name: prismaUser.name,
      role: prismaUser.role as Role,
      isActive: prismaUser.isActive,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      deletedAt: prismaUser.deletedAt,
    });
  }

  async save(user: User): Promise<User> {
    const prismaUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role as any,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
    return this.toDomain(prismaUser);
  }

  async findById(id: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
    if (!prismaUser) return null;
    return this.toDomain(prismaUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { email, deletedAt: null },
    });
    if (!prismaUser) return null;
    return this.toDomain(prismaUser);
  }

  async update(user: User): Promise<User> {
    const prismaUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        name: user.name,
        role: user.role as any,
        isActive: user.isActive,
        updatedAt: user.updatedAt,
      },
    });
    return this.toDomain(prismaUser);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}