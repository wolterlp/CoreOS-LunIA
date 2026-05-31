import { Agent, AgentType, AgentStatus } from '../../domain/agent.entity';
import { AgentRepository } from '../../domain/agent.repository';
import { CreateAgentDto } from '../dto/create-agent.dto';
import { randomUUID } from 'crypto';

export class CreateAgentUseCase {
  constructor(private readonly agentRepository: AgentRepository) {}

  async execute(dto: CreateAgentDto, userId: string): Promise<Agent> {
    const agent = new Agent({
      id: randomUUID(),
      name: dto.name,
      type: dto.type as AgentType,
      status: AgentStatus.IDLE,
      config: dto.config,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this.agentRepository.save(agent);
  }
}
