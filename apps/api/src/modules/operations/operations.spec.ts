import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { MarketplaceOperationsService } from './services/marketplace-operations.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('MarketplaceOperationsService', () => {
  let service: MarketplaceOperationsService;

  const mockPrisma = {
    operationsIncident: {
      create: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketplaceOperationsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<MarketplaceOperationsService>(MarketplaceOperationsService);
  });

  it('should create live marketplace operation incident', async () => {
    mockPrisma.operationsIncident.create.mockResolvedValue({
      incidentId: 'inc_1',
      title: 'Payment Delay',
      status: 'OPEN',
    });

    const res = await service.createIncident('Payment Delay', 'Webhook timeout');
    expect(res.incidentId).toBe('inc_1');
  });

  it('should fetch SLA metrics and compliance rate', async () => {
    mockPrisma.operationsIncident.count.mockResolvedValue(1);

    const res = await service.getSlaMetrics();
    expect(res.slaComplianceRatePercent).toBe('99.4%');
    expect(res.openIncidentsCount).toBe(1);
  });
});
