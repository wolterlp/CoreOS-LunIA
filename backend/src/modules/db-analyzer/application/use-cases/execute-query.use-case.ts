import { QueryLog } from '../../domain/query-log.entity';
import { DBConnectionRepository } from '../../domain/db-connection.repository';
import { ExecuteQueryDto } from '../dto/execute-query.dto';
import { NotFoundError } from '../../../../shared/errors';
import { randomUUID } from 'crypto';
import { AIProvider } from '../../../../shared/ai.provider';

export class ExecuteQueryUseCase {
  constructor(
    private readonly dbConnectionRepository: DBConnectionRepository,
    private readonly aiProvider: AIProvider,
  ) {}

  async execute(dto: ExecuteQueryDto, userId: string): Promise<QueryLog> {
    const connection = await this.dbConnectionRepository.findById(dto.connectionId);
    if (!connection || connection.userId !== userId) {
      throw new NotFoundError('Database connection not found');
    }

    let query = dto.query;

    if (dto.naturalLanguage) {
      const schemas = await this.dbConnectionRepository.findSchemasByConnectionId(dto.connectionId);
      const prompt = `Given a ${connection.type} database with these tables:
${JSON.stringify(schemas.map(s => ({ table: s.tableName, columns: s.columns })), null, 2)}

Convert this natural language request to a SQL query (SELECT ONLY, read-only):
"${dto.naturalLanguage}"

Return ONLY the SQL query, no explanation.`;

      const response = await this.aiProvider.generateText(prompt);
      query = response.content.trim();
    }

    // Simulated Result Generation
    const resultPrompt = `Given this SQL query: "${query}"
Generate a realistic JSON result (array of objects) that would return from a database.
Return ONLY valid JSON.`;

    const resultResponse = await this.aiProvider.generateText(resultPrompt);
    let result: any;
    try {
      result = JSON.parse(resultResponse.content);
    } catch {
      result = { message: "Query executed, but could not parse simulated result." };
    }

    const log = new QueryLog({
      id: randomUUID(),
      query,
      result,
      connectionId: dto.connectionId,
      userId,
      executedAt: new Date(),
    });

    return await this.dbConnectionRepository.saveQueryLog(log);
  }
}
