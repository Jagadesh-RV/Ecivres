import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TrustScoreService } from './services/trust-score.service';

@ApiTags('reputation')
@Controller('reputation')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReputationController {
  constructor(private readonly reputationService: TrustScoreService) {}

  @Post('trust-score')
  @ApiOperation({ summary: 'Calculate provider / user trust score (0-100)' })
  async calculateScore(@Body() body: { identityVerified: boolean; averageRating: number; totalJobsCompleted: number; cancellationRatePercent: number }) {
    return this.reputationService.calculateTrustScore(body.identityVerified, body.averageRating, body.totalJobsCompleted, body.cancellationRatePercent);
  }

  @Post('badges')
  @ApiOperation({ summary: 'Evaluate provider verified trust badges' })
  async evaluateBadges(@Body() body: { trustScore: number; backgroundCheckPassed: boolean; insuranceActive: boolean }) {
    return this.reputationService.evaluateVerifiedBadges(body.trustScore, body.backgroundCheckPassed, body.insuranceActive);
  }
}
