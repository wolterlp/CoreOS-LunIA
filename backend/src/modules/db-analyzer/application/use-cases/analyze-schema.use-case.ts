import { DBConnectionRepository } from '../../domain/db-connection.repository';
import { TableSchema } from '../../domain/table-schema.entity';
import { NotFoundError } from '../../../../shared/errors';
import { randomUUID } from 'crypto';
import { AIProvider } from '../../../../shared/ai.provider';

export class AnalyzeSchemaUseCase {
  constructor(
    private readonly dbConnectionRepository: DBConnectionRepository,
    private readonly aiProvider: AIProvider,
  ) {}

  async execute(connectionId: string, userId: string): Promise<TableSchema[]> {
    const connection = await this.dbConnectionRepository.findById(connectionId);
    if (!connection || connection.userId !== userId) {
      throw new NotFoundError('Database connection not found');
    }

    const prompt = `Given a ${connection.type} database named "${connection.database}" on ${connection.host}:${connection.port}, simulate a comprehensive business schema analysis.

The analysis should include tables typical for a growing enterprise, such as:
- Sales/Transactions (including foreign keys to customers and products)
- Customers (with contact info and status)
- Inventory/Products (with stock levels and categories)
- Employees/HR (with roles and departments)
- Financial/Invoices (with dates and amounts)

Generate a realistic list of at least 8 tables with their columns (name, type, nullable, isPrimaryKey).
Return ONLY a valid JSON array: [{ tableName: string, columns: [{ name, type, nullable, isPrimaryKey }], rowCount: number }]`;

    const response = await this.aiProvider.generateText(prompt);

    let tables: any[];
    try {
      tables = JSON.parse(response.content);
    } catch {
      tables = [];
    }

    await this.dbConnectionRepository.deleteSchemasByConnectionId(connectionId);

    const schemas: TableSchema[] = [];
    for (const table of tables) {
      const schema = new TableSchema({
        id: randomUUID(),
        tableName: table.tableName,
        columns: table.columns,
        rowCount: table.rowCount,
        connectionId,
        analyzedAt: new Date(),
      });
      schemas.push(await this.dbConnectionRepository.saveSchema(schema));
    }

    return schemas;
  }
}
