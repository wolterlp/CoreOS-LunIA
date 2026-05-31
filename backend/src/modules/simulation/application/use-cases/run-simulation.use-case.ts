import { SimulationScenario } from '../../domain/simulation-scenario.entity';
import { SimulationRepository } from '../../domain/simulation.repository';
import { NotFoundError, AppError } from '../../../../shared/errors';
import { AIProvider } from '../../../../shared/ai.provider';

export class RunSimulationUseCase {
  constructor(
    private readonly simulationRepository: SimulationRepository,
    private readonly aiProvider: AIProvider,
  ) {}

  async execute(id: string, userId: string): Promise<SimulationScenario> {
    const scenario = await this.simulationRepository.findById(id);
    if (!scenario || scenario.userId !== userId) {
      throw new NotFoundError('Simulation scenario not found');
    }

    const prompt = `Act as a business simulation engine. Given these business variables:
${JSON.stringify(scenario.variables, null, 2)}

Generate a simulation with:
1. Best case scenario
2. Most probable scenario  
3. Worst case scenario

For each scenario, provide: expected revenue, costs, profit margin, and key risks.
Return as JSON.`;

    const response = await this.aiProvider.generateText(prompt);
    
    let results: Record<string, any>;
    try {
      results = JSON.parse(response.content);
    } catch {
      throw new AppError('Failed to parse simulation results from AI');
    }

    const updated = new SimulationScenario({
      ...scenario['props'],
      results,
      status: 'COMPLETED',
      updatedAt: new Date(),
    });

    return await this.simulationRepository.update(updated);
  }
}
