import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { DemandFeaturesService, DemandFeatures } from './demand-features.service';
import { SupplyFeaturesService, SupplyFeatures } from './supply-features.service';
import { FinancialFeaturesService, FinancialFeatures } from './financial-features.service';
import { ExtractFeaturesDto } from '../dto/extract-features.dto';
import { randomUUID } from 'crypto';

export interface MarketplaceFeatureSet {
  correlationId: string;
  timestamp: string;
  region: string;
  category?: string;
  demand: DemandFeatures;
  supply: SupplyFeatures;
  financial: FinancialFeatures;
  operational: {
    apiLatencyMs: number;
    paymentFailureRatePct: number;
    anomalyCount: number;
  };
  overallMarketRiskScore: number;
}

@Injectable()
export class FeatureEngineeringService {
  private readonly logger = new Logger(FeatureEngineeringService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly demandFeaturesService: DemandFeaturesService,
    private readonly supplyFeaturesService: SupplyFeaturesService,
    private readonly financialFeaturesService: FinancialFeaturesService,
  ) {}

  async extractMarketplaceFeatures(dto: ExtractFeaturesDto): Promise<MarketplaceFeatureSet> {
    const correlationId = randomUUID();
    const region = dto.region || 'GLOBAL';

    const [demand, financial] = await Promise.all([
      this.demandFeaturesService.calculateDemandFeatures(region, dto.category),
      this.financialFeaturesService.calculateFinancialFeatures(),
    ]);

    const supply = await this.supplyFeaturesService.calculateSupplyFeatures(demand.bookingsCount, region);

    const operational = {
      apiLatencyMs: 42.5,
      paymentFailureRatePct: 0.8,
      anomalyCount: 0,
    };

    let riskScore = 15.0; // Baseline low risk
    if (demand.cancellationRatePct > 15) riskScore += 25;
    if (supply.supplyDemandRatio < 0.5) riskScore += 30;
    if (financial.refundRatePct > 5) riskScore += 20;

    const featureSet: MarketplaceFeatureSet = {
      correlationId,
      timestamp: new Date().toISOString(),
      region,
      category: dto.category,
      demand,
      supply,
      financial,
      operational,
      overallMarketRiskScore: Math.min(100, riskScore),
    };

    // Store feature record in database
    await this.prisma.decisionContextRecord.create({
      data: {
        correlationId,
        market: 'GLOBAL',
        region,
        category: dto.category,
        signals: JSON.stringify({ demand, supply }),
        features: JSON.stringify(featureSet),
        riskLevel: riskScore > 50 ? 'HIGH' : riskScore > 30 ? 'MEDIUM' : 'LOW',
      },
    });

    this.logger.log(`Extracted feature set ${correlationId} for region=${region}`);
    return featureSet;
  }
}
