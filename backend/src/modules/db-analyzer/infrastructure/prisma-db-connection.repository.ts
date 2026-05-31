import { PrismaClient } from '@prisma/client';
import { DatabaseConnection } from '../domain/database-connection.entity';
import { TableSchema } from '../domain/table-schema.entity';
import { QueryLog } from '../domain/query-log.entity';
import { DBConnectionRepository } from '../domain/db-connection.repository';
import { config } from '../../../config';

const prisma = new PrismaClient({
  datasources: { db: { url: config.db.url } },
});

export class PrismaDBConnectionRepository implements DBConnectionRepository {
  private connectionToDomain(p: any): DatabaseConnection {
    return new DatabaseConnection({
      id: p.id,
      name: p.name,
      type: p.type,
      host: p.host,
      port: p.port,
      database: p.database,
      username: p.username,
      password: p.password,
      ssl: p.ssl,
      isActive: p.isActive,
      userId: p.userId,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    });
  }

  private schemaToDomain(p: any): TableSchema {
    return new TableSchema({
      id: p.id,
      tableName: p.tableName,
      columns: p.columns,
      rowCount: p.rowCount,
      connectionId: p.connectionId,
      analyzedAt: p.analyzedAt,
    });
  }

  private queryLogToDomain(p: any): QueryLog {
    return new QueryLog({
      id: p.id,
      query: p.query,
      result: p.result,
      tokensUsed: p.tokensUsed,
      error: p.error,
      connectionId: p.connectionId,
      userId: p.userId,
      executedAt: p.executedAt,
    });
  }

  async save(connection: DatabaseConnection): Promise<DatabaseConnection> {
    const p = await prisma.databaseConnection.create({
      data: {
        id: connection.id,
        name: connection.name,
        type: connection.type,
        host: connection.host,
        port: connection.port,
        database: connection.database,
        username: connection.username,
        password: connection.password,
        ssl: connection.ssl,
        isActive: connection.isActive,
        userId: connection.userId,
      },
    });
    return this.connectionToDomain(p);
  }

  async findById(id: string): Promise<DatabaseConnection | null> {
    const p = await prisma.databaseConnection.findUnique({ where: { id } });
    return p ? this.connectionToDomain(p) : null;
  }

  async findByUserId(userId: string): Promise<DatabaseConnection[]> {
    const items = await prisma.databaseConnection.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    return items.map(this.connectionToDomain);
  }

  async update(connection: DatabaseConnection): Promise<DatabaseConnection> {
    const p = await prisma.databaseConnection.update({
      where: { id: connection.id },
      data: {
        name: connection.name,
        host: connection.host,
        port: connection.port,
        database: connection.database,
        username: connection.username,
        password: connection.password,
        ssl: connection.ssl,
        isActive: connection.isActive,
      },
    });
    return this.connectionToDomain(p);
  }

  async delete(id: string): Promise<void> {
    await prisma.databaseConnection.delete({ where: { id } });
  }

  async saveSchema(schema: TableSchema): Promise<TableSchema> {
    const p = await prisma.tableSchema.create({
      data: {
        id: schema.id,
        tableName: schema.tableName,
        columns: schema.columns,
        rowCount: schema.rowCount,
        connectionId: schema.connectionId,
      },
    });
    return this.schemaToDomain(p);
  }

  async findSchemasByConnectionId(connectionId: string): Promise<TableSchema[]> {
    const items = await prisma.tableSchema.findMany({ where: { connectionId } });
    return items.map(this.schemaToDomain);
  }

  async deleteSchemasByConnectionId(connectionId: string): Promise<void> {
    await prisma.tableSchema.deleteMany({ where: { connectionId } });
  }

  async saveQueryLog(log: QueryLog): Promise<QueryLog> {
    const p = await prisma.queryLog.create({
      data: {
        id: log.id,
        query: log.query,
        result: log.result,
        tokensUsed: log.tokensUsed,
        error: log.error,
        connectionId: log.connectionId,
        userId: log.userId,
      },
    });
    return this.queryLogToDomain(p);
  }

  async findQueryLogsByConnectionId(connectionId: string): Promise<QueryLog[]> {
    const items = await prisma.queryLog.findMany({ where: { connectionId }, orderBy: { executedAt: 'desc' } });
    return items.map(this.queryLogToDomain);
  }
}
