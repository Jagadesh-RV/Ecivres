import { Test, TestingModule } from '@nestjs/testing';
import { ProductionQueueService } from './production-queue.service';
import { DlqProcessorService } from './dlq-processor.service';

describe('Production Queue Services', () => {
  let queueService: ProductionQueueService;
  let dlqService: DlqProcessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductionQueueService, DlqProcessorService],
    }).compile();

    queueService = module.get<ProductionQueueService>(ProductionQueueService);
    dlqService = module.get<DlqProcessorService>(DlqProcessorService);
  });

  it('should enqueue and process background jobs', async () => {
    const job = await queueService.addJob('EMAIL', { to: 'user@example.com', template: 'WELCOME' }, 3);
    expect(job.status).toBe('QUEUED');

    const processed = await queueService.processNextJob('EMAIL');
    expect(processed?.status).toBe('COMPLETED');
  });

  it('should move failed jobs to DLQ and allow retry', async () => {
    const job = await queueService.addJob('INVOICE_PDF', { bookingId: 'b_100' }, 1);
    // Simulate failed processing
    job.attempts = 1;
    job.status = 'DLQ';
    (await queueService.getDlqJobs()).push(job);

    const retryRes = await dlqService.retryDlqJob(job.id);
    expect(retryRes.retried).toBe(true);
    expect(job.status).toBe('QUEUED');
  });
});
