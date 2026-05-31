import { SimulationScenario } from './simulation-scenario.entity';

export interface SimulationRepository {
  save(scenario: SimulationScenario): Promise<SimulationScenario>;
  findById(id: string): Promise<SimulationScenario | null>;
  findByUserId(userId: string): Promise<SimulationScenario[]>;
  update(scenario: SimulationScenario): Promise<SimulationScenario>;
  delete(id: string): Promise<void>;
}
