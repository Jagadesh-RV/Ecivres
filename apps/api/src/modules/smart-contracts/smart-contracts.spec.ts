import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { SmartEscrowService } from './services/smart-escrow.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('SmartEscrowService', () => {
  let service: SmartEscrowService;

  const mockPrisma = {
    smartContractEscrow: {
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmartEscrowService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<SmartEscrowService>(SmartEscrowService);
  });

  it('should create smart escrow hold', async () => {
    mockPrisma.smartContractEscrow.create.mockResolvedValue({
      escrowId: 'esc_1',
      bookingId: 'bk_1',
      amount: 500,
      isReleased: false,
    });

    const res = await service.createEscrow('bk_1', 500, 'Milestone 1');
    expect(res.escrowId).toBe('esc_1');
    expect(res.isReleased).toBe(false);
  });
});
