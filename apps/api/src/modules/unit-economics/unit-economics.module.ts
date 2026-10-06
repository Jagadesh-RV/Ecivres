import { Module } from '@nestjs/common';
import { MarketplaceEconomicsService } from './services/marketplace-economics.service';
import { LtvCacCalculatorService } from './services/ltv-cac-calculator.service';
import { UnitEconomicsService } from './services/unit-economics.service';
import { UnitEconomicsController } from './unit-economics.controller';

@Module({
  controllers: [UnitEconomicsController],
  providers: [MarketplaceEconomicsService, LtvCacCalculatorService, UnitEconomicsService],
  exports: [MarketplaceEconomicsService, LtvCacCalculatorService, UnitEconomicsService],
})
export class UnitEconomicsModule {}
