export class BusinessProfile {
  id?: string;
  industry!: string;
  size!: string;
  revenueRange!: string;
  productsServices!: string[];
  processes!: string[];
  customerSegments!: string[];
  userId!: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: Partial<BusinessProfile>) {
    Object.assign(this, props);
  }
}
