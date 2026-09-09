import { Test, TestingModule } from '@nestjs/testing';
import { AiAssistantService } from './assistant.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AiAssistantService', () => {
  let service: AiAssistantService;

  beforeEach(async () => {
    const mockPrisma = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiAssistantService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AiAssistantService>(AiAssistantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate booking suggestions for AC repair queries', async () => {
    const res = await service.processUserMessage({
      userId: 'user-1',
      userRole: 'CUSTOMER',
      message: 'I need AC repair service tomorrow',
    });

    expect(res.recommendedAction).toBe('BOOK_SERVICE');
    expect(res.suggestedBooking?.serviceName).toBe('AC Deep Cleaning & Repair');
  });

  it('should answer Provider FAQ queries regarding payouts', async () => {
    const res = await service.processUserMessage({
      userId: 'prov-1',
      userRole: 'PROVIDER',
      message: 'When do I get my payouts?',
    });

    expect(res.recommendedAction).toBe('VIEW_FAQ');
    expect(res.reply).toContain('Monday');
  });

  it('should answer Customer Help queries regarding refunds', async () => {
    const res = await service.processUserMessage({
      userId: 'cust-1',
      userRole: 'CUSTOMER',
      message: 'How does cancellation refund work?',
    });

    expect(res.reply).toContain('100% instant refund');
  });
});
