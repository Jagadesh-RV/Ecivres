import { Injectable, Logger } from '@nestjs/common';
import { FeatureEngineeringService } from '../../modules/feature-engineering/services/feature-engineering.service';

export interface TwinScenarioParameters {
  scenarioName: string;
  surgePriceMultiplier: number; // e.g. 1.0 (baseline), 1.15 (+15%), 0.90 (-10%)
  providerIncentiveBonusPct: number; // e.g. 0%, +10%, +25%
  promotionDiscountPct: number; // e.g. 0%, 5%, 15%
  takeRatePct: number; // platform commission
}

export interface TwinScenarioProjection {
  scenarioName: string;
  projectedGmv: number;
  projectedPlatformRevenue: number;
  projectedConversionRate: number;
  projectedProviderUtilization: number;
  projectedProviderEarnings: number;
  projectedCancellationRate: number;
  projectedOperationalLoad: number;
  estimatedRiskScore: number; // 0 - 100
  deltaVsBaselinePct: {
    gmv: number;
    revenue: number;
    conversion: number;
    utilization: number;
  };
}

export interface DigitalTwinComparisonReport {
  simulatedAt: Date;
  isReadOnly: true;
  baselineState: {
    activeProviders: number;
    searchVolume: number;
    baseGmv: number;
  };
  scenarios: TwinScenarioProjection[];
  optimalScenarioRecommendation: string;
}

@Injectable()
export class DigitalTwinService {
  private readonly logger = new Logger(DigitalTwinService.name);

  constructor(private readonly featureService: FeatureEngineeringService) {}

  /**
   * Run multi-scenario counterfactual simulation.
   * INVARIANT: READ-ONLY. NEVER MUTATES PRODUCTION STATE.
   */
  async simulateScenarios(scenarios: TwinScenarioParameters[]): Promise<DigitalTwinComparisonReport> {
    this.logger.log(`Running read-only Digital Twin simulation for ${scenarios.length} scenarios.`);

    // Fetch baseline state vectors (read-only)
    const baseVector = await this.featureService.extractMarketplaceFeatures({ region: 'GLOBAL' });
    const baseGmv = baseVector.financial.gmvAmount || 150000;
    const baseSearchVolume = (baseVector.demand.bookingsCount || 240) * 5;
    const baseProviders = baseVector.supply.activeProvidersCount || 340;
    const baseConversion = 20.0;
    const baseUtilization = baseVector.supply.providerUtilizationPct || 65.0;

    const projections: TwinScenarioProjection[] = [];

    for (const sc of scenarios) {
      // Elasticity modeling
      const priceFactor = sc.surgePriceMultiplier;
      const incentiveFactor = 1 + sc.providerIncentiveBonusPct / 100;
      const promoFactor = 1 + sc.promotionDiscountPct / 100;

      // Price elasticity: higher prices reduce conversion slightly, but increase GMV per order
      const projectedConversion = Number((baseConversion * (1 / Math.pow(priceFactor, 0.4)) * promoFactor).toFixed(2));
      const projectedOrders = Math.round((baseSearchVolume * projectedConversion) / 100);
      const projectedGmv = Number((baseGmv * priceFactor * (projectedOrders / (baseSearchVolume * (baseConversion / 100)))).toFixed(2));
      const takeRate = sc.takeRatePct || 15.0;
      const projectedRevenue = Number((projectedGmv * (takeRate / 100)).toFixed(2));

      // Provider supply response to incentives
      const projectedUtilization = Number(Math.min(95.0, baseUtilization * incentiveFactor).toFixed(2));
      const projectedProviderEarnings = Number((projectedGmv * (1 - takeRate / 100) * incentiveFactor).toFixed(2));
      const projectedCancellation = Number(Math.max(1.0, 4.5 * (priceFactor > 1.2 ? 1.5 : 1.0)).toFixed(2));
      const operationalLoad = Math.round(projectedOrders * 1.15);

      // Risk score composite
      let riskScore = 20;
      if (priceFactor > 1.2) riskScore += 30;
      if (projectedCancellation > 5.0) riskScore += 25;
      if (sc.providerIncentiveBonusPct > 20) riskScore += 15;

      const deltaGmv = Number((((projectedGmv - baseGmv) / baseGmv) * 100).toFixed(2));
      const deltaRevenue = Number((((projectedRevenue - (baseGmv * 0.15)) / (baseGmv * 0.15)) * 100).toFixed(2));
      const deltaConversion = Number((((projectedConversion - baseConversion) / baseConversion) * 100).toFixed(2));
      const deltaUtilization = Number((((projectedUtilization - baseUtilization) / baseUtilization) * 100).toFixed(2));

      projections.push({
        scenarioName: sc.scenarioName,
        projectedGmv,
        projectedPlatformRevenue: projectedRevenue,
        projectedConversionRate: projectedConversion,
        projectedProviderUtilization: projectedUtilization,
        projectedProviderEarnings,
        projectedCancellationRate: projectedCancellation,
        projectedOperationalLoad: operationalLoad,
        estimatedRiskScore: Math.min(100, riskScore),
        deltaVsBaselinePct: {
          gmv: deltaGmv,
          revenue: deltaRevenue,
          conversion: deltaConversion,
          utilization: deltaUtilization,
        },
      });
    }

    // Identify optimal scenario balancing GMV, Revenue, and Risk
    const sorted = [...projections].sort((a, b) => {
      const scoreA = a.projectedPlatformRevenue - a.estimatedRiskScore * 50;
      const scoreB = b.projectedPlatformRevenue - b.estimatedRiskScore * 50;
      return scoreB - scoreA;
    });

    const report: DigitalTwinComparisonReport = {
      simulatedAt: new Date(),
      isReadOnly: true,
      baselineState: {
        activeProviders: baseProviders,
        searchVolume: baseSearchVolume,
        baseGmv,
      },
      scenarios: projections,
      optimalScenarioRecommendation: sorted[0]?.scenarioName || 'Scenario A (Baseline)',
    };

    return report;
  }
}
