import { Module, Global } from '@nestjs/common';
import { RedisConfigService } from './redis.config';
import { QueueService } from './queue.service';
import { NotificationQueueProcessor } from './jobs/notification.job';
import { BookingReminderJobProcessor } from './jobs/booking-reminder.job';
import { CouponExpirationJobProcessor } from './jobs/coupon-expiration.job';
import { CleanupJobProcessor } from './jobs/cleanup.job';

@Global()
@Module({
  providers: [
    RedisConfigService,
    QueueService,
    NotificationQueueProcessor,
    BookingReminderJobProcessor,
    CouponExpirationJobProcessor,
    CleanupJobProcessor,
  ],
  exports: [
    RedisConfigService,
    QueueService,
    NotificationQueueProcessor,
    BookingReminderJobProcessor,
    CouponExpirationJobProcessor,
    CleanupJobProcessor,
  ],
})
export class QueueModule {}
