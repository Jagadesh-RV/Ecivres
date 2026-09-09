import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface ProviderVerificationSubmission {
  documentType: 'GOVT_ID' | 'BUSINESS_LICENSE' | 'INSURANCE_CERTIFICATE' | 'BACKGROUND_CHECK';
  documentUrl: string;
  notes?: string;
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

    // Set provider verified status in database
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
}
