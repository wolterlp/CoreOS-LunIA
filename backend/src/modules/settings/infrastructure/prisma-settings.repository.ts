import { prisma } from '../../../shared/infrastructure/prisma.client';
import { SettingsRepository } from '../domain/settings.repository';
import { SystemSetting } from '../domain/system-setting.entity';

export class PrismaSettingsRepository implements SettingsRepository {
  async findAll(): Promise<SystemSetting[]> {
    const items = await prisma.systemSetting.findMany();
    return items.map(item => new SystemSetting({
      ...item,
      description: item.description || undefined
    }));
  }

  async findByKey(key: string): Promise<SystemSetting | null> {
    const item = await prisma.systemSetting.findUnique({ where: { key } });
    if (!item) return null;
    return new SystemSetting({
      ...item,
      description: item.description || undefined
    });
  }

  async save(setting: SystemSetting): Promise<SystemSetting> {
    const item = await prisma.systemSetting.upsert({
      where: { key: setting.key },
      create: {
        key: setting.key,
        value: setting.value,
        category: setting.category,
        description: setting.description,
        isSecret: setting.isSecret,
      },
      update: {
        value: setting.value,
        category: setting.category,
        description: setting.description,
        isSecret: setting.isSecret,
      },
    });
    return new SystemSetting({
      ...item,
      description: item.description || undefined
    });
  }

  async update(key: string, value: string): Promise<SystemSetting> {
    const item = await prisma.systemSetting.update({
      where: { key },
      data: { value },
    });
    return new SystemSetting({
      ...item,
      description: item.description || undefined
    });
  }
}
