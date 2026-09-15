import { Module, Global } from '@nestjs/common';
import { RedisConfigService } from './redis.config';
import { QueueService } from './queue.service';
import { NotificationQueueProcessor } from './jobs/notification.job';
import { BookingReminderJobProcessor } from './jobs/booking-reminder.job';
import { CouponExpirationJobProcessor } from './jobs/coupon-expiration.job';
import { CleanupJobProcessor } from './jobs/cleanup.job';
import { QueueController } from './queue.controller';
import { ProductionQueueService } from './production-queue.service';
import { EmailQueueProcessor } from './email-queue.processor';
import { InvoiceQueueProcessor } from './invoice-queue.processor';
import { AIQueueProcessor } from './ai-queue.processor';
import { DlqProcessorService } from './dlq-processor.service';

@Global()
@Module({
  controllers: [QueueController],
  providers: [
    RedisConfigService,
    QueueService,
    NotificationQueueProcessor,
    BookingReminderJobProcessor,
    CouponExpirationJobProcessor,
    CleanupJobProcessor,
    ProductionQueueService,
    EmailQueueProcessor,
    InvoiceQueueProcessor,
    AIQueueProcessor,
    DlqProcessorService,
  ],
  exports: [
    RedisConfigService,
    QueueService,
    NotificationQueueProcessor,
    BookingReminderJobProcessor,
    CouponExpirationJobProcessor,
    CleanupJobProcessor,
    ProductionQueueService,
    EmailQueueProcessor,
    InvoiceQueueProcessor,
    AIQueueProcessor,
    DlqProcessorService,
  ],
})
export class QueueModule {}
