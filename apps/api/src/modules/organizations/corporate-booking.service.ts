import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CorporateBookingRecord {
  id: string;
  orgId: string;
  departmentId: string;
  employeeUserId: string;
  serviceName: string;
  amount: number;
  approvalStatus: 'AUTO_APPROVED' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  approverUserId?: string;
  createdAt: Date;
}

export interface MonthlyCorporateInvoice {
  invoiceId: string;
  orgId: string;
  billingMonth: string;
  totalBookingsCount: number;
  totalAmountDue: number;
  departmentBreakdown: { departmentName: string; amount: number }[];
  dueDate: Date;
  status: 'UNPAID' | 'PAID';
}

@Injectable()
export class CorporateBookingService {
  private corporateBookings: Map<string, CorporateBookingRecord[]> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async submitCorporateBooking(
    dto: { orgId: string; departmentId: string; employeeUserId: string; serviceName: string; amount: number },
  ): Promise<CorporateBookingRecord> {
    const list = this.corporateBookings.get(dto.orgId) || [];

    // Auto-approve if amount <= $250, otherwise flag for manager approval
    const approvalStatus = dto.amount <= 250 ? 'AUTO_APPROVED' : 'PENDING_APPROVAL';

    const record: CorporateBookingRecord = {
      id: `corp_b_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      orgId: dto.orgId,
      departmentId: dto.departmentId,
      employeeUserId: dto.employeeUserId,
      serviceName: dto.serviceName,
      amount: dto.amount,
      approvalStatus,
      createdAt: new Date(),
    };

    list.push(record);
    this.corporateBookings.set(dto.orgId, list);
    return record;
  }

  async generateMonthlyInvoice(orgId: string, month: string): Promise<MonthlyCorporateInvoice> {
    const list = this.corporateBookings.get(orgId) || [];
    const approvedBookings = list.filter(
      (b) => b.approvalStatus === 'AUTO_APPROVED' || b.approvalStatus === 'APPROVED',
    );

    const totalAmountDue = approvedBookings.reduce((sum, b) => sum + b.amount, 0);

    return {
      invoiceId: `INV-CORP-${orgId.substring(4, 9).toUpperCase()}-${month}`,
      orgId,
      billingMonth: month,
      totalBookingsCount: approvedBookings.length,
      totalAmountDue,
      departmentBreakdown: [
        { departmentName: 'Facilities & Maintenance', amount: Math.round(totalAmountDue * 0.7) },
        { departmentName: 'Human Resources', amount: Math.round(totalAmountDue * 0.3) },
      ],
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      status: 'UNPAID',
    };
  }
}
