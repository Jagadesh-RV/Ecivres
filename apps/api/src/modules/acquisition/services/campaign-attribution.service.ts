import { Injectable, Logger } from '@nestjs/common';
import { AcquisitionTrackingService } from './acquisition-tracking.service';

@Injectable()
export class CampaignAttributionService {
  private readonly logger = new Logger(CampaignAttributionService.name);

  constructor(private readonly acquisitionService: AcquisitionTrackingService) {}

  async attributeCustomerSource(userId: string) {
    const record = await this.acquisitionService.getAcquisitionByUserId(userId);
    if (!record) {
      return { channel: 'ORGANIC_DIRECT', campaign: 'DIRECT', cac: 0.0 };
    }
    const channel = record.utmSource ? record.utmSource.toUpperCase() : (record.referralCode ? 'REFERRAL' : 'ORGANIC');
    this.logger.log(`Attributed user ${userId} to channel ${channel}, campaign ${record.utmCampaign || 'NONE'}`);
    return {
      channel,
      campaign: record.utmCampaign || 'ORGANIC',
      medium: record.utmMedium || 'DIRECT',
      referralCode: record.referralCode || null,
      cac: record.acquisitionCost || 0.0,
    };
  }
}
