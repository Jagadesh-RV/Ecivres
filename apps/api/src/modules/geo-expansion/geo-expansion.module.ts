import { Module } from '@nestjs/common';
import { GeographicExpansionService } from './services/geographic-expansion.service';
import { LocalizationConfigService } from './services/localization-config.service';
import { CrossBorderMarketplaceService } from './services/cross-border-marketplace.service';
import { GeoExpansionController } from './geo-expansion.controller';

@Module({
  controllers: [GeoExpansionController],
  providers: [GeographicExpansionService, LocalizationConfigService, CrossBorderMarketplaceService],
  exports: [GeographicExpansionService, LocalizationConfigService, CrossBorderMarketplaceService],
})
export class GeoExpansionModule {}
