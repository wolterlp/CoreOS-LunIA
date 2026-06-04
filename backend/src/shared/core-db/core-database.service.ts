import * as fs from 'fs';
import * as path from 'path';
import { CoreDbCollection, CoreDbConfig } from './core-database.types';

const DEFAULT_CONFIG: CoreDbConfig = {
  dataDir: path.resolve(process.cwd(), '.coreos'),
  autoSync: true,
  syncIntervalMs: 5000,
};

class CoreCollection<T extends { id: string }> implements CoreDbCollection<T> {
  private documents: Map<string, T> = new Map();
  private dirty = false;
  private syncTimer: NodeJS.Timeout | null = null;

  constructor(
    private name: string,
    private filePath: string,
    private config: CoreDbConfig,
  ) {
    this.load();
    if (config.autoSync) {
      this.syncTimer = setInterval(() => this.sync(), config.syncIntervalMs);
    }
  }

  private load(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const docs: T[] = JSON.parse(raw);
        this.documents = new Map(docs.map(d => [d.id, d]));
      }
    } catch (err) {
      console.warn(`[CoreDB] Error loading collection "${this.name}":`, err);
    }
  }

  private sync(): void {
    if (!this.dirty) return;
    try {
      const docs = Array.from(this.documents.values());
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(docs, null, 2), 'utf-8');
      this.dirty = false;
    } catch (err) {
      console.error(`[CoreDB] Error syncing collection "${this.name}":`, err);
    }
  }

  flush(): void {
    this.sync();
  }

  destroy(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
    this.sync();
  }

  findMany(filter?: Partial<T>): T[] {
    const docs = Array.from(this.documents.values());
    if (!filter || Object.keys(filter).length === 0) return docs;
    return docs.filter(doc =>
      Object.entries(filter).every(([key, val]) => (doc as any)[key] === val)
    );
  }

  findById(id: string): T | undefined {
    return this.documents.get(id);
  }

  findOne(filter: Partial<T>): T | undefined {
    return this.findMany(filter)[0];
  }

  insertOne(doc: T): T {
    this.documents.set(doc.id, doc);
    this.dirty = true;
    return doc;
  }

  updateById(id: string, update: Partial<T>): T | undefined {
    const existing = this.documents.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...update, id };
    this.documents.set(id, updated);
    this.dirty = true;
    return updated;
  }

  deleteById(id: string): boolean {
    const existed = this.documents.has(id);
    this.documents.delete(id);
    if (existed) this.dirty = true;
    return existed;
  }

  count(filter?: Partial<T>): number {
    return this.findMany(filter).length;
  }

  upsert(filter: Partial<T>, doc: T): T {
    const existing = this.findOne(filter);
    if (existing) {
      return this.updateById(existing.id, doc) as T;
    }
    return this.insertOne(doc);
  }
}

export class CoreDatabase {
  private collections: Map<string, CoreCollection<any>> = new Map();
  private config: CoreDbConfig;

  constructor(config?: Partial<CoreDbConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    if (!fs.existsSync(this.config.dataDir)) {
      fs.mkdirSync(this.config.dataDir, { recursive: true });
    }
    console.log(`[CoreDB] Initialized at ${this.config.dataDir}`);
  }

  collection<T extends { id: string }>(name: string): CoreDbCollection<T> {
    if (!this.collections.has(name)) {
      const filePath = path.join(this.config.dataDir, `${name}.json`);
      const col = new CoreCollection<T>(name, filePath, this.config);
      this.collections.set(name, col);
    }
    return this.collections.get(name)!;
  }

  flush(): void {
    for (const col of this.collections.values()) {
      col.flush();
    }
  }

  destroy(): void {
    for (const col of this.collections.values()) {
      col.destroy();
    }
    this.collections.clear();
  }
}

let coreDbInstance: CoreDatabase | null = null;

export function initCoreDb(customPath?: string): CoreDatabase {
  if (!coreDbInstance) {
    const dir = customPath || process.env.COREDB_PATH || path.resolve(process.cwd(), '.coreos');
    coreDbInstance = new CoreDatabase({ dataDir: dir });
  }
  return coreDbInstance;
}

export function getCoreDb(): CoreDatabase {
  if (!coreDbInstance) throw new Error('[CoreDB] Not initialized. Call initCoreDb() first.');
  return coreDbInstance;
}
