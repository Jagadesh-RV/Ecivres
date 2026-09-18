import { Injectable, Logger } from '@nestjs/common';
import { CreateClaimDto } from './dto/create-claim.dto';

export interface ClaimRecord {
  claimId: string;
  policyNumber: string;
  policyHolderId: string;
  bookingId: string;
  claimType: string;
  estimatedDamageUsd: number;
  deductibleUsd: number;
  coveredAmountUsd: number;
  status: 'FILED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  filedAt: string;
}

@Injectable()
export class ClaimsService {
  private readonly logger = new Logger(ClaimsService.name);

  async fileClaim(dto: CreateClaimDto): Promise<ClaimRecord> {
    const claimId = `clm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const deductibleUsd = 250;
    const coveredAmountUsd = Math.max(0, dto.estimatedDamageUsd - deductibleUsd);

    this.logger.log(`Filing insurance claim ${claimId} for policy ${dto.policyNumber}`);

    return {
      claimId,
      policyNumber: dto.policyNumber,
      policyHolderId: dto.policyHolderId,
      bookingId: dto.bookingId,
      claimType: dto.claimType,
      estimatedDamageUsd: dto.estimatedDamageUsd,
      deductibleUsd,
      coveredAmountUsd,
      status: coveredAmountUsd > 0 ? 'UNDER_REVIEW' : 'REJECTED',
      filedAt: new Date().toISOString(),
    };
  }
}
