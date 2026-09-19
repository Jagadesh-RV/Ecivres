import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { SimulateRevenueDto } from './dto/economic-simulation.dto';
import { PricingBenchmarkService } from './pricing-benchmark.service';
import { RevenueSimulatorService } from './revenue-simulator.service';

@Controller('commerce-intel')
export class CommerceIntelController {
  constructor(
    private readonly pricingBenchmark: PricingBenchmarkService,
    private readonly revenueSimulator: RevenueSimulatorService,
  ) {}

  @Post('simulate-revenue')
  simulateRevenue(@Body() dto: SimulateRevenueDto) {
    return this.revenueSimulator.simulateRevenue(dto);
  }

  @Get('competitor-benchmark')
  getBenchmark(@Query('category') category: string, @Query('price') price: number) {
    return this.pricingBenchmark.getCompetitorBenchmark(category || 'HVAC Repair', Number(price) || 220);
  }
}
