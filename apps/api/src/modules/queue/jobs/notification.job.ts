import { Injectable, Logger } from '@nestjs/common';
import { QueueService } from '../queue.service';

export interface NotificationJobData {
  userId: string;
  title: string;
  body: string;
  channel: 'PUSH' | 'EMAIL' | 'SMS';
}

@Injectable()
export class NotificationQueueProcessor {
  private readonly logger = new Logger(NotificationQueueProcessor.name);

  constructor(private queueService: QueueService) {}

  async queueNotification(data: NotificationJobData) {
    this.logger.log(`Queueing notification job for user ${data.userId} via ${data.channel}`);
    return this.queueService.addJob('SEND_NOTIFICATION', data);
  }
}
