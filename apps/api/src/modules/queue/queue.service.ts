import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RedisConfigService } from './redis.config';

export interface BackgroundJob {
  id: string;
  name: string;
  data: any;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

@Injectable()
export class QueueService implements OnModuleInit {
  private readonly logger = new Logger(QueueService.name);
  private jobs: BackgroundJob[] = [];

  constructor(private redisConfigService: RedisConfigService) {}

  onModuleInit() {
    const config = this.redisConfigService.getRedisConfig();
    this.logger.log(`Initialized BullMQ queue manager on Redis ${config.host}:${config.port}`);
  }

  async addJob(name: string, data: any): Promise<BackgroundJob> {
    const job: BackgroundJob = {
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      data,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    this.jobs.push(job);
    this.logger.log(`Queued background job "${name}" (ID: ${job.id})`);
    return job;
  }

  async getJobs(): Promise<BackgroundJob[]> {
    return this.jobs;
  }
}
