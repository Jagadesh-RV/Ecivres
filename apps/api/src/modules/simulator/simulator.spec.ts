import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { ScenarioSimulatorService } from './services/scenario-simulator.service';
import { PricingSimulatorService } from './services/pricing-simulator.service';
import { TakeRateSimulatorService } from './services/take-rate-simulator.service';
import { IncentiveSimulatorService } from './services/incentive-simulator.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ScenarioType } from './dto/run-simulation.dto';

describe('ScenarioSimulatorService', () => {
  let service: ScenarioSimulatorService;

  const mockPrisma = {
    whatIfSimulation: {
      create: jest.fn().mockResolvedValue({ id: 'sim-123' }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScenarioSimulatorService,
        PricingSimulatorService,
        TakeRateSimulatorService,
        IncentiveSimulatorService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ScenarioSimulatorService>(ScenarioSimulatorService);
  });

  it('should simulate surge pricing scenario cleanly', async () => {
    const res = await service.executeSimulation({
      scenarioType: ScenarioType.SURGE_PRICING,
      parameterChangePct: 15,
      region: 'GLOBAL',
    });

    expect(res).toBeDefined();
    expect(res.id).toBe('sim-123');
    expect(res.gmvDeltaPct).toBeDefined();
    expect(res.recommendation).toBeDefined();
  });

  it('should simulate take rate adjustment scenario cleanly', async () => {
    const res = await service.executeSimulation({
      scenarioType: ScenarioType.TAKE_RATE_ADJUSTMENT,
      parameterChangePct: -3,
    });

    expect(res).toBeDefined();
    expect(res.id).toBe('sim-123');
    expect(res.revenueDeltaPct).toBeDefined();
  });
});
