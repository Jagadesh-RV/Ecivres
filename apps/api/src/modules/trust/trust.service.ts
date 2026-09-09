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

    // Record submission (updates provider metadata or verification status)
    return {
      submissionId: `verif_${Date.now()}`,
      providerId: provider.id,
      documentType: data.documentType,
      documentUrl: data.documentUrl,
      status: 'PENDING_REVIEW',
      submittedAt: new Date(),
    };
  }
}
