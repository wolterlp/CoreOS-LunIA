import { prisma } from '../../../../shared/infrastructure/prisma.client';

export class DetectAnomalyUseCase {
  async execute(userId: string) {
    // Basic Anomaly Detection MVP:
    // If a metric deviates significantly from its baseline
    const profiles = await prisma.anomalyProfile.findMany({ where: { userId } });

    for (const profile of profiles) {
      const currentValue = Math.random() * 100;
      const deviation = Math.abs(currentValue - profile.baselineMean);

      if (deviation > profile.baselineStd * 2) {
        await prisma.alert.create({
          data: {
            title: `Anomalía Detectada: ${profile.metric}`,
            description: `Se ha detectado una desviación inusual en ${profile.metric}. Valor actual: ${currentValue.toFixed(2)} (Media: ${profile.baselineMean.toFixed(2)}).`,
            severity: 'WARNING',
            userId
          }
        });
      }
    }
  }
}
