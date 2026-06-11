import { prisma } from '../infrastructure/prisma.client';

export class ConfigService {
  private static instance: ConfigService;
  private cache: Map<string, string> = new Map();
  private lastUpdate: number = 0;
  private CACHE_TTL = 60000; // 1 minute

  private constructor() {}

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  async get(key: string): Promise<string | undefined> {
    const now = Date.now();
    if (now - this.lastUpdate > this.CACHE_TTL) {
      await this.refreshCache();
    }
    return this.cache.get(key) || process.env[key];
  }

  private async refreshCache() {
    try {
      const settings = await prisma.systemSetting.findMany();
      this.cache.clear();
      settings.forEach(s => {
        if (s.value) {
          this.cache.set(s.key, s.value);
        }
      });
      this.lastUpdate = Date.now();
    } catch (error) {
      console.error('Error refreshing config cache', error);
    }
  }
}
