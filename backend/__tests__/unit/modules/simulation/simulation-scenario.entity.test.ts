import { SimulationScenario } from '../../../../src/modules/simulation/domain/simulation-scenario.entity';

describe('SimulationScenario Entity', () => {
  const mockDate = new Date('2025-01-01');

  const validProps = {
    id: 'sim-1',
    name: 'Growth Projection 2025',
    description: 'Best case scenario',
    variables: { growthRate: 0.15, investment: 100000 },
    results: undefined,
    status: 'DRAFT',
    userId: 'user-1',
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  it('should create a simulation scenario', () => {
    const scenario = new SimulationScenario(validProps);
    expect(scenario.id).toBe('sim-1');
    expect(scenario.name).toBe('Growth Projection 2025');
    expect(scenario.variables).toEqual({ growthRate: 0.15, investment: 100000 });
  });

  it('should detect DRAFT status', () => {
    const draft = new SimulationScenario(validProps);
    expect(draft.isDraft()).toBe(true);
    expect(draft.isCompleted()).toBe(false);
  });

  it('should detect COMPLETED status', () => {
    const completed = new SimulationScenario({
      ...validProps,
      status: 'COMPLETED',
      results: { npv: 50000, irr: 0.12 },
    });
    expect(completed.isCompleted()).toBe(true);
    expect(completed.isDraft()).toBe(false);
    expect(completed.results).toEqual({ npv: 50000, irr: 0.12 });
  });

  it('should handle optional description', () => {
    const withDesc = new SimulationScenario(validProps);
    const withoutDesc = new SimulationScenario({ ...validProps, description: undefined });

    expect(withDesc.description).toBe('Best case scenario');
    expect(withoutDesc.description).toBeUndefined();
  });
});
