export class BusinessProfile {
  id?: string;
  industry!: string;
  size!: string;
  revenueRange!: string;
  productsServices!: string[];
  processes!: string[];
  customerSegments!: string[];
  companyName?: string;
  description?: string;
  mission?: string;
  vision?: string;
  values?: string[];
  userId!: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: Partial<BusinessProfile>) {
    Object.assign(this, props);
  }
}
