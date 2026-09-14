import { Test, TestingModule } from '@nestjs/testing';
import { AutoFollowUpService } from './auto-followup.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AutoFollowUpService', () => {
  let service: AutoFollowUpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutoFollowUpService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<AutoFollowUpService>(AutoFollowUpService);
  });

  it('should schedule post-service follow-up and send notification', async () => {
    const schedule = await service.schedulePostServiceFollowUp('b_100', 'c_200', 2);
    expect(schedule.status).toBe('PENDING');

    const result = await service.triggerFollowUp('b_100');
    expect(result.sent).toBe(true);
    expect(result.message).toContain('rate your provider');
  });
});
