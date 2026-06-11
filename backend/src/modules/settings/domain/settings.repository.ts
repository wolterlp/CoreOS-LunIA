import { SystemSetting } from '../domain/system-setting.entity';

export interface SettingsRepository {
  findAll(): Promise<SystemSetting[]>;
  findByKey(key: string): Promise<SystemSetting | null>;
  save(setting: SystemSetting): Promise<SystemSetting>;
  update(key: string, value: string): Promise<SystemSetting>;
}
