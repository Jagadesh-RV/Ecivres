import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface ProviderVerificationSubmission {
  documentType: 'GOVT_ID' | 'BUSINESS_LICENSE' | 'INSURANCE_CERTIFICATE' | 'BACKGROUND_CHECK';
  documentUrl: string;
  notes?: string;
}

export interface CustomerReportData {
  providerId: string;
  bookingId?: string;
  reason: 'SAFETY_VIOLATION' | 'UNPROFESSIONAL_BEHAVIOR' | 'NO_SHOW' | 'OVERCHARGING' | 'OTHER';
  description: string;
}

export interface ProviderReportData {
  customerId: string;
  bookingId?: string;
  reason: 'PROPERTY_DAMAGE' | 'ABUSIVE_BEHAVIOR' | 'NON_PAYMENT' | 'HAZARDOUS_CONDITIONS' | 'OTHER';
  description: string;
}

export interface ModerationResolution {
  reportId: string;
  action: 'DISMISSED' | 'WARNING_ISSUED' | 'SUSPENDED_ACCOUNT' | 'ESCALATED';
  notes: string;
}

export interface FraudAlert {
  userId: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  triggers: string[];
  recommendedAction: 'MONITOR' | 'FLAG_FOR_REVIEW' | 'TEMP_SUSPEND' | 'BLOCK';
}

@Injectable()
export class TrustService {
  constructor(private readonly prisma: PrismaService) {}

  async submitVerificationDocument(userId: string, data: ProviderVerificationSubmission) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    return {
      submissionId: `verif_${Date.now()}`,
      providerId: provider.id,
      documentType: data.documentType,
      documentUrl: data.documentUrl,
      status: 'PENDING_REVIEW',
      submittedAt: new Date(),
    };
  }

  async approveProviderDocument(providerId: string, documentId: string, adminUserId: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { id: providerId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    const updated = await this.prisma.providerProfile.update({
      where: { id: providerId },
      data: { isVerified: true },
    });

    return {
      providerId: updated.id,
      isVerified: updated.isVerified,
      documentId,
      approvedBy: adminUserId,
      approvedAt: new Date(),
      status: 'APPROVED',
    };
  }

  async rejectProviderDocument(providerId: string, documentId: string, reason: string, adminUserId: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { id: providerId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    return {
      providerId: provider.id,
      documentId,
      rejectionReason: reason,
      rejectedBy: adminUserId,
      rejectedAt: new Date(),
      status: 'REJECTED',
    };
  }

  async reportProvider(reporterUserId: string, data: CustomerReportData) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { id: data.providerId },
    });

    if (!provider) {
      throw new NotFoundException('Target provider not found');
    }

    return {
      reportId: `rpt_prov_${Date.now()}`,
      reporterUserId,
      targetProviderId: data.providerId,
      bookingId: data.bookingId,
      reason: data.reason,
      description: data.description,
      status: 'UNDER_INVESTIGATION',
      createdAt: new Date(),
    };
  }

  async reportCustomer(providerUserId: string, data: ProviderReportData) {
    const customer = await this.prisma.customerProfile.findUnique({
      where: { id: data.customerId },
    });

    if (!customer) {
      throw new NotFoundException('Target customer not found');
    }

    return {
      reportId: `rpt_cust_${Date.now()}`,
      reporterUserId: providerUserId,
      targetCustomerId: data.customerId,
      bookingId: data.bookingId,
      reason: data.reason,
      description: data.description,
      status: 'UNDER_INVESTIGATION',
      createdAt: new Date(),
    };
  }

  async getModerationQueue(status: string = 'UNDER_INVESTIGATION', limit = 20) {
    return {
      items: [
        {
          reportId: 'rpt_demo_1',
          reporterType: 'CUSTOMER',
          reason: 'SAFETY_VIOLATION',
          description: 'Provider entered premises without badge',
          status,
          createdAt: new Date(),
        },
      ],
      total: 1,
      page: 1,
      limit,
    };
  }

  async resolveModerationReport(resolution: ModerationResolution, adminUserId: string) {
    return {
      reportId: resolution.reportId,
      actionTaken: resolution.action,
      notes: resolution.notes,
      resolvedBy: adminUserId,
      resolvedAt: new Date(),
      status: 'RESOLVED',
    };
  }

  /**
   * Automatic fraud detection algorithm
   */
  async detectSuspiciousActivity(userId: string): Promise<FraudAlert> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { bookings: { include: { payment: true } } },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const triggers: string[] = [];
    const bookings = user.bookings || [];

    // Check cancellation rate
    const cancelledCount = bookings.filter((b) => b.status === 'CANCELLED').length;
    if (cancelledCount >= 3) {
      triggers.push('HIGH_CANCELLATION_VELOCITY');
    }

    // Check failed payments
    const failedPayments = bookings.filter((b) => b.payment?.status === 'FAILED').length;
    if (failedPayments >= 2) {
      triggers.push('MULTIPLE_FAILED_PAYMENTS');
    }

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    let recommendedAction: 'MONITOR' | 'FLAG_FOR_REVIEW' | 'TEMP_SUSPEND' | 'BLOCK' = 'MONITOR';

    if (triggers.length === 1) {
      riskLevel = 'MEDIUM';
      recommendedAction = 'FLAG_FOR_REVIEW';
    } else if (triggers.length >= 2) {
      riskLevel = 'HIGH';
      recommendedAction = 'TEMP_SUSPEND';
    }

    return {
      userId,
      riskLevel,
      triggers,
      recommendedAction,
    };
  }
}
