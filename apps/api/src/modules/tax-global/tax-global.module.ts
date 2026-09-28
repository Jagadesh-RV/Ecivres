import { Module } from '@nestjs/common';
import { RegionalTaxCalculatorService } from './services/regional-tax-calculator.service';
import { TaxGlobalController } from './tax-global.controller';

@Module({
  controllers: [TaxGlobalController],
  providers: [RegionalTaxCalculatorService],
  exports: [RegionalTaxCalculatorService],
})
export class TaxGlobalModule {}
