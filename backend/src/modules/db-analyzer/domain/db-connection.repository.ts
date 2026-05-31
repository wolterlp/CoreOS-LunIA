import { DatabaseConnection } from './database-connection.entity';
import { TableSchema } from './table-schema.entity';
import { QueryLog } from './query-log.entity';

export interface DBConnectionRepository {
  save(connection: DatabaseConnection): Promise<DatabaseConnection>;
  findById(id: string): Promise<DatabaseConnection | null>;
  findByUserId(userId: string): Promise<DatabaseConnection[]>;
  update(connection: DatabaseConnection): Promise<DatabaseConnection>;
  delete(id: string): Promise<void>;

  saveSchema(schema: TableSchema): Promise<TableSchema>;
  findSchemasByConnectionId(connectionId: string): Promise<TableSchema[]>;
  deleteSchemasByConnectionId(connectionId: string): Promise<void>;

  saveQueryLog(log: QueryLog): Promise<QueryLog>;
  findQueryLogsByConnectionId(connectionId: string): Promise<QueryLog[]>;
}
