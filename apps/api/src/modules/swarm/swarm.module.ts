import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { PricingAgentService } from './services/pricing-agent.service';
import { SupplyAgentService } from './services/supply-agent.service';
import { RiskAgentService } from './services/risk-agent.service';
import { SwarmConsensusService } from './services/swarm-consensus.service';

@Module({
  imports: [PrismaModule],
  providers: [
    PricingAgentService,
    SupplyAgentService,
    RiskAgentService,
    SwarmConsensusService,
  ],
  exports: [
    PricingAgentService,
    SupplyAgentService,
    RiskAgentService,
    SwarmConsensusService,
  ],
})
export class SwarmModule {}
