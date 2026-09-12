import { Test, TestingModule } from '@nestjs/testing';
import { CorporateBookingService } from './corporate-booking.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('CorporateBookingService', () => {
  let service: CorporateBookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CorporateBookingService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<CorporateBookingService>(CorporateBookingService);
  });

  it('should auto-approve bookings under $250 and generate monthly invoice', async () => {
    const booking = await service.submitCorporateBooking({
      orgId: 'org_123',
      departmentId: 'dept_fac',
      employeeUserId: 'u_emp',
      serviceName: 'Office HVAC Sanitization',
      amount: 180,
    });

    expect(booking.approvalStatus).toBe('AUTO_APPROVED');

    const invoice = await service.generateMonthlyInvoice('org_123', '2026-09');
    expect(invoice.totalBookingsCount).toBe(1);
    expect(invoice.totalAmountDue).toBe(180);
    expect(invoice.invoiceId).toContain('INV-CORP-');
  });
});
