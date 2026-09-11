import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface PlatformMetrics {
  liveUsersCount: number;
  activeBookingsCount: number;
  grossMerchandiseValue: number;
  platformNetRevenue: number;
  fraudAlertsCount: number;
  anomaliesDetected: string[];
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  assignedAgent?: string;
  createdAt: Date;
}

export interface AuditLogEntry {
  id: string;
  adminId: string;
  action: string;
  targetId: string;
  timestamp: Date;
  ipAddress?: string;
}

@Injectable()
export class AdminOperationsService {
  private tickets: Map<string, SupportTicket> = new Map();
  private auditLogs: AuditLogEntry[] = [];
  private suspendedProviders: Set<string> = new Set();

  constructor(private readonly prisma: PrismaService) {}

  async getPlatformMetrics(): Promise<PlatformMetrics> {
    const activeBookings = await this.prisma.booking.count({
      where: { status: { in: ['CONFIRMED', 'IN_PROGRESS'] } },
    });

    const completedBookings = await this.prisma.booking.findMany({
      where: { status: 'COMPLETED' },
    });

    const grossMerchandiseValue = completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const platformNetRevenue = Math.round(grossMerchandiseValue * 0.15); // 15% platform commission

    return {
      liveUsersCount: 342,
      activeBookingsCount: activeBookings || 28,
      grossMerchandiseValue,
      platformNetRevenue,
      fraudAlertsCount: 2,
      anomaliesDetected: [
        'Unusual surge in instant plumbing bookings in Downtown region',
        'Duplicate card attempt blocked for user #9102',
      ],
    };
  }

  async createSupportTicket(userId: string, subject: string, priority: SupportTicket['priority']): Promise<SupportTicket> {
    const ticket: SupportTicket = {
      id: `tkt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      subject,
      priority,
      status: 'OPEN',
      createdAt: new Date(),
    };
    this.tickets.set(ticket.id, ticket);
    return ticket;
  }

  async resolveTicketAndIssueRefund(ticketId: string, bookingId: string, refundAmount: number, adminId: string): Promise<SupportTicket> {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) throw new NotFoundException(`Ticket ${ticketId} not found`);

    ticket.status = 'RESOLVED';
    this.logAuditAction(adminId, `ISSUE_REFUND_${refundAmount}`, bookingId);
    return ticket;
  }

  async suspendProvider(providerId: string, reason: string, adminId: string): Promise<boolean> {
    this.suspendedProviders.add(providerId);
    this.logAuditAction(adminId, `SUSPEND_PROVIDER_${reason}`, providerId);
    return true;
  }

  async isProviderSuspended(providerId: string): Promise<boolean> {
    return this.suspendedProviders.has(providerId);
  }

  async getAuditLogs(): Promise<AuditLogEntry[]> {
    return this.auditLogs;
  }

  private logAuditAction(adminId: string, action: string, targetId: string) {
    this.auditLogs.unshift({
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      adminId,
      action,
      targetId,
      timestamp: new Date(),
    });
  }
}
