import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateForecastDto, ForecastType } from '../dto/create-forecast.dto';
import { DemandForecastingService, ForecastResult } from './demand-forecasting.service';
import { RevenueForecastingService } from './revenue-forecasting.service';

@Injectable()
export class ForecastingEngineService {
  private readonly logger = new Logger(ForecastingEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly demandForecastingService: DemandForecastingService,
    private readonly revenueForecastingService: RevenueForecastingService,
  ) {}

  async generateForecast(dto: CreateForecastDto): Promise<ForecastResult & { id: string }> {
    let result: ForecastResult;

    if (dto.forecastType === ForecastType.DEMAND || dto.forecastType === ForecastType.CAPACITY) {
      result = this.demandForecastingService.forecastDemand([15, 18, 22, 25, 30], dto.targetHorizon, dto.method);
    } else {
      result = this.revenueForecastingService.forecastRevenue([1500, 1800, 2200, 2500, 3000], dto.targetHorizon, dto.method);
    }

    const record = await this.prisma.demandRevenueForecast.create({
      data: {
        forecastType: dto.forecastType,
        targetHorizon: dto.targetHorizon,
        region: dto.region || 'GLOBAL',
        category: dto.category,
        expectedValue: result.expectedValue,
        lowerBound: result.lowerBound,
        upperBound: result.upperBound,
        confidence: result.confidence,
        method: dto.method || 'EXPONENTIAL_SMOOTHING',
        inputMetadata: JSON.stringify({ dto }),
        explanation: result.explanation,
      },
    });

    this.logger.log(`Generated forecast ${record.id} type=${dto.forecastType} horizon=${dto.targetHorizon}`);
    return {
      ...result,
      id: record.id,
    };
  }
}
