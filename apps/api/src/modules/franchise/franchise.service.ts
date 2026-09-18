import { Injectable, Logger } from '@nestjs/common';
import { OnboardFranchiseDto } from './dto/onboard-franchise.dto';

export interface FranchiseRecord {
  franchiseId: string;
  brandName: string;
  ownerEmail: string;
  primaryRegion: string;
  royaltyPercentage: number;
  activeBranchesCount: number;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

@Injectable()
export class FranchiseService {
  private readonly logger = new Logger(FranchiseService.name);

  async onboardFranchise(dto: OnboardFranchiseDto): Promise<FranchiseRecord> {
    const franchiseId = `fran_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    this.logger.log(`Onboarding new franchise brand ${dto.brandName} (${franchiseId})`);

    return {
      franchiseId,
      brandName: dto.brandName,
      ownerEmail: dto.ownerEmail,
      primaryRegion: dto.primaryRegion,
      royaltyPercentage: dto.royaltyPercentage,
      activeBranchesCount: 1,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
  }
}
