import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { AutomatedSettlementService } from './services/automated-settlement.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AutomatedSettlementService', () => {
  let service: AutomatedSettlementService;

  const mockPrisma = {
    autonomousSettlement: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutomatedSettlementService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AutomatedSettlementService>(AutomatedSettlementService);
  });

  it('should process escrow settlement with 5% platform fee', async () => {
    mockPrisma.autonomousSettlement.create.mockResolvedValue({
      settlementId: 'stl_1',
      escrowId: 'esc_1',
      grossAmount: 1000,
      platformFee: 50,
      netPayout: 950,
      status: 'SETTLED',
    });

    const res = await service.settleEscrow('esc_1', 1000);
    expect(res.settlementId).toBe('stl_1');
    expect(res.netPayout).toBe(950);
  });
});
