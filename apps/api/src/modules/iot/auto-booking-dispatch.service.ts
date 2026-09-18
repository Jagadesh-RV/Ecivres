import { Injectable, Logger } from '@nestjs/common';
import { AutoBookingTriggerDto } from './dto/auto-booking-trigger.dto';

export interface TriggerDispatchResult {
  triggerId: string;
  deviceId: string;
  generatedBookingId: string;
  status: 'DISPATCHED' | 'PENDING_APPROVAL';
  dispatchedAt: string;
}

@Injectable()
export class AutoBookingDispatchService {
  private readonly logger = new Logger(AutoBookingDispatchService.name);

  async processTrigger(dto: AutoBookingTriggerDto): Promise<TriggerDispatchResult> {
    const triggerId = `trig_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const generatedBookingId = `bk_iot_${Date.now()}`;

    this.logger.log(`Processing IoT auto-booking trigger ${triggerId} for device ${dto.deviceId}`);

    return {
      triggerId,
      deviceId: dto.deviceId,
      generatedBookingId,
      status: dto.autoConfirm ? 'DISPATCHED' : 'PENDING_APPROVAL',
      dispatchedAt: new Date().toISOString(),
    };
  }
}
