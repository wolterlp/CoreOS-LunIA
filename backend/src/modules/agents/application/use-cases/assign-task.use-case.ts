import { AgentTask, TaskStatus } from '../../domain/agent-task.entity';
import { AgentRepository } from '../../domain/agent.repository';
import { AssignTaskDto } from '../dto/assign-task.dto';
import { NotFoundError } from '../../../../shared/errors';
import { randomUUID } from 'crypto';

export class AssignTaskUseCase {
  constructor(private readonly agentRepository: AgentRepository) {}

  async execute(dto: AssignTaskDto, assignedBy: string): Promise<AgentTask> {
    const agent = await this.agentRepository.findById(dto.agentId);
    if (!agent) {
      throw new NotFoundError('Agent not found');
    }

    const task = new AgentTask({
      id: randomUUID(),
      title: dto.title,
      description: dto.description,
      status: TaskStatus.PENDING,
      agentId: dto.agentId,
      assignedBy,
      createdAt: new Date(),
    });

    return await this.agentRepository.saveTask(task);
  }
}
