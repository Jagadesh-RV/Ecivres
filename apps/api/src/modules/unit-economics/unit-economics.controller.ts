import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { MarketplaceEconomicsService } from './services/marketplace-economics.service';
import { LtvCacCalculatorService } from './services/ltv-cac-calculator.service';
import { UnitEconomicsService } from './services/unit-economics.service';

@ApiTags('unit-economics')
@Controller('unit-economics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UnitEconomicsController {
  constructor(
    private readonly economicsService: MarketplaceEconomicsService,
    private readonly ltvCacService: LtvCacCalculatorService,
    private readonly marginService: UnitEconomicsService,
  ) {}

  @Get('executive-revenue')
  @ApiOperation({ summary: 'Get executive revenue metrics (GMV, Net Revenue, Take Rate, AOV)' })
  async getExecutiveRevenue() {
    return this.economicsService.getExecutiveRevenueMetrics();
  }

  @Get('ltv-cac')
  @ApiOperation({ summary: 'Calculate LTV, LTV:CAC ratio, and payback period' })
  async getLtvCac(
    @Query('cac') cac?: string,
    @Query('arpuMonthly') arpuMonthly?: string,
    @Query('grossMargin') grossMargin?: string,
    @Query('churnRate') churnRate?: string,
  ) {
    return this.ltvCacService.calculateLtvCacMetrics(
      Number(cac || 35),
      Number(arpuMonthly || 25),
      Number(grossMargin || 80),
      Number(churnRate || 3.5),
    );
  }

  @Get('margins')
  @ApiOperation({ summary: 'Calculate gross profit & contribution margin' })
  async getMargins(
    @Query('revenue') revenue?: string,
    @Query('cogs') cogs?: string,
    @Query('marketing') marketing?: string,
    @Query('paymentProc') paymentProc?: string,
  ) {
    return this.marginService.calculateContributionMargin(
      Number(revenue || 100000),
      Number(cogs || 15000),
      Number(marketing || 20000),
      Number(paymentProc || 3000),
    );
  }
}
