import { Injectable } from '@nestjs/common';
import { CalculateRepairEstimateDto } from './dto/repair-estimate.dto';

export interface RepairEstimateResult {
  claimId: string;
  totalLaborCostUsd: number;
  totalMaterialsCostUsd: number;
  grandTotalUsd: number;
  recommendedCoveragePercentage: number;
}

@Injectable()
export class RepairEstimateService {
  async calculateEstimate(dto: CalculateRepairEstimateDto): Promise<RepairEstimateResult> {
    const hourlyRateUsd = 85;
    let totalLabor = 0;
    let totalMaterials = 0;

    for (const item of dto.items) {
      totalLabor += item.laborHours * hourlyRateUsd;
      totalMaterials += item.materialsCostUsd;
    }

    const grandTotalUsd = totalLabor + totalMaterials;

    return {
      claimId: dto.claimId,
      totalLaborCostUsd: totalLabor,
      totalMaterialsCostUsd: totalMaterials,
      grandTotalUsd,
      recommendedCoveragePercentage: grandTotalUsd > 5000 ? 80 : 100,
    };
  }
}
