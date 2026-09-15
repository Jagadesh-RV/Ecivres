import { Module } from '@nestjs/common';
import { MultiCurrencyService } from './multi-currency.service';
import { RegionalTaxService } from './regional-tax.service';
import { GlobalizationController } from './globalization.controller';

@Module({
  controllers: [GlobalizationController],
  providers: [MultiCurrencyService, RegionalTaxService],
  exports: [MultiCurrencyService, RegionalTaxService],
})
export class GlobalizationModule {}
