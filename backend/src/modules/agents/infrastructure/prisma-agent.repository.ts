import { PrismaClient } from '@prisma/client';
import { Agent, AgentType, AgentStatus } from '../domain/agent.entity';
import { AgentTask, TaskStatus } from '../domain/agent-task.entity';
import { AgentRepository } from '../domain/agent.repository';
import { config } from '../../../config';

const prisma = new PrismaClient({
  datasources: { db: { url: config.db.url } },
});

export class PrismaAgentRepository implements AgentRepository {
  private toDomain(p: any): Agent {
    return new Agent({
      id: p.id,
      name: p.name,
      type: p.type as AgentType,
      status: p.status as AgentStatus,
      config: p.config,
      userId: p.userId,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    });
  }

  private taskToDomain(p: any): AgentTask {
    return new AgentTask({
      id: p.id,
      title: p.title,
      description: p.description,
      status: p.status as TaskStatus,
      result: p.result,
      agentId: p.agentId,
      assignedBy: p.assignedBy,
      createdAt: p.createdAt,
      completedAt: p.completedAt,
    });
  }

  async save(agent: Agent): Promise<Agent> {
    const p = await prisma.agent.create({
      data: {
        id: agent.id,
        name: agent.name,
        type: agent.type,
        status: agent.status,
        config: agent.config,
        userId: agent.userId,
      },
    });
    return this.toDomain(p);
  }

  async findById(id: string): Promise<Agent | null> {
    const p = await prisma.agent.findUnique({ where: { id } });
    return p ? this.toDomain(p) : null;
  }

  async findByUserId(userId: string): Promise<Agent[]> {
    const items = await prisma.agent.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    return items.map(this.toDomain);
  }

  async findByType(userId: string, type: string): Promise<Agent[]> {
    const items = await prisma.agent.findMany({ where: { userId, type }, orderBy: { createdAt: 'desc' } });
    return items.map(this.toDomain);
  }

  async update(agent: Agent): Promise<Agent> {
    const p = await prisma.agent.update({
      where: { id: agent.id },
      data: { name: agent.name, status: agent.status, config: agent.config },
    });
    return this.toDomain(p);
  }

  async delete(id: string): Promise<void> {
    await prisma.agent.delete({ where: { id } });
  }

  async saveTask(task: AgentTask): Promise<AgentTask> {
    const p = await prisma.agentTask.create({
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        agentId: task.agentId,
        assignedBy: task.assignedBy,
      },
    });
    return this.taskToDomain(p);
  }

  async findTaskById(id: string): Promise<AgentTask | null> {
    const p = await prisma.agentTask.findUnique({ where: { id } });
    return p ? this.taskToDomain(p) : null;
  }

  async findTasksByAgentId(agentId: string): Promise<AgentTask[]> {
    const items = await prisma.agentTask.findMany({ where: { agentId }, orderBy: { createdAt: 'desc' } });
    return items.map(this.taskToDomain);
  }

  async updateTask(task: AgentTask): Promise<AgentTask> {
    const p = await prisma.agentTask.update({
      where: { id: task.id },
      data: { status: task.status, result: task.result, completedAt: task.completedAt },
    });
    return this.taskToDomain(p);
  }
}
