import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ViralReferralService } from './services/viral-referral.service';

@ApiTags('viral-referral')
@Controller('viral-referral')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ViralReferralController {
  constructor(private readonly referralService: ViralReferralService) {}

  @Post('track')
  @ApiOperation({ summary: 'Track new viral invite' })
  async trackInvite(@Body() body: { referrerId: string; refereeId: string; referralCode: string }) {
    return this.referralService.trackInvite(body.referrerId, body.refereeId, body.referralCode);
  }

  @Post('qualify-reward')
  @ApiOperation({ summary: 'Qualify and reward completed referral' })
  async qualifyReward(@Body() body: { refereeId: string; bookingAmountUsd: number }) {
    return this.referralService.qualifyAndRewardReferral(body.refereeId, body.bookingAmountUsd);
  }

  @Post('fraud-check')
  @ApiOperation({ summary: 'Evaluate referral fraud risk parameters' })
  async fraudCheck(@Body() body: { referrerIp: string; refereeIp: string; referrerDeviceId: string; refereeDeviceId: string }) {
    return this.referralService.evaluateReferralFraudRisk(body.referrerIp, body.refereeIp, body.referrerDeviceId, body.refereeDeviceId);
  }
}
