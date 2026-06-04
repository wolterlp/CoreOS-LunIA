import { SecretaryRepository } from '../../domain/secretary.repository';
import { AIProvider } from '../../../../shared/ai.provider';
import { MemoryRepository } from '../../../memory/domain/memory.repository';

export class ScheduleEventUseCase {
  constructor(
    private readonly secretaryRepository: SecretaryRepository,
    private readonly memoryRepository: MemoryRepository,
    private readonly aiProvider: AIProvider
  ) {}

  async execute(dto: any, userId: string) {
    // Enrich with context using AI
    const memories = await this.memoryRepository.findByUserId(userId);
    const topMemories = memories.slice(0, 5);
    const contextStr = topMemories.map(m => `[${m.type}] ${m.title}`).join(', ');

    const prompt = `
      El usuario quiere agendar un evento: "${dto.title}" para el ${dto.date}.
      CONTEXTO EMPRESARIAL RECIENTE: ${contextStr}

      Genera una descripción breve para el evento que incluya contexto relevante del negocio
      o sugerencias para la reunión.
    `;

    const aiRes = await this.aiProvider.generateText(prompt);

    return await this.secretaryRepository.createEvent({
      ...dto,
      description: aiRes.content,
      userId
    });
  }
}
