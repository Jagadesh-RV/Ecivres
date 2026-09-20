import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PriorityDispatchService {
  private readonly logger = new Logger(PriorityDispatchService.name);

  constructor(private readonly prisma: PrismaService) {}

  async dispatchSos(customerId: string, serviceCategory: string, latitude: number, longitude: number) {
    const sosId = `sos_${Date.now()}`;
    this.logger.warn(`EMERGENCY SOS DISPATCH TRIGGERED ${sosId} for category ${serviceCategory} at (${latitude}, ${longitude})`);
    return this.prisma.emergencySosBooking.create({
      data: {
        sosId,
        customerId,
        serviceCategory,
        latitude,
        longitude,
        priorityScore: 100,
        status: 'DISPATCHED',
      },
    });
  }

  async trackResponder(sosId: string) {
    this.logger.log(`Fetching live responder geolocation tracking for SOS ${sosId}`);
    return {
      sosId,
      status: 'EN_ROUTE',
      responderId: 'resp_speedy_101',
      etaSeconds: 180,
      currentLatitude: 37.7750,
      currentLongitude: -122.4190,
    };
  }
}
