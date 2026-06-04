import { CreateSimulationUseCase } from '../../../../src/modules/simulation/application/use-cases/create-simulation.use-case';
import { SimulationScenario } from '../../../../src/modules/simulation/domain/simulation-scenario.entity';

describe('CreateSimulationUseCase', () => {
  let useCase: CreateSimulationUseCase;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn().mockImplementation((scenario: SimulationScenario) => Promise.resolve(scenario)),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new CreateSimulationUseCase(mockRepository);
  });

  it('should create a simulation scenario successfully', async () => {
    const dto = {
      name: 'Test Simulation',
      description: 'A test',
      variables: { growthRate: 0.1 },
    };

    const result = await useCase.execute(dto, 'user-1');

    expect(result.name).toBe('Test Simulation');
    expect(result.description).toBe('A test');
    expect(result.variables).toEqual({ growthRate: 0.1 });
    expect(result.status).toBe('DRAFT');
    expect(result.userId).toBe('user-1');
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should create simulation without optional description', async () => {
    const dto = {
      name: 'Minimal Simulation',
      variables: { test: true },
    };

    const result = await useCase.execute(dto, 'user-1');

    expect(result.name).toBe('Minimal Simulation');
    expect(result.description).toBeUndefined();
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  });
});
