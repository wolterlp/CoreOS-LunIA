import { prisma } from '../infrastructure/prisma.client';
import { OpenAIAdapter } from '../infrastructure/ai/openai.adapter';

export class HeartbeatService {
  private static instance: HeartbeatService;
  private intervalId: NodeJS.Timeout | null = null;
  private readonly INTERVAL_MS = 30 * 60 * 1000; // 30 minutes
  private aiProvider: OpenAIAdapter;

  private constructor() {
    this.aiProvider = new OpenAIAdapter();
  }

  public static getInstance(): HeartbeatService {
    if (!HeartbeatService.instance) {
      HeartbeatService.instance = new HeartbeatService();
    }
    return HeartbeatService.instance;
  }

  public start(): void {
    if (this.intervalId) return;

    console.log('[Heartbeat]: System pulse started. Interval: 30 minutes.');

    // Initial pulse
    this.pulse();

    this.intervalId = setInterval(() => {
      this.pulse();
    }, this.INTERVAL_MS);
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('[Heartbeat]: System pulse stopped.');
    }
  }

  private async pulse(): Promise<void> {
    const now = new Date();
    console.log(`[Heartbeat]: Pulse at ${now.toISOString()} - Checking tasks and pending actions...`);

    try {
      await this.checkPendingTasks();
      await this.checkAutomationRules();
      await this.generateProactiveAlerts();
    } catch (error) {
      console.error('[Heartbeat]: Error during pulse:', error);
    }
  }

  private async checkPendingTasks(): Promise<void> {
    const pendingTasks = await prisma.agentTask.findMany({
      where: { status: 'PENDING' },
      include: { agent: true }
    });

    for (const task of pendingTasks) {
      console.log(`[Heartbeat]: Processing pending task for agent ${task.agent.name}: ${task.title}`);
      // Simulating task processing
      await prisma.agentTask.update({
        where: { id: task.id },
        data: {
          status: 'COMPLETED',
          result: { success: true, message: 'Automated processing by Heartbeat' },
          completedAt: new Date()
        }
      });
    }
  }

  private async checkAutomationRules(): Promise<void> {
    const scheduledRules = await prisma.automationRule.findMany({
      where: {
        isActive: true,
        trigger: 'SCHEDULED'
      }
    });

    for (const rule of scheduledRules) {
      console.log(`[Heartbeat]: Executing scheduled rule: ${rule.name}`);

      await prisma.automationLog.create({
        data: {
          action: JSON.stringify(rule.action),
          status: 'SUCCESS',
          result: { message: 'Executed by Heartbeat' },
          ruleId: rule.id,
          userId: rule.userId
        }
      });

      await prisma.automationRule.update({
        where: { id: rule.id },
        data: { lastRunAt: new Date() }
      });
    }
  }

  private async generateProactiveAlerts(): Promise<void> {
    // Get all users to check their state
    const users = await prisma.user.findMany();

    for (const user of users) {
      // Gather context
      const memories = await prisma.memoryEntry.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      const recentHistory = memories.map(m => `[${m.type}] ${m.title}: ${m.content}`).join('\n');

      const prompt = `
        Eres el Cerebro Empresarial IA (Asesor Económico Senior).
        Analiza la situación reciente de la empresa del usuario y genera una ALERTA PROACTIVA si detectas riesgos o grandes oportunidades.

        CONTEXTO RECIENTE:
        ${recentHistory}

        Responde ÚNICAMENTE en formato JSON con los campos:
        - title: Título corto de la alerta
        - description: Explicación detallada y acción recomendada
        - severity: "INFO", "WARNING" o "CRITICAL"

        Si no hay nada relevante que alertar, responde con {"skip": true}.
      `;

      const response = await this.aiProvider.generateText(prompt, { model: 'gpt-4o' });

      try {
        const result = JSON.parse(response.content);
        if (!result.skip) {
          await prisma.alert.create({
            data: {
              title: result.title,
              description: result.description,
              severity: result.severity || 'INFO',
              userId: user.id
            }
          });
          console.log(`[Heartbeat]: Created proactive alert for ${user.email}: ${result.title}`);
        }
      } catch (e) {
        // Skip if AI doesn't return valid JSON
      }
    }
  }
}
