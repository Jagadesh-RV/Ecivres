import { Module } from '@nestjs/common';
import { WhitelabelTenantService } from './services/whitelabel-tenant.service';
import { BrandThemeConfigService } from './services/brand-theme-config.service';
import { RevenueShareCalculatorService } from './services/revenue-share-calculator.service';
import { WhitelabelController } from './whitelabel.controller';

@Module({
  controllers: [WhitelabelController],
  providers: [WhitelabelTenantService, BrandThemeConfigService, RevenueShareCalculatorService],
  exports: [WhitelabelTenantService, BrandThemeConfigService, RevenueShareCalculatorService],
})
export class WhitelabelModule {}
