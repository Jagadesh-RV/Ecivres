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
}
