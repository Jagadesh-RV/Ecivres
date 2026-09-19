import { Module } from '@nestjs/common';
import { PricingBenchmarkService } from './pricing-benchmark.service';
import { RevenueSimulatorService } from './revenue-simulator.service';
import { CommerceIntelController } from './commerce-intel.controller';

@Module({
  controllers: [CommerceIntelController],
  providers: [PricingBenchmarkService, RevenueSimulatorService],
  exports: [PricingBenchmarkService, RevenueSimulatorService],
})
export class CommerceIntelModule {}
