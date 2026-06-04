import { CoreDatabase } from '../../../src/shared/core-db/core-database.service';
import * as fs from 'fs';
import * as path from 'path';

describe('CoreDatabase', () => {
  const testDir = path.resolve(process.cwd(), '__tests__', '.coreos-test');
  let db: CoreDatabase;

  beforeEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    db = new CoreDatabase({ dataDir: testDir, autoSync: false });
  });

  afterEach(() => {
    db.destroy();
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should create a collection and insert a document', () => {
    const col = db.collection<{ id: string; name: string; value: number }>('test');
    const doc = { id: '1', name: 'test-doc', value: 42 };
    const result = col.insertOne(doc);
    expect(result).toEqual(doc);
  });

  it('should find document by id', () => {
    const col = db.collection<{ id: string; name: string }>('test');
    col.insertOne({ id: '1', name: 'Alice' });
    col.insertOne({ id: '2', name: 'Bob' });
    expect(col.findById('1')?.name).toBe('Alice');
    expect(col.findById('3')).toBeUndefined();
  });

  it('should find many documents with filter', () => {
    const col = db.collection<{ id: string; role: string }>('users');
    col.insertOne({ id: '1', role: 'admin' });
    col.insertOne({ id: '2', role: 'user' });
    col.insertOne({ id: '3', role: 'user' });

    const admins = col.findMany({ role: 'admin' });
    expect(admins).toHaveLength(1);

    const users = col.findMany({ role: 'user' });
    expect(users).toHaveLength(2);
  });

  it('should find one document by filter', () => {
    const col = db.collection<{ id: string; email: string }>('test');
    col.insertOne({ id: '1', email: 'a@test.com' });
    col.insertOne({ id: '2', email: 'b@test.com' });
    expect(col.findOne({ email: 'a@test.com' })?.id).toBe('1');
  });

  it('should update document by id', () => {
    const col = db.collection<{ id: string; name: string; count: number }>('test');
    col.insertOne({ id: '1', name: 'original', count: 0 });
    col.updateById('1', { name: 'updated', count: 5 });
    expect(col.findById('1')?.name).toBe('updated');
    expect(col.findById('1')?.count).toBe(5);
  });

  it('should delete document by id', () => {
    const col = db.collection<{ id: string }>('test');
    col.insertOne({ id: '1' });
    col.insertOne({ id: '2' });
    expect(col.deleteById('1')).toBe(true);
    expect(col.deleteById('3')).toBe(false);
    expect(col.count()).toBe(1);
  });

  it('should count documents', () => {
    const col = db.collection<{ id: string; active: boolean }>('test');
    col.insertOne({ id: '1', active: true });
    col.insertOne({ id: '2', active: false });
    col.insertOne({ id: '3', active: true });
    expect(col.count()).toBe(3);
    expect(col.count({ active: true })).toBe(2);
  });

  it('should upsert documents', () => {
    const col = db.collection<{ id: string; name: string; score: number }>('test');
    col.upsert({ name: 'Alice' }, { id: '1', name: 'Alice', score: 10 });
    col.upsert({ name: 'Alice' }, { id: '1', name: 'Alice', score: 20 });
    expect(col.count()).toBe(1);
    expect(col.findById('1')?.score).toBe(20);
  });

  it('should persist data to disk on flush', () => {
    const col = db.collection<{ id: string; data: string }>('persist');
    col.insertOne({ id: 'p1', data: 'hello' });
    db.flush();

    const filePath = path.join(testDir, 'persist.json');
    expect(fs.existsSync(filePath)).toBe(true);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    expect(content).toHaveLength(1);
    expect(content[0].data).toBe('hello');
  });

  it('should load persisted data on re-initialization', () => {
    const col = db.collection<{ id: string; value: number }>('reload');
    col.insertOne({ id: 'r1', value: 100 });
    db.flush();
    db.destroy();

    const db2 = new CoreDatabase({ dataDir: testDir, autoSync: false });
    const col2 = db2.collection<{ id: string; value: number }>('reload');
    expect(col2.count()).toBe(1);
    expect(col2.findById('r1')?.value).toBe(100);
    db2.destroy();
  });
});
