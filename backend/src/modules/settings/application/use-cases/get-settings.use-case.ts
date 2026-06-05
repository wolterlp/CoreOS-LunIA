import { SettingsRepository } from '../../domain/settings.repository';
import { SystemSetting } from '../../domain/system-setting.entity';

export class GetSettingsUseCase {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  async execute(): Promise<SystemSetting[]> {
    const settings = await this.settingsRepository.findAll();
    // Mask secrets for UI
    return settings.map(s => {
      if (s.isSecret && s.value) {
        return new SystemSetting({
          ...s,
          value: '********'
        });
      }
      return s;
    });
  }
}
