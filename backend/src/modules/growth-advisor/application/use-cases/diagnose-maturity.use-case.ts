import { prisma } from '../../../../shared/infrastructure/prisma.client';
import { AIProvider } from '../../../../shared/ai.provider';

export class DiagnoseMaturityUseCase {
  constructor(private readonly aiProvider: AIProvider) {}

  async execute(userId: string) {
    const profile = await prisma.businessProfile.findUnique({ where: { userId } });
    const memories = await prisma.memoryEntry.findMany({ where: { userId }, take: 10 });
    const agents = await prisma.agent.findMany({ where: { userId } });

    const prompt = `
      Analiza la madurez de esta empresa basado en:
      PERFIL: ${JSON.stringify(profile)}
      HISTORIAL: ${memories.map(m => m.title).join(', ')}
      AGENTES ACTIVOS: ${agents.length}

      Asigna una puntuación del 1 al 10 para:
      - organizationLevel
      - technologyLevel
      - financialLevel
      - commercialLevel

      Responde ÚNICAMENTE en JSON.
    `;

    const aiRes = await this.aiProvider.generateText(prompt);
    let scores: any;
    try {
        scores = JSON.parse(aiRes.content);
    } catch {
        scores = { organizationLevel: 5, technologyLevel: 5, financialLevel: 5, commercialLevel: 5 };
    }

    const overallScore = Math.round((scores.organizationLevel + scores.technologyLevel + scores.financialLevel + scores.commercialLevel) / 4);

    return await prisma.maturityDiagnosis.create({
      data: {
        ...scores,
        overallScore,
        userId
      }
    });
  }
}
