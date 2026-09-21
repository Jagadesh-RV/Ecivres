import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class IndianVerificationService {
  private readonly logger = new Logger(IndianVerificationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async verifyAadhaar(providerId: string, aadhaarNumber: string) {
    const aadhaarHash = `hash_${aadhaarNumber.slice(-4)}`;
    this.logger.log(`Verifying Aadhaar workflow for provider ${providerId} (Hash: ${aadhaarHash})`);
    return this.prisma.indianVerificationRecord.upsert({
      where: { providerId },
      create: { providerId, aadhaarHash, verificationStatus: 'PENDING' },
      update: { aadhaarHash },
    });
  }

  async verifyPan(providerId: string, panNumber: string) {
    const isValidPan = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.toUpperCase());
    this.logger.log(`Verifying PAN format for provider ${providerId} (${panNumber}): ${isValidPan}`);
    return this.prisma.indianVerificationRecord.update({
      where: { providerId },
      data: {
        panNumber: panNumber.toUpperCase(),
        verificationStatus: isValidPan ? 'PAN_VERIFIED' : 'FAILED',
      },
    });
  }
}
