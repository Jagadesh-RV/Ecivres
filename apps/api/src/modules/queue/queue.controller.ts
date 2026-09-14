import { Controller, Get } from '@nestjs/common';
import { ProductionQueueService } from './production-queue.service';

@Controller('admin/queues')
export class QueueController {
  constructor(private readonly queueService: ProductionQueueService) {}

  @Get('health')
  async getQueueHealth() {
    return this.queueService.getQueueMetrics();
  }

  @Get('dlq')
  async getDlqJobs() {
    return {
      dlqName: 'ecivres-dlq',
      failedCount: 0,
      jobs: [],
    };
  }
}
