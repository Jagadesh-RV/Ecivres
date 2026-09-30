import { Injectable, Logger } from '@nestjs/common';
import { TrackAcquisitionDto } from '../dto/track-acquisition.dto';

@Injectable()
export class AcquisitionTrackingService {
  private readonly logger = new Logger(AcquisitionTrackingService.name);
  private readonly acquisitions = new Map<string, TrackAcquisitionDto & { createdAt: Date }>();

  async recordAcquisition(dto: TrackAcquisitionDto) {
    const record = { ...dto, createdAt: new Date() };
    this.acquisitions.set(dto.userId, record);
    this.logger.log(`Recorded acquisition for user ${dto.userId} (Source: ${dto.utmSource || 'direct'}, Campaign: ${dto.utmCampaign || 'none'})`);
    return record;
  }

  async getAcquisitionByUserId(userId: string) {
    return this.acquisitions.get(userId) || null;
  }
}
