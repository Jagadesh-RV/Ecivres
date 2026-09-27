import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RevenueIntelligenceService } from './services/revenue-intelligence.service';

@ApiTags('revenue-intelligence')
@Controller('revenue-intelligence')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RevenueIntelligenceController {
  constructor(private readonly revenueService: RevenueIntelligenceService) {}

  @Post('executive-metrics')
  @ApiOperation({ summary: 'Calculate GMV, MRR, and ARR executive metrics' })
  async calculateMetrics(@Body() body: { monthlyGmvUsd: number; takeRatePercent?: number; activeSubscriptionsCount?: number; subscriptionPriceUsd?: number }) {
    return this.revenueService.calculateExecutiveRevenueMetrics(body.monthlyGmvUsd, body.takeRatePercent, body.activeSubscriptionsCount, body.subscriptionPriceUsd);
  }

  @Post('customer-ltv')
  @ApiOperation({ summary: 'Calculate customer lifetime value (LTV)' })
  async calculateLtv(@Body() body: { averageOrderValueUsd: number; annualPurchaseFrequency: number; averageLifespanYears: number; grossMarginPercent?: number }) {
    return this.revenueService.calculateCustomerLtv(body.averageOrderValueUsd, body.annualPurchaseFrequency, body.averageLifespanYears, body.grossMarginPercent);
  }

  @Post('churn-risk')
  @ApiOperation({ summary: 'Predict customer churn risk score' })
  async predictChurn(@Body() body: { daysSinceLastBooking: number; supportTicketsCount: number; averageRatingGiven: number }) {
    return this.revenueService.predictCustomerChurnRisk(body.daysSinceLastBooking, body.supportTicketsCount, body.averageRatingGiven);
  }
}
