import { Controller, Get, Query } from '@nestjs/common';
import { DemandForecasterService } from './demand-forecaster.service';
import { CustomerSegmentationService } from './customer-segmentation.service';

@Controller('analytics/intelligence')
export class DataIntelligenceController {
  constructor(
    private readonly demandForecaster: DemandForecasterService,
    private readonly segmentation: CustomerSegmentationService,
  ) {}

  @Get('demand-forecast')
  getForecast(@Query('categoryId') categoryId: string, @Query('targetMonth') targetMonth: string) {
    return this.demandForecaster.predictDemandForCategory(categoryId || 'cat_demo', targetMonth || '2026-10');
  }

  @Get('customer-segment')
  getSegment(@Query('customerId') customerId: string, @Query('spend') spend: number, @Query('bookings') bookings: number) {
    return this.segmentation.segmentCustomer(customerId || 'cust_demo', Number(spend) || 500, Number(bookings) || 4);
  }
}
