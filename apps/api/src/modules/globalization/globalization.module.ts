import { Module } from '@nestjs/common';
import { MultiCurrencyService } from './multi-currency.service';
import { RegionalTaxService } from './regional-tax.service';
import { ContentTranslatorService } from './content-translator.service';
import { GlobalizationController } from './globalization.controller';

@Module({
  controllers: [GlobalizationController],
  providers: [MultiCurrencyService, RegionalTaxService, ContentTranslatorService],
  exports: [MultiCurrencyService, RegionalTaxService, ContentTranslatorService],
})
export class GlobalizationModule {}
