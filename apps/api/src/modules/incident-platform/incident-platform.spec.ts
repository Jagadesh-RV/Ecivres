import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { IncidentGovernanceService } from './services/incident-governance.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('IncidentGovernanceService', () => {
  let service: IncidentGovernanceService;

  const mockPrisma = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentGovernanceService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<IncidentGovernanceService>(IncidentGovernanceService);
  });

  it('should classify SEV-1 for outage with high affected user count', async () => {
    const res = await service.classifySeverity('Database Outage', 'Complete region outage', 1500);
    expect(res.severity).toBe('SEV-1');
    expect(res.responseSlaMinutes).toBe(5);
  });

  it('should classify SEV-2 for payment failure with moderate user impact', async () => {
    const res = await service.classifySeverity('Payment Timeout', 'Payment Gateway error', 150);
    expect(res.severity).toBe('SEV-2');
    expect(res.responseSlaMinutes).toBe(30);
  });
});
