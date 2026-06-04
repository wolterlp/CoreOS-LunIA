import { prisma } from '../../../../shared/infrastructure/prisma.client';
import { AIProvider } from '../../../../shared/ai.provider';

export class GenerateGrowthPlanUseCase {
  constructor(private readonly aiProvider: AIProvider) {}

  async execute(userId: string) {
    const diagnosis = await prisma.maturityDiagnosis.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });

    const prompt = `
      Genera un PLAN DE CRECIMIENTO basado en este diagnóstico de madurez (Score: ${diagnosis?.overallScore}/10).

      Responde ÚNICAMENTE en JSON con los campos:
      - stage: "INICIAL", "INTERMEDIA" o "AVANZADA"
      - recommendations: Lista de 5 acciones concretas
      - estimatedImpact: Impacto esperado (ej: "Incremento 20% eficiencia")
    `;

    const aiRes = await this.aiProvider.generateText(prompt);
    let plan: any;
    try {
        plan = JSON.parse(aiRes.content);
    } catch {
        plan = { stage: "INICIAL", recommendations: ["Formalizar procesos"], estimatedImpact: "Mejor control" };
    }

    return await prisma.growthPath.create({
      data: {
        ...plan,
        userId
      }
    });
  }
}
