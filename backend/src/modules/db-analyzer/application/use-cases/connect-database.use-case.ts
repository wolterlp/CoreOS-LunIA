import { DatabaseConnection } from '../../domain/database-connection.entity';
import { DBConnectionRepository } from '../../domain/db-connection.repository';
import { ConnectDatabaseDto } from '../dto/connect-database.dto';
import { randomUUID } from 'crypto';

function parseConnectionString(cs: string): Partial<ConnectDatabaseDto> {
  try {
    const url = new URL(cs);
    return {
      type: url.protocol.replace(':', ''),
      host: url.hostname,
      port: parseInt(url.port, 10) || 5432,
      database: url.pathname.replace('/', ''),
      username: url.username,
      password: url.password,
    };
  } catch {
    return {};
  }
}

export class ConnectDatabaseUseCase {
  constructor(private readonly dbConnectionRepository: DBConnectionRepository) {}

  async execute(dto: ConnectDatabaseDto, userId: string): Promise<DatabaseConnection> {
    let parsed = { type: dto.type, host: dto.host, port: dto.port, database: dto.database, username: dto.username, password: dto.password };

    if (dto.connectionString) {
      parsed = { ...parsed, ...parseConnectionString(dto.connectionString) };
    }

    const connection = new DatabaseConnection({
      id: randomUUID(),
      name: dto.name,
      type: parsed.type || 'postgresql',
      host: parsed.host || '',
      port: parsed.port || 5432,
      database: parsed.database || '',
      username: parsed.username || '',
      password: parsed.password || '',
      ssl: dto.ssl,
      isActive: true,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this.dbConnectionRepository.save(connection);
  }
}
