export class SystemSetting {
  id!: string;
  key!: string;
  value!: string;
  category!: string;
  description?: string;
  isSecret!: boolean;
  updatedAt!: Date;

  constructor(props: Partial<SystemSetting>) {
    Object.assign(this, props);
  }
}
