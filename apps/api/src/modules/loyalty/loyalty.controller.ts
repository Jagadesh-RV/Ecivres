import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { LoyaltyVipTierService } from './services/loyalty-vip-tier.service';

@ApiTags('loyalty')
@Controller('loyalty')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyVipTierService) {}

  @Post('calculate-tier')
  @ApiOperation({ summary: 'Calculate user VIP loyalty tier & cashback rate' })
  async calculateTier(@Body() body: { totalSpendUsd: number; totalBookingsCount: number }) {
    return this.loyaltyService.calculateVipTier(body.totalSpendUsd, body.totalBookingsCount);
  }

  @Post('birthday-reward')
  @ApiOperation({ summary: 'Evaluate birthday bonus reward coupon eligibility' })
  async birthdayReward(@Body() body: { userBirthMonthDay: string; currentMonthDay: string; vipTier: string }) {
    return this.loyaltyService.evaluateBirthdayReward(body.userBirthMonthDay, body.currentMonthDay, body.vipTier);
  }

  @Post('surprise-reward')
  @ApiOperation({ summary: 'Generate milestone surprise reward bonus' })
  async surpriseReward(@Body() body: { bookingMilestoneCount: number }) {
    return this.loyaltyService.generateSurpriseReward(body.bookingMilestoneCount);
  }
}
