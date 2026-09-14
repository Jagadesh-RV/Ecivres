import { Injectable, Logger } from '@nestjs/common';
import { ProductionQueueService, QueueJobPayload } from './production-queue.service';

@Injectable()
export class DlqProcessorService {
  private readonly logger = new Logger(DlqProcessorService.name);

  constructor(private readonly queueService: ProductionQueueService) {}

  async retryDlqJob(jobId: string): Promise<{ retried: boolean; message: string }> {
    const dlqJobs = await this.queueService.getDlqJobs();
    const job = dlqJobs.find((j) => j.id === jobId);

    if (!job) {
      return { retried: false, message: `Job ${jobId} not found in Dead Letter Queue` };
    }

    job.attempts = 0;
    job.status = 'QUEUED';

    this.logger.log(`DLQ Job ${jobId} successfully re-queued for processing`);
    return { retried: true, message: `Job ${jobId} re-queued` };
  }
}
