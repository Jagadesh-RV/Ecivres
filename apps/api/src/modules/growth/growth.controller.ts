import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { GrowthService } from './growth.service';
import { LoyaltyExpansionService } from './loyalty-expansion.service';
import { CustomerMissionsService } from './customer-missions.service';

@ApiTags('growth')
@Controller('growth')
@UseGuards(JwtAuthGuard)
export class GrowthController {
  constructor(
    private readonly growthService: GrowthService,
    private readonly loyaltyService: LoyaltyExpansionService,
    private readonly missionsService: CustomerMissionsService,
  ) {}

  @Get('referral-qr')
  @ApiOperation({ summary: 'Generate referral QR code and deep link' })
  async getReferralQr(@CurrentUser() user: any) {
    return this.growthService.generateReferralQr(user.id);
  }

  @Post('invite-contacts')
  @ApiOperation({ summary: 'Send contact invitations via SMS, WhatsApp, or Email' })
  async inviteContacts(@CurrentUser() user: any, @Body() body: any) {
    return this.growthService.inviteContacts({
      inviterUserId: user.id,
      contacts: body.contacts,
      channel: body.channel || 'WHATSAPP',
    });
  }

  @Get('loyalty-status')
  @ApiOperation({ summary: 'Get expanded VIP tier loyalty status & perks' })
  async getLoyaltyStatus(@CurrentUser() user: any, @Query('birthMonth') birthMonth?: number) {
    return this.loyaltyService.getLoyaltyStatus(user.id, birthMonth ? Number(birthMonth) : undefined);
  }

  @Post('claim-birthday-reward')
  @ApiOperation({ summary: 'Claim annual birthday reward voucher' })
  async claimBirthdayReward(@CurrentUser() user: any) {
    return this.loyaltyService.claimBirthdayReward(user.id);
  }

  @Get('missions')
  @ApiOperation({ summary: 'Get active customer missions and challenges' })
  async getActiveMissions(@CurrentUser() user: any) {
    return this.missionsService.getActiveMissions(user.id);
  }

  @Post('claim-mission')
  @ApiOperation({ summary: 'Claim completed mission reward points' })
  async claimMission(@CurrentUser() user: any, @Body('missionId') missionId: string) {
    return this.missionsService.claimMissionReward(user.id, missionId);
  }
}
