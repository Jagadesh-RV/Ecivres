import { Module } from '@nestjs/common';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';
import { ProviderAnalyticsService } from './provider-analytics.service';
import { ProviderStaffService } from './provider-staff.service';
import { ProviderInventoryService } from './provider-inventory.service';
import { ProviderPortfolioService } from './provider-portfolio.service';

@Module({
  controllers: [ProvidersController],
  providers: [
    ProvidersService,
    ProviderAnalyticsService,
    ProviderStaffService,
    ProviderInventoryService,
    ProviderPortfolioService,
  ],
  exports: [
    ProvidersService,
    ProviderAnalyticsService,
    ProviderStaffService,
    ProviderInventoryService,
    ProviderPortfolioService,
  ],
})
export class ProvidersModule {}

