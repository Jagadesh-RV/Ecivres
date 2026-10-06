import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { DemandFeaturesService } from './services/demand-features.service';
import { SupplyFeaturesService } from './services/supply-features.service';
import { FinancialFeaturesService } from './services/financial-features.service';
import { FeatureEngineeringService } from './services/feature-engineering.service';

@Module({
  imports: [PrismaModule],
  providers: [
    DemandFeaturesService,
    SupplyFeaturesService,
    FinancialFeaturesService,
    FeatureEngineeringService,
  ],
  exports: [
    DemandFeaturesService,
    SupplyFeaturesService,
    FinancialFeaturesService,
    FeatureEngineeringService,
  ],
})
export class FeatureEngineeringModule {}
