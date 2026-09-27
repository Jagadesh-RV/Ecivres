import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CustomerMissionService } from './services/customer-mission.service';

@ApiTags('customer-missions')
@Controller('customer-missions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CustomerMissionsController {
  constructor(private readonly missionService: CustomerMissionService) {}

  @Get('daily/:userId')
  @ApiOperation({ summary: 'Get active daily missions for customer' })
  async getDailyMissions(@Param('userId') userId: string) {
    return this.missionService.getDailyMissions(userId);
  }

  @Post('evaluate-streak')
  @ApiOperation({ summary: 'Evaluate booking streak eligibility & bonus' })
  async evaluateStreak(@Body() body: { currentStreakConsecutiveMonths: number }) {
    return this.missionService.evaluateBookingStreak(body.currentStreakConsecutiveMonths);
  }

  @Get('badges/:userId')
  @ApiOperation({ summary: 'Get unlocked achievement badges' })
  async getBadges(@Param('userId') userId: string) {
    return this.missionService.getUserBadges(userId);
  }
}
