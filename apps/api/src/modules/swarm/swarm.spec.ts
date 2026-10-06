import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { SwarmConsensusService } from './services/swarm-consensus.service';
import { PricingAgentService } from './services/pricing-agent.service';
import { SupplyAgentService } from './services/supply-agent.service';
import { RiskAgentService } from './services/risk-agent.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('SwarmConsensusService', () => {
  let service: SwarmConsensusService;

  const mockPrisma = {
    autonomousDecisionLog: {
      create: jest.fn().mockResolvedValue({ id: 'swarm-123' }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SwarmConsensusService,
        PricingAgentService,
        SupplyAgentService,
        RiskAgentService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<SwarmConsensusService>(SwarmConsensusService);
  });

  it('should approve proposal with supermajority consensus', async () => {
    const res = await service.negotiateAndDecide({
      title: 'Moderate Peak Surge',
      proposedAction: 'SURGE_PRICING',
      proposedValue: 20,
    });

    expect(res).toBeDefined();
    expect(res.id).toBe('swarm-123');
    expect(res.finalDecision).toBe('APPROVED');
    expect(res.consensusReached).toBe(true);
    expect(res.votes.length).toBe(3);
  });

  it('should reject proposal when RiskAgent vetoes high surge', async () => {
    const res = await service.negotiateAndDecide({
      title: 'Aggressive Peak Surge',
      proposedAction: 'SURGE_PRICING',
      proposedValue: 45,
    });

    expect(res.finalDecision).toBe('REJECTED');
    expect(res.consensusReached).toBe(false);
  });
});
