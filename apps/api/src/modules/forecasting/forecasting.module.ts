import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { DemandForecastingService } from './services/demand-forecasting.service';
import { RevenueForecastingService } from './services/revenue-forecasting.service';
import { ForecastingEngineService } from './services/forecasting-engine.service';

@Module({
  imports: [PrismaModule],
  providers: [
    DemandForecastingService,
    RevenueForecastingService,
    ForecastingEngineService,
  ],
  exports: [
    DemandForecastingService,
    RevenueForecastingService,
    ForecastingEngineService,
  ],
})
export class ForecastingModule {}
