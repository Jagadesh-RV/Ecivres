import { Module } from '@nestjs/common';
import { AcquisitionTrackingService } from './services/acquisition-tracking.service';
import { CampaignAttributionService } from './services/campaign-attribution.service';
import { CustomerActivationService } from './services/customer-activation.service';
import { AcquisitionController } from './acquisition.controller';

@Module({
  controllers: [AcquisitionController],
  providers: [AcquisitionTrackingService, CampaignAttributionService, CustomerActivationService],
  exports: [AcquisitionTrackingService, CampaignAttributionService, CustomerActivationService],
})
export class AcquisitionModule {}
