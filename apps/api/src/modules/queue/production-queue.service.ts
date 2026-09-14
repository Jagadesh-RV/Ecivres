import { Injectable, Logger } from '@nestjs/common';

export interface QueueJobPayload {
  id: string;
  queueName: 'EMAIL' | 'PUSH_NOTIFICATION' | 'INVOICE_PDF' | 'AI_PROCESSING';
  data: any;
  attempts: number;
  maxAttempts: number;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'DLQ';
}

@Injectable()
export class ProductionQueueService {
  private readonly logger = new Logger(ProductionQueueService.name);
  private queueStore: Map<string, QueueJobPayload[]> = new Map();
  private dlqStore: QueueJobPayload[] = [];

  async addJob(
    queueName: QueueJobPayload['queueName'],
    data: any,
    maxAttempts: number = 3,
  ): Promise<QueueJobPayload> {
    const list = this.queueStore.get(queueName) || [];
    const job: QueueJobPayload = {
      id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      queueName,
      data,
      attempts: 0,
      maxAttempts,
      status: 'QUEUED',
    };

    list.push(job);
    this.queueStore.set(queueName, list);
    return job;
  }

  async processNextJob(queueName: QueueJobPayload['queueName']): Promise<QueueJobPayload | null> {
    const list = this.queueStore.get(queueName) || [];
    const pending = list.find((j) => j.status === 'QUEUED' || j.status === 'FAILED');

    if (!pending) return null;

    pending.attempts += 1;
    pending.status = 'PROCESSING';

    try {
      // Simulate asynchronous execution
      pending.status = 'COMPLETED';
      return pending;
    } catch (err) {
      if (pending.attempts >= pending.maxAttempts) {
        pending.status = 'DLQ';
        this.dlqStore.push(pending);
        this.logger.error(`Job ${pending.id} moved to Dead Letter Queue (DLQ) after ${pending.attempts} attempts`);
      } else {
        pending.status = 'FAILED';
      }
      return pending;
    }
  }

  async getDlqJobs(): Promise<QueueJobPayload[]> {
    return this.dlqStore;
  }
}
