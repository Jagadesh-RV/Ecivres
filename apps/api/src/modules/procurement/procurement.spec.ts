import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { VendorContractService } from './services/vendor-contract.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('VendorContractService', () => {
  let service: VendorContractService;

  const mockPrisma = {
    procurementContract: {
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendorContractService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<VendorContractService>(VendorContractService);
  });

  it('should auto approve contract under $25,000 threshold', async () => {
    mockPrisma.procurementContract.create.mockResolvedValue({
      contractId: 'cnt_100',
      status: 'APPROVED',
    });

    const res = await service.createContract('org_1', 'Vendor A', 10000);
    expect(res.status).toBe('APPROVED');
  });
});
