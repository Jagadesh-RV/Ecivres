import { Test, TestingModule } from '@nestjs/testing';
import { AdminOperationsService } from './admin-operations.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AdminOperationsService', () => {
  let service: AdminOperationsService;

  const mockPrismaService = {
    booking: {
      count: jest.fn().mockResolvedValue(15),
      findMany: jest.fn().mockResolvedValue([
        { id: 'b1', totalAmount: 500, status: 'COMPLETED' },
        { id: 'b2', totalAmount: 300, status: 'COMPLETED' },
      ]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminOperationsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AdminOperationsService>(AdminOperationsService);
  });

  it('should calculate live platform GMV and revenue metrics', async () => {
    const metrics = await service.getPlatformMetrics();
    expect(metrics.liveUsersCount).toBeGreaterThan(0);
    expect(metrics.grossMerchandiseValue).toBe(800);
    expect(metrics.platformNetRevenue).toBe(120);
    expect(metrics.anomaliesDetected.length).toBeGreaterThan(0);
  });

  it('should process support ticket escalations and refunds with audit logs', async () => {
    const ticket = await service.createSupportTicket('user_123', 'Late arrival dispute', 'HIGH');
    expect(ticket.priority).toBe('HIGH');
    expect(ticket.status).toBe('OPEN');

    const resolved = await service.resolveTicketAndIssueRefund(ticket.id, 'b1', 50, 'admin_007');
    expect(resolved.status).toBe('RESOLVED');

    const logs = await service.getAuditLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].action).toContain('ISSUE_REFUND');
  });

  it('should suspend provider and record immutable audit trail', async () => {
    await service.suspendProvider('prov_bad', 'Failed background check', 'admin_007');
    const isSuspended = await service.isProviderSuspended('prov_bad');
    expect(isSuspended).toBe(true);

    const logs = await service.getAuditLogs();
    expect(logs[0].action).toContain('SUSPEND_PROVIDER');
  });
});
