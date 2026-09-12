import { Test, TestingModule } from '@nestjs/testing';
import { ProviderAiCopilotService } from './provider-copilot.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ProviderAiCopilotService', () => {
  let service: ProviderAiCopilotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProviderAiCopilotService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<ProviderAiCopilotService>(ProviderAiCopilotService);
  });

  it('should optimize provider route and calculate fuel savings', async () => {
    const res = await service.optimizeProviderSchedule('prov_100');
    expect(res.optimizedOrder.length).toBe(3);
    expect(res.fuelSavedPercentage).toBeGreaterThan(0);
  });

  it('should generate draft responses and tax deduction suggestions', async () => {
    const draft = await service.generateCustomerReplyDraft('What is the quote for AC repair?');
    expect(draft.suggestedReplies.length).toBeGreaterThan(0);
    expect(draft.suggestedReplies[0]).toContain('$120');

    const deductions = await service.getTaxDeductions('prov_100');
    expect(deductions.length).toBeGreaterThan(0);
    expect(deductions[0].estimatedDeductionAmount).toBeGreaterThan(0);
  });
});
