import { Agent, AgentType, AgentStatus } from '../../../../src/modules/agents/domain/agent.entity';
import { AgentTask, TaskStatus } from '../../../../src/modules/agents/domain/agent-task.entity';

describe('Agent Entity', () => {
  const mockDate = new Date('2025-01-01');

  const validProps = {
    id: 'agent-1',
    name: 'Marketing Analyzer',
    type: AgentType.MARKETING,
    status: AgentStatus.ACTIVE,
    config: { model: 'gpt-4' },
    userId: 'user-1',
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  it('should create an agent with valid props', () => {
    const agent = new Agent(validProps);
    expect(agent.id).toBe('agent-1');
    expect(agent.name).toBe('Marketing Analyzer');
    expect(agent.type).toBe(AgentType.MARKETING);
    expect(agent.status).toBe(AgentStatus.ACTIVE);
  });

  it('should detect if agent is active', () => {
    const active = new Agent({ ...validProps, status: AgentStatus.ACTIVE });
    const idle = new Agent({ ...validProps, status: AgentStatus.IDLE });
    const error = new Agent({ ...validProps, status: AgentStatus.ERROR });

    expect(active.isActive()).toBe(true);
    expect(idle.isActive()).toBe(false);
    expect(error.isActive()).toBe(false);
  });

  it('should detect coordinator type', () => {
    const coordinator = new Agent({ ...validProps, type: AgentType.COORDINATOR });
    const marketing = new Agent({ ...validProps, type: AgentType.MARKETING });

    expect(coordinator.isCoordinator()).toBe(true);
    expect(marketing.isCoordinator()).toBe(false);
  });
});

describe('AgentTask Entity', () => {
  const mockDate = new Date('2025-01-01');

  const validProps = {
    id: 'task-1',
    title: 'Analyze Q4 data',
    description: 'Run analysis on quarterly sales',
    status: TaskStatus.PENDING,
    result: undefined,
    agentId: 'agent-1',
    assignedBy: 'user-1',
    createdAt: mockDate,
    completedAt: undefined,
  };

  it('should create a task with PENDING status', () => {
    const task = new AgentTask(validProps);
    expect(task.title).toBe('Analyze Q4 data');
    expect(task.status).toBe(TaskStatus.PENDING);
    expect(task.isCompleted()).toBe(false);
    expect(task.isFailed()).toBe(false);
  });

  it('should detect completed status', () => {
    const completed = new AgentTask({
      ...validProps,
      status: TaskStatus.COMPLETED,
      result: { success: true },
      completedAt: new Date(),
    });
    expect(completed.isCompleted()).toBe(true);
    expect(completed.result).toEqual({ success: true });
  });

  it('should detect failed status', () => {
    const failed = new AgentTask({
      ...validProps,
      status: TaskStatus.FAILED,
      result: { error: 'timeout' },
    });
    expect(failed.isFailed()).toBe(true);
    expect(failed.isCompleted()).toBe(false);
  });
});
