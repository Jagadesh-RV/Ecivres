import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReferralService } from './referral.service';
import { RedeemReferralDto } from './dto/referral.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('referrals')
@Controller('referrals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user referral code and referral stats' })
  async getMyReferralCode(@CurrentUser() user: any) {
    return this.referralService.getOrCreateUserReferralCode(user.id);
  }

  @Post('redeem')
  @ApiOperation({ summary: 'Redeem a referral code' })
  async redeemReferralCode(@CurrentUser() user: any, @Body() dto: RedeemReferralDto) {
    return this.referralService.redeemCode(user.id, dto.code);
  }
}
