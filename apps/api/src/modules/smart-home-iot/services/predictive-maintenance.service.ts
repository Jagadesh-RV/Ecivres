import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PredictiveMaintenanceService {
  private readonly logger = new Logger(PredictiveMaintenanceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async registerDevice(homeId: string, deviceType: string, telemetryTopic: string) {
    const smartDeviceId = `dev_sm_${Date.now()}`;
    this.logger.log(`Registering smart home IoT device ${smartDeviceId} (${deviceType}) for home ${homeId}`);
    return this.prisma.smartHomeDevice.create({
      data: {
        smartDeviceId,
        homeId,
        deviceType,
        telemetryTopic,
        lastStatus: 'HEALTHY',
      },
    });
  }

  async triggerPredictiveBooking(smartDeviceId: string, errorMetric: string) {
    this.logger.warn(`Predictive maintenance alert on smart device ${smartDeviceId}: ${errorMetric}. Triggering auto-booking.`);
    return {
      smartDeviceId,
      status: 'AUTO_BOOKING_DISPATCHED',
      suggestedCategory: 'HVAC_FILTER_REPLACEMENT',
      recommendedDate: new Date(Date.now() + 86400000).toISOString(),
    };
  }
}
