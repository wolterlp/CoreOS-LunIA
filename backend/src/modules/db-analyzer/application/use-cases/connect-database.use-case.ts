import { DatabaseConnection } from '../../domain/database-connection.entity';
import { DBConnectionRepository } from '../../domain/db-connection.repository';
import { ConnectDatabaseDto } from '../dto/connect-database.dto';
import { randomUUID } from 'crypto';

export class ConnectDatabaseUseCase {
  constructor(private readonly dbConnectionRepository: DBConnectionRepository) {}

  async execute(dto: ConnectDatabaseDto, userId: string): Promise<DatabaseConnection> {
    const connection = new DatabaseConnection({
      id: randomUUID(),
      name: dto.name,
      type: dto.type,
      host: dto.host,
      port: dto.port,
      database: dto.database,
      username: dto.username,
      password: dto.password,
      ssl: dto.ssl,
      isActive: true,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this.dbConnectionRepository.save(connection);
  }
}
