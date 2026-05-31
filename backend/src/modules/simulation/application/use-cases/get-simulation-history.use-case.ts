import { SimulationScenario } from '../../domain/simulation-scenario.entity';
import { SimulationRepository } from '../../domain/simulation.repository';

export class GetSimulationHistoryUseCase {
  constructor(private readonly simulationRepository: SimulationRepository) {}

  async execute(userId: string): Promise<SimulationScenario[]> {
    return await this.simulationRepository.findByUserId(userId);
  }
}
