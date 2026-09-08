import { Injectable, Logger } from '@nestjs/common';
import { QueueService } from '../queue.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CouponExpirationJobProcessor {
  private readonly logger = new Logger(CouponExpirationJobProcessor.name);

  constructor(
    private queueService: QueueService,
    private prisma: PrismaService,
  ) {}

  async processExpiredCoupons() {
    const now = new Date();
    const result = await this.prisma.coupon.updateMany({
      where: {
        expiresAt: { lt: now },
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    this.logger.log(`Automated Coupon Expiration Job: Deactivated ${result.count} expired coupons`);
    return { deactivatedCount: result.count };
  }
}
