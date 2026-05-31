import { Agent } from './agent.entity';
import { AgentTask } from './agent-task.entity';

export interface AgentRepository {
  save(agent: Agent): Promise<Agent>;
  findById(id: string): Promise<Agent | null>;
  findByUserId(userId: string): Promise<Agent[]>;
  findByType(userId: string, type: string): Promise<Agent[]>;
  update(agent: Agent): Promise<Agent>;
  delete(id: string): Promise<void>;

  saveTask(task: AgentTask): Promise<AgentTask>;
  findTaskById(id: string): Promise<AgentTask | null>;
  findTasksByAgentId(agentId: string): Promise<AgentTask[]>;
  updateTask(task: AgentTask): Promise<AgentTask>;
}
