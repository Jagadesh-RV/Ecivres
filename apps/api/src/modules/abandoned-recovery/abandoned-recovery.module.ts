import { Module } from '@nestjs/common';
import { AbandonedBookingService } from './services/abandoned-booking.service';
import { RecoveryCampaignService } from './services/recovery-campaign.service';
import { AbandonedRecoveryController } from './abandoned-recovery.controller';

@Module({
  controllers: [AbandonedRecoveryController],
  providers: [AbandonedBookingService, RecoveryCampaignService],
  exports: [AbandonedBookingService, RecoveryCampaignService],
})
export class AbandonedRecoveryModule {}
