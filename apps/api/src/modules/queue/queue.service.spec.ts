import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from './queue.service';
import { RedisConfigService } from './redis.config';
import { ConfigService } from '@nestjs/config';

describe('QueueService', () => {
  let service: QueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        RedisConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'REDIS_HOST') return '127.0.0.1';
              if (key === 'REDIS_PORT') return 6379;
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add background job to queue', async () => {
    const job = await service.addJob('TEST_JOB', { foo: 'bar' });
    expect(job.id).toBeDefined();
    expect(job.name).toEqual('TEST_JOB');
    expect(job.status).toEqual('PENDING');

    const jobs = await service.getJobs();
    expect(jobs).toHaveLength(1);
  });
});
