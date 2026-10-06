import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RunSimulationDto, ScenarioType } from '../dto/run-simulation.dto';
import { PricingSimulatorService, SimulationOutput } from './pricing-simulator.service';
import { TakeRateSimulatorService } from './take-rate-simulator.service';
import { IncentiveSimulatorService } from './incentive-simulator.service';

@Injectable()
export class ScenarioSimulatorService {
  private readonly logger = new Logger(ScenarioSimulatorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly pricingSimulator: PricingSimulatorService,
    private readonly takeRateSimulator: TakeRateSimulatorService,
    private readonly incentiveSimulator: IncentiveSimulatorService,
  ) {}

  async executeSimulation(dto: RunSimulationDto): Promise<SimulationOutput & { id: string }> {
    let output: SimulationOutput;

    switch (dto.scenarioType) {
      case ScenarioType.SURGE_PRICING:
        output = this.pricingSimulator.simulateSurgePricing(dto.parameterChangePct);
        break;
      case ScenarioType.TAKE_RATE_ADJUSTMENT:
        output = this.takeRateSimulator.simulateTakeRate(dto.parameterChangePct);
        break;
      case ScenarioType.PROVIDER_INCENTIVE:
      default:
        output = this.incentiveSimulator.simulateIncentives(dto.parameterChangePct);
        break;
    }

    const record = await this.prisma.whatIfSimulation.create({
      data: {
        scenarioType: dto.scenarioType,
        region: dto.region || 'GLOBAL',
        category: dto.category,
        parameterChangePct: dto.parameterChangePct,
        gmvDeltaPct: output.gmvDeltaPct,
        revenueDeltaPct: output.revenueDeltaPct,
        conversionImpactPct: output.conversionImpactPct,
        providerEarningsDeltaPct: output.providerEarningsDeltaPct,
        riskAssessment: output.riskAssessment,
        recommendation: output.recommendation,
      },
    });

    this.logger.log(`Ran simulation ${record.id} scenario=${dto.scenarioType} param=${dto.parameterChangePct}%`);
    return {
      ...output,
      id: record.id,
    };
  }
}
