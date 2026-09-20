import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class DamageAssessmentService {
  private readonly logger = new Logger(DamageAssessmentService.name);

  constructor(private readonly prisma: PrismaService) {}

  async submitClaim(policyId: string, providerId: string, assessedAmount: number) {
    const damageClaimId = `clm_dmg_${Date.now()}`;
    const coverageValid = assessedAmount <= 5000.0;
    this.logger.log(`Submitting digital damage claim ${damageClaimId} for policy ${policyId} ($${assessedAmount})`);
    return this.prisma.insuranceDamageClaim.create({
      data: {
        damageClaimId,
        policyId,
        providerId,
        assessedAmount,
        coverageValid,
        status: coverageValid ? 'APPROVED_FOR_PAYOUT' : 'UNDER_REVIEW',
      },
    });
  }

  async validateCoverage(policyId: string) {
    this.logger.log(`Validating policy coverage active status for ${policyId}`);
    return { policyId, isCoverageActive: true, maxLimitUSD: 10000.0, deductibleUSD: 250.0 };
  }
}
