export class BusinessMetric {
  id?: string;
  name!: string;
  value!: number;
  period!: string;
  trend?: string;
  userId!: string;
  createdAt?: Date;

  constructor(props: Partial<BusinessMetric>) {
    Object.assign(this, props);
  }
}
