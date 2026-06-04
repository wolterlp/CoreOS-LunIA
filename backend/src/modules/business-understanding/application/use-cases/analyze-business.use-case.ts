import { BusinessRepository } from '../../domain/business.repository';
import { BusinessProfile } from '../../domain/business-profile.entity';
import { AIProvider } from '../../../../shared/ai.provider';
import { DBConnectionRepository } from '../../../db-analyzer/domain/db-connection.repository';
import { NotFoundError } from '../../../../shared/errors';

export class AnalyzeBusinessUseCase {
  constructor(
    private readonly businessRepository: BusinessRepository,
    private readonly dbRepository: DBConnectionRepository,
    private readonly aiProvider: AIProvider
  ) {}

  async execute(connectionId: string, userId: string): Promise<BusinessProfile> {
    const connection = await this.dbRepository.findById(connectionId);
    if (!connection || connection.userId !== userId) {
      throw new NotFoundError('Database connection not found');
    }

    const schemas = await this.dbRepository.findSchemasByConnectionId(connectionId);

    const prompt = `
      Analiza la estructura de esta base de datos empresarial y deduce el modelo de negocio.
      TABLAS Y COLUMNAS:
      ${JSON.stringify(schemas.map(s => ({ table: s.tableName, columns: s.columns })), null, 2)}

      Responde ÚNICAMENTE en formato JSON con los campos:
      - industry: Industria principal
      - size: Tamaño estimado (Pequeña, Mediana, Corporación)
      - revenueRange: Rango de ingresos (estimado por tablas)
      - productsServices: Lista de productos o servicios detectados
      - processes: Procesos de negocio clave (ej: Ventas, Producción, Logística)
      - customerSegments: Tipos de clientes detectados
    `;

    const response = await this.aiProvider.generateText(prompt);
    let data: any;
    try {
      data = JSON.parse(response.content);
    } catch (e) {
      // Fallback simple
      data = {
        industry: 'Desconocida',
        size: 'Mediana',
        revenueRange: 'No determinado',
        productsServices: [],
        processes: [],
        customerSegments: []
      };
    }

    const profile = new BusinessProfile({
      ...data,
      userId
    });

    return await this.businessRepository.saveProfile(profile);
  }
}
