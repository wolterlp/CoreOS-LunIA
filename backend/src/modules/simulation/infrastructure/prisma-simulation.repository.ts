import { PrismaClient } from '@prisma/client';
import { SimulationScenario } from '../domain/simulation-scenario.entity';
import { SimulationRepository } from '../domain/simulation.repository';
import { config } from '../../../config';

const prisma = new PrismaClient({
  datasources: { db: { url: config.db.url } },
});

export class PrismaSimulationRepository implements SimulationRepository {
  private toDomain(p: any): SimulationScenario {
    return new SimulationScenario({
      id: p.id,
      name: p.name,
      description: p.description,
      variables: p.variables,
      results: p.results,
      status: p.status,
      userId: p.userId,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    });
  }

  async save(scenario: SimulationScenario): Promise<SimulationScenario> {
    const p = await prisma.simulationScenario.create({
      data: {
        id: scenario.id,
        name: scenario.name,
        description: scenario.description,
        variables: scenario.variables,
        status: scenario.status,
        userId: scenario.userId,
      },
    });
    return this.toDomain(p);
  }

  async findById(id: string): Promise<SimulationScenario | null> {
    const p = await prisma.simulationScenario.findUnique({ where: { id } });
    return p ? this.toDomain(p) : null;
  }

  async findByUserId(userId: string): Promise<SimulationScenario[]> {
    const items = await prisma.simulationScenario.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    return items.map(this.toDomain);
  }

  async update(scenario: SimulationScenario): Promise<SimulationScenario> {
    const p = await prisma.simulationScenario.update({
      where: { id: scenario.id },
      data: {
        name: scenario.name,
        description: scenario.description,
        variables: scenario.variables,
        results: scenario.results,
        status: scenario.status,
      },
    });
    return this.toDomain(p);
  }

  async delete(id: string): Promise<void> {
    await prisma.simulationScenario.delete({ where: { id } });
  }
}
