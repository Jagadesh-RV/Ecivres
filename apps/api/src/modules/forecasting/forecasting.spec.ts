import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { ForecastingEngineService } from './services/forecasting-engine.service';
import { DemandForecastingService } from './services/demand-forecasting.service';
import { RevenueForecastingService } from './services/revenue-forecasting.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ForecastHorizon, ForecastType, ForecastMethod } from './dto/create-forecast.dto';

describe('ForecastingEngineService', () => {
  let service: ForecastingEngineService;

  const mockPrisma = {
    demandRevenueForecast: {
      create: jest.fn().mockResolvedValue({ id: 'fc-123' }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForecastingEngineService,
        DemandForecastingService,
        RevenueForecastingService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ForecastingEngineService>(ForecastingEngineService);
  });

  it('should generate demand forecast successfully', async () => {
    const res = await service.generateForecast({
      forecastType: ForecastType.DEMAND,
      targetHorizon: ForecastHorizon.ONE_DAY,
      method: ForecastMethod.EXPONENTIAL_SMOOTHING,
    });

    expect(res).toBeDefined();
    expect(res.id).toBe('fc-123');
    expect(res.expectedValue).toBeGreaterThan(0);
    expect(res.confidence).toBeGreaterThan(50);
  });

  it('should generate revenue forecast successfully', async () => {
    const res = await service.generateForecast({
      forecastType: ForecastType.REVENUE,
      targetHorizon: ForecastHorizon.SEVEN_DAYS,
      method: ForecastMethod.TREND_FORECASTING,
    });

    expect(res).toBeDefined();
    expect(res.id).toBe('fc-123');
    expect(res.expectedValue).toBeGreaterThan(0);
  });
});
