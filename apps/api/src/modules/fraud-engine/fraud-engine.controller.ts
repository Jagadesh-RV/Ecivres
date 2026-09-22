import { Controller, Post, Body, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { FraudIntelligenceService } from './services/fraud-intelligence.service';

@ApiTags('fraud-engine')
@Controller('fraud-engine')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FraudEngineController {
  constructor(private readonly fraudService: FraudIntelligenceService) {}

  @Post('score-behavior')
  @ApiOperation({ summary: 'Calculate behavioral fraud score for target user/provider' })
  async scoreBehavior(@Body() body: { targetId: string; targetType: string }) {
    return this.fraudService.calculateBehavioralScore(body.targetId, body.targetType);
  }

  @Post('detect-fake-review')
  @ApiOperation({ summary: 'Evaluate fake review probability score' })
  async detectFakeReview(@Body() body: { reviewId: string; reviewText: string; rating: number }) {
    return this.fraudService.detectFakeReview(body.reviewId, body.reviewText, body.rating);
  }

  @Post('detect-payment-anomaly')
  @ApiOperation({ summary: 'Detect high-value payment anomaly & 3DS trigger' })
  async detectPaymentAnomaly(@Body() body: { userId: string; amountUSD: number; ipAddress: string }) {
    return this.fraudService.detectPaymentAnomaly(body.userId, body.amountUSD, body.ipAddress);
  }

  @Get('device-reputation/:fingerprint')
  @ApiOperation({ summary: 'Check device fingerprint reputation score' })
  async getDeviceReputation(@Param('fingerprint') fingerprint: string) {
    return this.fraudService.scoreDeviceReputation(fingerprint);
  }
}
