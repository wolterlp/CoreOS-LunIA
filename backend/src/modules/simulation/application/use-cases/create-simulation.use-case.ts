import { SimulationScenario } from '../../domain/simulation-scenario.entity';
import { SimulationRepository } from '../../domain/simulation.repository';
import { CreateSimulationDto } from '../dto/create-simulation.dto';
import { randomUUID } from 'crypto';

export class CreateSimulationUseCase {
  constructor(private readonly simulationRepository: SimulationRepository) {}

  async execute(dto: CreateSimulationDto, userId: string): Promise<SimulationScenario> {
    const scenario = new SimulationScenario({
      id: randomUUID(),
      name: dto.name,
      description: dto.description,
      variables: dto.variables,
      status: 'DRAFT',
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this.simulationRepository.save(scenario);
  }
}
