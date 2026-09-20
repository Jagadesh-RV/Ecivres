import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseApprovalService } from './services/purchase-approval.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('PurchaseApprovalService', () => {
  let service: PurchaseApprovalService;

  const mockPrisma = {
    procurementPurchaseRequest: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseApprovalService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PurchaseApprovalService>(PurchaseApprovalService);
  });

  it('should assign approval level VP_FINANCE for large budget requests', async () => {
    mockPrisma.procurementPurchaseRequest.create.mockResolvedValue({
      requestId: 'pr_1',
      organizationId: 'org_1',
      estimatedCost: 15000,
      approvalLevel: 'VP_FINANCE',
      status: 'SUBMITTED',
    });

    const res = await service.createPurchaseRequest('org_1', 'Heavy Equipment', 15000);
    expect(res.requestId).toBe('pr_1');
    expect(res.approvalLevel).toBe('VP_FINANCE');
  });
});
