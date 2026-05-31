import { Agent } from '../../domain/agent.entity';
import { AgentRepository } from '../../domain/agent.repository';
import { NotFoundError } from '../../../../shared/errors';

export interface AgentStatusResponse {
  agent: Agent;
  pendingTasks: number;
}

export class GetAgentStatusUseCase {
  constructor(private readonly agentRepository: AgentRepository) {}

  async execute(agentId: string): Promise<AgentStatusResponse> {
    const agent = await this.agentRepository.findById(agentId);
    if (!agent) {
      throw new NotFoundError('Agent not found');
    }

    const tasks = await this.agentRepository.findTasksByAgentId(agentId);
    const pendingTasks = tasks.filter(t => !t.isCompleted() && !t.isFailed()).length;

    return { agent, pendingTasks };
  }
}
