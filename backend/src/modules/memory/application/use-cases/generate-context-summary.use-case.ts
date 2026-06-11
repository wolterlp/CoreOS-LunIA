import { prisma } from '../../../../shared/infrastructure/prisma.client';
import { AIProvider } from '../../../../shared/ai.provider';

export class GenerateContextSummaryUseCase {
  constructor(private readonly aiProvider: AIProvider) {}

  async execute(userId: string): Promise<string> {
    const memories = await prisma.memoryEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    const profile = await prisma.businessProfile.findUnique({ where: { userId } });
    const activeAlerts = await prisma.alert.findMany({ where: { userId, isRead: false }, take: 5 });

    const rawContext = `
      PERFIL: ${JSON.stringify(profile)}
      MEMORIAS: ${memories.map(m => `[${m.type}] ${m.title}: ${m.content}`).join('\n')}
      ALERTAS: ${activeAlerts.map(a => a.title).join(', ')}
    `;

    const prompt = `
      Eres el Resumidor Inteligente del Cerebro Empresarial.
      Toma este contexto crudo y genera un RESUMEN CONDENSADO (máximo 300 palabras) que capture la esencia
      del estado actual, desafíos y objetivos del negocio.
      Este resumen será usado como contexto para otros LLMs para ahorrar tokens y mejorar precisión.

      DATOS CRUDOS:
      ${rawContext}
    `;

    const response = await this.aiProvider.generateText(prompt);
    return response.content;
  }
}
