import { prisma } from '../../../../shared/infrastructure/prisma.client';
import { AlertSeverity } from '@prisma/client';

export class CheckRulesUseCase {
  async execute(userId: string) {
    const rules = await prisma.alertRule.findMany({ where: { userId, enabled: true } });

    for (const rule of rules) {
      // In a real system, we'd fetch the latest value of the metric
      // For MVP, we simulate a check
      const currentValue = Math.random() * 100;
      let triggered = false;

      if (rule.condition === '>' && currentValue > rule.threshold) triggered = true;
      if (rule.condition === '<' && currentValue < rule.threshold) triggered = true;
      if (rule.condition === '=' && currentValue === rule.threshold) triggered = true;

      if (triggered) {
        await prisma.alert.create({
          data: {
            title: `Umbral alcanzado: ${rule.metric}`,
            description: `El valor actual (${currentValue.toFixed(2)}) ha superado el umbral de ${rule.threshold}.`,
            severity: rule.severity,
            userId
          }
        });
      }
    }
  }
}
