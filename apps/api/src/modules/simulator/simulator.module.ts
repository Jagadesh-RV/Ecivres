import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { PricingSimulatorService } from './services/pricing-simulator.service';
import { TakeRateSimulatorService } from './services/take-rate-simulator.service';
import { IncentiveSimulatorService } from './services/incentive-simulator.service';
import { ScenarioSimulatorService } from './services/scenario-simulator.service';

@Module({
  imports: [PrismaModule],
  providers: [
    PricingSimulatorService,
    TakeRateSimulatorService,
    IncentiveSimulatorService,
    ScenarioSimulatorService,
  ],
  exports: [
    PricingSimulatorService,
    TakeRateSimulatorService,
    IncentiveSimulatorService,
    ScenarioSimulatorService,
  ],
})
export class SimulatorModule {}
