export interface CoreDbCollection<T = any> {
  findMany(filter?: Partial<T>): T[];
  findById(id: string): T | undefined;
  findOne(filter: Partial<T>): T | undefined;
  insertOne(doc: T): T;
  updateById(id: string, update: Partial<T>): T | undefined;
  deleteById(id: string): boolean;
  count(filter?: Partial<T>): number;
  upsert(filter: Partial<T>, doc: T): T;
}

export interface CoreDbConfig {
  dataDir: string;
  autoSync: boolean;
  syncIntervalMs: number;
}
