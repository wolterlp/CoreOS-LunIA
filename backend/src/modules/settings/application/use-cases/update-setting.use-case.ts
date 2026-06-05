import { SettingsRepository } from '../../domain/settings.repository';
import { SystemSetting } from '../../domain/system-setting.entity';

export class UpdateSettingUseCase {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  async execute(key: string, value: string): Promise<SystemSetting> {
    const existing = await this.settingsRepository.findByKey(key);
    if (!existing) {
      // If it doesn't exist, we might want to prevent creation of arbitrary keys
      // but for this MVP we can allow it or just update existing ones.
      throw new Error(`Setting ${key} not found`);
    }

    // If it's a secret and user sent '********', don't update it
    if (existing.isSecret && value === '********') {
      return existing;
    }

    return await this.settingsRepository.update(key, value);
  }
}
